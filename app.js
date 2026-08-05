const seed = {
  members: ["我", "小明", "媽媽", "阿華"],
  books: [
    { id: "couple", icon: "❤️", name: "我們" },
    { id: "family", icon: "👨‍👩‍👧", name: "家庭" },
    { id: "friends", icon: "🍻", name: "朋友聚會" }
  ],
  transactions: [
    { id: crypto.randomUUID(), bookId:"couple", title:"義大利麵晚餐", category:"餐飲", amount:850, payer:"我", participants:["我","小明"], method:"信用卡", note:"", date:new Date().toISOString() },
    { id: crypto.randomUUID(), bookId:"couple", title:"電影票", category:"娛樂", amount:560, payer:"小明", participants:["我","小明"], method:"行動支付", note:"", date:new Date(Date.now()-86400000).toISOString() },
    { id: crypto.randomUUID(), bookId:"family", title:"全聯採買", category:"生活", amount:1260, payer:"媽媽", participants:["我","媽媽"], method:"信用卡", note:"", date:new Date(Date.now()-172800000).toISOString() },
    { id: crypto.randomUUID(), bookId:"friends", title:"火鍋聚餐", category:"餐飲", amount:4200, payer:"我", participants:["我","小明","阿華"], method:"信用卡", note:"AA", date:new Date(Date.now()-259200000).toISOString() }
  ]
};

const categoryMeta = {
  餐飲:{icon:"🍔", color:"#ef8f58"}, 交通:{icon:"🚗", color:"#68a5aa"}, 娛樂:{icon:"🎬", color:"#9b83c5"},
  購物:{icon:"🛍️", color:"#e6b44e"}, 生活:{icon:"🏠", color:"#7fa263"}, 旅行:{icon:"✈️", color:"#6e93c8"}, 其他:{icon:"✨", color:"#aaa096"}
};

let state = JSON.parse(localStorage.getItem("bori-state")) || seed;
let activeBookId = state.books[0]?.id;

const $ = s => document.querySelector(s);
const money = n => `$${Math.round(n).toLocaleString("zh-TW")}`;
const save = () => localStorage.setItem("bori-state", JSON.stringify(state));
const bookById = id => state.books.find(b => b.id === id);

function showToast(text){ const el=$("#toast"); el.textContent=text; el.classList.add("show"); setTimeout(()=>el.classList.remove("show"),1800); }

function goTo(pageId){
  document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active", p.id===pageId));
  document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active", n.dataset.page===pageId));
  if(pageId==="ledgerPage") renderLedger();
  if(pageId==="analysisPage") renderAnalysis();
  window.scrollTo({top:0, behavior:"smooth"});
}

document.querySelectorAll("[data-page]").forEach(btn=>btn.addEventListener("click",()=>goTo(btn.dataset.page)));
document.querySelectorAll("[data-go]").forEach(btn=>btn.addEventListener("click",()=>goTo(btn.dataset.go)));

function renderHome(){
  const total = state.transactions.reduce((s,t)=>s+t.amount,0);
  const mine = state.transactions.filter(t=>t.payer==="我").reduce((s,t)=>s+t.amount,0);
  $("#monthlyTotal").textContent=money(total);
  $("#paidByMe").textContent=money(mine);
  $("#paidByOthers").textContent=money(total-mine);

  const heights=[34,48,42,61,53,78,66,88];
  $("#miniChart").innerHTML=heights.map(h=>`<i style="height:${h}%"></i>`).join("");

  $("#bookList").innerHTML=state.books.map(book=>{
    const txs=state.transactions.filter(t=>t.bookId===book.id);
    const sum=txs.reduce((s,t)=>s+t.amount,0);
    return `<article class="book-card" data-book="${book.id}"><div class="book-icon">${book.icon}</div><div class="book-info"><h3>${book.name}</h3><p>${txs.length} 筆支出</p></div><strong>${money(sum)}</strong></article>`;
  }).join("") || `<div class="empty">還沒有帳本</div>`;
  document.querySelectorAll("[data-book]").forEach(el=>el.onclick=()=>{activeBookId=el.dataset.book;goTo("ledgerPage")});

  const recent=[...state.transactions].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,4);
  $("#recentList").innerHTML=recent.length?recent.map(transactionHTML).join(""):`<div class="empty">按下中間的＋新增第一筆支出</div>`;
  fillSelects();
}

function transactionHTML(t){
  const meta=categoryMeta[t.category]||categoryMeta.其他;
  const book=bookById(t.bookId);
  const date=new Date(t.date).toLocaleDateString("zh-TW",{month:"numeric",day:"numeric"});
  return `<article class="transaction"><div class="tx-icon" style="background:${meta.color}20">${meta.icon}</div><div class="tx-info"><h3>${t.title}</h3><p>${book?.name||"帳本"} · ${t.payer}付款 · ${date}</p></div><div class="amount">${money(t.amount)}</div></article>`;
}

function fillSelects(){
  const opts=state.books.map(b=>`<option value="${b.id}">${b.icon} ${b.name}</option>`).join("");
  $("#bookInput").innerHTML=opts; $("#bookFilter").innerHTML=opts;
  if(activeBookId){ $("#bookInput").value=activeBookId; $("#bookFilter").value=activeBookId; }
  $("#payerInput").innerHTML=state.members.map(m=>`<option>${m}</option>`).join("");
  $("#participantChecks").innerHTML=state.members.map((m,i)=>`<label><input type="checkbox" value="${m}" ${i<2?"checked":""}>${m}</label>`).join("");
}

function renderLedger(){
  if(!activeBookId && state.books[0]) activeBookId=state.books[0].id;
  fillSelects();
  const book=bookById(activeBookId);
  $("#ledgerTitle").textContent=`${book?.icon||"📒"} ${book?.name||"帳本"}`;
  const txs=state.transactions.filter(t=>t.bookId===activeBookId).sort((a,b)=>new Date(b.date)-new Date(a.date));
  $("#ledgerList").innerHTML=txs.length?txs.map(transactionHTML).join(""):`<div class="empty">這本帳還沒有支出</div>`;

  let net=0;
  txs.forEach(t=>{
    const share=t.amount/(t.participants.length||1);
    if(t.payer==="我") net += t.participants.filter(p=>p!=="我").length*share;
    else if(t.participants.includes("我")) net -= share;
  });
  $("#balanceAmount").textContent=money(Math.abs(net));
  $("#balanceAmount").className=net>=0?"positive":"negative";
  $("#balanceText").textContent=net>0?`其他成員合計欠你 ${money(net)}`:net<0?`你目前需要支付 ${money(Math.abs(net))}`:"目前沒有需要結算的款項";
}

$("#bookFilter").addEventListener("change",e=>{activeBookId=e.target.value;renderLedger()});
$("#settleBtn").addEventListener("click",()=>showToast("已標記為結清（示範功能）"));

$("#expenseForm").addEventListener("submit",e=>{
  e.preventDefault();
  const participants=[...document.querySelectorAll("#participantChecks input:checked")].map(i=>i.value);
  if(!participants.length) return showToast("請至少選擇一位參與者");
  const tx={
    id:crypto.randomUUID(), bookId:$("#bookInput").value, title:$("#titleInput").value.trim(), category:$("#categoryInput").value,
    amount:Number($("#amountInput").value), payer:$("#payerInput").value, participants, method:$("#methodInput").value,
    note:$("#noteInput").value.trim(), date:new Date().toISOString()
  };
  state.transactions.push(tx); activeBookId=tx.bookId; save(); e.target.reset(); renderHome(); goTo("homePage"); showToast("支出已儲存 🌾");
});

function renderAnalysis(){
  const total=state.transactions.reduce((s,t)=>s+t.amount,0);
  $("#donutTotal").textContent=money(total);
  const grouped={}; state.transactions.forEach(t=>grouped[t.category]=(grouped[t.category]||0)+t.amount);
  const entries=Object.entries(grouped).sort((a,b)=>b[1]-a[1]);
  let cursor=0; const segs=entries.map(([cat,val])=>{const start=cursor; const deg=total?val/total*360:0; cursor+=deg; return `${categoryMeta[cat]?.color||"#aaa"} ${start}deg ${cursor}deg`;});
  $("#donutChart").style.background=segs.length?`conic-gradient(${segs.join(",")})`:'#eee7dc';
  $("#categoryLegend").innerHTML=entries.map(([cat,val])=>`<div class="legend-row"><i class="legend-dot" style="background:${categoryMeta[cat]?.color}"></i><span>${cat}</span><strong>${Math.round(val/(total||1)*100)}%</strong></div>`).join("")||"尚無資料";
  const payers={};state.transactions.forEach(t=>payers[t.payer]=(payers[t.payer]||0)+t.amount);
  $("#payerRanking").innerHTML=Object.entries(payers).sort((a,b)=>b[1]-a[1]).map(([name,val],i)=>`<div class="rank-row"><strong>${["🥇","🥈","🥉"][i]||i+1}</strong><span>${name}</span><b>${money(val)}</b></div>`).join("");
}

$("#addBookBtn").onclick=()=>$("#bookDialog").showModal();
$("#bookForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=$("#newBookName").value.trim(); if(!name)return;
  const book={id:`book-${Date.now()}`,icon:$("#newBookIcon").value,name}; state.books.push(book); activeBookId=book.id; save(); $("#bookDialog").close(); e.target.reset(); renderHome(); showToast("新帳本建立完成");
});

$("#resetBtn").onclick=()=>{ if(confirm("確定要恢復成最初的示範資料嗎？")){state=structuredClone(seed);save();renderHome();goTo("homePage");showToast("資料已重設");} };

renderHome();
