const ACTIVE_BOOK_KEY = "bori-v13-active-book";
document.documentElement.setAttribute("data-color-theme", localStorage.getItem("bori-color-theme") || "green");
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
const defaultCategories = [
  { name: "餐飲", icon: "ramen" }, { name: "飲料", icon: "bubbletea" }, { name: "日常用品", icon: "toiletries" },
  { name: "住房", icon: "house" }, { name: "交通", icon: "bus" }, { name: "汽車", icon: "car" },
  { name: "水電瓦斯", icon: "lightbulb" }, { name: "通訊", icon: "phone" }, { name: "訂閱", icon: "tv" },
  { name: "服飾", icon: "clothes" }, { name: "休閒育樂", icon: "game" }, { name: "醫療保健", icon: "firstaid" },
  { name: "寵物", icon: "pets" }, { name: "固定貸款", icon: "creditcard" }, { name: "其他", icon: "receipt" }
];
const categoryIconKeys = ["ramen","bubbletea","coffee","cake","burger","groceries","shopping_bag","cart","car","scooter","train","plane","gas","bus","taxi","parking","movie","game","headphones","gift","house","building","lightbulb","faucet","toiletries","bed_moon","firstaid","medicine","fitness","produce","pets","petfood","toiletries2","clothes","makeup","haircut","luggage","bedroom","laptop","phone","book","graduation","tv","calendar","wallet","creditcard","insurance","receipt","flowers","chat"];
function activeCategories() {
  const c = activeBook()?.categories;
  if (!c || !c.length) return defaultCategories;
  return c.map((x) => (typeof x === "string" ? { name: x, icon: null } : x));
}
function categoryIconHTML(name) {
  const cat = activeCategories().find((c) => c.name === name);
  const key = cat?.icon && categoryIconKeys.includes(cat.icon) ? cat.icon : "receipt";
  return `<img class="category-icon-img" src="assets/category-icons/${key}.png" alt="" />`;
}
const stickerSets = [
  { id: "cute", name: "可愛對話", stickers: [
    { id: "hi", img: "assets/stickers/hi.jpg", text: "嗨嗨！" },
    { id: "there", img: "assets/stickers/there.jpg", text: "在嗎？" },
    { id: "thankyou", img: "assets/stickers/thankyou.jpg", text: "謝謝你！" },
    { id: "awesome", img: "assets/stickers/awesome.jpg", text: "太棒了！" },
    { id: "please", img: "assets/stickers/please.jpg", text: "拜託拜託～" },
    { id: "congrats", img: "assets/stickers/congrats.jpg", text: "恭喜！" },
    { id: "whimper", img: "assets/stickers/whimper.jpg", text: "嗚嗚…" },
    { id: "hug", img: "assets/stickers/hug.jpg", text: "抱抱～" },
    { id: "gotit", img: "assets/stickers/gotit.jpg", text: "好的！" },
    { id: "thinking", img: "assets/stickers/thinking.jpg", text: "我想想…" },
    { id: "ok2", img: "assets/stickers/ok2.jpg", text: "OK！" },
    { id: "goodnight", img: "assets/stickers/goodnight.jpg", text: "晚安～" },
    { id: "hardwork", img: "assets/stickers/hardwork.jpg", text: "辛苦了！" },
    { id: "yay", img: "assets/stickers/yay.jpg", text: "耶！" },
    { id: "touched", img: "assets/stickers/touched.jpg", text: "感動" },
    { id: "leaving", img: "assets/stickers/leaving.jpg", text: "先走囉～" }
  ]},
  { id: "bookkeeping", name: "熊熊記帳", stickers: [
  { id: "hi2", img: "assets/stickers2/hi2.jpg", text: "嗨嗨！" },
  { id: "logging", img: "assets/stickers2/logging.jpg", text: "記帳中…" },
  { id: "calculating", img: "assets/stickers2/calculating.jpg", text: "算一算" },
  { id: "done2", img: "assets/stickers2/done2.jpg", text: "搞定！" },
  { id: "saving_best", img: "assets/stickers2/saving_best.jpg", text: "存錢最棒！" },
  { id: "spree", img: "assets/stickers2/spree.jpg", text: "買買買！" },
  { id: "overspent", img: "assets/stickers2/overspent.jpg", text: "又花太多了…" },
  { id: "ohno", img: "assets/stickers2/ohno.jpg", text: "天啊！" },
  { id: "shouldbuy", img: "assets/stickers2/shouldbuy.jpg", text: "要買嗎？" },
  { id: "planfirst", img: "assets/stickers2/planfirst.jpg", text: "先計畫！" },
  { id: "tinyjoy", img: "assets/stickers2/tinyjoy.jpg", text: "小確幸～" },
  { id: "summary", img: "assets/stickers2/summary.jpg", text: "本月總結" },
  { id: "goalmet", img: "assets/stickers2/goalmet.jpg", text: "目標達成！" },
  { id: "keepsaving", img: "assets/stickers2/keepsaving.jpg", text: "加油存錢！" },
  { id: "saveit", img: "assets/stickers2/saveit.jpg", text: "存起來！" },
  { id: "todayspend", img: "assets/stickers2/todayspend.jpg", text: "今日支出" },
  { id: "waitbuy", img: "assets/stickers2/waitbuy.jpg", text: "等等再買！" },
  { id: "walletcry", img: "assets/stickers2/walletcry.jpg", text: "荷包哭哭" },
  { id: "relax", img: "assets/stickers2/relax.jpg", text: "放鬆一下～" },
  { id: "goodnight2", img: "assets/stickers2/goodnight2.jpg", text: "晚安～" }
  ]}
];
const allStickers = stickerSets.flatMap((set) => set.stickers);

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
function goTo(pageId) { $$(".page").forEach((p) => p.classList.toggle("active", p.id === pageId)); $$(".nav-item,.nav-add").forEach((b) => b.classList.toggle("active", b.dataset.page === pageId)); if (pageId === "chatPage") scrollChat(); if (pageId === "addPage" && activeBookId) { $("#transactionForm")?.reset(); setAddType("expense"); $("#dateInput").value = localDateStr(); } }
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
  $("#ledgerCount").textContent = transactions.length ? `共 ${transactions.length} 筆` : "";
  const expenses = monthTransactions("expense");
  const exp = expenses.reduce((s, x) => s + Number(x.amount), 0);
  const myPaid = expenses.filter((x) => x.user_id === session?.user?.id).reduce((s, x) => s + Number(x.amount), 0);
  const otherPaid = Math.max(exp - myPaid, 0);
  $("#myPaidTotal").textContent = money(myPaid); $("#otherPaidTotal").textContent = money(otherPaid);
  renderAccountBalances();
  renderBudgets(expenses);
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
  $("#verifiedBadge").classList.toggle("hidden", !session?.user?.email_confirmed_at);
  const book = activeBook(), isOwner = book?.role === "owner";
  $("#heroRoomSummary").classList.toggle("hidden", !book);
  if (book) { $("#heroRoomIcon").src = typeIcon[book.type] || typeIcon.other; $("#heroRoomName").textContent = book.name; $("#heroRoomMembers").textContent = `${memberCounts[book.id] || 1} 位成員 · 同步中`; }
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
  renderCategorySelects();
}
function renderCategorySelects() {
  $("#budgetCategory").innerHTML = activeCategories().map((c) => `<option>${escapeHTML(c.name)}</option>`).join("");
}
function renderCategoryManageList() {
  const cats = activeCategories();
  $("#categoryManageList").innerHTML = cats.map((c, i) => `<div class="category-manage-row" data-index="${i}"><span class="drag-handle">⠿</span>${categoryIconHTML(c.name)}<span class="category-name">${escapeHTML(c.name)}</span><button type="button" class="category-remove" data-remove-category="${escapeHTML(c.name)}">×</button></div>`).join("");
}
async function updateCategories(list) {
  const { error } = await supabaseClient.from("books").update({ categories: list }).eq("id", activeBookId);
  if (error) return toast(error.message);
  const b = books.find((x) => x.id === activeBookId); if (b) b.categories = list;
  renderCategorySelects(); renderCategoryManageList();
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
}
function renderBudgets(expenses) {
  const el = $("#budgetPreview");
  if (!budgets.length) { el.innerHTML = `<div class="empty-state compact"><p>尚未設定預算，先為常用分類設定上限吧。</p></div>`; return; }
  el.innerHTML = budgets.map((b) => {
    const used = expenses.filter((x) => x.category === b.category).reduce((s, x) => s + Number(x.amount), 0), pct = Number(b.amount) ? Math.min(120, (used / Number(b.amount)) * 100) : 0;
    return `<article class="budget-card"><div class="budget-head"><span>${categoryIconHTML(b.category)} ${escapeHTML(b.category)}</span><strong>${money(used)} / ${money(b.amount)}</strong></div><div class="progress"><i class="${pct >= 100 ? "over" : ""}" style="width:${Math.min(100, pct)}%"></i></div><small>${pct >= 100 ? "已超出預算" : `還可以使用 ${money(Math.max(Number(b.amount) - used, 0))}`}</small></article>`;
  }).join("");
}
const paymentMethodLabels = { cash: "現金", credit_card: "信用卡", bank: "銀行帳戶", ewallet: "電子支付" };
const paymentMethodIcons = {
  cash: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/></svg>',
  credit_card: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 9.5h19"/><path d="M6 14.5h4"/></svg>',
  bank: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10l9-6 9 6"/><path d="M4.5 10v8M9 10v8M15 10v8M19.5 10v8"/><path d="M2.5 20h19"/></svg>',
  ewallet: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h11A2.5 2.5 0 0 1 19 7.5v9A2.5 2.5 0 0 1 16.5 19h-11A2.5 2.5 0 0 1 3 16.5z"/><path d="M15 12.5h3.5v2.5H15a1.25 1.25 0 0 1 0-2.5z"/></svg>'
};
function computeAccountBalances() {
  const balances = { cash: 0, credit_card: 0, bank: 0, ewallet: 0 };
  transactions.forEach((x) => {
    const pm = balances.hasOwnProperty(x.payment_method) ? x.payment_method : "cash";
    balances[pm] += x.transaction_type === "income" ? Number(x.amount) : -Number(x.amount);
  });
  return balances;
}
function renderAccountBalances() {
  const el = $("#accountBalances");
  if (!el) return;
  const balances = computeAccountBalances();
  el.innerHTML = Object.keys(paymentMethodLabels).map((key) => `<div class="account-balance-card"><span class="account-icon">${paymentMethodIcons[key]}</span><small>${paymentMethodLabels[key]}</small><strong class="${balances[key] < 0 ? "negative" : ""}">${money(balances[key])}</strong></div>`).join("");
}
function recordHTML(x) {
  const income = x.transaction_type === "income", meta = income ? { icon: "💰", color: "#7fa56a" } : (categoryMeta[x.category] || categoryMeta.其他);
  const iconHTML = income ? meta.icon : categoryIconHTML(x.category);
  const noteHTML = x.note ? `<small class="record-note">📝 ${escapeHTML(x.note)}</small>` : "";
  const payLabel = paymentMethodLabels[x.payment_method] || "現金";
  return `<article class="record"><div class="record-icon" style="background:${meta.color}20">${iconHTML}</div><div><strong>${escapeHTML(x.title)}</strong><small>${escapeHTML(x.category)} · ${new Date(`${x.transaction_date}T00:00:00`).toLocaleDateString("zh-TW")} · ${payLabel}</small>${noteHTML}</div><b class="${income ? "income-text" : ""}">${income ? "+" : "-"}${money(x.amount)}</b></article>`;
}
function renderAdd() { const has = !!activeBookId; $("#addEmpty").classList.toggle("hidden", has); $("#addContent").classList.toggle("hidden", !has); if (has) setAddType(addType); }
function stickerById(id) { return allStickers.find((s) => s.id === id); }
function renderChat() {
  const has = !!activeBookId; $("#chatEmpty").classList.toggle("hidden", has); $("#chatContent").classList.toggle("hidden", !has); if (!has) return;
  const b = activeBook(); $("#chatBookTitle").textContent = b.name;
  $("#messageList").innerHTML = messages.length ? messages.map((m) => {
    const mine = m.user_id === session.user.id, name = m.profiles?.display_name || (mine ? profile?.display_name : "成員");
    if (m.message_type === "sticker") { const s = stickerById(m.sticker_id); return `<div class="message ${mine ? "mine" : "other"} sticker-message"><small class="sender">${escapeHTML(name)}</small>${s ? `<img src="${s.img}" alt="${escapeHTML(s.text)}" />` : `<span>🐻</span><strong>BORI</strong>`}<small>${new Date(m.created_at).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}</small></div>`; }
    return `<div class="message ${mine ? "mine" : "other"}"><small class="sender">${escapeHTML(name)}</small><p>${escapeHTML(m.content || "")}</p><small>${new Date(m.created_at).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}</small></div>`;
  }).join("") : `<div class="chat-welcome"><span>🐻</span><p>這裡是你們的即時聊天室。<br>先傳一句話或一張 BORI 貼圖吧。</p></div>`;
  renderStickerTray();
}
let activeStickerSet = 0;
function renderStickerTray() {
  $("#stickerSetTabs").innerHTML = stickerSets.map((set, i) => `<button type="button" class="sticker-set-tab ${i === activeStickerSet ? "active" : ""}" data-set="${i}"><img src="${set.stickers[0].img}" alt="${escapeHTML(set.name)}" /></button>`).join("");
  $("#stickerGrid").innerHTML = stickerSets[activeStickerSet].stickers.map((s) => `<button type="button" data-sticker="${s.id}"><img src="${s.img}" alt="${escapeHTML(s.text)}" /></button>`).join("");
}
function scrollChat() { setTimeout(() => { const el = $("#messageList"); if (el) el.scrollTop = el.scrollHeight; }, 30); }
function renderAnalysis() {
  if (!activeBookId) return;
  const expenses = monthTransactions("expense");
  const exp = expenses.reduce((s, x) => s + Number(x.amount), 0);
  $("#donutTotal").textContent = money(exp);
  const grouped = {}; expenses.forEach((x) => grouped[x.category] = (grouped[x.category] || 0) + Number(x.amount)); const entries = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
  let cursor = 0; const segments = entries.map(([c, v]) => { const start = cursor; cursor += exp ? (v / exp) * 360 : 0; return `${(categoryMeta[c] || categoryMeta.其他).color} ${start}deg ${cursor}deg`; });
  $("#donutChart").style.background = segments.length ? `conic-gradient(${segments.join(",")})` : "#eee7dc";
  $("#categoryLegend").innerHTML = entries.length ? entries.map(([c, v]) => `<div class="legend-row"><i style="background:${(categoryMeta[c] || categoryMeta.其他).color}"></i><span>${escapeHTML(c)}</span><strong>${Math.round((v / exp) * 100)}%</strong></div>`).join("") : `<p class="muted">尚無支出分類</p>`;
}

async function createBook(name, type) {
  const code = inviteCode();
  const { data, error } = await supabaseClient.from("books").insert({ name, type, owner_id: session.user.id, invite_code: code }).select().single();
  if (error) throw error;
  const { error: memberError } = await supabaseClient.from("book_members").insert({ book_id: data.id, user_id: session.user.id, role: "owner" });
  if (memberError) throw memberError;
  return data;
}
async function addTransaction(type, title, amount, category, note = "", date = null, paymentMethod = "cash") {
  const { error } = await supabaseClient.from("transactions").insert({ book_id: activeBookId, user_id: session.user.id, transaction_type: type, category, title, amount: Number(amount), transaction_date: date || localDateStr(), note, payment_method: paymentMethod });
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
  closeDialog("roomSettingsDialog");
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
  closeDialog("roomSettingsDialog");
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
const incomeCategories = ["薪水", "獎金", "副業", "投資", "退款", "禮金", "其他"];
let addType = "expense";
function setAddType(type) {
  addType = type;
  $("#addTypeSelect").value = type;
  $("#addPageEyebrow").textContent = type === "expense" ? "NEW EXPENSE" : "NEW INCOME";
  $("#addPageTitle").textContent = type === "expense" ? "這次花了多少？" : "這次收入多少？";
  $("#categoryInput").innerHTML = (type === "expense" ? activeCategories().map((c) => c.name) : incomeCategories).map((n) => `<option>${escapeHTML(n)}</option>`).join("");
}
$("#addTypeSelect").addEventListener("change", (e) => setAddType(e.target.value));
$("#transactionForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || "cash";
  try {
    await addTransaction(addType, $("#titleInput").value.trim(), $("#amountInput").value, $("#categoryInput").value, $("#noteInput").value.trim(), $("#dateInput").value, paymentMethod);
    e.target.reset();
    setAddType("expense");
    $("#dateInput").value = localDateStr();
    await loadActiveBookData();
    renderAll();
    goTo("homePage");
    toast(addType === "expense" ? "支出已同步到房間 ☁️" : "收入已同步到房間 💰");
  } catch (err) { toast(err.message); }
});
$("#budgetForm").addEventListener("submit", async (e) => { e.preventDefault(); const row = { book_id: activeBookId, category: $("#budgetCategory").value, amount: Number($("#budgetAmount").value), month: currentMonth(), created_by: session.user.id }; const { error } = await supabaseClient.from("budgets").upsert(row, { onConflict: "book_id,category,month" }); if (error) return toast(error.message); e.target.reset(); closeDialog("budgetDialog"); await loadActiveBookData(); renderAll(); toast("預算已更新 🎯"); });
let selectedCategoryIcon = "receipt";
function renderIconPicker() {
  $("#iconPicker").innerHTML = categoryIconKeys.map((k) => `<button type="button" class="icon-picker-item ${k === selectedCategoryIcon ? "active" : ""}" data-icon="${k}"><img src="assets/category-icons/${k}.png" alt="" /></button>`).join("");
}
$("#iconPicker").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-icon]");
  if (!btn) return;
  selectedCategoryIcon = btn.dataset.icon;
  $$("#iconPicker .icon-picker-item").forEach((b) => b.classList.toggle("active", b.dataset.icon === selectedCategoryIcon));
});
$("#manageCategoriesLink").addEventListener("click", () => { renderCategoryManageList(); renderIconPicker(); openDialog("manageCategoriesDialog"); });
document.addEventListener("click", (e) => { if (e.target.closest('[data-open="manageCategoriesDialog"]')) { renderCategoryManageList(); renderIconPicker(); } });
async function renderMemberList() {
  if (!activeBookId) return;
  const { data, error } = await supabaseClient.from("book_members").select("role, user_id, profiles(display_name, avatar_url)").eq("book_id", activeBookId).order("created_at", { ascending: true });
  if (error) { $("#memberList").innerHTML = `<p class="muted-hint">載入失敗：${escapeHTML(error.message)}</p>`; return; }
  $("#memberList").innerHTML = (data && data.length) ? data.map((m) => {
    const name = m.profiles?.display_name || "BORI 使用者";
    const avatar = m.profiles?.avatar_url ? `<img src="${m.profiles.avatar_url}" alt="" />` : `<span class="member-emoji">🐻</span>`;
    return `<div class="member-row"><span class="member-avatar">${avatar}</span><span class="member-info"><strong>${escapeHTML(name)}</strong><small>${m.role === "owner" ? "擁有者" : "成員"}</small></span></div>`;
  }).join("") : `<p class="muted-hint">目前沒有成員資料。</p>`;
}
document.addEventListener("click", (e) => { if (e.target.closest('[data-open="memberListDialog"]')) renderMemberList(); });
function renderAccountSecurity() {
  const isGoogle = session?.user?.app_metadata?.provider === "google";
  $("#loginMethodValue").textContent = isGoogle ? "Google 帳號" : "Email";
  $("#changePasswordSection").classList.toggle("hidden", isGoogle);
  $("#googleAccountNote").classList.toggle("hidden", !isGoogle);
}
document.addEventListener("click", (e) => { if (e.target.closest('[data-open="accountSecurityDialog"]')) renderAccountSecurity(); });
$("#changePasswordForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const pw = $("#newPasswordInput").value;
  if (pw.length < 6) return toast("密碼至少要 6 碼");
  const { error } = await supabaseClient.auth.updateUser({ password: pw });
  if (error) return toast(error.message);
  e.target.reset();
  toast("密碼已更新 🔒");
});
function applyColorTheme(theme) {
  document.documentElement.setAttribute("data-color-theme", theme);
  $$("#colorThemePicker .color-theme-item").forEach((b) => b.classList.toggle("active", b.dataset.themeColor === theme));
}
applyColorTheme(localStorage.getItem("bori-color-theme") || "green");
$("#colorThemePicker").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-theme-color]");
  if (!btn) return;
  const theme = btn.dataset.themeColor;
  localStorage.setItem("bori-color-theme", theme);
  applyColorTheme(theme);
});
$("#categoryManageList").addEventListener("click", async (e) => {
  const delBtn = e.target.closest("[data-remove-category]");
  if (!delBtn) return;
  const cur = activeCategories();
  if (cur.length <= 1) return toast("至少要保留一個分類");
  await updateCategories(cur.filter((c) => c.name !== delBtn.dataset.removeCategory));
});
$("#categoryManageList").addEventListener("pointerdown", (e) => {
  if (e.target.closest(".category-remove")) return;
  const row = e.target.closest(".category-manage-row");
  if (!row) return;
  const startX = e.clientX, startY = e.clientY, pointerId = e.pointerId;
  let activated = false;
  const timer = setTimeout(() => { activated = true; beginCategoryDrag(row, pointerId, startY); }, 350);
  const onMove = (ev) => { if (!activated && (Math.abs(ev.clientY - startY) > 10 || Math.abs(ev.clientX - startX) > 10)) cleanup(); };
  const onUp = () => cleanup();
  function cleanup() {
    clearTimeout(timer);
    row.removeEventListener("pointermove", onMove);
    row.removeEventListener("pointerup", onUp);
    row.removeEventListener("pointercancel", onUp);
  }
  row.addEventListener("pointermove", onMove);
  row.addEventListener("pointerup", onUp);
  row.addEventListener("pointercancel", onUp);
});
function beginCategoryDrag(startRow, pointerId, startY) {
  const list = $("#categoryManageList");
  const allRows = $$("#categoryManageList .category-manage-row");
  const startIndex = allRows.indexOf(startRow);
  const rowHeight = startRow.getBoundingClientRect().height + 8;
  const scrollStart = list.scrollTop;
  let currentIndex = startIndex;
  let lastClientY = startY;
  let autoScrollRAF = null;
  try { startRow.setPointerCapture(pointerId); } catch {}
  startRow.classList.add("dragging");
  function updatePositions(effectiveDeltaY) {
    startRow.style.transform = `translateY(${effectiveDeltaY}px)`;
    const slotShift = Math.round(effectiveDeltaY / rowHeight);
    const newIndex = Math.min(allRows.length - 1, Math.max(0, startIndex + slotShift));
    if (newIndex !== currentIndex) {
      allRows.forEach((r, i) => {
        if (r === startRow) return;
        let shift = 0;
        if (newIndex > currentIndex && i > currentIndex && i <= newIndex) shift = -1;
        else if (newIndex < currentIndex && i >= newIndex && i < currentIndex) shift = 1;
        r.style.transform = shift ? `translateY(${shift * rowHeight}px)` : "";
      });
      currentIndex = newIndex;
    }
  }
  function autoScrollLoop() {
    const rect = list.getBoundingClientRect();
    const edge = 36;
    let speed = 0;
    if (lastClientY < rect.top + edge) speed = -Math.ceil((rect.top + edge - lastClientY) / 3);
    else if (lastClientY > rect.bottom - edge) speed = Math.ceil((lastClientY - (rect.bottom - edge)) / 3);
    if (speed !== 0) {
      const before = list.scrollTop;
      list.scrollTop = Math.max(0, Math.min(list.scrollHeight - list.clientHeight, list.scrollTop + speed));
      if (list.scrollTop !== before) updatePositions((lastClientY - startY) + (list.scrollTop - scrollStart));
    }
    autoScrollRAF = requestAnimationFrame(autoScrollLoop);
  }
  autoScrollRAF = requestAnimationFrame(autoScrollLoop);
  function onMove(ev) {
    ev.preventDefault();
    lastClientY = ev.clientY;
    updatePositions((ev.clientY - startY) + (list.scrollTop - scrollStart));
  }
  function onUp() {
    if (autoScrollRAF) cancelAnimationFrame(autoScrollRAF);
    try { startRow.releasePointerCapture(pointerId); } catch {}
    startRow.removeEventListener("pointermove", onMove);
    startRow.removeEventListener("pointerup", onUp);
    startRow.removeEventListener("pointercancel", onUp);
    startRow.classList.remove("dragging");
    allRows.forEach((r) => { r.style.transform = ""; });
    if (currentIndex !== startIndex) {
      const cur = [...activeCategories()];
      const [moved] = cur.splice(startIndex, 1);
      cur.splice(currentIndex, 0, moved);
      updateCategories(cur);
    }
  }
  startRow.addEventListener("pointermove", onMove);
  startRow.addEventListener("pointerup", onUp);
  startRow.addEventListener("pointercancel", onUp);
}
$("#addCategoryForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = $("#newCategoryInput").value.trim();
  if (!name) return;
  const cur = activeCategories();
  if (cur.some((c) => c.name === name)) return toast("這個分類已經有了");
  await updateCategories([...cur, { name, icon: selectedCategoryIcon }]);
  e.target.reset();
  selectedCategoryIcon = "receipt";
  renderIconPicker();
});
$("#chatForm").addEventListener("submit", async (e) => { e.preventDefault(); const content = $("#messageInput").value.trim(); if (!content) return; const { error } = await supabaseClient.from("messages").insert({ book_id: activeBookId, user_id: session.user.id, message_type: "text", content }); if (error) return toast(error.message); $("#messageInput").value = ""; });
$("#stickerBtn").addEventListener("click", () => $("#stickerTray").classList.toggle("hidden"));
$("#stickerSetTabs").addEventListener("click", (e) => { const btn = e.target.closest("[data-set]"); if (!btn) return; activeStickerSet = Number(btn.dataset.set); renderStickerTray(); });
$("#stickerGrid").addEventListener("click", async (e) => { const btn = e.target.closest("[data-sticker]"); if (!btn) return; const s = stickerById(btn.dataset.sticker); if (!s) return; const { error } = await supabaseClient.from("messages").insert({ book_id: activeBookId, user_id: session.user.id, message_type: "sticker", sticker_id: s.id }); if (error) return toast(error.message); $("#stickerTray").classList.add("hidden"); });

function finishSplash() { const s = $("#splashScreen"); if (!s || s.dataset.done) return; s.dataset.done = "1"; s.classList.add("hide"); document.body.classList.remove("splash-lock"); setTimeout(() => s.remove(), 650); }
document.body.classList.add("splash-lock"); addEventListener("load", () => setTimeout(boot, 1150)); setTimeout(() => { if (!$("#splashScreen")?.dataset.done) boot(); }, 3200);
if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(console.warn));
