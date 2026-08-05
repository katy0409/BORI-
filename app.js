const emptyState = {
  books: [],
  transactions: []
};

const categoryMeta = {
  餐飲:{icon:"🍔", color:"#ef8f58"}, 交通:{icon:"🚗", color:"#68a5aa"}, 娛樂:{icon:"🎬", color:"#9b83c5"},
  購物:{icon:"🛍️", color:"#e6b44e"}, 生活:{icon:"🏠", color:"#78965e"}, 旅行:{icon:"✈️", color:"#6e93c8"}, 其他:{icon:"✨", color:"#aaa096"}
};

let state = loadState();
let activeBookId = state.books[0]?.id || null;

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const money = value => `$${Math.round(Number(value) || 0).toLocaleString("zh-TW")}`;
const bookById = id => state.books.find(book => book.id === id);

function uuid(){
  return globalThis.crypto?.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadState(){
  try {
    const saved = JSON.parse(localStorage.getItem("bori-v2-state"));
    if(saved && Array.isArray(saved.books) && Array.isArray(saved.transactions)) return saved;
  } catch(error){ console.warn("BORI 資料讀取失敗，已改用空白資料。", error); }
  return structuredClone(emptyState);
}

function saveState(){
  localStorage.setItem("bori-v2-state", JSON.stringify(state));
}

function showToast(message){
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function openDialog(id){
  const dialog = document.getElementById(id);
  if(dialog && !dialog.open) dialog.showModal();
}

function closeDialog(id){
  const dialog = document.getElementById(id);
  if(dialog?.open) dialog.close();
}

function goTo(pageId){
  $$(".page").forEach(page => page.classList.toggle("active", page.id === pageId));
  $$(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.page === pageId));
  if(pageId === "ledgerPage") renderLedger();
  if(pageId === "addPage") renderAddPage();
  if(pageId === "analysisPage") renderAnalysis();
  window.scrollTo({top:0, behavior:"smooth"});
}

function renderAll(){
  renderHome();
  renderLedger();
  renderAddPage();
  renderAnalysis();
}

function renderHome(){
  const hasBooks = state.books.length > 0;
  $("#homeEmpty").classList.toggle("hidden", hasBooks);
  $("#homeDashboard").classList.toggle("hidden", !hasBooks);
  if(!hasBooks) return;

  const total = state.transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const mine = state.transactions.filter(tx => tx.payer === "我").reduce((sum, tx) => sum + tx.amount, 0);
  $("#monthlyTotal").textContent = money(total);
  $("#paidByMe").textContent = money(mine);
  $("#paidByOthers").textContent = money(total - mine);
  $("#monthlyChange").textContent = total ? `本月共有 ${state.transactions.length} 筆共同支出` : "新增第一筆支出，開始累積生活紀錄";

  const heights = state.transactions.length ? [28,42,37,56,49,72,63,84] : [12,12,12,12,12,12,12,12];
  $("#miniChart").innerHTML = heights.map(height => `<i style="height:${height}%"></i>`).join("");

  $("#bookList").innerHTML = state.books.map(book => {
    const txs = state.transactions.filter(tx => tx.bookId === book.id);
    const sum = txs.reduce((total, tx) => total + tx.amount, 0);
    const memberCount = book.members?.length || 1;
    return `<article class="book-card" data-book="${book.id}"><div class="book-icon">${book.icon}</div><div class="book-info"><h3>${escapeHTML(book.name)}</h3><p>${memberCount} 位成員 · ${txs.length} 筆支出</p></div><strong>${money(sum)}</strong></article>`;
  }).join("");
  $$('[data-book]').forEach(card => card.addEventListener("click", () => { activeBookId = card.dataset.book; goTo("ledgerPage"); }));

  const recent = [...state.transactions].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,4);
  $("#recentList").innerHTML = recent.length ? recent.map(transactionHTML).join("") : `<div class="empty-state"><div class="empty-illustration">🧾</div><h2>還沒有支出</h2><p>按下中間的＋新增第一筆共同支出。</p></div>`;
}

function renderLedger(){
  const hasBooks = state.books.length > 0;
  $("#ledgerEmpty").classList.toggle("hidden", hasBooks);
  $("#ledgerContent").classList.toggle("hidden", !hasBooks);
  if(!hasBooks) return;

  if(!activeBookId || !bookById(activeBookId)) activeBookId = state.books[0].id;
  fillBookSelects();
  const book = bookById(activeBookId);
  $("#ledgerTitle").textContent = `${book.icon} ${book.name}`;
  $("#bookFilter").value = activeBookId;

  const txs = state.transactions.filter(tx => tx.bookId === activeBookId).sort((a,b) => new Date(b.date) - new Date(a.date));
  $("#ledgerList").innerHTML = txs.length ? txs.map(transactionHTML).join("") : `<div class="empty-state"><div class="empty-illustration">🧾</div><h2>這本帳還是空的</h2><p>新增第一筆支出後，就能開始計算誰欠誰。</p></div>`;

  let net = 0;
  txs.forEach(tx => {
    const share = tx.amount / Math.max(tx.participants.length, 1);
    if(tx.payer === "我") net += tx.participants.filter(name => name !== "我").length * share;
    else if(tx.participants.includes("我")) net -= share;
  });
  $("#balanceAmount").textContent = money(Math.abs(net));
  $("#balanceAmount").className = net >= 0 ? "positive" : "negative";
  $("#balanceText").textContent = net > 0 ? `其他成員合計欠你 ${money(net)}` : net < 0 ? `你目前需要支付 ${money(Math.abs(net))}` : "目前沒有需要結算的款項";
}

function renderAddPage(){
  const hasBooks = state.books.length > 0;
  $("#addEmpty").classList.toggle("hidden", hasBooks);
  $("#addContent").classList.toggle("hidden", !hasBooks);
  if(!hasBooks) return;
  if(!activeBookId || !bookById(activeBookId)) activeBookId = state.books[0].id;
  fillBookSelects();
  updateMemberInputs(activeBookId);
}

function fillBookSelects(){
  const options = state.books.map(book => `<option value="${book.id}">${book.icon} ${escapeHTML(book.name)}</option>`).join("");
  $("#bookInput").innerHTML = options;
  $("#bookFilter").innerHTML = options;
  if(activeBookId){ $("#bookInput").value = activeBookId; $("#bookFilter").value = activeBookId; }
}

function updateMemberInputs(bookId){
  const book = bookById(bookId);
  const members = book?.members?.length ? book.members : ["我"];
  $("#payerInput").innerHTML = members.map(name => `<option>${escapeHTML(name)}</option>`).join("");
  $("#participantChecks").innerHTML = members.map(name => `<label><input type="checkbox" value="${escapeHTML(name)}" checked>${escapeHTML(name)}</label>`).join("");
}

function renderAnalysis(){
  const hasData = state.transactions.length > 0;
  $("#analysisEmpty").classList.toggle("hidden", hasData);
  $("#analysisContent").classList.toggle("hidden", !hasData);
  if(!hasData) return;

  const total = state.transactions.reduce((sum, tx) => sum + tx.amount, 0);
  $("#donutTotal").textContent = money(total);
  const grouped = {};
  state.transactions.forEach(tx => grouped[tx.category] = (grouped[tx.category] || 0) + tx.amount);
  const entries = Object.entries(grouped).sort((a,b) => b[1] - a[1]);
  let cursor = 0;
  const segments = entries.map(([category,value]) => {
    const start = cursor;
    cursor += total ? value / total * 360 : 0;
    return `${categoryMeta[category]?.color || "#aaa"} ${start}deg ${cursor}deg`;
  });
  $("#donutChart").style.background = `conic-gradient(${segments.join(",")})`;
  $("#categoryLegend").innerHTML = entries.map(([category,value]) => `<div class="legend-row"><i class="legend-dot" style="background:${categoryMeta[category]?.color || "#aaa"}"></i><span>${category}</span><strong>${Math.round(value / total * 100)}%</strong></div>`).join("");

  const payers = {};
  state.transactions.forEach(tx => payers[tx.payer] = (payers[tx.payer] || 0) + tx.amount);
  $("#payerRanking").innerHTML = Object.entries(payers).sort((a,b) => b[1] - a[1]).map(([name,value],index) => `<div class="rank-row"><strong>${["🥇","🥈","🥉"][index] || index + 1}</strong><span>${escapeHTML(name)}</span><b>${money(value)}</b></div>`).join("");
}

function transactionHTML(tx){
  const meta = categoryMeta[tx.category] || categoryMeta.其他;
  const book = bookById(tx.bookId);
  const date = new Date(tx.date).toLocaleDateString("zh-TW", {month:"numeric",day:"numeric"});
  return `<article class="transaction"><div class="tx-icon" style="background:${meta.color}20">${meta.icon}</div><div class="tx-info"><h3>${escapeHTML(tx.title)}</h3><p>${escapeHTML(book?.name || "帳本")} · ${escapeHTML(tx.payer)}付款 · ${date}</p></div><div class="amount">${money(tx.amount)}</div></article>`;
}

function escapeHTML(value){
  return String(value).replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
}

$$('[data-page]').forEach(button => button.addEventListener("click", () => goTo(button.dataset.page)));
$$('[data-go]').forEach(button => button.addEventListener("click", () => goTo(button.dataset.go)));
$$('[data-close]').forEach(button => button.addEventListener("click", () => closeDialog(button.dataset.close)));

["#createFirstBookBtn","#quickAddBookBtn","#addBookBtn","#ledgerCreateBtn","#addCreateBookBtn"].forEach(selector => {
  $(selector)?.addEventListener("click", () => openDialog("bookDialog"));
});
$("#joinBookBtn").addEventListener("click", () => openDialog("inviteDialog"));

$("#bookForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = $("#newBookName").value.trim();
  if(!name) return showToast("請輸入帳本名稱");
  const icon = document.querySelector('input[name="bookType"]:checked')?.value || "📒";
  const members = $("#newBookMembers").value.split(/[，,]/).map(name => name.trim()).filter(Boolean);
  const normalizedMembers = [...new Set(members.length ? members : ["我"])];
  if(!normalizedMembers.includes("我")) normalizedMembers.unshift("我");
  const book = { id: uuid(), name, icon, members: normalizedMembers, createdAt: new Date().toISOString() };
  state.books.push(book);
  activeBookId = book.id;
  saveState();
  event.target.reset();
  $("#newBookMembers").value = "我";
  closeDialog("bookDialog");
  renderAll();
  showToast("共同帳本建立完成 🌾");
});

$("#inviteForm").addEventListener("submit", event => {
  event.preventDefault();
  showToast("邀請功能會在後端版本啟用");
  closeDialog("inviteDialog");
});

$("#bookFilter").addEventListener("change", event => { activeBookId = event.target.value; renderLedger(); });
$("#bookInput").addEventListener("change", event => { activeBookId = event.target.value; updateMemberInputs(activeBookId); });
$("#settleBtn").addEventListener("click", () => showToast("結清功能會在下一版加入"));
$("#memberManageBtn").addEventListener("click", () => showToast("成員管理功能會在下一版加入"));

$("#expenseForm").addEventListener("submit", event => {
  event.preventDefault();
  const participants = $$("#participantChecks input:checked").map(input => input.value);
  if(!participants.length) return showToast("請至少選擇一位參與者");
  const amount = Number($("#amountInput").value);
  if(!Number.isFinite(amount) || amount <= 0) return showToast("請輸入正確金額");
  const transaction = {
    id: uuid(), bookId: $("#bookInput").value, title: $("#titleInput").value.trim(), category: $("#categoryInput").value,
    amount, payer: $("#payerInput").value, participants, method: $("#methodInput").value,
    note: $("#noteInput").value.trim(), date: new Date().toISOString()
  };
  state.transactions.push(transaction);
  activeBookId = transaction.bookId;
  saveState();
  event.target.reset();
  renderAll();
  goTo("homePage");
  showToast("支出已儲存 🌾");
});

$("#resetBtn").addEventListener("click", () => {
  if(!confirm("確定要清除所有帳本與支出嗎？此動作無法復原。")) return;
  state = structuredClone(emptyState);
  activeBookId = null;
  saveState();
  renderAll();
  goTo("homePage");
  showToast("所有資料已清除");
});

renderAll();

// 啟動畫面與安裝到手機主畫面支援
function finishSplash(){
  const splash = document.getElementById("splashScreen");
  if(!splash) return;
  splash.classList.add("hide");
  document.body.classList.remove("splash-lock");
  window.setTimeout(() => splash.remove(), 650);
}

document.body.classList.add("splash-lock");
window.addEventListener("load", () => {
  window.setTimeout(finishSplash, 1900);
});
window.setTimeout(finishSplash, 3500);

if("serviceWorker" in navigator){
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(error => console.warn("Service Worker 註冊失敗", error)));
}
