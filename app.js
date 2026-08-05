const ACTIVE_BOOK_KEY = "bori-v13-active-book";
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const money = (n) => new Intl.NumberFormat("zh-TW", { style: "currency", currency: "TWD", maximumFractionDigits: 0 }).format(Number(n || 0));
const escapeHTML = (v = "") => String(v).replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));
const currentMonth = () => new Date().toISOString().slice(0, 7);
const typeIcon = { couple: "❤️", family: "👨‍👩‍👧", friends: "🍻", travel: "✈️", other: "📒" };
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
function openDialog(id) { if (!activeBookId && !["bookDialog", "joinDialog"].includes(id)) return toast("請先建立或加入帳本"); $("#" + id)?.showModal(); }
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

async function boot() {
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

async function loadBooks() {
  const { data, error } = await supabaseClient.from("book_members").select("role, books(*)").eq("user_id", session.user.id);
  if (error) { toast(error.message); books = []; return; }
  books = (data || []).map((row) => ({ ...row.books, role: row.role })).filter(Boolean);
  if (!books.some((b) => b.id === activeBookId)) activeBookId = books[0]?.id || null;
  if (activeBookId) localStorage.setItem(ACTIVE_BOOK_KEY, activeBookId); else localStorage.removeItem(ACTIVE_BOOK_KEY);
}

async function loadActiveBookData() {
  unsubscribeRealtime();
  transactions = []; budgets = []; messages = [];
  if (!activeBookId) return;
  const [tx, bd, ms] = await Promise.all([
    supabaseClient.from("transactions").select("*").eq("book_id", activeBookId).order("transaction_date", { ascending: false }).order("created_at", { ascending: false }),
    supabaseClient.from("budgets").select("*").eq("book_id", activeBookId).eq("month", currentMonth()),
    supabaseClient.from("messages").select("*, profiles(display_name)").eq("book_id", activeBookId).order("created_at", { ascending: true }).limit(200)
  ]);
  if (tx.error) toast(tx.error.message); else transactions = tx.data || [];
  if (bd.error) toast(bd.error.message); else budgets = bd.data || [];
  if (ms.error) toast(ms.error.message); else messages = ms.data || [];
  subscribeRealtime();
}

function subscribeRealtime() {
  if (!activeBookId) return;
  realtimeChannel = supabaseClient.channel(`bori-chat-${activeBookId}`)
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `book_id=eq.${activeBookId}` }, async (payload) => {
      const { data } = await supabaseClient.from("messages").select("*, profiles(display_name)").eq("id", payload.new.id).single();
      if (data && !messages.some((m) => m.id === data.id)) { messages.push(data); renderChat(); renderHome(); scrollChat(); }
    }).subscribe();
}
function unsubscribeRealtime() { if (realtimeChannel && supabaseClient) supabaseClient.removeChannel(realtimeChannel); realtimeChannel = null; }

async function switchBook(bookId) {
  activeBookId = bookId;
  localStorage.setItem(ACTIVE_BOOK_KEY, activeBookId);
  await loadActiveBookData();
  renderAll();
}

function renderAll() { renderProfile(); renderBookSwitcher(); renderHome(); renderAdd(); renderChat(); renderAnalysis(); }
function renderProfile() {
  $("#profileName").textContent = profile?.display_name || "BORI 使用者";
  $("#profileEmail").textContent = session?.user?.email || "Cloud Life · V1.3";
  $("#helloText").textContent = `안녕, ${profile?.display_name || "BORI"} 👋`;
}
function renderBookSwitcher() {
  $("#activeBookSelect").innerHTML = books.map((b) => `<option value="${b.id}" ${b.id === activeBookId ? "selected" : ""}>${typeIcon[b.type] || "📒"} ${escapeHTML(b.name)}</option>`).join("");
}
function renderHome() {
  const has = books.length > 0;
  $("#homeEmpty").classList.toggle("hidden", has); $("#homeDashboard").classList.toggle("hidden", !has);
  if (!has) return;
  const book = activeBook();
  const expenses = monthTransactions("expense"), incomes = monthTransactions("income");
  const exp = expenses.reduce((s, x) => s + Number(x.amount), 0), inc = incomes.reduce((s, x) => s + Number(x.amount), 0), bud = budgets.reduce((s, x) => s + Number(x.amount), 0);
  $("#homeBookName").textContent = `${typeIcon[book.type] || "📒"} ${book.name}`;
  $("#incomeTotal").textContent = money(inc); $("#expenseTotal").textContent = money(exp); $("#budgetTotal").textContent = money(bud);
  $("#availableAmount").textContent = money(bud ? Math.max(bud - exp, 0) : inc - exp);
  $("#budgetHint").textContent = bud ? `預算已使用 ${Math.min(100, Math.round((exp / bud) * 100 || 0))}%` : `目前結餘 ${money(inc - exp)}`;
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
  return `<article class="record"><div class="record-icon" style="background:${meta.color}20">${meta.icon}</div><div><strong>${escapeHTML(x.title)}</strong><small>${escapeHTML(x.category)} · ${new Date(`${x.transaction_date}T00:00:00`).toLocaleDateString("zh-TW")}</small></div><b class="${income ? "income-text" : ""}">${income ? "+" : "-"}${money(x.amount)}</b></article>`;
}
function renderAdd() { const has = !!activeBookId; $("#addEmpty").classList.toggle("hidden", has); $("#addContent").classList.toggle("hidden", !has); }
function stickerById(id) { return stickers.find((s) => s.id === id); }
function renderChat() {
  const has = !!activeBookId; $("#chatEmpty").classList.toggle("hidden", has); $("#chatContent").classList.toggle("hidden", !has); if (!has) return;
  const b = activeBook(); $("#chatBookTitle").textContent = `${typeIcon[b.type] || "📒"} ${b.name}`;
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
  const { error } = await supabaseClient.from("transactions").insert({ book_id: activeBookId, user_id: session.user.id, transaction_type: type, category, title, amount: Number(amount), transaction_date: new Date().toISOString().slice(0, 10), note });
  if (error) throw error;
}


$$('[data-auth-tab]').forEach((b) => b.addEventListener("click", () => {
  $$('[data-auth-tab]').forEach((x) => x.classList.toggle("active", x === b));
  $("#loginForm").classList.toggle("hidden", b.dataset.authTab !== "login"); $("#registerForm").classList.toggle("hidden", b.dataset.authTab !== "register");
}));
$("#loginForm").addEventListener("submit", async (e) => { e.preventDefault(); const { data, error } = await supabaseClient.auth.signInWithPassword({ email: $("#loginEmail").value.trim(), password: $("#loginPassword").value }); if (error) return toast(error.message); session = data.session; await enterApp(); toast("登入成功 🌾"); });
$("#registerForm").addEventListener("submit", async (e) => { e.preventDefault(); const { data, error } = await supabaseClient.auth.signUp({ email: $("#registerEmail").value.trim(), password: $("#registerPassword").value, options: { data: { display_name: $("#registerName").value.trim() } } }); if (error) return toast(error.message); if (data.session) { session = data.session; await enterApp(); } else { toast("註冊成功，請到信箱完成驗證"); $$('[data-auth-tab]')[0].click(); } });
$("#signOutBtn").addEventListener("click", async () => { unsubscribeRealtime(); await supabaseClient.auth.signOut(); session = null; showOnly("authScreen"); toast("已登出"); });

$$('[data-page]').forEach((b) => b.addEventListener("click", () => goTo(b.dataset.page)));
$$('[data-open]').forEach((b) => b.addEventListener("click", () => openDialog(b.dataset.open)));
$$('[data-close]').forEach((b) => b.addEventListener("click", () => closeDialog(b.dataset.close)));
$("#activeBookSelect").addEventListener("change", (e) => switchBook(e.target.value));

$("#bookForm").addEventListener("submit", async (e) => { e.preventDefault(); try { const name = $("#newBookName").value.trim(), type = document.querySelector('[name="bookType"]:checked').value; const book = await createBook(name, type); activeBookId = book.id; localStorage.setItem(ACTIVE_BOOK_KEY, activeBookId); e.target.reset(); closeDialog("bookDialog"); await loadBooks(); await loadActiveBookData(); renderAll(); toast(`帳本建立完成，邀請碼：${book.invite_code}`); } catch (err) { toast(err.message); } });
$("#joinForm").addEventListener("submit", async (e) => { e.preventDefault(); const code = $("#inviteCodeInput").value.trim().toUpperCase(); const { data, error } = await supabaseClient.rpc("join_book_by_code", { p_invite_code: code }); if (error) return toast(error.message); if (!data) return toast("找不到邀請碼"); closeDialog("joinDialog"); e.target.reset(); await loadBooks(); activeBookId = data; await loadActiveBookData(); renderAll(); toast("已加入共同帳本"); });
$("#expenseForm").addEventListener("submit", async (e) => { e.preventDefault(); try { await addTransaction("expense", $("#titleInput").value.trim(), $("#amountInput").value, $("#categoryInput").value, $("#noteInput").value.trim()); e.target.reset(); await loadActiveBookData(); renderAll(); goTo("homePage"); toast("支出已同步到雲端"); } catch (err) { toast(err.message); } });
$("#incomeForm").addEventListener("submit", async (e) => { e.preventDefault(); try { await addTransaction("income", $("#incomeTitle").value.trim(), $("#incomeAmount").value, $("#incomeCategory").value); e.target.reset(); closeDialog("incomeDialog"); await loadActiveBookData(); renderAll(); toast("收入已同步到雲端 💰"); } catch (err) { toast(err.message); } });
$("#budgetForm").addEventListener("submit", async (e) => { e.preventDefault(); const row = { book_id: activeBookId, category: $("#budgetCategory").value, amount: Number($("#budgetAmount").value), month: currentMonth(), created_by: session.user.id }; const { error } = await supabaseClient.from("budgets").upsert(row, { onConflict: "book_id,category,month" }); if (error) return toast(error.message); e.target.reset(); closeDialog("budgetDialog"); await loadActiveBookData(); renderAll(); toast("預算已更新 🎯"); });
$("#chatForm").addEventListener("submit", async (e) => { e.preventDefault(); const content = $("#messageInput").value.trim(); if (!content) return; const { error } = await supabaseClient.from("messages").insert({ book_id: activeBookId, user_id: session.user.id, message_type: "text", content }); if (error) return toast(error.message); $("#messageInput").value = ""; });
$("#stickerBtn").addEventListener("click", () => $("#stickerTray").classList.toggle("hidden"));
$("#stickerTray").addEventListener("click", async (e) => { const btn = e.target.closest("[data-sticker]"); if (!btn) return; const s = stickers[Number(btn.dataset.sticker)]; const { error } = await supabaseClient.from("messages").insert({ book_id: activeBookId, user_id: session.user.id, message_type: "sticker", sticker_id: s.id }); if (error) return toast(error.message); $("#stickerTray").classList.add("hidden"); });

function finishSplash() { const s = $("#splashScreen"); if (!s || s.dataset.done) return; s.dataset.done = "1"; s.classList.add("hide"); document.body.classList.remove("splash-lock"); setTimeout(() => s.remove(), 650); }
document.body.classList.add("splash-lock"); addEventListener("load", () => setTimeout(boot, 1150)); setTimeout(() => { if (!$("#splashScreen")?.dataset.done) boot(); }, 3200);
if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(console.warn));
