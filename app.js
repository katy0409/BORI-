const ACTIVE_BOOK_KEY = "bori-v13-active-book";
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const money = (n) => new Intl.NumberFormat("zh-TW", { style: "currency", currency: "TWD", maximumFractionDigits: 0 }).format(Number(n || 0));
const escapeHTML = (v = "") => String(v).replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));
const pad2 = (n) => String(n).padStart(2, "0");
const localDateStr = (d = new Date()) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const currentMonth = () => localDateStr().slice(0, 7);
const typeIcon = {
  home: "assets/room-icons/home.jpg", beach: "assets/room-icons/beach.jpg", cat: "assets/room-icons/cat.jpg",
  couple: "assets/room-icons/couple.jpg", plant: "assets/room-icons/plant.jpg",
  piggybank: "assets/room-icons/piggybank.jpg", shopping: "assets/room-icons/shopping.jpg", food: "assets/room-icons/food.jpg",
  book: "assets/room-icons/book.jpg", fitness: "assets/room-icons/fitness.jpg",
  camera: "assets/room-icons/camera.jpg", balloons: "assets/room-icons/balloons.jpg", movie: "assets/room-icons/movie.jpg",
  game: "assets/room-icons/game.jpg", checklist: "assets/room-icons/checklist.jpg",
  store: "assets/room-icons/store.jpg", baby: "assets/room-icons/baby.jpg", car: "assets/room-icons/car.jpg",
  letter: "assets/room-icons/letter.jpg", gift: "assets/room-icons/gift.jpg",
  family: "assets/room-icons/baby.jpg", friends: "assets/room-icons/balloons.jpg", travel: "assets/room-icons/beach.jpg", other: "assets/room-icons/home.jpg"
};
const categoryMeta = {
  餐飲: { icon: "🍜", color: "#e59b5f" }, 交通: { icon: "🚌", color: "#74a7b8" }, 娛樂: { icon: "🎬", color: "#967ac1" },
  購物: { icon: "🛍", color: "#dc8293" }, 生活: { icon: "🏠", color: "#84a86d" }, 旅行: { icon: "✈️", color: "#d3ad55" }, 其他: { icon: "◌", color: "#9b9388" }
};
const stickers = [
  { id: "ok", emoji: "🐻👌", text: "OK！" }, { id: "thanks", emoji: "🐻💛", text: "謝謝～" },
  { id: "received", emoji: "🐻📩", text: "收到～" }, { id: "paid", emoji: "🐻✅", text: "已付款" },
  { id: "treat", emoji: "🐻🍚", text: "今天我請客" }, { id: "laugh", emoji: "🐻😂", text: "哈哈哈" },
  { id: "love", emoji: "🐻❤️", text: "愛你" }, { id: "remember", emoji: "🐻🌾", text: "記得記帳喔" }
];

let supabaseClient = null;
let session = null;
let profile = null;
let books = [];
let activeBookId = localStorage.getItem(ACTIVE_BOOK_KEY) || null;
let transactions = [];
let budgets = [];
let messages = [];
let realtimeChannel = null;

function toast(message) { const el = $("#toast"); el.textContent = message; el.classList.add("show"); setTimeout(() => el.classList.remove("show"), 2300); }
function showOnly(id) { ["configErrorScreen", "authScreen", "appShell"].forEach((x) => $("#" + x).classList.toggle("hidden", x !== id)); }
function openDialog(id) { if (!activeBookId && !["bookDialog", "joinDialog"].includes(id)) return toast("請先開一個房間或加入房間"); $("#" + id)?.showModal(); }
function closeDialog(id) { $("#" + id)?.close(); }
function goTo(pageId) { $$(".page").forEach((p) => p.classList.toggle("active", p.id === pageId)); $$(".nav-item,.nav-add").forEach((b) => b.classList.toggle("active", b.dataset.page === pageId)); if (pageId === "chatPage") scrollChat(); }
function activeBook() { return books.find((b) => b.id === activeBookId) || books[0] || null; }
function monthTransactions(type) { return transactions.filter((x) => x.transaction_type === type && String(x.transaction_date).slice(0, 7) === currentMonth()); }
function inviteCode() { return `BORI-${Math.random().toString(36).slice(2, 8).toUpperCase()}`; }

function initClient() {
  const cfg = window.BORI_CONFIG || {};
  const url = String(cfg.SUPABASE_URL || "").trim().replace(/\/$/, "");
  const key = String(cfg.SUPABASE_PUBLISHABLE_KEY || "").trim();
  if (!url.includes("supabase.co") || !key.startsWith("sb_publishable_")) return false;
  supabaseClient = window.supabase.createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  return true;
}

let booted = false;
async function boot() {
  if (booted) return;
  booted = true;
  if (!initClient()) { showOnly("configErrorScreen"); finishSplash(); return; }
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) toast(error.message);
  session = data.session;
  if (!session) { showOnly("authScreen"); finishSplash(); return; }
  await enterApp();
  finishSplash();
}

async function enterApp() {
  showOnly("appShell");
  await loadProfile();
  await loadBooks();
  await loadActiveBookData();
  renderAll();
}

async function loadProfile() {
  const { data } = await supabaseClient.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
  profile = data || { id: session.user.id, display_name: session.user.user_metadata?.display_name || session.user.email?.split("@")[0] || "BORI 使用者" };
}

let memberCounts = {};
async function loadBooks() {
  const { data, error } = await supabaseClient.from("book_members").select("role, books(*)").eq("user_id", session.user.id);
  if (error) { toast(error.message); books = []; memberCounts = {}; return; }
  books = (data || []).map((row) => ({ ...row.books, role: row.role })).filter(Boolean);
  if (!books.some((b) => b.id === activeBookId)) activeBookId = books[0]?.id || null;
  if (activeBookId) localStorage.setItem(ACTIVE_BOOK_KEY, activeBookId); else localStorage.removeItem(ACTIVE_BOOK_KEY);
  memberCounts = {};
  if (books.length) {
    const { data: mrows } = await supabaseClient.from("book_members").select("book_id").in("book_id", books.map((b) => b.id));
    (mrows || []).forEach((r) => { memberCounts[r.book_id] = (memberCounts[r.book_id] || 0) + 1; });
  }
}

async function fetchLedger() {
  const [tx, bd] = await Promise.all([
    supabaseClient.from("transactions").select("*").eq("book_id", activeBookId).order("transaction_date", { ascending: false }).order("created_at", { ascending: false }),
    supabaseClient.from("budgets").select("*").eq("book_id", activeBookId).eq("month", currentMonth())
  ]);
  if (tx.error) toast(tx.error.message); else transactions = tx.data || [];
  if (bd.error) toast(bd.error.message); else budgets = bd.data || [];
}

async function loadActiveBookData() {
  unsubscribeRealtime();
  transactions = []; budgets = []; messages = [];
  if (!activeBookId) return;
  const msPromise = supabaseClient.from("messages").select("*, profiles(display_name)").eq("book_id", activeBookId).order("created_at", { ascending: true }).limit(200);
  const [ms] = await Promise.all([msPromise, fetchLedger()]);
  if (ms.error) toast(ms.error.message); else messages = ms.data || [];
  subscribeRealtime();
}

let ledgerRefreshTimer = null;
function scheduleLedgerRefresh() {
  clearTimeout(ledgerRefreshTimer);
  ledgerRefreshTimer = setTimeout(async () => {
    if (!activeBookId) return;
    await fetchLedger();
    renderAll();
  }, 400);
}

function subscribeRealtime() {
  if (!activeBookId) return;
  realtimeChannel = supabaseClient.channel(`bori-book-${activeBookId}`)
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `book_id=eq.${activeBookId}` }, async (payload) => {
      const { data } = await supabaseClient.from("messages").select("*, profiles(display_name)").eq("id", payload.new.id).single();
      if (data && !messages.some((m) => m.id === data.id)) { messages.push(data); renderChat(); renderHome(); scrollChat(); }
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "transactions", filter: `book_id=eq.${activeBookId}` }, () => scheduleLedgerRefresh())
    .on("postgres_changes", { event: "*", schema: "public", table: "budgets", filter: `book_id=eq.${activeBookId}` }, () => scheduleLedgerRefresh())
    .subscribe();
}
function unsubscribeRealtime() { if (realtimeChannel && supabaseClient) supabaseClient.removeChannel(realtimeChannel); realtimeChannel = null; }

async function switchBook(bookId) {
  activeBookId = bookId;
  localStorage.setItem(ACTIVE_BOOK_KEY, activeBookId);
  await loadActiveBookData();
  renderAll();
}

function renderAll() { renderProfile(); renderBookSwitcher(); renderTopbarRoom(); renderSwitchRoomList(); renderHome(); renderAdd(); renderChat(); renderLedger(); renderAnalysis(); }
function renderSwitchRoomList() {
  $("#switchRoomList").innerHTML = books.map((b) => `<button class="switch-room-item ${b.id === activeBookId ? "active" : ""}" data-book="${b.id}"><img src="${typeIcon[b.type] || typeIcon.other}" alt="" /><span><strong>${escapeHTML(b.name)}</strong><small>${memberCounts[b.id] || 1} 位成員</small></span>${b.id === activeBookId ? '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>' : ""}</button>`).join("");
}
function renderTopbarRoom() {
  const book = activeBook();
  $("#topbarRoom").classList.toggle("hidden", !book);
  if (!book) return;
  $("#topbarRoomIcon").src = typeIcon[book.type] || typeIcon.other;
  $("#topbarRoomName").textContent = book.name;
}
function renderLedger() {
  const has = !!activeBookId;
  $("#ledgerEmpty").classList.toggle("hidden", has);
  $("#ledgerContent").classList.toggle("hidden", !has);
  if (!has) return;
  $("#ledgerBookTitle").textContent = activeBook()?.name || "交易紀錄";
  $("#ledgerCount").textContent = transactions.length ? `共 ${transactions.length} 筆` : "";
  $("#ledgerList").innerHTML = transactions.length ? transactions.map(recordHTML).join("") : `<div class="empty-state compact"><p>還沒有收入或支出紀錄。</p></div>`;
}
function renderProfile() {
  $("#profileName").textContent = profile?.display_name || "BORI 使用者";
  $("#profileEmail").textContent = session?.user?.email || "Cloud Life · V1.3";
  $("#helloText").textContent = `안녕, ${profile?.display_name || "BORI"} 👋`;
  const hasAvatar = !!profile?.avatar_url;
  $("#profileAvatarEmoji").classList.toggle("hidden", hasAvatar);
  $("#profileAvatarImg").classList.toggle("hidden", !hasAvatar);
  $("#headerAvatarEmoji").classList.toggle("hidden", hasAvatar);
  $("#headerAvatarImg").classList.toggle("hidden", !hasAvatar);
  if (hasAvatar) { $("#profileAvatarImg").src = profile.avatar_url; $("#headerAvatarImg").src = profile.avatar_url; }
  const book = activeBook(), isOwner = book?.role === "owner";
  $("#leaveRoomBtn").classList.toggle("hidden", !book);
  $("#resetRoomBtn").classList.toggle("hidden", !book || !isOwner);
  $("#deleteRoomBtn").classList.toggle("hidden", !book || !isOwner);
  $("#roomCodeBtn").classList.toggle("hidden", !book);
  if (book) $("#roomCodeValue").textContent = book.invite_code;
}
function renderBookSwitcher() {
  $("#roomEmptyHint").classList.toggle("hidden", books.length > 0);
  $("#roomCarousel").classList.toggle("hidden", books.length === 0);
  $("#roomCarousel").innerHTML = books.map((b) => `<button class="room-card ${b.id === activeBookId ? "active" : ""}" data-book="${b.id}"><img class="room-thumb" src="${typeIcon[b.type] || typeIcon.other}" alt="" /><strong>${escapeHTML(b.name)}</strong><small>${memberCounts[b.id] || 1} 位成員</small></button>`).join("");
}
function monthRangeLabel() {
  const d = new Date(), last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  return `${d.getMonth() + 1}月1日 - ${d.getMonth() + 1}月${last}日`;
}
function renderHome() {
  const has = !!activeBookId;
  $("#homeDashboard").classList.toggle("hidden", !has);
  if (!has) return;
  const expenses = monthTransactions("expense"), incomes = monthTransactions("income");
  const exp = expenses.reduce((s, x) => s + Number(x.amount), 0), inc = incomes.reduce((s, x) => s + Number(x.amount), 0), bud = budgets.reduce((s, x) => s + Number(x.amount), 0);
  $("#overviewRange").textContent = monthRangeLabel();
  $("#incomeTotal").textContent = money(inc); $("#expenseTotal").textContent = money(exp);
  $("#availableAmount").textContent = money(bud ? Math.max(bud - exp, 0) : inc - exp);
  $("#budgetHint").textContent = bud ? `預算已使用 ${Math.min(100, Math.round((exp / bud) * 100 || 0))}%` : `目前結餘 ${money(inc - exp)}`;
  const myPaid = expenses.filter((x) => x.user_id === session?.user?.id).reduce((s, x) => s + Number(x.amount), 0);
  const otherPaid = Math.max(exp - myPaid, 0);
  $("#myPaidTotal").textContent = money(myPaid); $("#otherPaidTotal").textContent = money(otherPaid);
  const last = messages.at(-1); $("#chatSummary").textContent = last ? (last.message_type === "sticker" ? stickerById(last.sticker_id)?.text || "BORI 貼圖" : last.content) : "還沒有聊天訊息";
  renderBudgets(expenses);
  const records = transactions.slice(0, 6); $("#recentList").innerHTML = records.length ? records.map(recordHTML).join("") : `<div class="empty-state compact"><p>還沒有收入或支出紀錄。</p></div>`;
}
function renderBudgets(expenses) {
  const el = $("#budgetPreview");
  if (!budgets.length) { el.innerHTML = `<div class="empty-state compact"><p>尚未設定預算，先為常用分類設定上限吧。</p></div>`; return; }
  el.innerHTML = budgets.map((b) => {
    const used = expenses.filter((x) => x.category === b.category).reduce((s, x) => s + Number(x.amount), 0), pct = Number(b.amount) ? Math.min(120, (used / Number(b.amount)) * 100) : 0;
    const meta = categoryMeta[b.category] || categoryMeta.其他;
    return `<article class="budget-card"><div class="budget-head"><span>${meta.icon} ${escapeHTML(b.category)}</span><strong>${money(used)} / ${money(b.amount)}</strong></div><div class="progress"><i class="${pct >= 100 ? "over" : ""}" style="width:${Math.min(100, pct)}%"></i></div><small>${pct >= 100 ? "已超出預算" : `還可以使用 ${money(Math.max(Number(b.amount) - used, 0))}`}</small></article>`;
  }).join("");
}
function recordHTML(x) {
  const income = x.transaction_type === "income", meta = income ? { icon: "💰", color: "#7fa56a" } : (categoryMeta[x.category] || categoryMeta.其他);
  const noteHTML = x.note ? `<small class="record-note">📝 ${escapeHTML(x.note)}</small>` : "";
  return `<article class="record"><div class="record-icon" style="background:${meta.color}20">${meta.icon}</div><div><strong>${escapeHTML(x.title)}</strong><small>${escapeHTML(x.category)} · ${new Date(`${x.transaction_date}T00:00:00`).toLocaleDateString("zh-TW")}</small>${noteHTML}</div><b class="${income ? "income-text" : ""}">${income ? "+" : "-"}${money(x.amount)}</b></article>`;
}
function renderAdd() { const has = !!activeBookId; $("#addEmpty").classList.toggle("hidden", has); $("#addContent").classList.toggle("hidden", !has); }
function stickerById(id) { return stickers.find((s) => s.id === id); }
function renderChat() {
  const has = !!activeBookId; $("#chatEmpty").classList.toggle("hidden", has); $("#chatContent").classList.toggle("hidden", !has); if (!has) return;
  const b = activeBook(); $("#chatBookTitle").textContent = b.name;
  $("#messageList").innerHTML = messages.length ? messages.map((m) => {
    const mine = m.user_id === session.user.id, name = m.profiles?.display_name || (mine ? profile?.display_name : "成員");
    if (m.message_type === "sticker") { const s = stickerById(m.sticker_id) || { emoji: "🐻", text: "BORI" }; return `<div class="message ${mine ? "mine" : "other"} sticker-message"><small class="sender">${escapeHTML(name)}</small><span>${s.emoji}</span><strong>${escapeHTML(s.text)}</strong><small>${new Date(m.created_at).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}</small></div>`; }
    return `<div class="message ${mine ? "mine" : "other"}"><small class="sender">${escapeHTML(name)}</small><p>${escapeHTML(m.content || "")}</p><small>${new Date(m.created_at).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}</small></div>`;
  }).join("") : `<div class="chat-welcome"><span>🐻</span><p>這裡是你們的即時聊天室。<br>先傳一句話或一張 BORI 貼圖吧。</p></div>`;
  $("#stickerTray").innerHTML = stickers.map((s, i) => `<button type="button" data-sticker="${i}"><span>${s.emoji}</span><small>${s.text}</small></button>`).join("");
}
function scrollChat() { setTimeout(() => { const el = $("#messageList"); if (el) el.scrollTop = el.scrollHeight; }, 30); }
function renderAnalysis() {
  const has = transactions.length || budgets.length; $("#analysisEmpty").classList.toggle("hidden", !!has); $("#analysisContent").classList.toggle("hidden", !has); if (!has) return;
  const expenses = monthTransactions("expense"), incomes = monthTransactions("income");
  const exp = expenses.reduce((s, x) => s + Number(x.amount), 0), inc = incomes.reduce((s, x) => s + Number(x.amount), 0);
  $("#analysisIncome").textContent = money(inc); $("#analysisExpense").textContent = money(exp); $("#analysisNet").textContent = money(inc - exp); $("#donutTotal").textContent = money(exp);
  const grouped = {}; expenses.forEach((x) => grouped[x.category] = (grouped[x.category] || 0) + Number(x.amount)); const entries = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
  let cursor = 0; const segments = entries.map(([c, v]) => { const start = cursor; cursor += exp ? (v / exp) * 360 : 0; return `${(categoryMeta[c] || categoryMeta.其他).color} ${start}deg ${cursor}deg`; });
  $("#donutChart").style.background = segments.length ? `conic-gradient(${segments.join(",")})` : "#eee7dc";
  $("#categoryLegend").innerHTML = entries.length ? entries.map(([c, v]) => `<div class="legend-row"><i style="background:${(categoryMeta[c] || categoryMeta.其他).color}"></i><span>${escapeHTML(c)}</span><strong>${Math.round((v / exp) * 100)}%</strong></div>`).join("") : `<p class="muted">尚無支出分類</p>`;
  $("#incomeList").innerHTML = incomes.length ? incomes.map(recordHTML).join("") : `<div class="empty-state compact"><p>本月尚無收入。</p></div>`;
}

async function createBook(name, type) {
  const code = inviteCode();
  const { data, error } = await supabaseClient.from("books").insert({ name, type, owner_id: session.user.id, invite_code: code }).select().single();
  if (error) throw error;
  const { error: memberError } = await supabaseClient.from("book_members").insert({ book_id: data.id, user_id: session.user.id, role: "owner" });
  if (memberError) throw memberError;
  return data;
}
async function addTransaction(type, title, amount, category, note = "") {
  const { error } = await supabaseClient.from("transactions").insert({ book_id: activeBookId, user_id: session.user.id, transaction_type: type, category, title, amount: Number(amount), transaction_date: localDateStr(), note });
  if (error) throw error;
}


$$('[data-auth-tab]').forEach((b) => b.addEventListener("click", () => {
  $$('[data-auth-tab]').forEach((x) => x.classList.toggle("active", x === b));
  $("#loginForm").classList.toggle("hidden", b.dataset.authTab !== "login"); $("#registerForm").classList.toggle("hidden", b.dataset.authTab !== "register");
}));
$("#loginForm").addEventListener("submit", async (e) => { e.preventDefault(); const { data, error } = await supabaseClient.auth.signInWithPassword({ email: $("#loginEmail").value.trim(), password: $("#loginPassword").value }); if (error) return toast(error.message); session = data.session; await enterApp(); toast("登入成功 🌾"); });
$("#registerForm").addEventListener("submit", async (e) => { e.preventDefault(); const { data, error } = await supabaseClient.auth.signUp({ email: $("#registerEmail").value.trim(), password: $("#registerPassword").value, options: { data: { display_name: $("#registerName").value.trim() } } }); if (error) return toast(error.message); if (data.session) { session = data.session; await enterApp(); } else { toast("註冊成功，請到信箱完成驗證"); $$('[data-auth-tab]')[0].click(); } });
$("#signOutBtn").addEventListener("click", async () => { unsubscribeRealtime(); await supabaseClient.auth.signOut(); session = null; showOnly("authScreen"); toast("已登出"); });
$("#editAvatarBtn").addEventListener("click", () => $("#avatarFileInput").click());
$("#avatarFileInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 3 * 1024 * 1024) return toast("圖片太大了，請選 3MB 以內的照片");
  toast("上傳中…");
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${session.user.id}/avatar.${ext}`;
  const { error: uploadError } = await supabaseClient.storage.from("avatars").upload(path, file, { upsert: true, cacheControl: "3600" });
  if (uploadError) return toast(uploadError.message);
  const { data: pub } = supabaseClient.storage.from("avatars").getPublicUrl(path);
  const url = `${pub.publicUrl}?t=${Date.now()}`;
  const { error: updateError } = await supabaseClient.from("profiles").update({ avatar_url: url }).eq("id", session.user.id);
  if (updateError) return toast(updateError.message);
  profile.avatar_url = url;
  renderProfile();
  toast("大頭貼更新完成 📷");
  e.target.value = "";
});
$("#editNameBtn").addEventListener("click", () => { $("#editNameInput").value = profile?.display_name || ""; openDialog("editNameDialog"); });
$("#editNameForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = $("#editNameInput").value.trim();
  if (!name) return;
  const { error } = await supabaseClient.from("profiles").update({ display_name: name }).eq("id", session.user.id);
  if (error) return toast(error.message);
  profile.display_name = name;
  renderProfile();
  closeDialog("editNameDialog");
  toast("暱稱更新完成");
});
$("#roomCodeBtn").addEventListener("click", async () => {
  const book = activeBook();
  if (!book) return;
  try { await navigator.clipboard.writeText(book.invite_code); toast("已複製房間代碼 📋"); }
  catch { toast(`房間代碼：${book.invite_code}`); }
});
$("#leaveRoomBtn").addEventListener("click", async () => {
  const book = activeBook();
  if (!book) return;
  if (!confirm(`確定要退出「${book.name}」嗎？`)) return;
  const { data, error } = await supabaseClient.rpc("leave_book", { p_book_id: book.id });
  if (error) return toast(error.message);
  await loadBooks();
  await loadActiveBookData();
  renderAll();
  goTo("homePage");
  toast(data === "deleted" ? "房間已刪除" : data === "transferred" ? "已退出，擁有權已轉移給其他成員 🔄" : "已退出房間");
});
$("#resetRoomBtn").addEventListener("click", async () => {
  const book = activeBook();
  if (!book) return;
  if (!confirm(`確定要清空「${book.name}」的所有收支、預算與聊天記錄嗎？此動作無法復原。`)) return;
  const { error } = await supabaseClient.rpc("reset_book_data", { p_book_id: book.id });
  if (error) return toast(error.message);
  await loadActiveBookData();
  renderAll();
  toast("房間資料已清空 🧹");
});
$("#deleteRoomBtn").addEventListener("click", async () => {
  const book = activeBook();
  if (!book) return;
  if (!confirm(`確定要刪除「${book.name}」嗎？所有成員與資料都會一併移除，此動作無法復原。`)) return;
  const { error } = await supabaseClient.rpc("delete_book", { p_book_id: book.id });
  if (error) return toast(error.message);
  await loadBooks();
  await loadActiveBookData();
  renderAll();
  goTo("homePage");
  toast("房間已刪除");
});
$("#googleLoginBtn").addEventListener("click", async () => {
  const { error } = await supabaseClient.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + window.location.pathname } });
  if (error) toast(error.message);
});

$$('[data-page]').forEach((b) => b.addEventListener("click", () => goTo(b.dataset.page)));
$$('[data-open]').forEach((b) => b.addEventListener("click", () => openDialog(b.dataset.open)));
$$('[data-close]').forEach((b) => b.addEventListener("click", () => closeDialog(b.dataset.close)));
$("#roomCarousel").addEventListener("click", (e) => { const btn = e.target.closest(".room-card"); if (btn) switchBook(btn.dataset.book); });
$("#switchRoomList").addEventListener("click", (e) => { const btn = e.target.closest(".switch-room-item"); if (btn) { switchBook(btn.dataset.book); closeDialog("switchRoomDialog"); } });

$("#bookForm").addEventListener("submit", async (e) => { e.preventDefault(); try { const name = $("#newBookName").value.trim(), type = document.querySelector('[name="bookType"]:checked').value; const book = await createBook(name, type); activeBookId = book.id; localStorage.setItem(ACTIVE_BOOK_KEY, activeBookId); e.target.reset(); closeDialog("bookDialog"); await loadBooks(); await loadActiveBookData(); renderAll(); toast(`房間開好了，房間代碼：${book.invite_code}`); } catch (err) { toast(err.message); } });
$("#joinForm").addEventListener("submit", async (e) => { e.preventDefault(); const code = $("#inviteCodeInput").value.trim().toUpperCase(); const { data, error } = await supabaseClient.rpc("join_book_by_code", { p_invite_code: code }); if (error) return toast(error.message); if (!data) return toast("找不到這個房間代碼"); closeDialog("joinDialog"); e.target.reset(); await loadBooks(); activeBookId = data; await loadActiveBookData(); renderAll(); toast("已加入房間 🎉"); });
$("#expenseForm").addEventListener("submit", async (e) => { e.preventDefault(); try { await addTransaction("expense", $("#titleInput").value.trim(), $("#amountInput").value, $("#categoryInput").value, $("#noteInput").value.trim()); e.target.reset(); await loadActiveBookData(); renderAll(); goTo("homePage"); toast("支出已同步到房間 ☁️"); } catch (err) { toast(err.message); } });
$("#incomeForm").addEventListener("submit", async (e) => { e.preventDefault(); try { await addTransaction("income", $("#incomeTitle").value.trim(), $("#incomeAmount").value, $("#incomeCategory").value); e.target.reset(); closeDialog("incomeDialog"); await loadActiveBookData(); renderAll(); toast("收入已同步到房間 💰"); } catch (err) { toast(err.message); } });
$("#budgetForm").addEventListener("submit", async (e) => { e.preventDefault(); const row = { book_id: activeBookId, category: $("#budgetCategory").value, amount: Number($("#budgetAmount").value), month: currentMonth(), created_by: session.user.id }; const { error } = await supabaseClient.from("budgets").upsert(row, { onConflict: "book_id,category,month" }); if (error) return toast(error.message); e.target.reset(); closeDialog("budgetDialog"); await loadActiveBookData(); renderAll(); toast("預算已更新 🎯"); });
$("#chatForm").addEventListener("submit", async (e) => { e.preventDefault(); const content = $("#messageInput").value.trim(); if (!content) return; const { error } = await supabaseClient.from("messages").insert({ book_id: activeBookId, user_id: session.user.id, message_type: "text", content }); if (error) return toast(error.message); $("#messageInput").value = ""; });
$("#stickerBtn").addEventListener("click", () => $("#stickerTray").classList.toggle("hidden"));
$("#stickerTray").addEventListener("click", async (e) => { const btn = e.target.closest("[data-sticker]"); if (!btn) return; const s = stickers[Number(btn.dataset.sticker)]; const { error } = await supabaseClient.from("messages").insert({ book_id: activeBookId, user_id: session.user.id, message_type: "sticker", sticker_id: s.id }); if (error) return toast(error.message); $("#stickerTray").classList.add("hidden"); });

function finishSplash() { const s = $("#splashScreen"); if (!s || s.dataset.done) return; s.dataset.done = "1"; s.classList.add("hide"); document.body.classList.remove("splash-lock"); setTimeout(() => s.remove(), 650); }
document.body.classList.add("splash-lock"); addEventListener("load", () => setTimeout(boot, 1150)); setTimeout(() => { if (!$("#splashScreen")?.dataset.done) boot(); }, 3200);
if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(console.warn));
