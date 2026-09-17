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
  ]},
  { id: "shiba_transparent", name: "柴犬(去背版)", stickers: [
    { id: "record_it2", img: "assets/stickers5/record_it2.png", text: "記一筆" },
    { id: "income_in2", img: "assets/stickers5/income_in2.png", text: "收入入帳" },
    { id: "todays_expense2", img: "assets/stickers5/todays_expense2.png", text: "今日支出" },
    { id: "set_budget2", img: "assets/stickers5/set_budget2.png", text: "設定預算" },
    { id: "saving_hard2", img: "assets/stickers5/saving_hard2.png", text: "努力存錢" },
    { id: "broke_again2", img: "assets/stickers5/broke_again2.png", text: "又沒錢了" },
    { id: "living_cost2", img: "assets/stickers5/living_cost2.png", text: "生活費" },
    { id: "bill_due2", img: "assets/stickers5/bill_due2.png", text: "卡費來了" },
    { id: "saved_success2", img: "assets/stickers5/saved_success2.png", text: "存入成功" },
    { id: "monthly_recap2", img: "assets/stickers5/monthly_recap2.png", text: "月結算" },
    { id: "resist_buying2", img: "assets/stickers5/resist_buying2.png", text: "忍住別買" },
    { id: "goal_reached2", img: "assets/stickers5/goal_reached2.png", text: "目標達成" },
    { id: "hug_shiba2", img: "assets/stickers5/hug_shiba2.png", text: "抱抱" },
    { id: "kiss_one2", img: "assets/stickers5/kiss_one2.png", text: "親一個" },
    { id: "walk_together2", img: "assets/stickers5/walk_together2.png", text: "一起走" },
    { id: "glad_you_here_shiba2", img: "assets/stickers5/glad_you_here_shiba2.png", text: "有你真好" },
    { id: "love_you_most3", img: "assets/stickers5/love_you_most3.png", text: "最愛你" },
    { id: "sleep_together2", img: "assets/stickers5/sleep_together2.png", text: "一起睡" },
    { id: "carry_you2", img: "assets/stickers5/carry_you2.png", text: "我背你" },
    { id: "dont_cry2", img: "assets/stickers5/dont_cry2.png", text: "不哭不哭" },
    { id: "eat_together3", img: "assets/stickers5/eat_together3.png", text: "一起吃" },
    { id: "gift_for_you2", img: "assets/stickers5/gift_for_you2.png", text: "送給你" },
    { id: "love_you3", img: "assets/stickers5/love_you3.png", text: "愛你喔" },
    { id: "sorry_shiba2", img: "assets/stickers5/sorry_shiba2.png", text: "對不起嘛" },
    { id: "good_morning3", img: "assets/stickers5/good_morning3.png", text: "早安" },
    { id: "good_night3", img: "assets/stickers5/good_night3.png", text: "晚安" },
    { id: "mealtime2", img: "assets/stickers5/mealtime2.png", text: "吃飯囉" },
    { id: "drink_water2", img: "assets/stickers5/drink_water2.png", text: "多喝水" },
    { id: "work_hard2", img: "assets/stickers5/work_hard2.png", text: "努力工作" },
    { id: "exhausted2", img: "assets/stickers5/exhausted2.png", text: "累死了" },
    { id: "bath_time2", img: "assets/stickers5/bath_time2.png", text: "洗澡去" },
    { id: "wait_for_me2", img: "assets/stickers5/wait_for_me2.png", text: "等等我" },
    { id: "raining2", img: "assets/stickers5/raining2.png", text: "下雨了" },
    { id: "so_cold2", img: "assets/stickers5/so_cold2.png", text: "好冷喔" },
    { id: "happy_shiba2", img: "assets/stickers5/happy_shiba2.png", text: "開心" },
    { id: "here_we_come2", img: "assets/stickers5/here_we_come2.png", text: "我們來啦" }
  ]},
  { id: "office_daily", name: "上班摸魚日常", stickers: [
    { id: "morning_no_work", img: "assets/stickers6/morning_no_work.png", text: "早安…不想上班" },
    { id: "coffee_first", img: "assets/stickers6/coffee_first.png", text: "先喝咖啡" },
    { id: "fake_busy", img: "assets/stickers6/fake_busy.png", text: "假裝很忙" },
    { id: "handling_it", img: "assets/stickers6/handling_it.png", text: "正在處理" },
    { id: "do_later", img: "assets/stickers6/do_later.png", text: "等等再做" },
    { id: "sneak_scroll", img: "assets/stickers6/sneak_scroll.png", text: "偷滑一下" },
    { id: "boss_coming", img: "assets/stickers6/boss_coming.png", text: "老闆來了！" },
    { id: "quick_switch", img: "assets/stickers6/quick_switch.png", text: "快速切畫面" },
    { id: "zoning_meeting", img: "assets/stickers6/zoning_meeting.png", text: "開會放空" },
    { id: "nod_anyway", img: "assets/stickers6/nod_anyway.png", text: "聽不懂但點頭" },
    { id: "salary_thief", img: "assets/stickers6/salary_thief.png", text: "今天當薪水小偷" },
    { id: "slacking", img: "assets/stickers6/slacking.png", text: "摸魚中" },
    { id: "im_busy", img: "assets/stickers6/im_busy.png", text: "我在忙啦" },
    { id: "read_ignore", img: "assets/stickers6/read_ignore.png", text: "已讀裝死" },
    { id: "toilet_hide", img: "assets/stickers6/toilet_hide.png", text: "廁所避難" },
    { id: "get_air", img: "assets/stickers6/get_air.png", text: "出去透氣" },
    { id: "lunch_what", img: "assets/stickers6/lunch_what.png", text: "午餐吃什麼？" },
    { id: "food_coma", img: "assets/stickers6/food_coma.png", text: "吃飽想睡" },
    { id: "tea_time", img: "assets/stickers6/tea_time.png", text: "下午茶時間" },
    { id: "soul_left", img: "assets/stickers6/soul_left.png", text: "靈魂已下班" },
    { id: "cant_finish", img: "assets/stickers7/cant_finish.png", text: "今天做不完" },
    { id: "tomorrow_say", img: "assets/stickers7/tomorrow_say.png", text: "明天再說" },
    { id: "keep_file_open", img: "assets/stickers7/keep_file_open.png", text: "檔案開著就好" },
    { id: "busy_pretend", img: "assets/stickers7/busy_pretend.png", text: "忙著裝忙" },
    { id: "cover_me", img: "assets/stickers7/cover_me.png", text: "幫我擋一下" },
    { id: "boss_nearby", img: "assets/stickers7/boss_nearby.png", text: "主管在附近" },
    { id: "dont_find_me", img: "assets/stickers7/dont_find_me.png", text: "不要找我" },
    { id: "daydreaming", img: "assets/stickers7/daydreaming.png", text: "正在神遊" },
    { id: "brain_off", img: "assets/stickers7/brain_off.png", text: "腦袋關機" },
    { id: "want_leave", img: "assets/stickers7/want_leave.png", text: "我想請假" },
    { id: "leave_submitted", img: "assets/stickers7/leave_submitted.png", text: "假單已送出" },
    { id: "can_i_go", img: "assets/stickers7/can_i_go.png", text: "可以下班了嗎？" },
    { id: "countdown_off", img: "assets/stickers7/countdown_off.png", text: "倒數下班" },
    { id: "leave_ontime", img: "assets/stickers7/leave_ontime.png", text: "準時閃人" },
    { id: "no_overtime", img: "assets/stickers7/no_overtime.png", text: "拒絕加班" },
    { id: "finally_friday", img: "assets/stickers7/finally_friday.png", text: "終於星期五" },
    { id: "save_me_weekend", img: "assets/stickers7/save_me_weekend.png", text: "週末救我" },
    { id: "payday", img: "assets/stickers7/payday.png", text: "發薪了！" },
    { id: "money_gone", img: "assets/stickers7/money_gone.png", text: "錢錢又沒了" },
    { id: "slack_tomorrow", img: "assets/stickers7/slack_tomorrow.png", text: "明天繼續摸魚" }
  ]}
];
const allStickers = stickerSets.flatMap((set) => set.stickers);
(function applySavedStickerOrder() {
  try {
    const savedOrder = JSON.parse(localStorage.getItem("bori-sticker-order") || "[]");
    if (!savedOrder.length) return;
    const byId = new Map(stickerSets.map((s) => [s.id, s]));
    const ordered = savedOrder.map((id) => byId.get(id)).filter(Boolean);
    stickerSets.forEach((s) => { if (!savedOrder.includes(s.id)) ordered.push(s); });
    stickerSets.length = 0;
    stickerSets.push(...ordered);
  } catch {}
})();

let supabaseClient = null;
let session = null;
let profile = null;
let books = [];
let activeBookId = localStorage.getItem(ACTIVE_BOOK_KEY) || null;
let transactions = [];
let viewMonth = "";
let budgets = [];
let settlements = [];
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
const roomRequiredDialogs = ["budgetDialog", "manageCategoriesDialog", "roomSettingsDialog", "memberListDialog", "switchRoomDialog", "dataExportDialog"];
function openDialog(id) { if (!activeBookId && roomRequiredDialogs.includes(id)) return toast("請先開一個房間或加入房間"); $("#" + id)?.showModal(); }
function closeDialog(id) { $("#" + id)?.close(); }
function goTo(pageId) { $$(".page").forEach((p) => p.classList.toggle("active", p.id === pageId)); $$(".nav-item,.nav-add").forEach((b) => b.classList.toggle("active", b.dataset.page === pageId)); if (pageId === "chatPage") { showInteractionHub(); resetChatComposerBaseline(); } if (pageId === "insightsPage") renderInsights(); if (pageId === "addPage" && activeBookId) { $("#transactionForm")?.reset(); resetSplitState(); setAddType("expense"); setDateValue("dateInput", "dateInputDisplay", localDateStr()); editingTransactionId = null; $("#deleteTransactionBtn").classList.add("hidden"); } const _pg = document.getElementById(pageId); if (_pg) _pg.scrollTop = 0; window.scrollTo(0, 0); }
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
  const [tx, bd, st] = await Promise.all([
    supabaseClient.from("transactions").select("*").eq("book_id", activeBookId).order("transaction_date", { ascending: false }).order("created_at", { ascending: false }),
    supabaseClient.from("budgets").select("*").eq("book_id", activeBookId).eq("month", currentMonth()),
    supabaseClient.from("settlements").select("*").eq("book_id", activeBookId).order("created_at", { ascending: false })
  ]);
  if (tx.error) toast(tx.error.message); else transactions = tx.data || [];
  if (bd.error) toast(bd.error.message); else budgets = bd.data || [];
  if (st.error) toast(st.error.message); else settlements = st.data || [];
}

async function loadActiveBookData() {
  unsubscribeRealtime();
  transactions = []; budgets = []; settlements = []; messages = []; diaries = []; dailyAnswers = []; memberPrivacy = {}; roomMembers = []; memberFilterId = null; myLastReadAt = null;
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
    .on("postgres_changes", { event: "*", schema: "public", table: "settlements", filter: `book_id=eq.${activeBookId}` }, () => scheduleLedgerRefresh())
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
  if (!viewMonth) viewMonth = currentMonth();
  const _lmi = $("#ledgerMonthInput"); if (_lmi && _lmi.value !== viewMonth) _lmi.value = viewMonth;
  renderMemberFilterRow();
  const visible = visibleTransactions().filter((x) => String(x.transaction_date).slice(0, 7) === viewMonth);
  $("#ledgerCount").textContent = visible.length ? `共 ${visible.length} 筆` : "";
  const expenses = transactions.filter((x) => x.transaction_type === "expense" && String(x.transaction_date).slice(0, 7) === viewMonth);
  const _me = session?.user?.id;
  const myPaid = expenses.filter((x) => x.user_id === _me).reduce((s, x) => s + Number(x.amount), 0);
  const otherPaid = expenses.filter((x) => x.user_id !== _me).reduce((s, x) => s + Number(x.amount), 0);
  $("#myPaidTotal").textContent = money(myPaid); $("#otherPaidTotal").textContent = money(otherPaid);
  renderAccountBalances();
  renderBudgets(monthTransactions("expense"));
  renderSettleSummary();
  $("#ledgerList").innerHTML = visible.length ? visible.map(recordHTML).join("") : `<div class="empty-state compact"><p>還沒有收入或支出紀錄。</p></div>`;
}
function shareMapForTransaction(x) {
  if (x.transaction_type !== "expense" || x.split_mode !== "shared") return {};
  const members = Array.isArray(x.split_members) ? x.split_members : [];
  if (!members.length) return {};
  const amount = Number(x.amount) || 0;
  const map = {};
  if (x.split_type === "amount" && x.split_shares) {
    members.forEach((id) => { map[id] = Number(x.split_shares[id]) || 0; });
    return map;
  }
  if (x.split_type === "ratio" && x.split_shares) {
    members.forEach((id) => { map[id] = amount * (Number(x.split_shares[id]) || 0) / 100; });
    return map;
  }
  const equalShare = amount / members.length;
  members.forEach((id) => { map[id] = equalShare; });
  return map;
}
function computeNetBalances() {
  const net = {};
  roomMembers.forEach((m) => { net[m.id] = 0; });
  transactions.forEach((x) => {
    if (x.transaction_type !== "expense" || x.split_mode !== "shared") return;
    const shares = shareMapForTransaction(x);
    net[x.user_id] = (net[x.user_id] || 0) + Number(x.amount);
    Object.entries(shares).forEach(([uid, share]) => { net[uid] = (net[uid] || 0) - share; });
  });
  settlements.forEach((s) => { if (s.status === "pending") return;
    net[s.from_user_id] = (net[s.from_user_id] || 0) + Number(s.amount);
    net[s.to_user_id] = (net[s.to_user_id] || 0) - Number(s.amount);
  });
  return net;
}
function simplifyDebts(net) {
  const creditors = [], debtors = [];
  Object.entries(net).forEach(([id, value]) => {
    if (value > 0.5) creditors.push({ id, value });
    else if (value < -0.5) debtors.push({ id, value: -value });
  });
  creditors.sort((a, b) => b.value - a.value);
  debtors.sort((a, b) => b.value - a.value);
  const transfers = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const amount = Math.min(debtors[i].value, creditors[j].value);
    if (amount > 0.5) transfers.push({ from: debtors[i].id, to: creditors[j].id, amount: Math.round(amount) });
    debtors[i].value -= amount;
    creditors[j].value -= amount;
    if (debtors[i].value <= 0.5) i++;
    if (creditors[j].value <= 0.5) j++;
  }
  return transfers;
}
function memberName(id) { return id === session?.user?.id ? "我" : (roomMembers.find((m) => m.id === id)?.name || "成員"); }
function renderSettleSummary() {
  const section = $("#settleSection");
  if (!section) return;
  const show = roomMembers.length > 1;
  section.classList.toggle("hidden", !show);
  if (!show) return;
  const myId = session?.user?.id;
  const transfers = simplifyDebts(computeNetBalances());
  const rows = transfers.map((t) => {
    const isDebtor = t.from === myId;
    const action = isDebtor
      ? `<button type="button" data-settle-init-to="${t.to}" data-settle-init-amount="${t.amount}">發起結算</button>`
      : `<small class="settle-wait">只有 ${escapeHTML(memberName(t.from))} 能發起</small>`;
    return `<div class="settle-row"><div class="settle-row-info"><strong>${escapeHTML(memberName(t.from))} 應付給 ${escapeHTML(memberName(t.to))}</strong><small>依「與房間分攤」的支出計算</small></div><div class="settle-row-amount">${money(t.amount)}</div>${action}</div>`;
  });
  const pending = settlements.filter((s) => s.status === "pending" && (s.from_user_id === myId || s.to_user_id === myId));
  const pendingRows = pending.map((s) => {
    const iAmPayee = s.to_user_id === myId;
    const info = `<div class="settle-row-info"><strong>${escapeHTML(memberName(s.from_user_id))} → ${escapeHTML(memberName(s.to_user_id))}　${money(Number(s.amount))}</strong><small>${iAmPayee ? "對方已發起，等你確認收款" : "已送出，等待對方確認"}</small></div>`;
    const btns = iAmPayee
      ? `<button type="button" data-settle-confirm="${s.id}" data-settle-amount="${s.amount}" data-settle-from="${s.from_user_id}">確認收款</button>`
      : `<button type="button" class="settle-cancel" data-settle-cancel="${s.id}">取消</button>`;
    return `<div class="settle-row pending">${info}<div class="settle-row-amount"></div>${btns}</div>`;
  });
  const html = [...rows, ...pendingRows].join("");
  $("#settleSummaryList").innerHTML = html || `<div class="empty-state compact"><p>目前沒有人欠錢 🎉</p></div>`;
}
// ---- 分帳結算：發起 / 確認 ----
let settleInitState = { to: null, amount: 0, cat: "cash", sub: "現金" };
let settleConfirmState = { id: null, from: null, amount: 0, cat: "cash", sub: "現金" };
function renderSettlePicker(pickerEl, subEl, state, key) {
  if (!pickerEl || !subEl) return;
  pickerEl.innerHTML = baseCategories.map((c) => `<label><input type="radio" name="${key}Cat" value="${c.key}" ${c.key === state.cat ? "checked" : ""}><span>${c.icon}<small>${c.label}</small></span></label>`).join("");
  const subs = mySubAccounts(state.cat);
  if (subs.length <= 1) { subEl.classList.add("hidden"); state.sub = subs[0].name; return; }
  if (!subs.some((x) => x.name === state.sub)) state.sub = subs[0].name;
  subEl.classList.remove("hidden");
  subEl.innerHTML = subs.map((x) => `<button type="button" class="member-chip ${state.sub === x.name ? "active" : ""}" data-sub="${escapeHTML(x.name)}">${escapeHTML(x.name)}</button>`).join("");
}
function openSettleInitiate(to, amount) {
  settleInitState = { to, amount, cat: "cash", sub: "現金" };
  const who = $("#settleInitiateWho"); if (who) who.textContent = `結算給 ${memberName(to)}（最多 ${money(amount)}，可輸入部分金額）`;
  const inp = $("#settleInitiateAmount"); if (inp) { inp.value = amount; inp.max = amount; }
  renderSettlePicker($("#settleFromCategoryPicker"), $("#settleFromSubPicker"), settleInitState, "settleFrom");
  $("#settleInitiateDialog")?.showModal();
}
function openSettleConfirm(id, from, amount) {
  settleConfirmState = { id, from, amount, cat: "cash", sub: "現金" };
  const who = $("#settleConfirmWho"); if (who) who.textContent = `${memberName(from)} 付給你 ${money(amount)}，選擇收到哪個帳戶`;
  renderSettlePicker($("#settleToCategoryPicker"), $("#settleToSubPicker"), settleConfirmState, "settleTo");
  $("#settleConfirmDialog")?.showModal();
}
$("#settleFromCategoryPicker")?.addEventListener("change", (e) => { if (e.target.name === "settleFromCat") { settleInitState.cat = e.target.value; renderSettlePicker($("#settleFromCategoryPicker"), $("#settleFromSubPicker"), settleInitState, "settleFrom"); } });
$("#settleFromSubPicker")?.addEventListener("click", (e) => { const b = e.target.closest("[data-sub]"); if (b) { settleInitState.sub = b.dataset.sub; renderSettlePicker($("#settleFromCategoryPicker"), $("#settleFromSubPicker"), settleInitState, "settleFrom"); } });
$("#settleToCategoryPicker")?.addEventListener("change", (e) => { if (e.target.name === "settleToCat") { settleConfirmState.cat = e.target.value; renderSettlePicker($("#settleToCategoryPicker"), $("#settleToSubPicker"), settleConfirmState, "settleTo"); } });
$("#settleToSubPicker")?.addEventListener("click", (e) => { const b = e.target.closest("[data-sub]"); if (b) { settleConfirmState.sub = b.dataset.sub; renderSettlePicker($("#settleToCategoryPicker"), $("#settleToSubPicker"), settleConfirmState, "settleTo"); } });
$("#settleSummaryList").addEventListener("click", (e) => {
  const initBtn = e.target.closest("[data-settle-init-to]");
  if (initBtn) return openSettleInitiate(initBtn.dataset.settleInitTo, Number(initBtn.dataset.settleInitAmount));
  const confBtn = e.target.closest("[data-settle-confirm]");
  if (confBtn) return openSettleConfirm(confBtn.dataset.settleConfirm, confBtn.dataset.settleFrom, Number(confBtn.dataset.settleAmount));
  const cancelBtn = e.target.closest("[data-settle-cancel]");
  if (cancelBtn) return cancelPendingSettlement(cancelBtn.dataset.settleCancel);
});
async function cancelPendingSettlement(id) {
  if (!confirm("確定要取消這筆待確認的結算嗎？")) return;
  const { error } = await supabaseClient.from("settlements").delete().eq("id", id);
  if (error) return toast(error.message);
  await loadActiveBookData(); renderAll(); toast("已取消");
}
$("#settleInitiateForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const amt = Math.round(Number($("#settleInitiateAmount").value));
  if (!(amt > 0) || amt > settleInitState.amount) return toast(`金額需介於 1 ~ ${settleInitState.amount}`);
  const { error } = await supabaseClient.from("settlements").insert({ book_id: activeBookId, from_user_id: session.user.id, to_user_id: settleInitState.to, amount: amt, settled_by: session.user.id, status: "pending", from_category: settleInitState.cat, from_method: settleInitState.sub });
  if (error) return toast(error.message);
  $("#settleInitiateDialog")?.close();
  await loadActiveBookData(); renderAll(); toast("已送出，等待對方確認 ⏳");
});
$("#settleConfirmForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const { error } = await supabaseClient.from("settlements").update({ status: "confirmed", to_category: settleConfirmState.cat, to_method: settleConfirmState.sub, confirmed_by: session.user.id, confirmed_at: new Date().toISOString() }).eq("id", settleConfirmState.id);
  if (error) return toast(error.message);
  $("#settleConfirmDialog")?.close();
  await loadActiveBookData(); renderAll(); toast("結算完成，已同步記帳 ✅");
});
function renderSettleHistory() {
  const done = settlements.filter((s) => s.status !== "pending");
  $("#settleHistoryList").innerHTML = done.length
    ? done.map((s) => `<div class="settle-history-row"><div><strong>${escapeHTML(memberName(s.from_user_id))} → ${escapeHTML(memberName(s.to_user_id))}　${money(Number(s.amount))}</strong><small>${new Date(s.confirmed_at || s.created_at).toLocaleString("zh-TW")}　已完成</small></div></div>`).join("")
    : `<div class="empty-state compact"><p>還沒有完成的結算紀錄。</p></div>`;
}
document.addEventListener("click", (e) => { if (e.target.closest('[data-open="settleHistoryDialog"]')) renderSettleHistory(); });
$("#settleHistoryList").addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-delete-settlement]");
  if (!btn) return;
  if (!confirm("確定要取消這筆結算紀錄嗎？")) return;
  const { error } = await supabaseClient.from("settlements").delete().eq("id", btn.dataset.deleteSettlement);
  if (error) return toast(error.message);
  await loadActiveBookData();
  renderAll();
  renderSettleHistory();
  toast("已取消該筆結算");
});
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
    return `<button type="button" class="budget-card" data-edit-budget-category="${escapeHTML(category)}"><div class="budget-head"><span>${categoryIconHTML(category)} ${escapeHTML(category)}<small class="budget-scope">${escapeHTML([...new Set(scopes)].join("、"))}</small></span><strong>${money(used)} / ${money(total)}</strong></div><div class="progress"><i class="${pct >= 100 ? "over" : ""}" style="width:${Math.min(100, pct)}%"></i></div><small>${pct >= 100 ? "已超出預算" : `還可以使用 ${money(Math.max(total - used, 0))}`}</small></button>`;
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
function computeSubAccountBalances(categoryKey) {
  const myId = session?.user?.id;
  const map = {};
  mySubAccounts(categoryKey).forEach((sa) => { map[sa.name] = 0; });
  transactions.forEach((x) => {
    if (x.payment_category !== categoryKey) return;
    if (memberFilterId && x.user_id !== memberFilterId) return;
    if (x.user_id !== myId && memberPrivacy[x.user_id]) return;
    const name = x.payment_method || (baseCategories.find((c) => c.key === categoryKey)?.label) || categoryKey;
    if (!(name in map)) map[name] = 0;
    map[name] += x.transaction_type === "income" ? Number(x.amount) : -Number(x.amount);
  });
  return map;
}
let accountDetailCat = null;
function openAccountDetail(cat) {
  accountDetailCat = cat;
  const meta = baseCategories.find((c) => c.key === cat);
  const balances = computeSubAccountBalances(cat);
  const total = Object.values(balances).reduce((s2, v) => s2 + v, 0);
  const canAdjust = !memberFilterId || memberFilterId === session?.user?.id;
  const t = $("#accountDetailTitle"); if (t) t.innerHTML = `${meta?.icon || ""} ${escapeHTML(meta?.label || cat)}`;
  const tot = $("#accountDetailTotal"); if (tot) tot.textContent = money(total);
  const names = Object.keys(balances);
  const list = $("#accountDetailList");
  if (list) list.innerHTML = names.length ? names.map((n) => `<div class="account-detail-row"><span>${escapeHTML(n)}</span><strong class="${balances[n] < 0 ? "negative" : ""}">${money(balances[n])}</strong>${canAdjust ? `<button type="button" class="text-button" data-adjust-sub="${escapeHTML(n)}">調整</button>` : ""}</div>`).join("") : `<p class="muted">此分類還沒有子帳戶。</p>`;
  $("#accountDetailDialog")?.showModal();
}
async function adjustAccountBalance(cat, sub) {
  const cur = computeSubAccountBalances(cat)[sub] || 0;
  const input = prompt(`「${sub}」目前餘額為 ${money(cur)}。\n請輸入正確的餘額：`, String(Math.round(cur)));
  if (input === null) return;
  const target = Math.round(Number(input));
  if (!Number.isFinite(target)) return toast("請輸入數字");
  const delta = target - cur;
  if (delta === 0) return toast("餘額不變");
  const row = { book_id: activeBookId, user_id: session.user.id, transaction_type: delta > 0 ? "income" : "expense", category: "餘額調整", title: "餘額調整", amount: Math.abs(delta), transaction_date: localDateStr(), payment_category: cat, payment_method: sub, split_mode: "private", note: "手動調整餘額" };
  const { error } = await supabaseClient.from("transactions").insert(row);
  if (error) return toast(error.message);
  await loadActiveBookData();
  renderAll();
  openAccountDetail(cat);
  toast("餘額已調整 ✅");
}
$("#accountBalances")?.addEventListener("click", (e) => { const card = e.target.closest("[data-account-cat]"); if (card) openAccountDetail(card.dataset.accountCat); });
$("#accountDetailList")?.addEventListener("click", (e) => { const b = e.target.closest("[data-adjust-sub]"); if (b && accountDetailCat) adjustAccountBalance(accountDetailCat, b.dataset.adjustSub); });
function renderAccountBalances() {
  const el = $("#accountBalances");
  if (!el) return;
  const balances = computeAccountBalances();
  const selectedMember = memberFilterId ? roomMembers.find((m) => m.id === memberFilterId) : null;
  const ownerLabel = selectedMember ? selectedMember.name : "全部成員";
  el.innerHTML = baseCategories.map((c) => `<div class="account-balance-card clickable" data-account-cat="${c.key}"><span class="account-icon">${c.icon}</span><small>${escapeHTML(ownerLabel)} · ${c.label}</small><strong class="${balances[c.key] < 0 ? "negative" : ""}">${money(balances[c.key] || 0)}</strong><span class="account-chevron">›</span></div>`).join("");
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
function renderAdd() { const has = !!activeBookId; $("#addEmpty").classList.toggle("hidden", has); $("#addContent").classList.toggle("hidden", !has); if (has) { renderPaymentPicker(); if (!editingTransactionId) setAddType(addType); } const _t = new Date(); const _h = $("#aiBookkeepingHint"); if (_h) _h.textContent = `例如：「${_t.getMonth() + 1}/${_t.getDate()} 早餐 85 現金」`; }
function stickerById(id) { return allStickers.find((s) => s.id === id); }
function formatDateDivider(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const target = new Date(d); target.setHours(0, 0, 0, 0);
  if (target.getTime() === today.getTime()) return "今天";
  if (target.getTime() === yesterday.getTime()) return "昨天";
  const sameYear = target.getFullYear() === today.getFullYear();
  return sameYear ? `${target.getMonth() + 1}月${target.getDate()}日` : `${target.getFullYear()}年${target.getMonth() + 1}月${target.getDate()}日`;
}
function renderChat() {
  const has = !!activeBookId; $("#chatEmpty").classList.toggle("hidden", has); $("#chatContent").classList.toggle("hidden", !has); if (!has) return;
  const b = activeBook(); $("#chatBookTitle").textContent = b.name;
  const listEl = $("#messageList");
  const distanceFromBottomBefore = userScrolledUpInChat ? listEl.scrollHeight - listEl.scrollTop : null;
  if (!messages.length) {
    listEl.innerHTML = `<div class="chat-welcome"><span>🐻</span><p>這裡是你們的即時聊天室。<br>先傳一句話或一張 BORI 貼圖吧。</p></div>`;
    renderStickerTray();
    return;
  }
  let html = "", lastDate = null;
  messages.forEach((m) => {
    const msgDate = String(m.created_at).slice(0, 10);
    if (msgDate !== lastDate) { html += `<div class="chat-date-divider">${formatDateDivider(msgDate)}</div>`; lastDate = msgDate; }
    const mine = m.user_id === session.user.id, name = m.profiles?.display_name || (mine ? profile?.display_name : "成員");
    const quoteHTML = m.reply_to_id ? `<div class="message-quote"><small>${escapeHTML(m.reply_preview_sender || "")}</small><p>${escapeHTML(m.reply_preview_text || "")}</p></div>` : "";
    const timeStr = new Date(m.created_at).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" });
    if (m.message_type === "sticker") {
      const s = stickerById(m.sticker_id);
      html += `<div class="message ${mine ? "mine" : "other"} sticker-message" data-message-id="${m.id}"><small class="sender">${escapeHTML(name)}</small>${quoteHTML}${s ? `<img src="${s.img}" alt="${escapeHTML(s.text)}" />` : `<span>🐻</span><strong>BORI</strong>`}<small>${timeStr}</small></div>`;
    } else if (m.message_type === "image") {
      html += `<div class="message ${mine ? "mine" : "other"} image-message" data-message-id="${m.id}"><small class="sender">${escapeHTML(name)}</small>${quoteHTML}<a href="${escapeHTML(m.image_url || "")}" target="_blank" rel="noopener"><img src="${escapeHTML(m.image_url || "")}" alt="圖片" loading="lazy" /></a><small>${timeStr}</small></div>`;
    } else {
      html += `<div class="message ${mine ? "mine" : "other"}" data-message-id="${m.id}"><small class="sender">${escapeHTML(name)}</small>${quoteHTML}<p>${escapeHTML(m.content || "")}</p><small>${timeStr}</small></div>`;
    }
  });
  listEl.innerHTML = html;
  if (distanceFromBottomBefore !== null) listEl.scrollTop = listEl.scrollHeight - distanceFromBottomBefore;
  renderStickerTray();
}
let activeStickerSet = 0;
let hiddenStickerSets = new Set(JSON.parse(localStorage.getItem("bori-hidden-stickers") || "[]"));
function visibleStickerSets() {
  const shown = stickerSets.filter((s) => !hiddenStickerSets.has(s.id));
  return shown.length ? shown : stickerSets;
}
function renderStickerTray() {
  const sets = visibleStickerSets();
  if (activeStickerSet >= sets.length) activeStickerSet = 0;
  $("#stickerSetTabs").innerHTML = sets.map((set, i) => `<button type="button" class="sticker-set-tab ${i === activeStickerSet ? "active" : ""}" data-set="${i}"><img src="${set.stickers[0].img}" alt="${escapeHTML(set.name)}" /></button>`).join("");
  $("#stickerGrid").innerHTML = sets[activeStickerSet].stickers.map((s) => `<button type="button" data-sticker="${s.id}"><img src="${s.img}" alt="${escapeHTML(s.text)}" /></button>`).join("");
}
function scrollChat(force) {
  const el = $("#messageList");
  if (!el) return;
  if (!force && userScrolledUpInChat) return;
  const doScroll = () => { el.scrollTop = el.scrollHeight; };
  requestAnimationFrame(doScroll);
  setTimeout(doScroll, 120);
  setTimeout(doScroll, 400);
}
let userScrolledUpInChat = false;
$("#messageList").addEventListener("scroll", () => {
  const el = $("#messageList");
  const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
  userScrolledUpInChat = distanceFromBottom > 220;
  $("#scrollToLatestBtn").classList.toggle("hidden", !userScrolledUpInChat);
});
$("#scrollToLatestBtn").addEventListener("click", () => { userScrolledUpInChat = false; scrollChat(true); $("#scrollToLatestBtn").classList.add("hidden"); });
function renderStickerShopList() {
  $("#stickerShopList").innerHTML = stickerSets.map((set) => {
    const on = !hiddenStickerSets.has(set.id);
    return `<button type="button" class="sticker-shop-card" data-shop-toggle="${set.id}"><img src="${set.stickers[0].img}" alt="" /><strong>${escapeHTML(set.name)}</strong><small>${set.stickers.length} 張</small><span class="sticker-shop-badge">${on ? "✓ 已擁有" : "已隱藏"}</span></button>`;
  }).join("");
}
document.addEventListener("click", (e) => { if (e.target.closest('[data-open="stickerShopDialog"]')) renderStickerShopList(); });
$("#stickerShopList").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-shop-toggle]");
  if (!btn) return;
  const id = btn.dataset.shopToggle;
  const willHide = !hiddenStickerSets.has(id);
  if (willHide && hiddenStickerSets.size >= stickerSets.length - 1) return toast("至少要保留一組貼圖");
  if (willHide) hiddenStickerSets.add(id); else hiddenStickerSets.delete(id);
  localStorage.setItem("bori-hidden-stickers", JSON.stringify([...hiddenStickerSets]));
  renderStickerShopList();
  renderStickerTray();
});
function renderStickerManageList() {
  $("#stickerManageList").innerHTML = stickerSets.map((set) => {
    const on = !hiddenStickerSets.has(set.id);
    return `<div class="sticker-manage-row"><span class="drag-handle">⠿</span><img src="${set.stickers[0].img}" alt="" /><div class="sticker-manage-copy"><strong>${escapeHTML(set.name)}</strong><small>${set.stickers.length} 張貼圖</small></div><button type="button" class="toggle-switch ${on ? "on" : ""}" data-toggle-sticker-set="${set.id}"><i></i></button></div>`;
  }).join("");
}
document.addEventListener("click", (e) => { if (e.target.closest('[data-open="stickerManageDialog"]')) renderStickerManageList(); });
$("#stickerManageList").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-toggle-sticker-set]");
  if (!btn) return;
  const id = btn.dataset.toggleStickerSet;
  const willHide = !hiddenStickerSets.has(id);
  if (willHide && hiddenStickerSets.size >= stickerSets.length - 1) return toast("至少要保留一組貼圖");
  if (willHide) hiddenStickerSets.add(id); else hiddenStickerSets.delete(id);
  localStorage.setItem("bori-hidden-stickers", JSON.stringify([...hiddenStickerSets]));
  renderStickerManageList();
  renderStickerTray();
});
$("#stickerManageList").addEventListener("pointerdown", (e) => {
  if (e.target.closest(".toggle-switch")) return;
  const row = e.target.closest(".sticker-manage-row");
  if (!row) return;
  const startX = e.clientX, startY = e.clientY, pointerId = e.pointerId;
  let activated = false;
  const timer = setTimeout(() => { activated = true; beginStickerSetDrag(row, pointerId, startY); }, 350);
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
function beginStickerSetDrag(startRow, pointerId, startY) {
  beginListDrag($("#stickerManageList"), ".sticker-manage-row", startRow, pointerId, startY, () => stickerSets, (newOrder) => {
    stickerSets.length = 0;
    stickerSets.push(...newOrder);
    localStorage.setItem("bori-sticker-order", JSON.stringify(newOrder.map((s) => s.id)));
    activeStickerSet = 0;
    renderStickerManageList();
    renderStickerTray();
  });
}
function renderAnalysis() {
  if (!activeBookId) return;
  if (!viewMonth) viewMonth = currentMonth();
  const _mi = $("#analysisMonthInput"); if (_mi && _mi.value !== viewMonth) _mi.value = viewMonth;
  let analysisTransactions = transactions.filter((x) => String(x.transaction_date).slice(0, 7) === viewMonth);
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
  $("#categoryLegend").innerHTML = entries.length ? entries.map(([c, v]) => `<div class="legend-row"><i style="background:${(categoryMeta[c] || categoryMeta.其他).color}"></i><span>${escapeHTML(c)}</span><strong>${money(v)} (${Math.round((v / exp) * 100)}%)</strong></div>`).join("") : `<p class="muted">尚無支出分類</p>`;
  const [_yy, _mm] = viewMonth.split("-").map(Number);
  const _dim = new Date(_yy, _mm, 0).getDate();
  const _dayTotals = Array(_dim).fill(0);
  expenses.forEach((x) => { const dd = Number(String(x.transaction_date).slice(8, 10)); if (dd >= 1 && dd <= _dim) _dayTotals[dd - 1] += Number(x.amount); });
  const _maxDay = Math.max(1, ..._dayTotals);
  const _dbc = $("#dailyBarChart");
  if (_dbc) _dbc.innerHTML = _dayTotals.map((v, i) => `<div class="day-bar" title="${viewMonth}-${pad2(i + 1)}　${money(v)}"><span style="height:${v ? Math.max(3, Math.round((v / _maxDay) * 100)) : 0}%"></span><small>${(i + 1) % 5 === 0 || i === 0 ? i + 1 : ""}</small></div>`).join("");
  const _pd = new Date(_yy, _mm - 2, 1); const _pm = `${_pd.getFullYear()}-${pad2(_pd.getMonth() + 1)}`;
  let _prevExp = transactions.filter((x) => x.transaction_type === "expense" && String(x.transaction_date).slice(0, 7) === _pm);
  if (memberFilterId) _prevExp = _prevExp.filter((x) => x.user_id === memberFilterId);
  const _prevSum = _prevExp.reduce((s2, x) => s2 + Number(x.amount), 0);
  const _cmp = $("#analysisCompare");
  if (_cmp) { if (_prevSum > 0) { const _d = exp - _prevSum; const _pp = Math.round((_d / _prevSum) * 100); _cmp.textContent = `與上月（${money(_prevSum)}）相比，${_d >= 0 ? "多花" : "少花"}了 ${money(Math.abs(_d))}（${_d >= 0 ? "+" : ""}${_pp}%）`; } else { _cmp.textContent = "上月沒有支出可比較。"; } }
  const memberRows = roomMembers.map((member) => {
    const rows = analysisTransactions.filter((x) => x.user_id === member.id);
    const memberIncome = rows.filter((x) => x.transaction_type === "income").reduce((s, x) => s + Number(x.amount), 0);
    const memberExpense = rows.filter((x) => x.transaction_type === "expense").reduce((s, x) => s + Number(x.amount), 0);
    return `<article><strong>${escapeHTML(member.name)}</strong><span class="income-text">收入 ${money(memberIncome)}</span><span>支出 ${money(memberExpense)}</span><b class="${memberIncome - memberExpense < 0 ? "negative" : ""}">結餘 ${money(memberIncome - memberExpense)}</b></article>`;
  });
  $("#memberAnalysisList").innerHTML = memberRows.join("") || `<p class="muted">尚無成員資料</p>`;
}
function setViewMonth(m) {
  if (!m) return;
  viewMonth = m;
  renderLedger();
  renderAnalysis();
}
function shiftViewMonth(delta) {
  if (!viewMonth) viewMonth = currentMonth();
  const [y, m] = viewMonth.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  setViewMonth(`${d.getFullYear()}-${pad2(d.getMonth() + 1)}`);
}
$("#analysisPrevMonth")?.addEventListener("click", () => shiftViewMonth(-1));
$("#analysisNextMonth")?.addEventListener("click", () => shiftViewMonth(1));
$("#analysisMonthInput")?.addEventListener("change", (e) => setViewMonth(e.target.value));
$("#ledgerPrevMonth")?.addEventListener("click", () => shiftViewMonth(-1));
$("#ledgerNextMonth")?.addEventListener("click", () => shiftViewMonth(1));
$("#ledgerMonthInput")?.addEventListener("change", (e) => setViewMonth(e.target.value));
function showInteractionHub() {
  $("#interactionHub")?.classList.remove("hidden");
  $$(".interaction-view").forEach((view) => view.classList.add("hidden"));
}
$$('[data-interaction-view]').forEach((button) => button.addEventListener("click", () => {
  $("#interactionHub").classList.add("hidden");
  $$(".interaction-view").forEach((view) => view.classList.add("hidden"));
  const target = { chat: "interactionChat", diary: "interactionDiary", question: "interactionQuestion" }[button.dataset.interactionView];
  $("#" + target).classList.remove("hidden");
  if (button.dataset.interactionView === "chat") { userScrolledUpInChat = false; $("#scrollToLatestBtn").classList.add("hidden"); scrollChat(true); markChatRead(); resetChatComposerBaseline(); }
  if (button.dataset.interactionView === "diary") { resetDiaryForm(); renderDiary(); }
  if (button.dataset.interactionView === "question") renderDailyQuestion();
}));
$$('[data-interaction-back]').forEach((button) => button.addEventListener("click", showInteractionHub));

const DIARY_PREFIX = "[[BORI_DIARY_V2]]";
function parseDiaryContent(raw = "") {
  if (!raw.startsWith(DIARY_PREFIX)) return { title: "生活隨筆", mood: "回憶", emoji: "📖", body: raw };
  try {
    const data = JSON.parse(raw.slice(DIARY_PREFIX.length));
    const moodIcons = { 幸福: "happy_bonded", 開心: "joyful", 平靜: "calm", 疲累: "tired", 難過: "sad" };
    return { title: data.title || "生活隨筆", mood: data.mood || "回憶", iconKey: moodIcons[data.mood] || null, body: data.body || "" };
  } catch { return { title: "生活隨筆", mood: "回憶", emoji: "📖", body: raw }; }
}
function packDiaryContent(title, mood, body) { return DIARY_PREFIX + JSON.stringify({ title, mood, body }); }
function resetDiaryForm() {
  editingDiaryId = null;
  const form = $("#diaryForm"); if (!form) return;
  form.reset(); setDateValue("diaryDate", "diaryDateDisplay", taiwanToday());
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
    const moodTag = diary.iconKey ? `<img class="diary-mood-tag-icon" src="assets/mood-icons/${diary.iconKey}.png" alt="" />` : "📖";
    return `<article class="diary-entry"><div class="diary-date-badge"><b>${String(date.getDate()).padStart(2,"0")}</b><small>${date.getMonth()+1}月</small></div><div class="diary-paper"><div class="diary-entry-meta"><span>${moodTag} ${escapeHTML(diary.mood)}</span><small>${escapeHTML(dateLabel)} · ${escapeHTML(owner?.name || (mine ? profile?.display_name : "成員") || "成員")}</small></div><h4>${escapeHTML(diary.title)}</h4><p>${escapeHTML(diary.body)}</p>${mine ? `<div class="diary-entry-actions"><button type="button" data-edit-diary="${entry.id}">編輯</button><button type="button" data-delete-diary="${entry.id}">刪除</button></div>` : ""}</div></article>`;
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
    setDateValue("diaryDate", "diaryDateDisplay", entry.entry_date); $("#diaryTitle").value = diary.title === "生活隨筆" ? "" : diary.title; $("#diaryContent").value = diary.body;
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
  "最近有哪一件小事讓你感到被愛？",
  "你希望別人怎麼陪伴壓力大的你？",
  "什麼樣的舉動最容易讓你心動？",
  "你覺得自己最會用什麼方式表達愛？",
  "被愛的時候，你身體最先有什麼感覺？",
  "哪一種擁抱最能療癒你？",
  "你最想聽到對方對你說哪一句話？",
  "什麼時刻讓你覺得「還好有你在」？",
  "你希望多久被稱讚一次？",
  "對你來說，安全感是什麼樣子？",
  "你會怎麼讓喜歡的人知道你在乎他？",
  "最近誰的一個小舉動溫暖了你？",
  "你比較喜歡被驚喜，還是被好好計畫地對待？",
  "什麼樣的早安訊息會讓你一整天心情好？",
  "你覺得愛裡最重要的三個字是什麼？",
  "哪一種道歉方式你最能接受？",
  "你受傷難過時，最需要對方做什麼？",
  "你曾經因為哪句話而愛上一個人？",
  "你希望在爭吵後，對方先做什麼？",
  "什麼樣的陪伴讓你覺得不孤單？",
  "童年最幸福的一段回憶是什麼？",
  "你最想重新體驗哪一天？",
  "小時候最想成為什麼樣的大人？",
  "哪一個味道會立刻把你帶回童年？",
  "小時候最喜歡的一個玩具或遊戲是什麼？",
  "第一次覺得自己長大是在什麼時候？",
  "求學階段最難忘的一位老師是誰？",
  "你最懷念以前哪一段時光？",
  "小時候最怕什麼？現在還怕嗎？",
  "哪一首歌一響起就充滿回憶？",
  "你人生第一次的旅行去了哪裡？",
  "青春期最叛逆的一件事是什麼？",
  "哪一段友情對你影響最深？",
  "你最珍惜的一張老照片是哪一張？",
  "小時候家裡的哪個角落最有安全感？",
  "第一次賺到錢是怎麼賺的？",
  "你最難忘的一個生日是幾歲那年？",
  "有沒有一件當時覺得糗、現在覺得好笑的事？",
  "哪一個暑假讓你到現在都記得？",
  "你最想跟小時候的自己說什麼？",
  "如果不用擔心錢，你最想做什麼？",
  "五年後你希望自己過著什麼樣的生活？",
  "你有哪個一直放在心裡、還沒實現的夢想？",
  "你希望老的時候，生活是什麼樣子？",
  "如果能學會任何一種技能，你想學什麼？",
  "你想在哪裡度過退休生活？",
  "人生清單上最想完成的一件事是什麼？",
  "你希望被別人記得的是哪一點？",
  "如果能重來一次職涯，你會選什麼？",
  "你理想中的家是什麼樣子？",
  "接下來一年你最想達成的目標是什麼？",
  "你希望十年後的自己感謝現在做了什麼決定？",
  "如果可以無條件成功一次，你想挑戰什麼？",
  "你最想養成、卻還沒開始的好習慣是什麼？",
  "有沒有一個地方你這輩子一定要去？",
  "你希望未來的生活多一點什麼、少一點什麼？",
  "如果能開一間店，你會開什麼？",
  "你想留給下一代什麼樣的東西？",
  "接下來想培養哪一個新興趣？",
  "你覺得怎樣算是「過得好」的一生？",
  "你理想中的週末早晨是什麼樣子？",
  "一天裡你最喜歡哪一個時段？",
  "你有什麼別人可能不知道的小習慣？",
  "睡前你通常都在做什麼？",
  "一個人獨處時你最愛做什麼？",
  "早上起床第一件事是什麼？",
  "你最放鬆的充電方式是什麼？",
  "哪個生活小物你離不開？",
  "你會怎麼安排完美的一天？",
  "最近讓你很有成就感的小事是什麼？",
  "你有沒有什麼固定的儀式感？",
  "忙碌時你會先犧牲哪件事？",
  "通勤路上你都在想什麼或做什麼？",
  "你多久整理一次房間？",
  "你最想改掉自己的哪個習慣？",
  "下雨天你最喜歡做什麼？",
  "你手機裡最常用的 App 是哪個？為什麼？",
  "一個人吃飯時你都吃什麼？",
  "你有沒有非做不可、否則會渾身不對勁的事？",
  "最近哪件日常小事讓你特別滿足？",
  "最近一次真正大笑是為了什麼？",
  "什麼事情最容易惹你生氣？",
  "你難過的時候通常怎麼調適？",
  "最近有什麼煩惱想找人說？",
  "你害怕的東西是什麼？",
  "什麼會讓你瞬間平靜下來？",
  "你最近的壓力來源是什麼？",
  "你怎麼判斷自己「累了」？",
  "有沒有一種情緒你很難對別人說出口？",
  "你上一次哭是什麼時候？",
  "什麼樣的話會傷到你？",
  "你怎麼面對失望？",
  "最近有沒有覺得孤單的時刻？",
  "你如何跟自己的焦慮相處？",
  "什麼事情會讓你打從心底開心？",
  "你最想擺脫的一個念頭是什麼？",
  "獨處和熱鬧，你現在比較需要哪一個？",
  "你怎麼原諒別人（或自己）？",
  "最近一次感到「被理解」是什麼時候？",
  "你心裡有沒有一直放不下的事？",
  "最近最想感謝身邊的誰、為什麼？",
  "你最欣賞自己的哪一個特質？",
  "最近誰幫了你一個大忙？",
  "你想謝謝過去的自己做了什麼？",
  "身邊有誰是你的榜樣？",
  "最近有什麼讓你覺得「很幸運」的事？",
  "你最感謝家人給你的是什麼？",
  "有沒有一個陌生人的善意讓你記到現在？",
  "你欣賞另一半（或家人）哪個優點卻很少說出口？",
  "最近讓你心懷感激的一句話是什麼？",
  "你想對曾經幫過你的老師或前輩說什麼？",
  "今天有什麼值得感謝的小事？",
  "你覺得自己被高估、還是被低估的優點是什麼？",
  "有沒有誰默默為你付出，你卻很少道謝？",
  "你最想向誰道歉？",
  "回顧今年，你最感謝發生了什麼？",
  "你欣賞哪一種性格的人？",
  "誰讓你相信「人性本善」？",
  "最近有沒有被誰的努力打動？",
  "你會怎麼謝謝一路支持你的人？",
  "你覺得相處最重要的是什麼？",
  "吵架後你比較希望冷靜一下還是馬上溝通？",
  "什麼樣的朋友讓你最自在？",
  "你怎麼維繫一段重要的關係？",
  "在關係裡你最需要的是什麼？",
  "你能接受另一半有哪些秘密？",
  "你覺得好的溝通長什麼樣子？",
  "你比較容易付出還是接受？",
  "有沒有一種相處模式讓你覺得很舒服？",
  "你希望別人怎麼給你建議？",
  "什麼行為會讓你對一個人失望？",
  "你會怎麼修復一段有裂痕的關係？",
  "你重視承諾嗎？為什麼？",
  "朋友有難時你通常怎麼幫？",
  "你能原諒背叛嗎？取決於什麼？",
  "你希望在一段關係裡保有多少自己的空間？",
  "你如何表達不滿又不傷感情？",
  "什麼樣的默契讓你覺得很珍貴？",
  "你覺得家人和朋友最大的不同是什麼？",
  "你最想和誰把話說開？",
  "你最喜歡的季節是哪一個？為什麼？",
  "最近單曲循環的一首歌是什麼？",
  "有沒有一部你可以重看很多次的電影？",
  "你最喜歡的顏色最近有變嗎？",
  "哪一種天氣最讓你心情好？",
  "你最喜歡的一句電影或書裡的台詞是什麼？",
  "最近讓你上癮的一件事是什麼？",
  "你最喜歡去的一間店是哪裡？",
  "有沒有一種聲音讓你特別安心？",
  "你最喜歡的一種花或植物是什麼？",
  "最近看過最喜歡的一部劇是哪部？",
  "你最喜歡的節日是哪一個？",
  "哪一種香味是你的最愛？",
  "你最喜歡收藏什麼？",
  "你最喜歡的一位作者或創作者是誰？",
  "最近讓你笑最久的一個影片或迷因是什麼？",
  "你最喜歡的一種運動或活動是什麼？",
  "你最喜歡的一個城市是哪裡？",
  "你最喜歡穿什麼樣的衣服？",
  "有沒有一樣你百吃不膩的食物？",
  "你的最後一餐想吃什麼？",
  "最近最想吃的一道菜是什麼？",
  "有沒有一道菜會讓你想起某個人？",
  "你最會做的一道料理是什麼？",
  "早餐你是甜派還是鹹派？",
  "有什麼食物你以前討厭、現在愛上了？",
  "你心中的療癒美食是什麼？",
  "如果只能吃一種水果，你選哪個？",
  "最想學會做的一道料理是什麼？",
  "你吃火鍋必點什麼？",
  "消夜你最常吃什麼？",
  "有沒有一間餐廳你想帶大家一起去？",
  "你能接受最怪的食物組合是什麼？",
  "你喝咖啡還是茶？怎麼喝？",
  "哪一種家常菜最有「家的味道」？",
  "你最想再吃一次、卻吃不到的味道是什麼？",
  "甜點在你心中的地位是？",
  "你會為了美食排多久的隊？",
  "最近踩雷的一次外食是什麼？",
  "如果幫你辦一桌，你希望有哪三道菜？",
  "如果可以一起旅行，你最想去哪裡？",
  "你旅行時是計畫派還是隨性派？",
  "最想再去一次的地方是哪裡？",
  "旅行中最難忘的一次意外是什麼？",
  "你的夢想旅行清單第一名是哪裡？",
  "比較喜歡山還是海？",
  "你出國最想體驗什麼？",
  "有沒有一個地方你一去就愛上？",
  "你旅行必帶的一樣東西是什麼？",
  "最想來一場說走就走的哪種旅行？",
  "你想在哪裡看一次日出或日落？",
  "如果能住在國外一年，你選哪個城市？",
  "你旅行最在意的是住、吃、還是景？",
  "最想和誰一起環島或環遊世界？",
  "有沒有一種交通方式你特別想體驗？",
  "你會想去很冷的地方還是很熱的地方？",
  "旅行讓你學到最多的一課是什麼？",
  "你想去一個完全沒人認識你的地方嗎？",
  "最想在旅途中完成的一件事是什麼？",
  "下一趟旅行你最想放下什麼？",
  "如果能擁有一種超能力，你想要哪一種？",
  "如果中了大獎，第一件事會做什麼？",
  "如果能和任何人吃一頓飯，你選誰？",
  "如果能回到過去一天，你會選哪天？",
  "如果變成動物，你想當哪一種？",
  "如果只能保留手機裡三個 App，你留哪些？",
  "如果能瞬間精通一種語言，你選哪國？",
  "如果人生是一部電影，片名會叫什麼？",
  "如果能跟明天的自己說一句話，你會說什麼？",
  "如果世界末日只剩一天，你想怎麼過？",
  "如果能交換人生一天，你想當誰？",
  "如果能刪掉一種家事，你刪哪個？",
  "如果能永遠停在某個年紀，你選幾歲？",
  "如果有一天隱形，你想做什麼？",
  "如果只能聽一首歌一整年，你選哪首？",
  "如果能養任何一種寵物（不限現實），你養什麼？",
  "如果能無限吃某種食物不會胖，你選什麼？",
  "如果能和過去的自己交換一個決定，你換哪個？",
  "如果能為今天下標題，會是什麼？",
  "如果能許三個願望，你會許什麼？",
  "最近學到關於自己的哪件事？",
  "過去一年你最大的改變是什麼？",
  "你最想突破自己的哪一點？",
  "什麼事情曾經很難、現在對你來說變簡單了？",
  "你最引以為傲的一次選擇是什麼？",
  "你從失敗中學到最重要的一課是什麼？",
  "你現在最想放下的執念是什麼？",
  "你怎麼定義「成功」？",
  "有沒有一句話一直支撐著你？",
  "你最近走出的一個舒適圈是什麼？",
  "你希望明年的自己更擅長什麼？",
  "你如何面對別人的批評？",
  "最近做過最勇敢的一件事是什麼？",
  "你覺得自己被什麼綁住了？",
  "你最想戒掉的一個念頭或習慣是什麼？",
  "你怎麼重新振作？",
  "有沒有一個人生轉捩點改變了你？",
  "你現在的價值觀和五年前差在哪？",
  "你想成為什麼樣的長輩？",
  "你最近一次對自己說「做得好」是為了什麼？",
  "你覺得人生最重要的是什麼？",
  "金錢和時間，你現在更想要哪一個？",
  "你最不能忍受的一種行為是什麼？",
  "你相信命運還是選擇？",
  "你覺得什麼是真正的自由？",
  "你如何定義一個「好人」？",
  "你願意為了原則付出多少代價？",
  "你覺得後悔有意義嗎？",
  "對你來說，家是地方還是人？",
  "你比較在意過程還是結果？",
  "你相信第一印象嗎？",
  "你覺得善良和聰明哪個更重要？",
  "你怎麼看待「平凡」？",
  "你願意為理想冒多大的險？",
  "你覺得什麼樣的生活才算成功？",
  "名聲、財富、健康，你先要哪個？",
  "你如何看待「放棄」？",
  "你覺得道歉和原諒哪個更難？",
  "你會為了合群而委屈自己嗎？",
  "你心中最重要的三個原則是什麼？",
  "今天有哪一刻讓你覺得幸福？",
  "最近讓你會心一笑的一件小事是什麼？",
  "什麼樣的小確幸最能滿足你？",
  "哪一個日常畫面讓你覺得歲月靜好？",
  "最近一次「剛剛好」的體驗是什麼？",
  "你覺得最奢侈的享受是什麼？",
  "哪一種聲音會讓你放鬆？",
  "最近哪個瞬間你想按下暫停鍵？",
  "什麼樣的天氣配什麼事，最療癒？",
  "你最近收到最棒的一個小禮物是什麼？",
  "哪個地方是你的秘密放鬆基地？",
  "最近讓你嘴角上揚的一則訊息是什麼？",
  "你覺得最幸福的味道是什麼？",
  "什麼樣的夜晚最讓你安心？",
  "最近哪件事讓你覺得「活著真好」？",
  "你會為了什麼小事特地慶祝？",
  "你心中「完美的一杯飲料」是什麼？",
  "哪一種光線最讓你覺得溫暖？",
  "最近讓你充滿電的一個休息是什麼？",
  "你最珍惜的一段獨處時光是什麼樣子？",
  "如果明天放假，你最想一起做什麼？",
  "你希望我們之間多做哪一件事？",
  "你想和大家一起養成哪個習慣？",
  "我們一起最想完成的目標是什麼？",
  "你希望我們的假日長什麼樣子？",
  "有沒有一個地方想帶大家一起去？",
  "你希望我們吵架時怎麼收尾？",
  "我們之間有什麼默契你很喜歡？",
  "你想和我們一起學會什麼？",
  "未來你希望我們的家是什麼氛圍？",
  "有沒有一個一起的小夢想想實現？",
  "你希望多久一次專屬相處時間？",
  "我們一起做過最開心的一件事是什麼？",
  "你希望我們更常聊什麼話題？",
  "有沒有什麼想一起挑戰的事？",
  "你希望我們的關係一年後長什麼樣子？",
  "你最想跟大家一起慶祝什麼？",
  "我們可以一起改掉的一個壞習慣是什麼？",
  "你希望我們之間永遠保有什麼？",
  "有沒有一句話想常常對彼此說？",
  "你最近睡得好嗎？都幾點睡？",
  "累的時候你最想做什麼放空？",
  "什麼運動或活動最能幫你紓壓？",
  "你理想的休息一天會怎麼安排？",
  "有沒有一個地方去了就能放鬆？",
  "你怎麼照顧自己的心情？",
  "最近有沒有好好喘口氣？",
  "你紓壓的小秘方是什麼？",
  "泡澡、散步還是耍廢，你選哪個？",
  "你最近想對身體說什麼？",
  "什麼樣的音樂能讓你放鬆？",
  "你會怎麼獎勵努力的自己？",
  "最近一次真正放空是什麼時候？",
  "你希望一週有幾天完全屬於自己？",
  "什麼樣的環境最能讓你靜下來？",
  "你有沒有固定的放鬆儀式？",
  "忙碌時你會怎麼提醒自己休息？",
  "你最想去做一次的療癒體驗是什麼？",
  "最近哪件事幫你充飽電？",
  "你覺得自己需要多一點什麼樣的休息？",
  "你比較喜歡早起還是熬夜？為什麼？",
  "你比較喜歡山還是海？為什麼？",
  "你比較喜歡咖啡還是茶？為什麼？",
  "你比較喜歡甜還是鹹？為什麼？",
  "你比較喜歡貓還是狗？為什麼？",
  "你比較喜歡電影院還是在家追劇？為什麼？",
  "你比較喜歡夏天還是冬天？為什麼？",
  "你比較喜歡城市還是鄉村？為什麼？",
  "你比較喜歡計畫還是隨性？為什麼？",
  "你比較喜歡熱鬧還是安靜？為什麼？",
  "你比較喜歡紙本書還是電子書？為什麼？",
  "你比較喜歡旅行還是宅在家？為什麼？",
  "你比較喜歡存錢還是體驗？為什麼？",
  "你比較喜歡早餐還是消夜？為什麼？",
  "你比較喜歡聽音樂還是看風景？為什麼？",
  "你比較喜歡下廚還是外食？為什麼？",
  "你比較喜歡運動還是躺平？為什麼？",
  "你比較喜歡打電話還是傳訊息？為什麼？",
  "你比較喜歡驚喜還是計畫好的驚喜？為什麼？",
  "你比較喜歡先苦後甜還是先甜後苦？為什麼？",
  "你比較喜歡獨處還是有人陪？為什麼？",
  "你比較喜歡大城市還是小鎮？為什麼？",
  "你比較喜歡春天還是秋天？為什麼？",
  "你比較喜歡巧克力還是水果？為什麼？",
  "你比較喜歡看日出還是看日落？為什麼？",
  "你比較喜歡火鍋還是燒烤？為什麼？",
  "你比較喜歡開車還是搭車？為什麼？",
  "你比較喜歡拍照還是用心記住？為什麼？",
  "你比較喜歡先做難的還是先做簡單的？為什麼？",
  "你比較喜歡整潔還是隨性一點？為什麼？",
  "你比較喜歡計較細節還是看大方向？為什麼？",
  "你比較喜歡面對面還是文字訊息？為什麼？",
  "最近一次大笑是什麼時候？當時發生了什麼？",
  "最近一次感動到想哭是什麼時候？當時發生了什麼？",
  "最近一次做一件新鮮事是什麼時候？當時發生了什麼？",
  "最近一次對別人說謝謝是什麼時候？當時發生了什麼？",
  "最近一次一個人看電影是什麼時候？當時發生了什麼？",
  "最近一次早睡是什麼時候？當時發生了什麼？",
  "最近一次放空一整天是什麼時候？當時發生了什麼？",
  "最近一次完成一個目標是什麼時候？當時發生了什麼？",
  "最近一次嘗試新食物是什麼時候？當時發生了什麼？",
  "最近一次運動到流汗是什麼時候？當時發生了什麼？",
  "最近一次收到驚喜是什麼時候？當時發生了什麼？",
  "最近一次主動關心別人是什麼時候？當時發生了什麼？",
  "最近一次為自己買一份禮物是什麼時候？當時發生了什麼？",
  "最近一次熬夜到很晚是什麼時候？當時發生了什麼？",
  "最近一次徹底放鬆是什麼時候？當時發生了什麼？",
  "最近一次被誇獎是什麼時候？當時發生了什麼？",
  "最近一次幫助陌生人是什麼時候？當時發生了什麼？",
  "最近一次改變主意是什麼時候？當時發生了什麼？",
  "最近一次原諒一個人是什麼時候？當時發生了什麼？",
  "最近一次覺得很驕傲是什麼時候？當時發生了什麼？",
  "最近一次睡到自然醒是什麼時候？當時發生了什麼？",
  "最近一次看一本書是什麼時候？當時發生了什麼？",
  "最近一次寫下心情是什麼時候？當時發生了什麼？",
  "最近一次和老朋友聯絡是什麼時候？當時發生了什麼？",
  "最近一次做白日夢是什麼時候？當時發生了什麼？",
  "你心中最勇敢的一件事是什麼？",
  "你心中最想珍惜的關係是什麼？",
  "你心中最想去的地方是什麼？",
  "你心中最想學的技能是什麼？",
  "你心中最想改掉的習慣是什麼？",
  "你心中最療癒的一句話是什麼？",
  "你心中最喜歡的自己是什麼？",
  "你心中最難忘的一餐是什麼？",
  "你心中最想重來的決定是什麼？",
  "你心中最想感謝的人是什麼？",
  "你心中最喜歡的獨處方式是什麼？",
  "你心中最想完成的夢想是什麼？",
  "你心中最放鬆的時刻是什麼？",
  "你心中最想收到的禮物是什麼？",
  "你心中最珍惜的回憶是什麼？",
  "你心中最想擁有的特質是什麼？",
  "你心中最喜歡的季節活動是什麼？",
  "你心中最想對家人說的話是什麼？",
  "你心中最想突破的極限是什麼？",
  "你心中最喜歡的生活步調是什麼？",
  "你理想中的工作是什麼樣子？",
  "工作中最有成就感的一刻是什麼？",
  "如果不做現在的事，你想做什麼？",
  "你怎麼平衡工作和生活？",
  "職場上最想擁有的能力是什麼？",
  "你遇過最好的合作夥伴是什麼樣的人？",
  "你怎麼面對工作上的挫折？",
  "理想的下班後生活是什麼樣子？",
  "你希望退休後每天做什麼？",
  "工作讓你學到最重要的一課是什麼？",
  "你比較喜歡團隊還是獨立作業？",
  "如果能創業，你想做哪一行？",
  "最近工作上有什麼小突破？",
  "你怎麼決定該不該離開一份工作？",
  "你心中「有意義的工作」是什麼樣子？",
  "如果多了一筆意外之財，你會怎麼用？",
  "你覺得花錢在什麼上最值得？",
  "你是儲蓄派還是享受派？",
  "最近一次覺得「這錢花得真好」是買了什麼？",
  "你心中的理想生活需要多少錢？",
  "你會為了體驗花大錢嗎？",
  "最想投資在自己身上的哪件事？",
  "你有沒有一直想買卻捨不得的東西？",
  "你覺得最划算的一次消費是什麼？",
  "如果每月多一萬可自由花，你會怎麼用？",
  "你怎麼看待「省」與「花」的平衡？",
  "最想送給家人的一份禮物是什麼？",
  "你最喜歡怎麼過生日？",
  "過年對你來說最重要的是什麼？",
  "你希望節日多一點什麼樣的儀式感？",
  "最想和大家一起過的一個節日是哪個？",
  "你有沒有專屬於自己的小節日？",
  "跨年你想怎麼度過？",
  "哪個季節最有「換季」的儀式感？",
  "你最喜歡的一個節日回憶是什麼？",
  "收禮物和送禮物，你更喜歡哪個？",
  "你想在哪個節日發起一個新傳統？",
  "秋天到了你最想做什麼？",
  "夏天你最期待什麼？",
  "你最喜歡的動物是什麼？為什麼？",
  "如果養寵物，你想取什麼名字？",
  "你覺得自己個性像哪種動物？",
  "最想擁有的一種寵物是什麼？",
  "你和動物有過最療癒的一次互動是什麼？",
  "如果能聽懂一種動物說話，你選哪種？",
  "你覺得貓派還是狗派更適合你？",
  "最想去一次的動物相關景點是哪裡？",
  "有沒有一隻動物讓你印象深刻？",
  "你最離不開的一個 App 是什麼？",
  "如果一天不能用手機，你會做什麼？",
  "最近讓你驚豔的一個科技是什麼？",
  "你最常用手機做什麼？",
  "你希望未來有什麼科技出現？",
  "社群軟體對你來說是加分還是負擔？",
  "你手機相簿裡最多的是什麼照片？",
  "最近收藏了什麼影片或貼文？",
  "你會想過「數位排毒」的生活嗎？",
  "如果幫我們的房間取一個新名字，你會取什麼？",
  "如果為今天配一首主題曲，你選哪首？",
  "如果你的人生是一本書，這一章的標題是什麼？",
  "如果能設計一個假日，你想過什麼節？",
  "如果能發明一樣東西解決生活麻煩，你想發明什麼？",
  "如果用一種顏色形容最近的心情，是什麼色？",
  "如果能畫一幅畫送給某人，你想畫什麼？",
  "如果能開一間夢想小店，會賣什麼？",
  "如果幫自己設計一個吉祥物，會長什麼樣子？",
  "如果能寫一封信給十年後的自己，你會寫什麼？",
  "你最欣賞房間裡每位成員的哪個特點？",
  "最近最想感謝房間裡的誰、為什麼？",
  "你想更了解大家的哪一面？",
  "和大家相處最讓你安心的是什麼？",
  "你覺得大家最了解你的哪一點？",
  "有沒有想對某位成員說卻還沒說的話？",
  "大家一起做過最好笑的事是什麼？",
  "你希望和大家多創造哪種回憶？",
  "你覺得這個房間最珍貴的是什麼？",
  "如果要用一句話形容大家，你會說什麼？",
  "你最想和誰單獨聊聊？",
  "大家哪個習慣讓你覺得很溫暖？",
  "如果只能用一個詞形容最近的生活，你會選哪個詞？",
  "如果只能用一個詞形容今天的心情，你會選哪個詞？",
  "如果只能用一個詞形容理想的自己，你會選哪個詞？",
  "如果只能用一個詞形容這一年，你會選哪個詞？",
  "如果只能用一個詞形容你的個性，你會選哪個詞？",
  "如果只能用一個詞形容週末，你會選哪個詞？",
  "如果只能用一個詞形容工作，你會選哪個詞？",
  "如果只能用一個詞形容愛情，你會選哪個詞？",
  "如果只能用一個詞形容家，你會選哪個詞？",
  "如果只能用一個詞形容你的房間，你會選哪個詞？",
  "如果只能用一個詞形容你的朋友圈，你會選哪個詞？",
  "如果只能用一個詞形容現在的狀態，你會選哪個詞？",
  "如果只能用一個詞形容去年的自己，你會選哪個詞？",
  "如果只能用一個詞形容明年的期待，你會選哪個詞？",
  "如果只能用一個詞形容你的童年，你會選哪個詞？",
  "如果只能用一個詞形容你最好的朋友，你會選哪個詞？",
  "關於「對快樂的定義」，你小時候和現在有什麼不同？",
  "關於「最想要的東西」，你小時候和現在有什麼不同？",
  "關於「害怕的事」，你小時候和現在有什麼不同？",
  "關於「週末的過法」，你小時候和現在有什麼不同？",
  "關於「對未來的想像」，你小時候和現在有什麼不同？",
  "關於「理想的工作」，你小時候和現在有什麼不同？",
  "關於「最喜歡的食物」，你小時候和現在有什麼不同？",
  "關於「交朋友的方式」，你小時候和現在有什麼不同？",
  "關於「面對壓力的方法」，你小時候和現在有什麼不同？",
  "關於「對錢的看法」，你小時候和現在有什麼不同？",
  "如果我們的房間能一起去旅行，你最想去哪？",
  "如果我們一起訂一個年度目標，你想訂什麼？",
  "如果我們每週固定做一件事，你希望是什麼？",
  "如果我們一起養成一個好習慣，你選哪個？",
  "如果我們一起完成一個挑戰，你想挑戰什麼？",
  "如果我們辦一場聚會，你想辦什麼主題？",
  "如果我們一起學一樣新東西，你想學什麼？",
  "如果我們一起做一本紀念冊，你想放什麼？",
  "最近讓你循環播放的一首歌是什麼？",
  "有沒有一部電影改變了你的想法？",
  "最近讀到最有感的一句話是什麼？",
  "哪一首歌最能代表你的青春？",
  "你的「人生電影」是哪一部？",
  "最想推薦給大家的一本書或影集是什麼？",
  "哪一種類型的音樂最貼近你？",
  "有沒有一部作品你希望能重新體驗第一次看的感覺？",
  "最近的歌單長什麼風格？",
  "哪一句歌詞說中了你的心事？",
  "你最喜歡的一種天氣聲音是什麼？",
  "哪一種觸感讓你覺得舒服？",
  "什麼香味會讓你放鬆下來？",
  "你最喜歡的一種光線是什麼樣子？",
  "哪一種味道代表「家」？",
  "什麼樣的溫度最讓你自在？",
  "你最愛的一種身體放鬆是什麼？",
  "哪一個瞬間的畫面你想一直記得？",
  "什麼樣的聲音會讓你想睡？",
  "你覺得幸福是一種狀態還是選擇？",
  "人生如果重來，你最想改哪一段？",
  "你相信「一切都是最好的安排」嗎？",
  "你覺得遺憾也是一種美嗎？",
  "你怎麼看待變老這件事？",
  "你希望人生的下半場長什麼樣子？",
  "你覺得最難的一種勇氣是什麼？",
  "你如何跟過去的自己和解？",
  "你覺得什麼東西是錢買不到的？",
  "你希望人生被什麼填滿？",
  "你比較喜歡先享受再努力還是先努力再享受？",
  "你比較喜歡被需要還是被理解？",
  "你比較喜歡很多朋友還是幾個知己？",
  "你比較喜歡穩定還是自由？",
  "你比較喜歡計畫旅行還是隨機旅行？",
  "你比較喜歡陽光還是雨天？",
  "你比較喜歡早午餐還是消夜？",
  "你比較喜歡看書還是看劇？",
  "你比較喜歡大笑還是被感動？",
  "你比較喜歡回憶過去還是期待未來？",
  "你比較喜歡動手做還是動腦想？",
  "你比較喜歡被稱讚努力還是被稱讚聰明？",
  "你比較喜歡熱鬧的節日還是安靜的假期？",
  "你比較喜歡驚喜派對還是兩人晚餐？",
  "你比較喜歡城市夜景還是鄉間星空？",
  "你比較喜歡有計畫的人生還是隨遇而安？",
  "你比較喜歡多睡一小時還是多玩一小時？",
  "你比較喜歡下廚給人吃還是被下廚招待？",
  "你比較喜歡寫日記還是拍照記錄？",
  "你比較喜歡先聽建議還是先靠直覺？",
  "最近一次感到平靜是什麼時候？",
  "最近一次覺得被在乎是什麼時候？",
  "最近一次做了不後悔的決定是什麼時候？",
  "最近一次突破自己是什麼時候？",
  "最近一次對自己溫柔是什麼時候？",
  "最近一次真心稱讚別人是什麼時候？",
  "最近一次覺得世界很美是什麼時候？",
  "最近一次為別人改變計畫是什麼時候？",
  "最近一次放下一件事是什麼時候？",
  "最近一次得到意外的溫暖是什麼時候？",
  "最近一次感到期待是什麼時候？",
  "最近一次逼自己一把是什麼時候？",
  "最近一次完全不看手機是什麼時候？",
  "最近一次主動道歉是什麼時候？",
  "最近一次覺得努力有回報是什麼時候？",
  "你最想再見一次的人是什麼？",
  "你最想收藏的一個瞬間是什麼？",
  "你最想學會的一句外語是什麼？",
  "你最想養成的早晨習慣是什麼？",
  "你最想一起變老的相處方式是什麼？",
  "你最喜歡的獨處地點是什麼？",
  "你最想完成的旅行是什麼？",
  "你最想對自己說的一句話是什麼？",
  "你最珍惜的一份友情是什麼？",
  "你最想擁有的生活節奏是什麼？",
  "你最喜歡的放鬆音樂類型是什麼？",
  "你最想重溫的一段時光是什麼？",
  "你最想給家人的驚喜是什麼？",
  "你最想突破的一個恐懼是什麼？",
  "你最喜歡的一種天氣是什麼？",
  "你最想留下的一個習慣是什麼？",
  "有沒有一句話你一直想說卻沒說出口？",
  "你希望別人怎麼跟你溝通壞消息？",
  "你比較能接受直說還是委婉？",
  "你怎麼表達「我需要空間」？",
  "吵架時你最在意對方的什麼反應？",
  "你希望被誤會時對方怎麼做？",
  "你最想被問到的一個問題是什麼？",
  "有什麼話題你其實很想聊卻很少提？",
  "你怎麼讓別人知道你在生氣？",
  "你比較容易說「對不起」還是「謝謝」？",
  "你希望道歉時聽到什麼？",
  "有沒有一個秘密你願意今天分享？",
  "你做過最糗的一件事是什麼？",
  "最近讓你笑到肚子痛的一件事是什麼？",
  "你最會模仿誰或什麼？",
  "有沒有一個只有你覺得好笑的梗？",
  "你最擅長的冷笑話是什麼？",
  "小時候做過最蠢的一件事是什麼？",
  "最近一次尷尬到想鑽地洞是什麼時候？",
  "你有什麼奇怪但很得意的技能？",
  "你笑點在哪？什麼最容易逗笑你？",
  "你最近做過印象最深的夢是什麼？",
  "你會做重複的夢嗎？夢到什麼？",
  "你最想夢見誰？",
  "你發呆時最常想什麼？",
  "你腦中有沒有一段常重播的畫面？",
  "你睡前最常出現的念頭是什麼？",
  "有沒有一件事你希望當時更勇敢一點？",
  "你最想彌補的一件事是什麼？",
  "有沒有一個人你想好好道別？",
  "你如何跟遺憾共處？",
  "有沒有一句「早知道」你常想起？",
  "你最想收回的一句話是什麼？",
  "最近一次被陌生人的善意打動是什麼？",
  "哪一個瞬間你差點掉淚？",
  "誰為你做過最感動的一件事？",
  "有沒有一封訊息你捨不得刪？",
  "什麼樣的付出最讓你動容？",
  "哪一次的重逢讓你印象深刻？",
  "最近想搞懂的一件事是什麼？",
  "如果重回學生時代，你想認真學什麼？",
  "你最想擁有的一個冷知識領域是什麼？",
  "有沒有一項技能你偷偷想學很久了？",
  "你最近學會的新東西是什麼？",
  "你想向誰拜師學藝？",
  "你怎麼定義「真朋友」？",
  "最想約出來見面的老朋友是誰？",
  "你和好朋友最常一起做什麼？",
  "你交朋友最看重什麼？",
  "有沒有一段友情你很想修復？",
  "朋友低潮時你會怎麼陪？",
  "你最想和家人一起完成的一件事是什麼？",
  "家裡誰最懂你？",
  "你最想傳承的家庭味道是什麼？",
  "家人教過你最重要的一句話是什麼？",
  "你希望多陪家人做什麼？",
  "小時候家裡的哪個傳統你最愛？",
  "你最近有沒有好好吃飯？",
  "你怎麼在忙碌中對自己好一點？",
  "低潮時你會用什麼安慰自己？",
  "你會怎麼慶祝一個小小的努力？",
  "你最需要別人提醒你做什麼？",
  "你照顧情緒的第一步通常是什麼？",
  "你希望我們每天固定做哪件小事？",
  "有沒有一個一起的小默契你很珍惜？",
  "你想和大家一起看的一部電影是什麼？",
  "你希望我們一起吃的第一餐是什麼？",
  "你想和大家一起拍什麼樣的照片？",
  "你希望我們一起聽的歌單是什麼風格？",
  "你想像中五年後的一個平凡週末是什麼樣？",
  "你希望未來的自己還保有現在的什麼？",
  "你想在哪個城市擁有一個家？",
  "你希望未來每年固定做哪件事？",
  "你想在幾歲完成哪個夢想？",
  "你希望老了以後和誰住在附近？",
  "你會怎麼安慰難過的朋友？",
  "你會怎麼度過一個完全自由的假日？",
  "你會怎麼慶祝重要的日子？",
  "你會怎麼面對突如其來的改變？",
  "你會怎麼對喜歡的人表達心意？",
  "你會怎麼處理和家人的意見不合？",
  "你會怎麼重新振作？",
  "你會怎麼跟壓力共處？",
  "你會怎麼說再見？",
  "什麼樣的擁抱對你來說最療癒？",
  "什麼樣的一句話對你來說最安慰你？",
  "什麼樣的陪伴對你來說最讓你安心？",
  "什麼樣的早晨對你來說最完美？",
  "什麼樣的夜晚對你來說最放鬆？",
  "什麼樣的禮物對你來說最窩心？",
  "什麼樣的旅行對你來說最難忘？",
  "什麼樣的朋友對你來說最自在？",
  "什麼樣的生活對你來說最理想？",
  "什麼樣的休息對你來說最充電？",
  "什麼樣的驚喜對你來說最感動？",
  "什麼樣的約會對你來說最開心？",
  "什麼樣的風景對你來說最震撼？",
  "什麼樣的味道對你來說最懷念？",
  "什麼樣的聲音對你來說最安心？",
  "描述一下你理想中的週末。",
  "描述一下你理想中的早晨。",
  "描述一下你理想中的晚餐。",
  "描述一下你理想中的旅行。",
  "描述一下你理想中的家。",
  "描述一下你理想中的工作。",
  "描述一下你理想中的休息日。",
  "描述一下你理想中的約會。",
  "描述一下你理想中的生活步調。",
  "描述一下你理想中的夜晚。",
  "描述一下你理想中的假期。",
  "描述一下你理想中的下午。",
  "你比較喜歡被記得努力還是被記得溫柔？",
  "你比較喜歡一次長假還是多次短假？",
  "你比較喜歡熟悉的路還是沒走過的路？",
  "你比較喜歡經典重溫還是嘗鮮？",
  "你比較喜歡計畫好的浪漫還是突如其來的浪漫？",
  "你比較喜歡熱食還是冷食？",
  "你比較喜歡清晨的海還是傍晚的山？",
  "你比較喜歡一起耍廢還是一起冒險？",
  "你比較喜歡寫下來還是說出來？",
  "你比較喜歡被照顧還是照顧人？",
  "你比較喜歡先報喜還是先報憂？",
  "你比較喜歡大自然還是城市？",
  "你比較喜歡預留驚喜還是提前知道？",
  "你比較喜歡慢慢來還是趁熱打鐵？",
  "你比較喜歡少而精還是多而廣？",
  "你比較喜歡紀念日大慶祝還是平常小驚喜？",
  "你比較喜歡旅行拍很多照還是旅行好好體驗？",
  "你比較喜歡固定行程還是隨心所欲？",
  "最近一次為某人下廚是什麼時候？",
  "最近一次收到手寫的字是什麼時候？",
  "最近一次覺得被療癒是什麼時候？",
  "最近一次主動聯絡老朋友是什麼時候？",
  "最近一次好好睡一覺是什麼時候？",
  "最近一次逛街不趕時間是什麼時候？",
  "最近一次看星星或月亮是什麼時候？",
  "最近一次靜靜發呆是什麼時候？",
  "最近一次對生活充滿期待是什麼時候？",
  "最近一次被自己感動是什麼時候？",
  "最近一次做了很有勇氣的決定是什麼時候？",
  "最近一次放慢腳步是什麼時候？",
  "你最想收藏的一句話是什麼？",
  "你最想再吃一次的家常味是什麼？",
  "你最想一起去的秘密景點是什麼？",
  "你最想保留的一個小習慣是什麼？",
  "你最喜歡的一種安靜是什麼？",
  "你最想學會的一道菜是什麼？",
  "你最想重溫的一部作品是什麼？",
  "你最想對十年後說的話是什麼？",
  "你最珍惜的一個平凡日子是什麼？",
  "你最想擁有的一種從容是什麼？",
  "你最喜歡的一段旋律是什麼？",
  "你最想完成的一個小心願是什麼？"
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
async function addTransaction(type, title, amount, category, note = "", date = null, paymentCategory = "cash", paymentMethod = "現金", split = null) {
  const payload = { book_id: activeBookId, user_id: session.user.id, transaction_type: type, category, title, amount: Number(amount), transaction_date: date || localDateStr(), note, payment_category: paymentCategory, payment_method: paymentMethod };
  if (split) Object.assign(payload, split);
  const { error } = await supabaseClient.from("transactions").insert(payload);
  if (error) throw error;
}

function safeBottomPx() {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--safe-bottom").trim();
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}
function resetChatComposerBaseline() {
  const wrap = $("#chatComposerWrap");
  if (!wrap) return;
  const safeBottom = safeBottomPx();
  wrap.style.bottom = `${88 + safeBottom}px`;
  const tray = $("#stickerTray");
  if (tray) tray.style.bottom = `${158 + safeBottom}px`;
  positionScrollToLatestBtn();
}
function positionScrollToLatestBtn() {
  const wrap = $("#chatComposerWrap"), btn = $("#scrollToLatestBtn");
  if (!wrap || !btn) return;
  requestAnimationFrame(() => {
    const rect = wrap.getBoundingClientRect();
    btn.style.bottom = `${Math.max(8, window.innerHeight - rect.top + 12)}px`;
  });
}
function taiwanToday() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en", { timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date()).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}
const weekdayNames = ["日", "一", "二", "三", "四", "五", "六"];
function formatDateDisplay(dateStr) {
  if (!dateStr) return "選擇日期";
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "選擇日期";
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${weekdayNames[d.getDay()]}）`;
}
function setDateValue(inputId, displayId, dateStr) {
  const input = $("#" + inputId), display = $("#" + displayId);
  if (input) input.value = dateStr;
  if (display) display.textContent = formatDateDisplay(dateStr);
}
$$('input[type="date"]').forEach((input) => {
  const display = $("#" + input.id + "Display");
  if (!display) return;
  input.addEventListener("input", () => { display.textContent = formatDateDisplay(input.value); });
  input.addEventListener("change", () => { display.textContent = formatDateDisplay(input.value); });
});
const categorySynonyms = { "餐飲": ["餐飲", "飲食", "伙食", "吃飯", "食物", "餐費", "三餐"], "交通": ["交通", "車費", "通勤", "交通費"], "休閒育樂": ["休閒育樂", "娛樂", "休閒", "育樂", "玩樂"], "住房": ["住房", "居住", "房租", "住宿", "居家"], "水電瓦斯": ["水電瓦斯", "水電", "帳單", "生活費", "水電費"], "醫療保健": ["醫療保健", "醫療", "健康", "保健"], "寵物": ["寵物", "毛小孩", "貓咪", "狗狗"], "服飾": ["服飾", "治裝", "衣著", "衣服"], "日常用品": ["日常用品", "生活用品", "雜貨", "日用品", "家用"], "美妝": ["美妝", "美容", "保養"], "教育": ["教育", "學習", "進修", "書籍"], "薪水": ["薪水", "薪資", "工資", "月薪"], "獎金": ["獎金", "分紅", "年終"], "退款": ["退款", "退費"], "投資": ["投資", "理財", "股票", "股息"], "紅包": ["紅包", "禮金"] };
function resolveUserCategory(canonical, names) {
  if (names.includes(canonical)) return canonical;
  const syns = categorySynonyms[canonical] || [];
  return syns.find((sy) => names.includes(sy)) || null;
}
function guessCategoryFromHistory(text, income) {
  if (!text || !text.trim()) return null;
  const wantType = income ? "income" : "expense";
  const t = text.trim();
  const counts = {};
  transactions.forEach((x) => {
    if (x.transaction_type !== wantType || !x.category || !x.title) return;
    const pt = String(x.title).trim(); if (pt.length < 2) return;
    let match = t.includes(pt) || pt.includes(t);
    if (!match) { for (let i = 0; i < pt.length - 1; i++) { const g = pt.slice(i, i + 2); if (/[\u4e00-\u9fa5A-Za-z0-9]{2}/.test(g) && t.includes(g)) { match = true; break; } } }
    if (match) counts[x.category] = (counts[x.category] || 0) + 1;
  });
  const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return best ? best[0] : null;
}
function parseConversationalRecord(input) {
  const text = String(input || "").trim();
  if (!text) throw new Error("請先說或輸入一筆紀錄");
  const today = taiwanToday();
  let date = today;
  let cleaned = " " + text.replace(/[,，]/g, "") + " ";

  // ---- 日期：相對詞 / N天前 / 完整或短日期（避開 7-11 這類假日期）----
  let dateDone = false;
  const rel = { "今天": 0, "今日": 0, "昨天": 1, "昨日": 1, "前天": 2, "大前天": 3 };
  for (const w in rel) { if (cleaned.includes(w)) { const d = new Date(today + "T00:00:00"); d.setDate(d.getDate() - rel[w]); date = localDateStr(d); cleaned = cleaned.replace(w, " "); dateDone = true; break; } }
  if (!dateDone) { const nd = cleaned.match(/(\d{1,2})\s*天前/); if (nd) { const d = new Date(today + "T00:00:00"); d.setDate(d.getDate() - Number(nd[1])); date = localDateStr(d); cleaned = cleaned.replace(nd[0], " "); dateDone = true; } }
  if (!dateDone) {
    const fd = cleaned.match(/(20\d{2})[年\/-](\d{1,2})[月\/-](\d{1,2})日?/);
    const cn = cleaned.match(/(\d{1,2})\s*月\s*(\d{1,2})\s*日?/);
    const sl = cleaned.match(/(?:^|\s)(\d{1,2})\/(\d{1,2})(?!\d)/);
    if (fd) { date = `${fd[1]}-${pad2(fd[2])}-${pad2(fd[3])}`; cleaned = cleaned.replace(fd[0], " "); }
    else if (cn) { date = `${today.slice(0, 4)}-${pad2(cn[1])}-${pad2(cn[2])}`; cleaned = cleaned.replace(cn[0], " "); }
    else if (sl) { date = `${today.slice(0, 4)}-${pad2(sl[1])}-${pad2(sl[2])}`; cleaned = cleaned.replace(sl[0], " "); }
  }

  // ---- 金額：優先錢符號；否則排除數量詞與黏在文字裡的門市數字後取最合理者 ----
  let amount = null;
  const marked = [...cleaned.matchAll(/\$\s*(\d+(?:\.\d+)?)|nt\$?\s*(\d+(?:\.\d+)?)|(\d+(?:\.\d+)?)\s*(?:元|塊|円|圓)/gi)];
  if (marked.length) { const m = marked[marked.length - 1]; amount = Number(m[1] || m[2] || m[3]); cleaned = cleaned.replace(m[0], " "); }
  else {
    const cand = []; const re = /\d+(?:\.\d+)?/g; let mm;
    while ((mm = re.exec(cleaned)) !== null) {
      const raw = mm[0], idx = mm.index;
      const after = cleaned.slice(idx + raw.length, idx + raw.length + 1);
      const before = cleaned.slice(Math.max(0, idx - 1), idx);
      if (/[個支杯份張包瓶罐碗盒條雙件台人位樓折%％次顆本盤袋根束打箱]/.test(after)) continue;
      if (/[\u4e00-\u9fa5A-Za-z]/.test(after) || /[\u4e00-\u9fa5A-Za-z]/.test(before)) continue;
      cand.push({ n: Number(raw), raw, idx });
    }
    if (cand.length) { cand.sort((a, b) => b.n - a.n || b.idx - a.idx); const c = cand[0]; amount = c.n; cleaned = cleaned.slice(0, c.idx) + " " + cleaned.slice(c.idx + c.raw.length); }
    else { const any = cleaned.match(/\d+(?:\.\d+)?/); if (any) { amount = Number(any[0]); cleaned = cleaned.replace(any[0], " "); } }
  }
  if (!(amount > 0)) throw new Error("找不到金額，例如：早餐 85 現金");

  const income = /(收入|薪水|薪資|工資|獎金|年終|退款|退費|入帳|中獎|紅包|禮金|利息|股息|股利|分紅)/.test(cleaned);
  const type = income ? "income" : "expense";

  // ---- 帳戶 ----
  let paymentCategory = null, paymentMethod = null;
  for (const cat of baseCategories) {
    const subs = mySubAccounts(cat.key);
    const hit = subs.find((sa) => sa.name !== cat.label && cleaned.includes(sa.name));
    if (hit) { paymentCategory = cat.key; paymentMethod = hit.name; cleaned = cleaned.replace(hit.name, " "); break; }
  }
  if (!paymentCategory) {
    const rules = [{ w: /信用卡|刷卡|刷|信用/, k: "credit_card" }, { w: /銀行|轉帳|匯款|存款|帳戶|提款|atm/i, k: "bank" }, { w: /line\s*pay|linepay|街口|電子支付|悠遊付|一卡通|icash|apple\s*pay|google\s*pay|悠遊卡|載具|行動支付|支付寶|台灣pay/i, k: "ewallet" }, { w: /現金|付現|零錢|錢包|皮夾/, k: "cash" }];
    const r = rules.find((x) => x.w.test(cleaned));
    paymentCategory = r?.k || "cash";
    if (r) cleaned = cleaned.replace(r.w, " ");
    paymentMethod = mySubAccounts(paymentCategory)[0]?.name || baseCategories.find((c) => c.key === paymentCategory)?.label || "現金";
  }
  cleaned = cleaned.replace(/(收入|支出|記帳|記一筆|一筆|花了|付了|付|買了|買|領了|領|賺了|賺|花)/g, " ").replace(/\$|＄|nt\$?|元|塊|円|圓/gi, " ").replace(/\s+/g, " ").trim();

  // ---- 分類：① 你的分類名稱命中 → ② 依你過往習慣 → ③ 關鍵字(含同義詞) → ④ 保底 ----
  const myNames = income ? activeIncomeCategories().map((c) => c.name) : activeCategories().map((c) => c.name);
  let category = [...myNames].sort((a, b) => b.length - a.length).find((name) => name.length >= 2 && cleaned.includes(name));
  if (!category) { const h = guessCategoryFromHistory(cleaned, income); if (h && myNames.includes(h)) category = h; }
  if (!category) {
    const eRules = [{ re: /早餐|午餐|晚餐|宵夜|消夜|下午茶|餐|便當|咖啡|飲料|珍奶|奶茶|手搖|茶|飲品|小吃|零食|吃|喝|麥當勞|星巴克|超商|超市|全聯|全家|7-?11|蛋糕|麵包|火鍋|拉麵|壽司|鹹酥雞|滷味|早午餐/i, cat: "餐飲" }, { re: /捷運|公車|計程車|加油|油錢|停車|高鐵|台鐵|火車|uber|車票|機票|運費|過路費|悠遊卡加值|停車費/i, cat: "交通" }, { re: /電影|遊戲|唱歌|娛樂|ktv|旅遊|旅行|門票|訂閱|netflix|spotify|展覽|演唱會|按摩/i, cat: "休閒育樂" }, { re: /房租|租金|房貸|管理費|修繕/, cat: "住房" }, { re: /水費|電費|瓦斯|網路費|電話費|手機費|帳單|第四台/, cat: "水電瓦斯" }, { re: /醫院|看醫生|診所|藥局|藥|健保|掛號|牙醫|眼科|疫苗/, cat: "醫療保健" }, { re: /寵物|貓|狗|飼料|罐罐|貓砂|寵物醫院|逛街/, cat: "寵物" }, { re: /衣服|鞋|服飾|褲|外套|包包|飾品|帽/, cat: "服飾" }, { re: /日常用品|衛生紙|清潔|洗髮|沐浴|生活用品|五金|家用|洗衣|電池|燈泡/, cat: "日常用品" }, { re: /化妝|保養|美容|美髮|剪髮|指甲|睫毛|保養品/, cat: "美妝" }, { re: /書|文具|課程|補習|學費|教材|訂閱課/, cat: "教育" }];
    const iRules = [{ re: /薪水|薪資|工資|月薪/, cat: "薪水" }, { re: /獎金|年終|分紅|紅利/, cat: "獎金" }, { re: /退款|退費/, cat: "退款" }, { re: /投資|股息|股利|利息|配息|賣股/, cat: "投資" }, { re: /紅包|禮金/, cat: "紅包" }];
    const guess = (income ? iRules : eRules).find((rule) => rule.re.test(cleaned))?.cat;
    if (guess) category = resolveUserCategory(guess, myNames);
  }
  if (!category) category = myNames.includes("其他") ? "其他" : myNames[myNames.length - 1];

  const title = cleaned.replace(/\s+/g, " ").trim() || category;
  return { type, title, amount, category, date, paymentCategory, paymentMethod };
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
  $("#addPageArt").src = type === "expense" ? "assets/bear-expense.png" : "assets/bear-income.png";
  $("#categoryInput").innerHTML = (type === "expense" ? activeCategories() : activeIncomeCategories()).map((c) => `<option>${escapeHTML(c.name)}</option>`).join("");
  renderSplitSection();
}
$("#typeSwitch").addEventListener("click", (e) => { const btn = e.target.closest("[data-type]"); if (btn) setAddType(btn.dataset.type); });
async function updateTransaction(id, type, title, amount, category, note, date, paymentCategory, paymentMethod, split = null) {
  const payload = { transaction_type: type, title, amount: Number(amount), category, note, transaction_date: date, payment_category: paymentCategory, payment_method: paymentMethod };
  if (split) Object.assign(payload, split);
  const { error } = await supabaseClient.from("transactions").update(payload).eq("id", id);
  if (error) throw error;
}
let splitMode = "private";
let splitType = "equal";
let splitSelectedMembers = [];
let splitShares = {};
function resetSplitState() {
  splitMode = "private";
  splitType = "equal";
  splitSelectedMembers = roomMembers.map((m) => m.id);
  splitShares = {};
}
function resetShareDefaults() {
  splitShares = {};
  if (!splitSelectedMembers.length) return;
  if (splitType === "ratio") {
    const even = +(100 / splitSelectedMembers.length).toFixed(1);
    splitSelectedMembers.forEach((id) => { splitShares[id] = even; });
  } else if (splitType === "amount") {
    const total = Number($("#amountInput").value) || 0;
    const even = +(total / splitSelectedMembers.length).toFixed(2);
    splitSelectedMembers.forEach((id) => { splitShares[id] = even; });
  }
}
function splitShareSum() { return splitSelectedMembers.reduce((s, id) => s + (Number(splitShares[id]) || 0), 0); }
function renderSplitMemberChips() {
  $("#splitMemberRow").innerHTML = roomMembers.map((m) => `<button type="button" class="member-chip ${splitSelectedMembers.includes(m.id) ? "active" : ""}" data-split-member="${m.id}">${m.avatar ? `<img src="${m.avatar}" alt="" />` : "🐻"} ${escapeHTML(m.id === session?.user?.id ? "我" : m.name)}</button>`).join("");
}
function updateSplitHint() {
  const hint = $("#splitHint");
  if (!hint || splitType === "equal") return;
  const sum = splitShareSum();
  if (splitType === "ratio") {
    hint.textContent = `已分配 ${sum}%（需為 100%）`;
    hint.classList.toggle("negative", Math.abs(sum - 100) > 0.5);
  } else {
    const total = Number($("#amountInput").value) || 0;
    hint.textContent = `已分配 ${money(sum)}（需等於 ${money(total)}）`;
    hint.classList.toggle("negative", Math.abs(sum - total) > 0.5);
  }
}
function renderSplitShareInputs() {
  const wrap = $("#splitShareInputs");
  if (splitType === "equal") { wrap.classList.add("hidden"); wrap.innerHTML = ""; $("#splitHint").textContent = ""; return; }
  wrap.classList.remove("hidden");
  wrap.innerHTML = splitSelectedMembers.map((id) => {
    const m = roomMembers.find((r) => r.id === id);
    const name = id === session?.user?.id ? "我" : (m?.name || "成員");
    const step = splitType === "ratio" ? "0.1" : "0.01";
    return `<div class="split-share-row">${m?.avatar ? `<img src="${m.avatar}" alt="" />` : "<span>🐻</span>"}<span class="split-name">${escapeHTML(name)}</span><input type="number" min="0" step="${step}" data-split-share-input="${id}" value="${splitShares[id] ?? ""}" />${splitType === "ratio" ? "<span>%</span>" : "<span>$</span>"}</div>`;
  }).join("");
  updateSplitHint();
}
function renderSplitSection() {
  const show = addType === "expense" && roomMembers.length > 1;
  $("#splitSection").classList.toggle("hidden", !show);
  if (!show) return;
  $$("#splitModeSwitch .type-switch-option").forEach((b) => b.classList.toggle("active", b.dataset.splitMode === splitMode));
  $("#splitDetail").classList.toggle("hidden", splitMode !== "shared");
  if (splitMode !== "shared") return;
  $$("#splitTypeSwitch .type-switch-option").forEach((b) => b.classList.toggle("active", b.dataset.splitType === splitType));
  renderSplitMemberChips();
  renderSplitShareInputs();
}
$("#splitModeSwitch").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-split-mode]");
  if (!btn) return;
  splitMode = btn.dataset.splitMode;
  if (splitMode === "shared" && !splitSelectedMembers.length) splitSelectedMembers = roomMembers.map((m) => m.id);
  renderSplitSection();
});
$("#splitTypeSwitch").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-split-type]");
  if (!btn) return;
  splitType = btn.dataset.splitType;
  resetShareDefaults();
  renderSplitSection();
});
$("#splitMemberRow").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-split-member]");
  if (!btn) return;
  const id = btn.dataset.splitMember;
  if (splitSelectedMembers.includes(id)) {
    if (splitSelectedMembers.length <= 1) return toast("至少要保留一位分攤成員");
    splitSelectedMembers = splitSelectedMembers.filter((x) => x !== id);
  } else {
    splitSelectedMembers = [...splitSelectedMembers, id];
  }
  resetShareDefaults();
  renderSplitSection();
});
$("#splitShareInputs").addEventListener("input", (e) => {
  const input = e.target.closest("[data-split-share-input]");
  if (!input) return;
  splitShares[input.dataset.splitShareInput] = input.value;
  updateSplitHint();
});
$("#amountInput").addEventListener("input", () => { if (splitMode === "shared" && splitType === "amount") updateSplitHint(); });
function getSplitPayload(amountValue) {
  if (splitMode !== "shared") return { split_mode: "private", split_type: null, split_members: null, split_shares: null };
  if (!splitSelectedMembers.length) throw new Error("請至少選擇一位分攤成員");
  if (splitType === "equal") return { split_mode: "shared", split_type: "equal", split_members: splitSelectedMembers, split_shares: null };
  const sum = splitShareSum();
  const shares = {};
  splitSelectedMembers.forEach((id) => { shares[id] = Number(splitShares[id]) || 0; });
  if (splitType === "ratio") {
    if (Math.abs(sum - 100) > 0.5) throw new Error(`自訂比例總和需為 100%（目前 ${sum}%）`);
  } else {
    const total = Number(amountValue) || 0;
    if (Math.abs(sum - total) > 0.5) throw new Error(`自訂金額總和需等於 ${money(total)}（目前 ${money(sum)}）`);
  }
  return { split_mode: "shared", split_type: splitType, split_members: splitSelectedMembers, split_shares: shares };
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
  setDateValue("dateInput", "dateInputDisplay", tx.transaction_date);
  $("#noteInput").value = tx.note || "";
  selectedPaymentCategory = tx.payment_category || "cash";
  selectedSubAccount = tx.payment_method || "現金";
  renderPaymentPicker();
  splitMode = tx.split_mode === "shared" ? "shared" : "private";
  splitType = tx.split_type || "equal";
  splitSelectedMembers = Array.isArray(tx.split_members) && tx.split_members.length ? tx.split_members : roomMembers.map((m) => m.id);
  splitShares = tx.split_shares ? { ...tx.split_shares } : {};
  renderSplitSection();
  $("#addPageEyebrow").textContent = "EDIT RECORD";
  $("#addPageTitle").textContent = "編輯這筆紀錄";
  $("#deleteTransactionBtn").classList.remove("hidden");
}
$("#ledgerList").addEventListener("click", (e) => { const btn = e.target.closest("[data-edit-record]"); if (btn) openEditTransaction(btn.dataset.editRecord); });
$("#transactionForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const wasEditing = !!editingTransactionId;
    const split = addType === "expense" ? getSplitPayload($("#amountInput").value) : { split_mode: "private", split_type: null, split_members: null, split_shares: null };
    if (editingTransactionId) {
      await updateTransaction(editingTransactionId, addType, $("#titleInput").value.trim(), $("#amountInput").value, $("#categoryInput").value, $("#noteInput").value.trim(), $("#dateInput").value, selectedPaymentCategory, selectedSubAccount, split);
      toast("紀錄已更新 ✏️");
    } else {
      await addTransaction(addType, $("#titleInput").value.trim(), $("#amountInput").value, $("#categoryInput").value, $("#noteInput").value.trim(), $("#dateInput").value, selectedPaymentCategory, selectedSubAccount, split);
      toast(addType === "expense" ? "支出已同步到房間 ☁️" : "收入已同步到房間 💰");
    }
    e.target.reset();
    resetSplitState();
    setAddType("expense");
    setDateValue("dateInput", "dateInputDisplay", localDateStr());
    editingTransactionId = null;
    $("#deleteTransactionBtn").classList.add("hidden");
    await loadActiveBookData();
    renderAll();
    if (wasEditing) goTo("homePage");
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
let editingBudgetCategory = null;
function resetBudgetForm() {
  editingBudgetCategory = null;
  $("#budgetForm").reset();
  $("#budgetDialogTitle").textContent = "設定我的分類預算";
  $("#budgetDialogEyebrow").textContent = "MONTHLY BUDGET";
  $("#deleteBudgetBtn").classList.add("hidden");
}
function openEditBudget(category) {
  const mine = budgets.find((b) => b.category === category && !b.is_shared && b.assigned_user_id === session?.user?.id);
  const shared = budgets.find((b) => b.category === category && b.is_shared);
  const target = mine || shared;
  if (!target) return;
  editingBudgetCategory = category;
  renderCategorySelects();
  $("#budgetCategory").value = category;
  $("#budgetAmount").value = target.amount;
  $("#sharedBudgetCheckbox").checked = target.is_shared;
  $("#budgetDialogTitle").textContent = "編輯預算";
  $("#budgetDialogEyebrow").textContent = "EDIT BUDGET";
  $("#deleteBudgetBtn").classList.remove("hidden");
  openDialog("budgetDialog");
}
$("#budgetPreview").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-edit-budget-category]");
  if (btn) openEditBudget(btn.dataset.editBudgetCategory);
});
document.addEventListener("click", (e) => {
  const btn = e.target.closest('[data-open="budgetDialog"]');
  if (btn && !btn.closest("#budgetPreview")) resetBudgetForm();
});
$("#deleteBudgetBtn").addEventListener("click", async () => {
  if (!editingBudgetCategory) return;
  if (!confirm("確定要刪除這個預算嗎？")) return;
  const isShared = $("#sharedBudgetCheckbox").checked;
  let deleteQuery = supabaseClient.from("budgets").delete().eq("book_id", activeBookId).eq("category", editingBudgetCategory).eq("month", currentMonth());
  deleteQuery = isShared ? deleteQuery.eq("is_shared", true) : deleteQuery.eq("assigned_user_id", session.user.id).eq("is_shared", false);
  const { error } = await deleteQuery;
  if (error) return toast(error.message);
  resetBudgetForm(); closeDialog("budgetDialog"); await loadActiveBookData(); renderAll(); toast("預算已刪除");
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
  const wasEditing = !!editingBudgetCategory;
  resetBudgetForm(); closeDialog("budgetDialog"); await loadActiveBookData(); renderAll(); toast(wasEditing ? "預算已更新 ✏️" : "預算已同步到房間 🎯");
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
function beginListDrag(listEl, rowSelector, startRow, pointerId, startY, getItems, onReorder) {
  const allRows = Array.from(listEl.querySelectorAll(rowSelector));
  const startIndex = allRows.indexOf(startRow);
  const rowHeight = startRow.getBoundingClientRect().height + 8;
  const scrollStart = listEl.scrollTop;
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
    const rect = listEl.getBoundingClientRect();
    const edge = 36;
    let speed = 0;
    if (lastClientY < rect.top + edge) speed = -Math.ceil((rect.top + edge - lastClientY) / 3);
    else if (lastClientY > rect.bottom - edge) speed = Math.ceil((lastClientY - (rect.bottom - edge)) / 3);
    if (speed !== 0) {
      const before = listEl.scrollTop;
      listEl.scrollTop = Math.max(0, Math.min(listEl.scrollHeight - listEl.clientHeight, listEl.scrollTop + speed));
      if (listEl.scrollTop !== before) updatePositions((lastClientY - startY) + (listEl.scrollTop - scrollStart));
    }
    autoScrollRAF = requestAnimationFrame(autoScrollLoop);
  }
  autoScrollRAF = requestAnimationFrame(autoScrollLoop);
  function onMove(ev) {
    ev.preventDefault();
    lastClientY = ev.clientY;
    updatePositions((ev.clientY - startY) + (listEl.scrollTop - scrollStart));
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
      const cur = [...getItems()];
      const [moved] = cur.splice(startIndex, 1);
      cur.splice(currentIndex, 0, moved);
      onReorder(cur);
    }
  }
  startRow.addEventListener("pointermove", onMove);
  startRow.addEventListener("pointerup", onUp);
  startRow.addEventListener("pointercancel", onUp);
}
function beginCategoryDrag(startRow, pointerId, startY) {
  beginListDrag($("#categoryManageList"), ".category-manage-row", startRow, pointerId, startY, activeCategoriesForManage, updateCategories);
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
let replyingToMessage = null;
function startReply(msg) {
  if (!msg) return;
  const mine = msg.user_id === session?.user?.id;
  const senderName = mine ? "我" : (msg.profiles?.display_name || "成員");
  const snippet = msg.message_type === "sticker" ? `[貼圖] ${stickerById(msg.sticker_id)?.text || ""}` : msg.message_type === "image" ? "[圖片]" : (msg.content || "");
  replyingToMessage = { id: msg.id, senderName, snippet: snippet.slice(0, 60) };
  $("#replyPreviewSender").textContent = `回覆 ${senderName}`;
  $("#replyPreviewSnippet").textContent = snippet;
  $("#replyPreviewBar").classList.remove("hidden");
  $("#stickerTray").classList.add("hidden");
  $("#messageInput").focus();
  positionScrollToLatestBtn();
}
function cancelReply() {
  replyingToMessage = null;
  $("#replyPreviewBar").classList.add("hidden");
  positionScrollToLatestBtn();
}
$("#cancelReplyBtn").addEventListener("click", cancelReply);
$("#messageList").addEventListener("pointerdown", (e) => {
  const bubble = e.target.closest(".message");
  if (!bubble) return;
  const startX = e.clientX, startY = e.clientY;
  let fired = false;
  const timer = setTimeout(() => {
    fired = true;
    bubble.classList.add("long-press-active");
    if (navigator.vibrate) navigator.vibrate(12);
  }, 420);
  const cleanup = (didFire) => {
    clearTimeout(timer);
    bubble.classList.remove("long-press-active");
    bubble.removeEventListener("pointermove", onMove);
    bubble.removeEventListener("pointerup", onUp);
    bubble.removeEventListener("pointercancel", onCancel);
    if (didFire) {
      const id = bubble.dataset.messageId;
      const msg = messages.find((m) => String(m.id) === id);
      startReply(msg);
    }
  };
  function onMove(ev) { if (!fired && (Math.abs(ev.clientX - startX) > 10 || Math.abs(ev.clientY - startY) > 10)) cleanup(false); }
  function onUp() { cleanup(fired); }
  function onCancel() { cleanup(false); }
  bubble.addEventListener("pointermove", onMove);
  bubble.addEventListener("pointerup", onUp);
  bubble.addEventListener("pointercancel", onCancel);
});
let pendingImages = [];
function renderImagePreview() {
  const bar = $("#imagePreviewBar");
  if (!bar) return;
  if (!pendingImages.length) { bar.classList.add("hidden"); bar.innerHTML = ""; return; }
  bar.classList.remove("hidden");
  bar.innerHTML = pendingImages.map((it, i) => `<div class="image-preview-item"><img src="${it.url}" alt=""><button type="button" class="rm" data-rm="${i}" aria-label="移除">×</button></div>`).join("");
}
function clearPendingImages() {
  pendingImages.forEach((it) => { try { URL.revokeObjectURL(it.url); } catch (e) {} });
  pendingImages = [];
  renderImagePreview();
}
$("#imagePreviewBar")?.addEventListener("click", (e) => {
  const b = e.target.closest("[data-rm]");
  if (!b) return;
  const i = Number(b.dataset.rm);
  const it = pendingImages[i];
  if (it) { try { URL.revokeObjectURL(it.url); } catch (e2) {} }
  pendingImages.splice(i, 1);
  renderImagePreview();
});
function autoGrowInput() {
  const t = $("#messageInput");
  if (!t) return;
  t.style.height = "auto";
  t.style.height = Math.min(t.scrollHeight, 120) + "px";
}
$("#messageInput")?.addEventListener("input", autoGrowInput);
function pushLocalMessage(row) {
  if (!row || messages.some((m) => m.id === row.id)) return;
  messages.push({ ...row, profiles: { display_name: profile?.display_name, avatar_url: profile?.avatar_url } });
  renderChat(); renderHome(); scrollChat();
}
async function uploadPendingImages(replyMeta) {
  for (const it of pendingImages) {
    const file = it.file;
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `${activeBookId}/${session.user.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const { error: upErr } = await supabaseClient.storage.from("chat-images").upload(path, file, { cacheControl: "3600", contentType: file.type });
    if (upErr) { toast(upErr.message); continue; }
    const { data: pub } = supabaseClient.storage.from("chat-images").getPublicUrl(path);
    const row = { book_id: activeBookId, user_id: session.user.id, message_type: "image", image_url: pub.publicUrl };
    if (replyMeta && !replyMeta.used) { row.reply_to_id = replyMeta.id; row.reply_preview_sender = replyMeta.senderName; row.reply_preview_text = replyMeta.snippet; replyMeta.used = true; }
    const { data: inserted } = await supabaseClient.from("messages").insert(row).select("*").single();
    pushLocalMessage(inserted);
  }
}
$("#chatForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const content = $("#messageInput").value.trim();
  const hasImages = pendingImages.length > 0;
  if (!content && !hasImages) return;
  if (!activeBookId) { toast("請先選擇房間"); return; }
  const replyMeta = replyingToMessage ? { id: replyingToMessage.id, senderName: replyingToMessage.senderName, snippet: replyingToMessage.snippet, used: false } : null;
  if (content) {
    const row = { book_id: activeBookId, user_id: session.user.id, message_type: "text", content };
    if (replyMeta && !replyMeta.used) { row.reply_to_id = replyMeta.id; row.reply_preview_sender = replyMeta.senderName; row.reply_preview_text = replyMeta.snippet; replyMeta.used = true; }
    const { data: sent, error } = await supabaseClient.from("messages").insert(row).select("*").single();
    if (error) { toast(error.message); return; }
    $("#messageInput").value = "";
    autoGrowInput();
    pushLocalMessage(sent);
  }
  if (hasImages) {
    toast("上傳中…");
    await uploadPendingImages(replyMeta);
    clearPendingImages();
  }
  cancelReply();
});
$("#stickerBtn").addEventListener("click", () => { const hidden = $("#stickerTray").classList.toggle("hidden"); $("#stickerBtn").classList.toggle("active", !hidden); });
$("#stickerSetTabs").addEventListener("click", (e) => { const btn = e.target.closest("[data-set]"); if (!btn) return; activeStickerSet = Number(btn.dataset.set); renderStickerTray(); });
$("#stickerGrid").addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-sticker]");
  if (!btn) return;
  const s = stickerById(btn.dataset.sticker);
  if (!s) return;
  const row = { book_id: activeBookId, user_id: session.user.id, message_type: "sticker", sticker_id: s.id };
  if (replyingToMessage) { row.reply_to_id = replyingToMessage.id; row.reply_preview_sender = replyingToMessage.senderName; row.reply_preview_text = replyingToMessage.snippet; }
  const { data: sent, error } = await supabaseClient.from("messages").insert(row).select("*").single();
  if (error) return toast(error.message);
  pushLocalMessage(sent);
  $("#stickerTray").classList.add("hidden");
  $("#stickerBtn").classList.remove("active");
  cancelReply();
});

$("#chatImageBtn")?.addEventListener("click", () => $("#chatImageInput")?.click());
$("#chatImageInput")?.addEventListener("change", (e) => {
  const files = Array.from(e.target.files || []);
  for (const file of files) {
    if (!file.type.startsWith("image/")) { toast("只能選圖片檔"); continue; }
    if (file.size > 6 * 1024 * 1024) { toast(`「${file.name}」超過 6MB，略過`); continue; }
    if (pendingImages.length >= 9) { toast("一次最多 9 張"); break; }
    pendingImages.push({ file, url: URL.createObjectURL(file) });
  }
  renderImagePreview();
  e.target.value = "";
});

function finishSplash() { const s = $("#splashScreen"); if (!s || s.dataset.done) return; s.dataset.done = "1"; s.classList.add("hide"); document.body.classList.remove("splash-lock"); setTimeout(() => s.remove(), 650); }
if (window.visualViewport) {
  const vv = window.visualViewport;
  let inputFocused = false;
  function adjustChatForKeyboard() {
    const wrap = $("#chatComposerWrap");
    if (!wrap) return;
    // 只有在輸入框真的被聚焦時才考慮鍵盤高度，避免把 iOS Safari 滾動時
    // 網址列/工具列收合展開造成的視窗高度變化誤判成鍵盤彈出。
    if (!inputFocused) { resetChatComposerBaseline(); return; }
    const rawOffset = window.innerHeight - vv.height - vv.offsetTop;
    const keyboardOffset = Math.max(0, rawOffset);
    // 鍵盤彈出時底部導航列已隱藏，不用再預留它的高度，輸入框可以貼近鍵盤一點。
    wrap.style.bottom = `${12 + keyboardOffset}px`;
    const tray = $("#stickerTray");
    if (tray) tray.style.bottom = `${82 + keyboardOffset}px`;
    positionScrollToLatestBtn();
    if (keyboardOffset > 0 && $("#chatPage")?.classList.contains("active")) scrollChat();
  }
  const messageInput = $("#messageInput");
  if (messageInput) {
    messageInput.addEventListener("focus", () => { inputFocused = true; document.body.classList.add("chat-keyboard-open"); adjustChatForKeyboard(); });
    messageInput.addEventListener("blur", () => { inputFocused = false; document.body.classList.remove("chat-keyboard-open"); adjustChatForKeyboard(); });
  }
  vv.addEventListener("resize", adjustChatForKeyboard);
  vv.addEventListener("scroll", adjustChatForKeyboard);
}
const importPaymentCategoryLabels = { "現金": "cash", "信用卡": "credit_card", "銀行帳戶": "bank", "電子支付": "ewallet" };
function buildTemplateWorkbook() {
  const wb = XLSX.utils.book_new();
  const introRows = [
    ["BORI 記帳匯入範本"], [],
    ["① 填寫位置", "所有資料都填在「記帳紀錄」這張工作表，從第 2 列開始（第 1 列是欄位標題，不要刪除或更改）。"],
    ["② 日期", "格式為 YYYY-MM-DD，例如 2026-08-24。"],
    ["③ 類型", "只能填「支出」或「收入」兩者之一。"],
    ["④ 分類", "要填「房間裡真的有的分類名稱」，跟 App 裡自訂分類的名字要一模一樣，對不到的話那一筆會匯入失敗。"],
    ["⑤ 項目", "這筆紀錄的標題，例如「午餐」「薪水」，可自由填寫。"],
    ["⑥ 金額", "只能填數字，不要加 $ 符號或逗號。"],
    ["⑦ 帳戶類別", "只能填「現金」「信用卡」「銀行帳戶」「電子支付」其中一種。"],
    ["⑧ 帳戶名稱", "選填。留空的話會直接顯示帳戶類別的名稱。"],
    ["⑨ 備註", "選填，可自由填寫。"],
  ];
  const wsIntro = XLSX.utils.aoa_to_sheet(introRows);
  wsIntro["!cols"] = [{ wch: 16 }, { wch: 62 }];
  XLSX.utils.book_append_sheet(wb, wsIntro, "說明");
  const header = ["日期", "類型", "分類", "項目", "金額", "帳戶類別", "帳戶名稱", "備註"];
  const example = [
    ["2026-08-20", "支出", activeCategories()[0]?.name || "餐飲", "午餐", 120, "現金", "", "跟同事一起吃"],
    ["2026-08-20", "收入", activeIncomeCategories()[0]?.name || "薪水", "薪資", 45000, "銀行帳戶", "", ""],
  ];
  const wsRecords = XLSX.utils.aoa_to_sheet([header, ...example]);
  wsRecords["!cols"] = [{ wch: 13 }, { wch: 8 }, { wch: 12 }, { wch: 18 }, { wch: 10 }, { wch: 10 }, { wch: 14 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, wsRecords, "記帳紀錄");
  return wb;
}
$("#downloadTemplateLink").addEventListener("click", (e) => {
  e.preventDefault();
  XLSX.writeFile(buildTemplateWorkbook(), "BORI記帳匯入範本.xlsx");
});
document.addEventListener("click", (e) => { if (e.target.closest('[data-open="dataExportDialog"]')) $("#importResult").textContent = ""; });
$("#exportDataBtn").addEventListener("click", () => {
  if (!activeBookId) return;
  const wb = XLSX.utils.book_new();
  const txRows = transactions.map((x) => ({
    日期: x.transaction_date,
    類型: x.transaction_type === "income" ? "收入" : "支出",
    分類: x.category,
    項目: x.title,
    金額: Number(x.amount),
    帳戶類別: baseCategories.find((c) => c.key === x.payment_category)?.label || "現金",
    帳戶名稱: x.payment_method || "",
    備註: x.note || "",
    記錄人: x.user_id === session?.user?.id ? "我" : (roomMembers.find((m) => m.id === x.user_id)?.name || "成員"),
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(txRows.length ? txRows : [{ 日期: "", 類型: "", 分類: "", 項目: "", 金額: "", 帳戶類別: "", 帳戶名稱: "", 備註: "", 記錄人: "" }]), "記帳紀錄");
  const budgetRows = budgets.map((b) => ({
    分類: b.category,
    月份: b.month,
    金額: Number(b.amount),
    範圍: b.is_shared ? "全房共用" : "個人",
    歸屬成員: b.is_shared ? "" : (roomMembers.find((m) => m.id === b.assigned_user_id)?.name || ""),
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(budgetRows.length ? budgetRows : [{ 分類: "", 月份: "", 金額: "", 範圍: "", 歸屬成員: "" }]), "預算");
  const catRows = [
    ...activeCategories().map((c) => ({ 類型: "支出", 分類名稱: c.name })),
    ...activeIncomeCategories().map((c) => ({ 類型: "收入", 分類名稱: c.name })),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(catRows), "分類設定");
  const roomName = activeBook()?.name || "BORI";
  XLSX.writeFile(wb, `${roomName}_記帳資料_${localDateStr()}.xlsx`);
  toast("匯出完成 📤");
});
$("#importDataBtn").addEventListener("click", () => $("#importFileInput").click());
$("#importFileInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file || !activeBookId) return;
  $("#importResult").textContent = "匯入中…";
  try {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array", cellDates: false });
    const sheet = wb.Sheets["記帳紀錄"];
    if (!sheet) throw new Error("找不到「記帳紀錄」工作表，請用範本格式");
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    const expenseCats = new Set(activeCategories().map((c) => c.name));
    const incomeCats = new Set(activeIncomeCategories().map((c) => c.name));
    const goodRows = [];
    const errors = [];
    rows.forEach((r, i) => {
      const line = i + 2;
      const dateRaw = String(r["日期"] || "").trim();
      const typeRaw = String(r["類型"] || "").trim();
      const category = String(r["分類"] || "").trim();
      const title = String(r["項目"] || "").trim();
      const amount = Number(r["金額"]);
      const payCatLabel = String(r["帳戶類別"] || "現金").trim();
      const payMethod = String(r["帳戶名稱"] || "").trim() || payCatLabel;
      const note = String(r["備註"] || "").trim();
      if (!dateRaw && !typeRaw && !category && !title) return;
      const dateMatch = dateRaw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (!dateMatch) return errors.push(`第 ${line} 列：日期格式錯誤`);
      const date = `${dateMatch[1]}-${pad2(dateMatch[2])}-${pad2(dateMatch[3])}`;
      const type = typeRaw === "收入" ? "income" : typeRaw === "支出" ? "expense" : null;
      if (!type) return errors.push(`第 ${line} 列：類型要填「支出」或「收入」`);
      const catSet = type === "income" ? incomeCats : expenseCats;
      if (!catSet.has(category)) return errors.push(`第 ${line} 列：分類「${category}」不存在`);
      if (!title) return errors.push(`第 ${line} 列：項目不能空白`);
      if (!Number.isFinite(amount) || amount <= 0) return errors.push(`第 ${line} 列：金額不是有效數字`);
      const payKey = importPaymentCategoryLabels[payCatLabel];
      if (!payKey) return errors.push(`第 ${line} 列：帳戶類別「${payCatLabel}」不存在`);
      goodRows.push({ book_id: activeBookId, user_id: session.user.id, transaction_type: type, category, title, amount, transaction_date: date, payment_category: payKey, payment_method: payMethod, note });
    });
    if (goodRows.length) {
      const { error } = await supabaseClient.from("transactions").insert(goodRows);
      if (error) throw error;
    }
    let summary = `匯入完成：成功 ${goodRows.length} 筆`;
    if (errors.length) summary += `，失敗 ${errors.length} 筆\n` + errors.slice(0, 10).join("\n") + (errors.length > 10 ? `\n…還有 ${errors.length - 10} 筆錯誤` : "");
    $("#importResult").textContent = summary;
    if (goodRows.length) { await loadActiveBookData(); renderAll(); toast(`已匯入 ${goodRows.length} 筆紀錄 📥`); }
  } catch (err) {
    $("#importResult").textContent = "匯入失敗：" + err.message;
  } finally {
    e.target.value = "";
  }
});
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
