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
const defaultIncomeCategories = [
  { name: "薪水", icon: "salary" }, { name: "獎金", icon: "achievement" }, { name: "副業", icon: "freelance" },
  { name: "投資", icon: "investment_grow" }, { name: "退款", icon: "cashback" }, { name: "禮金", icon: "red_envelope" }, { name: "其他", icon: "wallet_gift" }
];
function activeIncomeCategories() {
  const c = activeBook()?.income_categories;
  if (!c || !c.length) return defaultIncomeCategories;
  return c.map((x) => (typeof x === "string" ? { name: x, icon: null } : x));
}
function activeCategoriesForManage() { return manageCategoryType === "income" ? activeIncomeCategories() : activeCategories(); }
function categoryIconHTML(name) {
  const cat = activeCategories().find((c) => c.name === name);
  const key = cat?.icon && categoryIconKeys.includes(cat.icon) ? cat.icon : "receipt";
  return `<img class="category-icon-img" src="assets/category-icons/${key}.png" alt="" />`;
}
function incomeCategoryIconHTML(name) {
  const cat = activeIncomeCategories().find((c) => c.name === name);
  const key = cat?.icon && incomeCategoryIconKeys.includes(cat.icon) ? cat.icon : "wallet_gift";
  return `<img class="category-icon-img" src="assets/income-icons/${key}.png" alt="" />`;
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
  ]},
  { id: "couple", name: "情侶互動", stickers: [
    { id: "im_here", img: "assets/stickers3/im_here.png", text: "我來啦" },
    { id: "wake_up", img: "assets/stickers3/wake_up.png", text: "起床囉" },
    { id: "eat_together", img: "assets/stickers3/eat_together.png", text: "一起吃飯" },
    { id: "angry", img: "assets/stickers3/angry.png", text: "哼！生氣了" },
    { id: "forgive_me", img: "assets/stickers3/forgive_me.png", text: "原諒我嘛" },
    { id: "miss_you", img: "assets/stickers3/miss_you.png", text: "好想見你" },
    { id: "take_meds", img: "assets/stickers3/take_meds.png", text: "要乖乖吃藥" },
    { id: "hard_work", img: "assets/stickers3/hard_work.png", text: "辛苦了" },
    { id: "you_rock", img: "assets/stickers3/you_rock.png", text: "你好棒" },
    { id: "ill_protect", img: "assets/stickers3/ill_protect.png", text: "有我在" },
    { id: "charging_you", img: "assets/stickers3/charging_you.png", text: "給你充電" },
    { id: "clingy", img: "assets/stickers3/clingy.png", text: "黏著你" },
    { id: "kiss_here", img: "assets/stickers3/kiss_here.png", text: "親這裡" },
    { id: "jealous", img: "assets/stickers3/jealous.png", text: "吃醋了" },
    { id: "love_you_lots", img: "assets/stickers3/love_you_lots.png", text: "愛你一萬次" },
    { id: "hug_me", img: "assets/stickers3/hug_me.png", text: "抱我" },
    { id: "good_morning", img: "assets/stickers3/good_morning.png", text: "早安呀" },
    { id: "good_night", img: "assets/stickers3/good_night.png", text: "晚安寶貝" },
    { id: "ignoring_you", img: "assets/stickers3/ignoring_you.png", text: "不理你了" },
    { id: "dont_be_mad", img: "assets/stickers3/dont_be_mad.png", text: "別生氣嘛" },
    { id: "made_up", img: "assets/stickers3/made_up.png", text: "和好囉" },
    { id: "eat_on_time", img: "assets/stickers3/eat_on_time.png", text: "記得吃飯" },
    { id: "stay_warm", img: "assets/stickers3/stay_warm.png", text: "不要著涼" },
    { id: "sweet_today", img: "assets/stickers3/sweet_today.png", text: "今天也要甜甜的" },
    { id: "why_late", img: "assets/stickers3/why_late.png", text: "你怎麼還沒來" },
    { id: "surprise_for_you", img: "assets/stickers3/surprise_for_you.png", text: "給妳的小驚喜" },
    { id: "date_time", img: "assets/stickers3/date_time.png", text: "約會時間" },
    { id: "glad_you_here", img: "assets/stickers3/glad_you_here.png", text: "有你真好" },
    { id: "love_you_most", img: "assets/stickers3/love_you_most.png", text: "最喜歡你" },
    { id: "together_forever", img: "assets/stickers3/together_forever.png", text: "永遠在一起" }
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
let memberPrivacy = {};
let roomMembers = [];
let memberFilterId = null;
let ledgerTypeFilter = "";
let ledgerCategoryFilter = "";
let myLastReadAt = null;
let realtimeChannel = null;
let diaries = [];
let editingDiaryId = null;
let dailyAnswers = [];
let budgetViewFilter = "";

function toast(message) { const el = $("#toast"); el.textContent = message; el.classList.add("show"); setTimeout(() => el.classList.remove("show"), 2300); }
function showOnly(id) { ["configErrorScreen", "authScreen", "appShell"].forEach((x) => $("#" + x).classList.toggle("hidden", x !== id)); }
const roomRequiredDialogs = ["budgetDialog", "manageCategoriesDialog", "roomSettingsDialog", "memberListDialog", "switchRoomDialog"];
function openDialog(id) { if (!activeBookId && roomRequiredDialogs.includes(id)) return toast("請先開一個房間或加入房間"); $("#" + id)?.showModal(); }
function closeDialog(id) { $("#" + id)?.close(); }
function goTo(pageId) { $$(".page").forEach((p) => p.classList.toggle("active", p.id === pageId)); $$(".nav-item,.nav-add").forEach((b) => b.classList.toggle("active", b.dataset.page === pageId)); if (pageId === "chatPage") showInteractionHub(); if (pageId === "insightsPage") renderInsights(); if (pageId === "addPage" && activeBookId) { $("#transactionForm")?.reset(); setAddType("expense"); $("#dateInput").value = localDateStr(); editingTransactionId = null; $("#deleteTransactionBtn").classList.add("hidden"); } }
function unreadCount() {
  const myId = session?.user?.id;
  if (!myId || !myLastReadAt) return 0;
  const cutoff = new Date(myLastReadAt).getTime();
  return messages.filter((m) => m.user_id !== myId && new Date(m.created_at).getTime() > cutoff).length;
}
function renderUnreadBadge() {
  const n = unreadCount();
  const text = n > 99 ? "99+" : n;
  [$("#unreadBadge"), $("#chatCardBadge")].forEach((el) => {
    if (!el) return;
    el.textContent = text;
    el.classList.toggle("hidden", n === 0);
  });
}
async function markChatRead() {
  if (!activeBookId || !session?.user?.id) return;
  myLastReadAt = new Date().toISOString();
  renderUnreadBadge();
  await supabaseClient.from("book_members").update({ last_read_at: myLastReadAt }).eq("book_id", activeBookId).eq("user_id", session.user.id);
}
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

async function fetchProfilesByIds(userIds) {
  const ids = [...new Set((userIds || []).filter(Boolean))];
  if (!ids.length) return new Map();
  const { data, error } = await supabaseClient.from("profiles").select("id, display_name, avatar_url").in("id", ids);
  if (error) throw error;
  return new Map((data || []).map((p) => [p.id, p]));
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
  transactions = []; budgets = []; messages = []; diaries = []; dailyAnswers = []; memberPrivacy = {}; roomMembers = []; memberFilterId = null; myLastReadAt = null;
  if (!activeBookId) return;
  const msPromise = supabaseClient.from("messages").select("*").eq("book_id", activeBookId).order("created_at", { ascending: true }).limit(200);
  const mpPromise = supabaseClient.from("book_members").select("user_id, hide_balance, last_read_at").eq("book_id", activeBookId);
  const [ms, mp] = await Promise.all([msPromise, mpPromise, fetchLedger()]);
  if (ms.error) toast(ms.error.message); else messages = ms.data || [];
  if (mp.error) {
    console.error("Failed to load room members:", mp.error);
    toast(`成員載入失敗：${mp.error.message}`);
  } else {
    try {
      const members = mp.data || [];
      const profileMap = await fetchProfilesByIds(members.map((m) => m.user_id));
      members.forEach((m) => { memberPrivacy[m.user_id] = m.hide_balance; });
      roomMembers = members.map((m) => {
        const memberProfile = profileMap.get(m.user_id);
        return { id: m.user_id, name: memberProfile?.display_name || "BORI 使用者", avatar: memberProfile?.avatar_url || null };
      });
      messages = messages.map((m) => ({ ...m, profiles: profileMap.get(m.user_id) || null }));
      const mine = members.find((m) => m.user_id === session?.user?.id);
      myLastReadAt = mine?.last_read_at || null;
    } catch (error) {
      console.error("Failed to load member profiles:", error);
      toast(`暱稱載入失敗：${error.message}`);
    }
  }
  await loadInteractionData();
  subscribeRealtime();
}

async function loadInteractionData() {
  if (!activeBookId) return;
  const [diaryResult, answerResult] = await Promise.all([
    supabaseClient.from("diaries").select("*").eq("book_id", activeBookId).order("entry_date", { ascending: false }).order("created_at", { ascending: false }).limit(100),
    supabaseClient.from("daily_answers").select("*").eq("book_id", activeBookId).order("question_date", { ascending: false }).limit(100)
  ]);
  if (!diaryResult.error) diaries = diaryResult.data || [];
  if (!answerResult.error) dailyAnswers = answerResult.data || [];
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
      const { data: rawMessage } = await supabaseClient.from("messages").select("*").eq("id", payload.new.id).single();
      const sender = roomMembers.find((m) => m.id === rawMessage?.user_id);
      const data = rawMessage ? { ...rawMessage, profiles: sender ? { display_name: sender.name } : null } : null;
      if (data && !messages.some((m) => m.id === data.id)) {
        messages.push(data); renderChat(); renderHome(); scrollChat();
        if ($("#chatPage")?.classList.contains("active") && data.user_id !== session?.user?.id) markChatRead();
        else renderUnreadBadge();
      }
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "transactions", filter: `book_id=eq.${activeBookId}` }, () => scheduleLedgerRefresh())
    .on("postgres_changes", { event: "*", schema: "public", table: "budgets", filter: `book_id=eq.${activeBookId}` }, () => scheduleLedgerRefresh())
    .on("postgres_changes", { event: "UPDATE", schema: "public", table: "books", filter: `id=eq.${activeBookId}` }, async () => {
      await loadBooks();
      renderAll();
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "diaries", filter: `book_id=eq.${activeBookId}` }, async () => { await loadInteractionData(); renderDiary(); renderTogetherHub(); })
    .on("postgres_changes", { event: "*", schema: "public", table: "daily_answers", filter: `book_id=eq.${activeBookId}` }, async () => { await loadInteractionData(); renderDailyQuestion(); renderTogetherHub(); })
    .subscribe();
}
function unsubscribeRealtime() { if (realtimeChannel && supabaseClient) supabaseClient.removeChannel(realtimeChannel); realtimeChannel = null; }

async function switchBook(bookId) {
  activeBookId = bookId;
  localStorage.setItem(ACTIVE_BOOK_KEY, activeBookId);
  await loadActiveBookData();
  renderAll();
}

function renderAll() { renderProfile(); renderBookSwitcher(); renderTopbarRoom(); renderSwitchRoomList(); renderHome(); renderAdd(); renderChat(); renderLedger(); renderInsights(); renderAnalysis(); renderDiary(); renderDailyQuestion(); renderTogetherHub(); renderUnreadBadge(); }
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
function visibleTransactions() {
  const myId = session?.user?.id;
  let list = transactions.filter((x) => x.user_id === myId || !(memberPrivacy[x.user_id] && x.transaction_type === "income"));
  if (memberFilterId) list = list.filter((x) => x.user_id === memberFilterId);
  if (ledgerTypeFilter) list = list.filter((x) => x.transaction_type === ledgerTypeFilter);
  if (ledgerCategoryFilter) list = list.filter((x) => x.category === ledgerCategoryFilter);
  return list;
}
function renderMemberFilterRow() {
  const show = roomMembers.length > 1;
  $("#memberFilterRow").classList.toggle("hidden", !show);
  $("#memberFilterRow").previousElementSibling?.classList.toggle("hidden", !show);
  $("#analysisFilterRow").classList.toggle("hidden", !show);
  $("#analysisFilterRow").previousElementSibling?.classList.toggle("hidden", !show);
  if (!show) return;
  const chips = `<button type="button" class="member-chip ${!memberFilterId ? "active" : ""}" data-member="">全部</button>` +
    roomMembers.map((m) => `<button type="button" class="member-chip ${memberFilterId === m.id ? "active" : ""}" data-member="${m.id}">${m.avatar ? `<img src="${m.avatar}" alt="" />` : "🐻"} ${escapeHTML(m.name)}</button>`).join("");
  $("#memberFilterRow").innerHTML = chips;
  $("#analysisFilterRow").innerHTML = chips;
}
function setMemberFilter(id) {
  memberFilterId = id || null;
  renderMemberFilterRow();
  renderLedger();
  renderAnalysis();
}
$("#memberFilterRow").addEventListener("click", (e) => { const btn = e.target.closest("[data-member]"); if (btn) setMemberFilter(btn.dataset.member); });
$("#analysisFilterRow").addEventListener("click", (e) => { const btn = e.target.closest("[data-member]"); if (btn) setMemberFilter(btn.dataset.member); });
$("#ledgerTypeFilter").addEventListener("change", (e) => { ledgerTypeFilter = e.target.value; renderLedger(); });
$("#ledgerCategoryFilter").addEventListener("change", (e) => { ledgerCategoryFilter = e.target.value; renderLedger(); });
function renderLedger() {
  const has = !!activeBookId;
  $("#ledgerEmpty").classList.toggle("hidden", has);
  $("#ledgerContent").classList.toggle("hidden", !has);
  if (!has) return;
  const visible = visibleTransactions();
  renderMemberFilterRow();
  $("#ledgerCount").textContent = visible.length ? `共 ${visible.length} 筆` : "";
  const expenses = monthTransactions("expense");
  const exp = expenses.reduce((s, x) => s + Number(x.amount), 0);
  const myPaid = expenses.filter((x) => x.user_id === session?.user?.id).reduce((s, x) => s + Number(x.amount), 0);
  const otherPaid = Math.max(exp - myPaid, 0);
  $("#myPaidTotal").textContent = money(myPaid); $("#otherPaidTotal").textContent = money(otherPaid);
  renderAccountBalances();
  renderBudgets(expenses);
  $("#ledgerList").innerHTML = visible.length ? visible.map(recordHTML).join("") : `<div class="empty-state compact"><p>還沒有收入或支出紀錄。</p></div>`;
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
  renderHideBalanceToggle();
}
function renderBookSwitcher() {
  $("#roomEmptyHint").classList.toggle("hidden", books.length > 0);
  $("#roomCarousel").classList.toggle("hidden", books.length === 0);
  $("#roomCarousel").innerHTML = books.map((b) => `<button class="room-card ${b.id === activeBookId ? "active" : ""}" data-book="${b.id}"><img class="room-thumb" src="${typeIcon[b.type] || typeIcon.other}" alt="" /><strong>${escapeHTML(b.name)}</strong><small>${memberCounts[b.id] || 1} 位成員</small></button>`).join("");
  renderCategorySelects();
}
function renderCategorySelects() {
  $("#budgetCategory").innerHTML = activeCategories().map((c) => `<option>${escapeHTML(c.name)}</option>`).join("");
  const allNames = [...new Set([...activeCategories().map((c) => c.name), ...activeIncomeCategories().map((c) => c.name)])];
  $("#ledgerCategoryFilter").innerHTML = `<option value="">全部分類</option>` + allNames.map((name) => `<option value="${escapeHTML(name)}" ${ledgerCategoryFilter === name ? "selected" : ""}>${escapeHTML(name)}</option>`).join("");
  $("#budgetViewFilter").innerHTML = `<option value="">全部成員</option><option value="shared">全房共用</option>` + roomMembers.map((m) => `<option value="${m.id}" ${budgetViewFilter === m.id ? "selected" : ""}>${escapeHTML(m.name)}</option>`).join("");
}
function renderCategoryManageList() {
  const isIncome = manageCategoryType === "income";
  const cats = activeCategoriesForManage();
  const iconFn = isIncome ? incomeCategoryIconHTML : categoryIconHTML;
  $("#categoryManageList").innerHTML = cats.map((c, i) => `<div class="category-manage-row" data-index="${i}"><span class="drag-handle">⠿</span>${iconFn(c.name)}<span class="category-name">${escapeHTML(c.name)}</span><button type="button" class="category-remove" data-remove-category="${escapeHTML(c.name)}">×</button></div>`).join("");
}
async function updateCategories(list) {
  const isIncome = manageCategoryType === "income";
  const { error } = await supabaseClient.rpc(isIncome ? "update_book_income_categories" : "update_book_categories", { p_book_id: activeBookId, p_categories: list });
  if (error) return toast(error.message);
  const b = books.find((x) => x.id === activeBookId);
  if (b) { if (isIncome) b.income_categories = list; else b.categories = list; }
  renderCategorySelects(); renderCategoryManageList();
}
function renderAccountManageList() {
  $("#accountManageList").innerHTML = baseCategories.map((c) => {
    const subs = profile?.sub_accounts?.[c.key] || [];
    const rows = subs.map((s) => `<div class="category-manage-row"><span class="category-icon-img account-manage-icon">${c.icon}</span><span class="category-name">${escapeHTML(s.name)}</span><button type="button" class="category-remove" data-remove-sub="${c.key}::${escapeHTML(s.name)}">×</button></div>`).join("");
    return `<p class="dialog-subhead">${c.icon} ${c.label}</p>${rows || '<p class="muted-hint">還沒有新增子帳戶，會顯示為「' + c.label + '」</p>'}`;
  }).join("");
}
async function updateSubAccounts(newSubAccounts) {
  const { error } = await supabaseClient.from("profiles").update({ sub_accounts: newSubAccounts }).eq("id", session.user.id);
  if (error) return toast(error.message);
  profile.sub_accounts = newSubAccounts;
  renderAccountManageList();
  renderPaymentPicker();
  renderAccountBalances();
}
let addAccountCategory = "cash";
function renderAddAccountCategoryPicker() {
  $("#addAccountCategoryPicker").innerHTML = baseCategories.map((c) => `<label><input type="radio" name="addAccountCategory" value="${c.key}" ${c.key === addAccountCategory ? "checked" : ""}><span>${c.icon}<small>${c.label}</small></span></label>`).join("");
}
$("#addAccountCategoryPicker").addEventListener("change", (e) => { if (e.target.name === "addAccountCategory") addAccountCategory = e.target.value; });
document.addEventListener("click", (e) => { if (e.target.closest('[data-open="manageAccountsDialog"]')) { renderAccountManageList(); renderAddAccountCategoryPicker(); } });
$("#accountManageList").addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-remove-sub]");
  if (!btn) return;
  const [catKey, name] = btn.dataset.removeSub.split("::");
  const cur = structuredClone(profile.sub_accounts || {});
  cur[catKey] = (cur[catKey] || []).filter((s) => s.name !== name);
  await updateSubAccounts(cur);
});
$("#addAccountForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = $("#newAccountInput").value.trim();
  if (!name) return;
  const cur = structuredClone(profile.sub_accounts || {});
  cur[addAccountCategory] = cur[addAccountCategory] || [];
  if (cur[addAccountCategory].some((s) => s.name === name)) return toast("這個子帳戶已經有了");
  cur[addAccountCategory].push({ name });
  await updateSubAccounts(cur);
  e.target.reset();
});
function monthRangeLabel() {
  const d = new Date(), last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  return `${d.getMonth() + 1}月1日 - ${d.getMonth() + 1}月${last}日`;
}
function renderHome() {
  const has = !!activeBookId;
  $("#homeDashboard").classList.toggle("hidden", !has);
  if (!has) return;
  const expenses = monthTransactions("expense"), incomes = monthTransactions("income");
  const exp = expenses.reduce((s, x) => s + Number(x.amount), 0), inc = incomes.reduce((s, x) => s + Number(x.amount), 0), bud = budgets.filter((b) => b.is_shared || b.assigned_user_id === session?.user?.id).reduce((s, x) => s + Number(x.amount), 0);
  $("#overviewRange").textContent = monthRangeLabel();
  $("#incomeTotal").textContent = money(inc); $("#expenseTotal").textContent = money(exp);
  $("#availableAmount").textContent = money(bud ? Math.max(bud - exp, 0) : inc - exp);
  $("#budgetHint").textContent = bud ? `預算已使用 ${Math.min(100, Math.round((exp / bud) * 100 || 0))}%` : `目前結餘 ${money(inc - exp)}`;
}
function renderBudgets(expenses) {
  const el = $("#budgetPreview");
  if (!el) return;
  if (!budgets.length) { el.innerHTML = `<div class="empty-state compact"><p>尚未設定預算，先為常用分類設定上限吧。</p></div>`; return; }
  let filtered = budgets;
  if (budgetViewFilter === "shared") filtered = filtered.filter((b) => b.is_shared);
  else if (budgetViewFilter) filtered = filtered.filter((b) => b.assigned_user_id === budgetViewFilter);
  const groups = new Map();
  filtered.forEach((b) => { const list = groups.get(b.category) || []; list.push(b); groups.set(b.category, list); });
  el.innerHTML = [...groups.entries()].map(([category, rows]) => {
    const total = rows.reduce((s, b) => s + Number(b.amount), 0);
    const scopes = rows.map((b) => b.is_shared ? "全房共用" : (roomMembers.find((m) => m.id === b.assigned_user_id)?.name || "成員"));
    const ownerIds = new Set(rows.filter((b) => !b.is_shared).map((b) => b.assigned_user_id));
    const hasShared = rows.some((b) => b.is_shared);
    const used = expenses.filter((x) => x.category === category && (hasShared || ownerIds.has(x.user_id))).reduce((s, x) => s + Number(x.amount), 0);
    const pct = total ? Math.min(120, (used / total) * 100) : 0;
    return `<article class="budget-card"><div class="budget-head"><span>${categoryIconHTML(category)} ${escapeHTML(category)}<small class="budget-scope">${escapeHTML([...new Set(scopes)].join("、"))}</small></span><strong>${money(used)} / ${money(total)}</strong></div><div class="progress"><i class="${pct >= 100 ? "over" : ""}" style="width:${Math.min(100, pct)}%"></i></div><small>${pct >= 100 ? "已超出預算" : `還可以使用 ${money(Math.max(total - used, 0))}`}</small></article>`;
  }).join("") || `<div class="empty-state compact"><p>這個篩選沒有預算。</p></div>`;
}

function renderInsights() {
  const has = !!activeBookId;
  $("#insightsEmpty").classList.toggle("hidden", has);
  $("#insightsContent").classList.toggle("hidden", !has);
  if (!has) return;
  renderMemberFilterRow();
  renderAnalysis();
  renderBudgets(monthTransactions("expense"));
}
$("#budgetViewFilter").addEventListener("change", (e) => { budgetViewFilter = e.target.value; renderInsights(); });
$$('[data-insight-tab]').forEach((button) => button.addEventListener("click", () => {
  $$('[data-insight-tab]').forEach((b) => b.classList.toggle("active", b === button));
  $("#insightAnalysis").classList.toggle("hidden", button.dataset.insightTab !== "analysis");
  $("#insightBudget").classList.toggle("hidden", button.dataset.insightTab !== "budget");
}));
const accountIconSvg = {
  cash: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/></svg>',
  credit_card: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 9.5h19"/><path d="M6 14.5h4"/></svg>',
  bank: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10l9-6 9 6"/><path d="M4.5 10v8M9 10v8M15 10v8M19.5 10v8"/><path d="M2.5 20h19"/></svg>',
  ewallet: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h11A2.5 2.5 0 0 1 19 7.5v9A2.5 2.5 0 0 1 16.5 19h-11A2.5 2.5 0 0 1 3 16.5z"/><path d="M15 12.5h3.5v2.5H15a1.25 1.25 0 0 1 0-2.5z"/></svg>'
};
const baseCategories = [
  { key: "cash", label: "現金", icon: accountIconSvg.cash },
  { key: "credit_card", label: "信用卡", icon: accountIconSvg.credit_card },
  { key: "bank", label: "銀行帳戶", icon: accountIconSvg.bank },
  { key: "ewallet", label: "電子支付", icon: accountIconSvg.ewallet }
];
function mySubAccounts(categoryKey) {
  const subs = profile?.sub_accounts?.[categoryKey];
  if (subs && subs.length) return subs;
  return [{ name: baseCategories.find((c) => c.key === categoryKey)?.label || categoryKey }];
}
function computeAccountBalances() {
  const balances = { cash: 0, credit_card: 0, bank: 0, ewallet: 0 };
  const myId = session?.user?.id;
  transactions.forEach((x) => {
    if (memberFilterId && x.user_id !== memberFilterId) return;
    if (x.user_id !== myId && memberPrivacy[x.user_id]) return;
    const key = balances.hasOwnProperty(x.payment_category) ? x.payment_category : "cash";
    balances[key] += x.transaction_type === "income" ? Number(x.amount) : -Number(x.amount);
  });
  return balances;
}
function renderAccountBalances() {
  const el = $("#accountBalances");
  if (!el) return;
  const balances = computeAccountBalances();
  const selectedMember = memberFilterId ? roomMembers.find((m) => m.id === memberFilterId) : null;
  const ownerLabel = selectedMember ? selectedMember.name : "全部成員";
  el.innerHTML = baseCategories.map((c) => `<div class="account-balance-card"><span class="account-icon">${c.icon}</span><small>${escapeHTML(ownerLabel)} · ${c.label}</small><strong class="${balances[c.key] < 0 ? "negative" : ""}">${money(balances[c.key] || 0)}</strong></div>`).join("");
}
let selectedPaymentCategory = "cash";
let selectedSubAccount = "現金";
function renderPaymentPicker() {
  const el = $("#paymentPicker");
  if (!el) return;
  el.innerHTML = baseCategories.map((c) => `<label><input type="radio" name="paymentCategory" value="${c.key}" ${c.key === selectedPaymentCategory ? "checked" : ""}><span>${c.icon}<small>${c.label}</small></span></label>`).join("");
  renderSubAccountPicker();
}
function renderSubAccountPicker() {
  const subs = mySubAccounts(selectedPaymentCategory);
  const el = $("#subAccountPicker");
  if (subs.length <= 1) { el.classList.add("hidden"); selectedSubAccount = subs[0].name; return; }
  if (!subs.some((s) => s.name === selectedSubAccount)) selectedSubAccount = subs[0].name;
  el.classList.remove("hidden");
  el.innerHTML = subs.map((s) => `<button type="button" class="member-chip ${selectedSubAccount === s.name ? "active" : ""}" data-sub-account="${escapeHTML(s.name)}">${escapeHTML(s.name)}</button>`).join("");
}
$("#paymentPicker").addEventListener("change", (e) => { if (e.target.name === "paymentCategory") { selectedPaymentCategory = e.target.value; renderSubAccountPicker(); } });
$("#subAccountPicker").addEventListener("click", (e) => { const btn = e.target.closest("[data-sub-account]"); if (btn) { selectedSubAccount = btn.dataset.subAccount; renderSubAccountPicker(); } });
function recordHTML(x) {
  const income = x.transaction_type === "income", meta = income ? { icon: "💰", color: "#7fa56a" } : (categoryMeta[x.category] || categoryMeta.其他);
  const iconHTML = income ? incomeCategoryIconHTML(x.category) : categoryIconHTML(x.category);
  const noteHTML = x.note ? `<small class="record-note">📝 ${escapeHTML(x.note)}</small>` : "";
  const catLabel = baseCategories.find((c) => c.key === x.payment_category)?.label || "現金";
  const isMine = x.user_id === session?.user?.id;
  const payLabel = isMine ? (x.payment_method || catLabel) : catLabel;
  const owner = roomMembers.find((m) => m.id === x.user_id);
  const ownerName = isMine ? "我" : (x.profiles?.display_name || owner?.name || "BORI 使用者");
  const tag = isMine ? "button" : "article";
  const attrs = isMine ? `type="button" class="record" data-edit-record="${x.id}"` : `class="record"`;
  return `<${tag} ${attrs}><div class="record-icon" style="background:${meta.color}20">${iconHTML}</div><div><strong>${escapeHTML(x.title)}</strong><small><b class="record-owner">${escapeHTML(ownerName)}</b> · ${escapeHTML(x.category)} · ${new Date(`${x.transaction_date}T00:00:00`).toLocaleDateString("zh-TW")} · ${escapeHTML(payLabel)}</small>${noteHTML}</div><b class="${income ? "income-text" : ""}">${income ? "+" : "-"}${money(x.amount)}</b></${tag}>`;
}
function renderAdd() { const has = !!activeBookId; $("#addEmpty").classList.toggle("hidden", has); $("#addContent").classList.toggle("hidden", !has); if (has) { renderPaymentPicker(); if (!editingTransactionId) setAddType(addType); } }
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
  let analysisTransactions = transactions.filter((x) => String(x.transaction_date).slice(0, 7) === currentMonth());
  if (memberFilterId) analysisTransactions = analysisTransactions.filter((x) => x.user_id === memberFilterId);
  const expenses = analysisTransactions.filter((x) => x.transaction_type === "expense");
  const incomes = analysisTransactions.filter((x) => x.transaction_type === "income");
  const exp = expenses.reduce((s, x) => s + Number(x.amount), 0);
  const inc = incomes.reduce((s, x) => s + Number(x.amount), 0);
  $("#analysisIncome").textContent = money(inc);
  $("#analysisExpense").textContent = money(exp);
  $("#analysisNet").textContent = money(inc - exp);
  $("#analysisNet").classList.toggle("negative", inc - exp < 0);
  $("#analysisCount").textContent = `${expenses.length} 筆`;
  $("#donutTotal").textContent = money(exp);
  const grouped = {}; expenses.forEach((x) => grouped[x.category] = (grouped[x.category] || 0) + Number(x.amount)); const entries = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
  let cursor = 0; const segments = entries.map(([c, v]) => { const start = cursor; cursor += exp ? (v / exp) * 360 : 0; return `${(categoryMeta[c] || categoryMeta.其他).color} ${start}deg ${cursor}deg`; });
  $("#donutChart").style.background = segments.length ? `conic-gradient(${segments.join(",")})` : "#eee7dc";
  $("#categoryLegend").innerHTML = entries.length ? entries.map(([c, v]) => `<div class="legend-row"><i style="background:${(categoryMeta[c] || categoryMeta.其他).color}"></i><span>${escapeHTML(c)}</span><strong>${Math.round((v / exp) * 100)}%</strong></div>`).join("") : `<p class="muted">尚無支出分類</p>`;
  const memberRows = roomMembers.map((member) => {
    const rows = analysisTransactions.filter((x) => x.user_id === member.id);
    const memberIncome = rows.filter((x) => x.transaction_type === "income").reduce((s, x) => s + Number(x.amount), 0);
    const memberExpense = rows.filter((x) => x.transaction_type === "expense").reduce((s, x) => s + Number(x.amount), 0);
    return `<article><strong>${escapeHTML(member.name)}</strong><span class="income-text">收入 ${money(memberIncome)}</span><span>支出 ${money(memberExpense)}</span><b class="${memberIncome - memberExpense < 0 ? "negative" : ""}">結餘 ${money(memberIncome - memberExpense)}</b></article>`;
  });
  $("#memberAnalysisList").innerHTML = memberRows.join("") || `<p class="muted">尚無成員資料</p>`;
}
function showInteractionHub() {
  $("#interactionHub")?.classList.remove("hidden");
  $$(".interaction-view").forEach((view) => view.classList.add("hidden"));
}
$$('[data-interaction-view]').forEach((button) => button.addEventListener("click", () => {
  $("#interactionHub").classList.add("hidden");
  $$(".interaction-view").forEach((view) => view.classList.add("hidden"));
  const target = { chat: "interactionChat", diary: "interactionDiary", question: "interactionQuestion" }[button.dataset.interactionView];
  $("#" + target).classList.remove("hidden");
  if (button.dataset.interactionView === "chat") { scrollChat(); markChatRead(); }
  if (button.dataset.interactionView === "diary") { resetDiaryForm(); renderDiary(); }
  if (button.dataset.interactionView === "question") renderDailyQuestion();
}));
$$('[data-interaction-back]').forEach((button) => button.addEventListener("click", showInteractionHub));

const DIARY_PREFIX = "[[BORI_DIARY_V2]]";
function parseDiaryContent(raw = "") {
  if (!raw.startsWith(DIARY_PREFIX)) return { title: "生活隨筆", mood: "回憶", emoji: "📖", body: raw };
  try {
    const data = JSON.parse(raw.slice(DIARY_PREFIX.length));
    const moodEmoji = { 幸福: "🥰", 開心: "😊", 平靜: "🌿", 疲累: "😴", 難過: "🥺" };
    return { title: data.title || "生活隨筆", mood: data.mood || "回憶", emoji: moodEmoji[data.mood] || "📖", body: data.body || "" };
  } catch { return { title: "生活隨筆", mood: "回憶", emoji: "📖", body: raw }; }
}
function packDiaryContent(title, mood, body) { return DIARY_PREFIX + JSON.stringify({ title, mood, body }); }
function resetDiaryForm() {
  editingDiaryId = null;
  const form = $("#diaryForm"); if (!form) return;
  form.reset(); $("#diaryDate").value = taiwanToday();
  $("#diarySaveButton").textContent = "收藏這篇日記";
  $("#diaryCancelEdit").classList.add("hidden");
  $("#diaryCharCount").textContent = "0";
}
function renderDiary() {
  const el = $("#diaryList"); if (!el) return;
  $("#diaryTotalCount").textContent = `${diaries.length} 篇`;
  el.innerHTML = diaries.length ? diaries.map((entry) => {
    const owner = roomMembers.find((m) => m.id === entry.user_id);
    const diary = parseDiaryContent(entry.content || ""), mine = entry.user_id === session?.user?.id;
    const date = new Date(`${entry.entry_date}T00:00:00+08:00`);
    const dateLabel = date.toLocaleDateString("zh-TW", { month: "long", day: "numeric", weekday: "short" });
    return `<article class="diary-entry"><div class="diary-date-badge"><b>${String(date.getDate()).padStart(2,"0")}</b><small>${date.getMonth()+1}月</small></div><div class="diary-paper"><div class="diary-entry-meta"><span>${escapeHTML(diary.emoji)} ${escapeHTML(diary.mood)}</span><small>${escapeHTML(dateLabel)} · ${escapeHTML(owner?.name || (mine ? profile?.display_name : "成員") || "成員")}</small></div><h4>${escapeHTML(diary.title)}</h4><p>${escapeHTML(diary.body)}</p>${mine ? `<div class="diary-entry-actions"><button type="button" data-edit-diary="${entry.id}">編輯</button><button type="button" data-delete-diary="${entry.id}">刪除</button></div>` : ""}</div></article>`;
  }).join("") : `<div class="diary-empty"><span>📖</span><strong>故事正要開始</strong><p>收藏第一篇屬於你們的回憶吧。</p></div>`;
}
$("#diaryForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = $("#diaryTitle").value.trim(), body = $("#diaryContent").value.trim(), entryDate = $("#diaryDate").value, mood = document.querySelector('[name="diaryMood"]:checked')?.value || "幸福";
  if (!title || !body || !entryDate) return;
  const content = packDiaryContent(title, mood, body);
  const query = editingDiaryId
    ? supabaseClient.from("diaries").update({ entry_date: entryDate, content }).eq("id", editingDiaryId).eq("user_id", session.user.id)
    : supabaseClient.from("diaries").insert({ book_id: activeBookId, user_id: session.user.id, entry_date: entryDate, content });
  const { error } = await query;
  if (error) return toast(error.message);
  const wasEditing = !!editingDiaryId; resetDiaryForm(); await loadInteractionData(); renderDiary(); renderTogetherHub(); toast(wasEditing ? "日記已更新 ✨" : "日記已收藏 📖");
});
$("#diaryContent").addEventListener("input", (e) => { $("#diaryCharCount").textContent = e.target.value.length; });
$("#diaryCancelEdit").addEventListener("click", resetDiaryForm);
$("#diaryList").addEventListener("click", async (e) => {
  const editBtn = e.target.closest("[data-edit-diary]"), deleteBtn = e.target.closest("[data-delete-diary]");
  if (editBtn) {
    const entry = diaries.find((d) => String(d.id) === editBtn.dataset.editDiary); if (!entry) return;
    const diary = parseDiaryContent(entry.content || ""); editingDiaryId = entry.id;
    $("#diaryDate").value = entry.entry_date; $("#diaryTitle").value = diary.title === "生活隨筆" ? "" : diary.title; $("#diaryContent").value = diary.body;
    const mood = document.querySelector(`[name="diaryMood"][value="${diary.mood}"]`); if (mood) mood.checked = true;
    $("#diaryCharCount").textContent = diary.body.length; $("#diarySaveButton").textContent = "儲存修改"; $("#diaryCancelEdit").classList.remove("hidden");
    $("#diaryForm").scrollIntoView({ behavior: "smooth", block: "start" }); return;
  }
  if (deleteBtn) {
    const entry = diaries.find((d) => String(d.id) === deleteBtn.dataset.deleteDiary); if (!entry || entry.user_id !== session.user.id || !confirm("確定要刪除這篇日記嗎？")) return;
    const { error } = await supabaseClient.from("diaries").delete().eq("id", entry.id).eq("user_id", session.user.id);
    if (error) return toast(error.message); if (editingDiaryId === entry.id) resetDiaryForm(); await loadInteractionData(); renderDiary(); renderTogetherHub(); toast("日記已刪除");
  }
});

const dailyQuestionBank = [
  "最近有哪一件小事讓你感到被愛？", "你希望別人怎麼陪伴壓力大的你？", "童年最幸福的一段回憶是什麼？", "如果明天放假，你最想一起做什麼？", "你最欣賞房間裡每位成員的哪個特點？", "最近有什麼心願還沒告訴大家？", "什麼樣的一句話最能安慰你？", "你理想中的週末早晨是什麼樣子？", "最近學到關於自己的哪件事？", "有哪個習慣希望大家一起培養？", "你最想重新體驗哪一天？", "什麼事情會讓你很有安全感？", "最近最想感謝房間裡的誰、為什麼？", "如果可以一起旅行，你最想去哪裡？"
];
function dailyQuestionFor(dateStr) {
  const dayNumber = Math.floor(Date.parse(`${dateStr}T00:00:00+08:00`) / 86400000);
  return dailyQuestionBank[Math.abs(dayNumber) % dailyQuestionBank.length];
}
function formatRelativeTime(ts) {
  if (!ts) return "";
  const diffMs = Date.now() - new Date(ts).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "剛剛";
  if (min < 60) return `${min} 分鐘前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} 小時前`;
  const day = Math.floor(hr / 24);
  if (day === 1) return "昨天";
  if (day < 7) return `${day} 天前`;
  return new Date(ts).toLocaleDateString("zh-TW");
}
function renderTogetherHub() {
  const book = activeBook();
  if (book?.created_at) {
    const days = Math.max(1, Math.floor((Date.now() - new Date(book.created_at).getTime()) / 86400000) + 1);
    $("#togetherDays").textContent = days;
  }
  const today = taiwanToday();
  const todayCount = messages.filter((m) => m.created_at && m.created_at.slice(0, 10) === today).length;
  $("#togetherTodayCount").textContent = `💌 今日 ${todayCount} 則`;
  $("#diaryCountHint").textContent = diaries.length ? `📖 ${diaries.length} 篇回憶` : "📖 開始第一篇";
  const answeredToday = dailyAnswers.some((a) => a.question_date === today && a.user_id === session?.user?.id);
  $("#questionStatusHint").textContent = answeredToday ? "💞 今日已回答" : "💞 今日未回答";
  const feedItems = [
    ...diaries.map((d) => ({ ts: d.created_at, type: "diary", data: d })),
    ...dailyAnswers.map((a) => ({ ts: a.created_at, type: "answer", data: a }))
  ].sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, 8);
  $("#togetherFeed").innerHTML = feedItems.length ? feedItems.map((item) => {
    const owner = roomMembers.find((m) => m.id === item.data.user_id);
    const name = item.data.user_id === session?.user?.id ? "我" : (owner?.name || "成員");
    const timeLabel = formatRelativeTime(item.ts);
    const label = item.type === "diary" ? `${escapeHTML(name)} 新增了一篇日記` : `${escapeHTML(name)} 回答了每日一問`;
    const quote = item.type === "diary" ? `${parseDiaryContent(item.data.content || "").title}｜${parseDiaryContent(item.data.content || "").body}` : item.data.question_text;
    const icon = item.type === "diary" ? "📖" : "💗";
    return `<div class="together-feed-item"><span class="together-feed-icon">${icon}</span><div class="together-feed-copy"><strong>${label}</strong><small>「${escapeHTML(String(quote).slice(0, 30))}${String(quote).length > 30 ? "…" : ""}」</small></div><span class="together-feed-time">${timeLabel}　›</span></div>`;
  }).join("") : `<p class="muted-hint">還沒有互動紀錄，開始寫日記或回答每日一問吧。</p>`;
}
function renderDailyQuestion() {
  const today = taiwanToday(), question = dailyQuestionFor(today);
  $("#questionDate").textContent = today;
  $("#dailyQuestionText").textContent = question;
  const mine = dailyAnswers.find((a) => a.question_date === today && a.user_id === session?.user?.id);
  $("#dailyAnswerForm").classList.toggle("hidden", !!mine);
  $("#questionLockHint").textContent = mine ? "你已回答。所有人的答案會在明天 00:00（台灣時間）解鎖。" : "答案會在明天 00:00（台灣時間）一起解鎖。";
  const unlocked = dailyAnswers.filter((a) => a.question_date < today);
  $("#dailyAnswersList").innerHTML = unlocked.length ? unlocked.map((answer) => {
    const owner = roomMembers.find((m) => m.id === answer.user_id);
    return `<article><small>${escapeHTML(answer.question_date)} · ${escapeHTML(answer.question_text)}</small><strong>${escapeHTML(owner?.name || "成員")}</strong><p>${escapeHTML(answer.answer)}</p></article>`;
  }).join("") : `<p class="muted-hint">過往解鎖的回答會出現在這裡。</p>`;
}
$("#dailyAnswerForm").addEventListener("submit", async (e) => {
  e.preventDefault(); const answer = $("#dailyAnswerInput").value.trim(); if (!answer) return;
  const today = taiwanToday();
  const { error } = await supabaseClient.from("daily_answers").insert({ book_id: activeBookId, user_id: session.user.id, question_date: today, question_text: dailyQuestionFor(today), answer });
  if (error) return toast(error.message); e.target.reset(); await loadInteractionData(); renderDailyQuestion(); renderTogetherHub(); toast("今天的答案已鎖定 💞");
});

async function createBook(name, type) {
  const code = inviteCode();
  const { data, error } = await supabaseClient.from("books").insert({ name, type, owner_id: session.user.id, invite_code: code }).select().single();
  if (error) throw error;
  const { error: memberError } = await supabaseClient.from("book_members").insert({ book_id: data.id, user_id: session.user.id, role: "owner" });
  if (memberError) throw memberError;
  return data;
}
async function addTransaction(type, title, amount, category, note = "", date = null, paymentCategory = "cash", paymentMethod = "現金") {
  const { error } = await supabaseClient.from("transactions").insert({ book_id: activeBookId, user_id: session.user.id, transaction_type: type, category, title, amount: Number(amount), transaction_date: date || localDateStr(), note, payment_category: paymentCategory, payment_method: paymentMethod });
  if (error) throw error;
}

function taiwanToday() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en", { timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date()).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}
function parseConversationalRecord(input) {
  const text = String(input || "").trim();
  if (!text) throw new Error("請先說或輸入一筆紀錄");
  const today = taiwanToday();
  let date = today, cleaned = text;
  const fullDate = text.match(/(20\d{2})[年\/-](\d{1,2})[月\/-](\d{1,2})日?/);
  const shortDate = text.match(/(?:^|\s)(\d{1,2})[月\/-](\d{1,2})日?/);
  if (fullDate) { date = `${fullDate[1]}-${pad2(fullDate[2])}-${pad2(fullDate[3])}`; cleaned = cleaned.replace(fullDate[0], " "); }
  else if (shortDate) { date = `${today.slice(0, 4)}-${pad2(shortDate[1])}-${pad2(shortDate[2])}`; cleaned = cleaned.replace(shortDate[0], " "); }
  const amountMatch = cleaned.match(/(?:\$|NT\$?|元)?\s*(\d+(?:\.\d+)?)/i);
  if (!amountMatch) throw new Error("找不到金額，例如：早餐 85 現金");
  const amount = Number(amountMatch[1]);
  cleaned = cleaned.replace(amountMatch[0], " ");
  const income = /(收入|薪水|薪資|獎金|退款|入帳|賺)/.test(cleaned);
  const type = income ? "income" : "expense";

  // 帳戶：先比對使用者自己實際新增過的子帳戶名稱（例如「國泰信用卡」「LINE Pay」），沒比對到才用大類關鍵字
  let paymentCategory = null, paymentMethod = null;
  for (const cat of baseCategories) {
    const subs = mySubAccounts(cat.key);
    const hit = subs.find((s) => s.name !== cat.label && cleaned.includes(s.name));
    if (hit) { paymentCategory = cat.key; paymentMethod = hit.name; cleaned = cleaned.replace(hit.name, " "); break; }
  }
  if (!paymentCategory) {
    const paymentRules = [{ words: /信用卡|刷卡/, key: "credit_card" }, { words: /銀行|轉帳|匯款|存款/, key: "bank" }, { words: /LINE\s*Pay|街口|電子支付|悠遊付|拍付|Apple\s*Pay/i, key: "ewallet" }, { words: /現金/, key: "cash" }];
    const rule = paymentRules.find((r) => r.words.test(cleaned));
    paymentCategory = rule?.key || "cash";
    if (rule) cleaned = cleaned.replace(rule.words, " ");
    paymentMethod = mySubAccounts(paymentCategory)[0]?.name || baseCategories.find((c) => c.key === paymentCategory)?.label || "現金";
  }
  cleaned = cleaned.replace(/(收入|支出|記帳|一筆)/g, " ").replace(/\s+/g, " ").trim();

  // 分類：先比對使用者自己實際設定的分類名稱，比對不到再用關鍵字猜，關鍵字猜出來的也要是使用者清單裡真的有的分類
  const myCategoryNames = income ? activeIncomeCategories().map((c) => c.name) : activeCategories().map((c) => c.name);
  let category = myCategoryNames.find((name) => cleaned.includes(name));
  if (!category) {
    const expenseRules = [{ re: /早餐|午餐|晚餐|餐|便當|咖啡|飲料|珍奶|飲品|吃/, cat: "餐飲" }, { re: /捷運|公車|計程車|加油|停車|高鐵|火車|uber/i, cat: "交通" }, { re: /電影|遊戲|唱歌|娛樂|ktv/i, cat: "休閒育樂" }, { re: /房租|租金|房貸/, cat: "住房" }, { re: /水費|電費|瓦斯/, cat: "水電瓦斯" }, { re: /醫院|看醫生|藥局|藥/, cat: "醫療保健" }, { re: /寵物|貓|狗|飼料/, cat: "寵物" }, { re: /衣服|鞋|服飾/, cat: "服飾" }, { re: /日常用品|衛生紙|清潔/, cat: "日常用品" }];
    const incomeRules = [{ re: /薪水|薪資/, cat: "薪水" }, { re: /獎金/, cat: "獎金" }, { re: /退款/, cat: "退款" }, { re: /投資|股息/, cat: "投資" }];
    const guess = (income ? incomeRules : expenseRules).find((rule) => rule.re.test(cleaned))?.cat;
    category = guess && myCategoryNames.includes(guess) ? guess : (myCategoryNames.includes("其他") ? "其他" : myCategoryNames[myCategoryNames.length - 1]);
  }
  return { type, title: cleaned || category, amount, category, date, paymentCategory, paymentMethod };
}
async function saveConversationalRecord() {
  try {
    const parsed = parseConversationalRecord($("#aiBookkeepingInput").value);
    await addTransaction(parsed.type, parsed.title, parsed.amount, parsed.category, "對話記帳", parsed.date, parsed.paymentCategory, parsed.paymentMethod);
    $("#aiBookkeepingResult").textContent = `已記錄：${parsed.date} ${parsed.title} ${money(parsed.amount)}（${parsed.category}／${parsed.paymentMethod}）`;
    $("#aiBookkeepingInput").value = "";
    await loadActiveBookData(); renderAll();
    toast("對話記帳完成 ✨");
  } catch (error) { $("#aiBookkeepingResult").textContent = error.message; }
}
$("#parseBookkeepingBtn").addEventListener("click", saveConversationalRecord);
$("#aiBookkeepingInput").addEventListener("keydown", (e) => { if (e.key === "Enter") saveConversationalRecord(); });
$("#voiceBookkeepingBtn").addEventListener("click", () => {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) return toast("此瀏覽器不支援語音辨識，請改用文字輸入");
  const recognition = new Recognition(); recognition.lang = "zh-TW"; recognition.interimResults = false;
  recognition.onstart = () => { $("#voiceBookkeepingBtn").classList.add("listening"); $("#aiBookkeepingResult").textContent = "正在聆聽…"; };
  recognition.onend = () => $("#voiceBookkeepingBtn").classList.remove("listening");
  recognition.onerror = () => { $("#aiBookkeepingResult").textContent = "沒有聽清楚，請再試一次"; };
  recognition.onresult = (event) => { $("#aiBookkeepingInput").value = event.results[0][0].transcript; saveConversationalRecord(); };
  recognition.start();
});


$$('[data-auth-tab]').forEach((b) => b.addEventListener("click", () => {
  $$('[data-auth-tab]').forEach((x) => x.classList.toggle("active", x === b));
  $("#loginForm").classList.toggle("hidden", b.dataset.authTab !== "login"); $("#registerForm").classList.toggle("hidden", b.dataset.authTab !== "register");
}));
$("#loginForm").addEventListener("submit", async (e) => { e.preventDefault(); const { data, error } = await supabaseClient.auth.signInWithPassword({ email: $("#loginEmail").value.trim(), password: $("#loginPassword").value }); if (error) return toast(error.message); session = data.session; await enterApp(); toast("登入成功 🌾"); });
let adminAccessCode = "";
$("#adminEntryBtn").addEventListener("click", () => { adminAccessCode = ""; $("#adminCodeForm").classList.remove("hidden"); $("#adminPanel").classList.add("hidden"); $("#adminCodeForm").reset(); openDialog("adminDialog"); });

async function openAdminPortal(code = adminAccessCode) {
  const { data, error } = await supabaseClient.rpc("admin_list_rooms_by_code", { p_code: code });
  if (error) return toast("管理碼錯誤");
  adminAccessCode = code;
  $("#adminCodeForm").classList.add("hidden"); $("#adminPanel").classList.remove("hidden");
  $("#adminRoomList").innerHTML = (data || []).map((room) => `<article><div><strong>${escapeHTML(room.name)}</strong><small>${room.member_count} 位成員 · ${room.transaction_count} 筆紀錄</small></div><button type="button" data-admin-delete-room="${room.id}">刪除房間</button></article>`).join("") || `<p class="muted-hint">目前沒有房間。</p>`;
}
$("#adminCodeForm").addEventListener("submit", async (e) => { e.preventDefault(); const code = $("#adminCodeInput").value.trim(); if (!/^\d{8}$/.test(code)) return toast("請輸入 8 位數字"); await openAdminPortal(code); });
$("#adminRoomList").addEventListener("click", async (e) => {
  const button = e.target.closest("[data-admin-delete-room]"); if (!button) return;
  if (!confirm("確定要永久刪除這個房間與所有相關資料嗎？此動作無法復原。")) return;
  const { error } = await supabaseClient.rpc("admin_delete_room_by_code", { p_code: adminAccessCode, p_book_id: button.dataset.adminDeleteRoom });
  if (error) return toast(error.message); await openAdminPortal(); toast("房間已刪除");
});
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
function renderHideBalanceToggle() {
  const on = !!memberPrivacy[session?.user?.id];
  $("#hideBalanceSwitch")?.classList.toggle("on", on);
}
document.addEventListener("click", (e) => { if (e.target.closest('[data-open="roomSettingsDialog"]')) renderHideBalanceToggle(); });
$("#hideBalanceToggleBtn").addEventListener("click", async () => {
  if (!activeBookId || !session?.user?.id) return;
  const next = !memberPrivacy[session.user.id];
  const { error } = await supabaseClient.from("book_members").update({ hide_balance: next }).eq("book_id", activeBookId).eq("user_id", session.user.id);
  if (error) return toast(error.message);
  memberPrivacy[session.user.id] = next;
  renderHideBalanceToggle();
  renderAccountBalances();
  toast(next ? "已隱藏你的帳戶餘額 🙈" : "已恢復顯示帳戶餘額");
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
let addType = "expense";
let editingTransactionId = null;
function setAddType(type) {
  addType = type;
  $$("#typeSwitch .type-switch-option").forEach((b) => b.classList.toggle("active", b.dataset.type === type));
  $("#addPageEyebrow").textContent = type === "expense" ? "NEW EXPENSE" : "NEW INCOME";
  $("#addPageTitle").textContent = type === "expense" ? "這次花了多少？" : "這次賺了多少？";
  $("#addPageTitle").classList.toggle("mode-expense", type === "expense");
  $("#addPageTitle").classList.toggle("mode-income", type === "income");
  $(".amount-field").classList.toggle("mode-expense", type === "expense");
  $(".amount-field").classList.toggle("mode-income", type === "income");
  $("#categoryInput").innerHTML = (type === "expense" ? activeCategories() : activeIncomeCategories()).map((c) => `<option>${escapeHTML(c.name)}</option>`).join("");
}
$("#typeSwitch").addEventListener("click", (e) => { const btn = e.target.closest("[data-type]"); if (btn) setAddType(btn.dataset.type); });
async function updateTransaction(id, type, title, amount, category, note, date, paymentCategory, paymentMethod) {
  const { error } = await supabaseClient.from("transactions").update({ transaction_type: type, title, amount: Number(amount), category, note, transaction_date: date, payment_category: paymentCategory, payment_method: paymentMethod }).eq("id", id);
  if (error) throw error;
}
function openEditTransaction(id) {
  const tx = transactions.find((t) => t.id === id);
  if (!tx || tx.user_id !== session?.user?.id) return;
  goTo("addPage");
  editingTransactionId = id;
  setAddType(tx.transaction_type);
  $("#categoryInput").value = tx.category;
  $("#amountInput").value = tx.amount;
  $("#titleInput").value = tx.title;
  $("#dateInput").value = tx.transaction_date;
  $("#noteInput").value = tx.note || "";
  selectedPaymentCategory = tx.payment_category || "cash";
  selectedSubAccount = tx.payment_method || "現金";
  renderPaymentPicker();
  $("#addPageEyebrow").textContent = "EDIT RECORD";
  $("#addPageTitle").textContent = "編輯這筆紀錄";
  $("#deleteTransactionBtn").classList.remove("hidden");
}
$("#ledgerList").addEventListener("click", (e) => { const btn = e.target.closest("[data-edit-record]"); if (btn) openEditTransaction(btn.dataset.editRecord); });
$("#transactionForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    if (editingTransactionId) {
      await updateTransaction(editingTransactionId, addType, $("#titleInput").value.trim(), $("#amountInput").value, $("#categoryInput").value, $("#noteInput").value.trim(), $("#dateInput").value, selectedPaymentCategory, selectedSubAccount);
      toast("紀錄已更新 ✏️");
    } else {
      await addTransaction(addType, $("#titleInput").value.trim(), $("#amountInput").value, $("#categoryInput").value, $("#noteInput").value.trim(), $("#dateInput").value, selectedPaymentCategory, selectedSubAccount);
      toast(addType === "expense" ? "支出已同步到房間 ☁️" : "收入已同步到房間 💰");
    }
    e.target.reset();
    setAddType("expense");
    $("#dateInput").value = localDateStr();
    editingTransactionId = null;
    $("#deleteTransactionBtn").classList.add("hidden");
    await loadActiveBookData();
    renderAll();
    goTo("homePage");
  } catch (err) { toast(err.message); }
});
$("#deleteTransactionBtn").addEventListener("click", async () => {
  if (!editingTransactionId) return;
  if (!confirm("確定要刪除這筆紀錄嗎？此動作無法復原。")) return;
  const { error } = await supabaseClient.from("transactions").delete().eq("id", editingTransactionId);
  if (error) return toast(error.message);
  editingTransactionId = null;
  await loadActiveBookData();
  renderAll();
  goTo("homePage");
  toast("紀錄已刪除");
});
$("#budgetForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const isShared = $("#sharedBudgetCheckbox").checked;
  const assignedUserId = isShared ? null : session.user.id;
  const category = $("#budgetCategory").value;
  let deleteQuery = supabaseClient.from("budgets").delete().eq("book_id", activeBookId).eq("category", category).eq("month", currentMonth());
  deleteQuery = isShared ? deleteQuery.eq("is_shared", true) : deleteQuery.eq("assigned_user_id", assignedUserId).eq("is_shared", false);
  const { error: deleteError } = await deleteQuery;
  if (deleteError) return toast(deleteError.message);
  const row = { book_id: activeBookId, category, amount: Number($("#budgetAmount").value), month: currentMonth(), created_by: session.user.id, assigned_user_id: assignedUserId, is_shared: isShared };
  const { error } = await supabaseClient.from("budgets").insert(row);
  if (error) return toast(error.message);
  e.target.reset(); closeDialog("budgetDialog"); await loadActiveBookData(); renderAll(); toast("預算已同步到房間 🎯");
});
const incomeCategoryIconKeys = ["salary","red_packet_income","payday","coffee_earn","growth_chart","stock_chart","piggybank","wallet_gift","bank_income","love_donate","transfer","red_envelope","resell","cashback","lottery","content_income","freelance","tips","house_fund","investment_grow","gift_income","travel_fund","bonus_pet","achievement"];
let manageCategoryType = "expense";
let selectedCategoryIcon = "receipt";
let selectedIncomeCategoryIcon = "wallet_gift";
function renderIconPicker() {
  const isIncome = manageCategoryType === "income";
  const keys = isIncome ? incomeCategoryIconKeys : categoryIconKeys;
  const folder = isIncome ? "income-icons" : "category-icons";
  const selected = isIncome ? selectedIncomeCategoryIcon : selectedCategoryIcon;
  $("#iconPicker").innerHTML = keys.map((k) => `<button type="button" class="icon-picker-item ${k === selected ? "active" : ""}" data-icon="${k}"><img src="assets/${folder}/${k}.png" alt="" /></button>`).join("");
}
$("#iconPicker").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-icon]");
  if (!btn) return;
  if (manageCategoryType === "income") selectedIncomeCategoryIcon = btn.dataset.icon;
  else selectedCategoryIcon = btn.dataset.icon;
  renderIconPicker();
});
$("#categoryTypeToggle").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-category-type]");
  if (!btn) return;
  manageCategoryType = btn.dataset.categoryType;
  $$("#categoryTypeToggle .type-switch-option").forEach((b) => b.classList.toggle("active", b.dataset.categoryType === manageCategoryType));
  renderCategoryManageList();
  renderIconPicker();
});
document.addEventListener("click", (e) => { if (e.target.closest('[data-open="manageCategoriesDialog"]')) { renderCategoryManageList(); renderIconPicker(); } });
async function renderMemberList() {
  if (!activeBookId) return;
  const { data, error } = await supabaseClient.from("book_members").select("role, user_id").eq("book_id", activeBookId).order("created_at", { ascending: true });
  if (error) { $("#memberList").innerHTML = `<p class="muted-hint">載入失敗：${escapeHTML(error.message)}</p>`; return; }
  let profileMap;
  try { profileMap = await fetchProfilesByIds((data || []).map((m) => m.user_id)); }
  catch (profileError) { $("#memberList").innerHTML = `<p class="muted-hint">暱稱載入失敗：${escapeHTML(profileError.message)}</p>`; return; }
  $("#memberList").innerHTML = (data && data.length) ? data.map((m) => {
    const memberProfile = profileMap.get(m.user_id);
    const name = memberProfile?.display_name || "BORI 使用者";
    const avatar = memberProfile?.avatar_url ? `<img src="${memberProfile.avatar_url}" alt="" />` : `<span class="member-emoji">🐻</span>`;
    const canKick = activeBook()?.role === "owner" && m.user_id !== session?.user?.id;
    return `<div class="member-row"><span class="member-avatar">${avatar}</span><span class="member-info"><strong>${escapeHTML(name)}</strong><small>${m.role === "owner" ? "擁有者" : "成員"}</small></span>${canKick ? `<button type="button" class="kick-member-btn" data-kick-member="${m.user_id}">移出</button>` : ""}</div>`;
  }).join("") : `<p class="muted-hint">目前沒有成員資料。</p>`;
}
document.addEventListener("click", (e) => { if (e.target.closest('[data-open="memberListDialog"]')) renderMemberList(); });
$("#memberList").addEventListener("click", async (e) => {
  const button = e.target.closest("[data-kick-member]"); if (!button) return;
  const member = roomMembers.find((m) => m.id === button.dataset.kickMember);
  if (!confirm(`確定要將 ${member?.name || "這位成員"} 移出房間嗎？`)) return;
  const { error } = await supabaseClient.rpc("kick_room_member", { p_book_id: activeBookId, p_user_id: button.dataset.kickMember });
  if (error) return toast(error.message); await loadBooks(); await loadActiveBookData(); renderAll(); renderMemberList(); toast("成員已移出房間");
});
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
const VAPID_PUBLIC_KEY = "BLK15NGBGUl4g_96o29669bGL2WciLVS4LOAcD0YgE12YKaJ0fjsMOKfsYv7v5Z-B9Pi_ELJQNLZj6YH4Xikm0E";
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}
async function renderNotificationSettings() {
  const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  $("#notifToggleRow").classList.toggle("hidden", !supported);
  $("#notifUnsupportedNote").classList.toggle("hidden", supported);
  if (!supported) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    $("#notifToggleSwitch").classList.toggle("on", !!sub);
  } catch {}
}
document.addEventListener("click", (e) => { if (e.target.closest('[data-open="notificationDialog"]')) renderNotificationSettings(); });
$("#notifToggleBtn").addEventListener("click", async () => {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return toast("這個瀏覽器不支援推播通知");
  const reg = await navigator.serviceWorker.ready;
  const existing = await reg.pushManager.getSubscription();
  if (existing) {
    await supabaseClient.from("push_subscriptions").delete().eq("endpoint", existing.endpoint);
    await existing.unsubscribe();
    renderNotificationSettings();
    toast("已關閉推播通知");
    return;
  }
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return toast("需要允許通知權限才能開啟");
  try {
    const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) });
    const json = sub.toJSON();
    const { error } = await supabaseClient.from("push_subscriptions").upsert({ user_id: session.user.id, endpoint: json.endpoint, p256dh: json.keys.p256dh, auth: json.keys.auth }, { onConflict: "endpoint" });
    if (error) throw error;
    renderNotificationSettings();
    toast("推播通知已開啟 🔔");
  } catch (err) {
    toast("開啟失敗：" + err.message);
  }
});
$("#categoryManageList").addEventListener("click", async (e) => {
  const delBtn = e.target.closest("[data-remove-category]");
  if (!delBtn) return;
  const cur = activeCategoriesForManage();
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
      const cur = [...activeCategoriesForManage()];
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
  const isIncome = manageCategoryType === "income";
  const cur = activeCategoriesForManage();
  if (cur.some((c) => c.name === name)) return toast("這個分類已經有了");
  await updateCategories([...cur, { name, icon: isIncome ? selectedIncomeCategoryIcon : selectedCategoryIcon }]);
  e.target.reset();
  if (isIncome) selectedIncomeCategoryIcon = "wallet_gift"; else selectedCategoryIcon = "receipt";
  renderIconPicker();
});
$("#chatForm").addEventListener("submit", async (e) => { e.preventDefault(); const content = $("#messageInput").value.trim(); if (!content) return; const { error } = await supabaseClient.from("messages").insert({ book_id: activeBookId, user_id: session.user.id, message_type: "text", content }); if (error) return toast(error.message); $("#messageInput").value = ""; });
$("#stickerBtn").addEventListener("click", () => $("#stickerTray").classList.toggle("hidden"));
$("#stickerSetTabs").addEventListener("click", (e) => { const btn = e.target.closest("[data-set]"); if (!btn) return; activeStickerSet = Number(btn.dataset.set); renderStickerTray(); });
$("#stickerGrid").addEventListener("click", async (e) => { const btn = e.target.closest("[data-sticker]"); if (!btn) return; const s = stickerById(btn.dataset.sticker); if (!s) return; const { error } = await supabaseClient.from("messages").insert({ book_id: activeBookId, user_id: session.user.id, message_type: "sticker", sticker_id: s.id }); if (error) return toast(error.message); $("#stickerTray").classList.add("hidden"); });

function finishSplash() { const s = $("#splashScreen"); if (!s || s.dataset.done) return; s.dataset.done = "1"; s.classList.add("hide"); document.body.classList.remove("splash-lock"); setTimeout(() => s.remove(), 650); }
if (window.visualViewport) {
  const vv = window.visualViewport;
  function safeBottomPx() {
    const v = getComputedStyle(document.documentElement).getPropertyValue("--safe-bottom").trim();
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  }
  function adjustChatForKeyboard() {
    const composer = $("#chatForm");
    if (!composer) return;
    const rawOffset = window.innerHeight - vv.height - vv.offsetTop;
    // iOS Safari 滾動時網址列/工具列收合展開也會讓可視視窗高度變動，
    // 真正的鍵盤高度通常遠大於這種誤差，所以小於 150px 一律當作沒有鍵盤。
    const keyboardOffset = rawOffset > 150 ? rawOffset : 0;
    const safeBottom = safeBottomPx();
    composer.style.bottom = `${88 + safeBottom + keyboardOffset}px`;
    const tray = $("#stickerTray");
    if (tray) tray.style.bottom = `${158 + safeBottom + keyboardOffset}px`;
    if (keyboardOffset > 0 && $("#chatPage")?.classList.contains("active")) scrollChat();
  }
  vv.addEventListener("resize", adjustChatForKeyboard);
  vv.addEventListener("scroll", adjustChatForKeyboard);
}
document.body.classList.add("splash-lock"); addEventListener("load", () => setTimeout(boot, 1150)); setTimeout(() => { if (!$("#splashScreen")?.dataset.done) boot(); }, 3200);
if ("serviceWorker" in navigator) {
  let swRefreshed = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (swRefreshed) return;
    swRefreshed = true;
    location.reload();
  });
  addEventListener("load", () => navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" }).catch(console.warn));
}
