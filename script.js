let splitChart, goldHistoryChart;

// 🌙 Theme
function toggleTheme(){
  document.body.classList.toggle("dark");
  localStorage.setItem("theme",
    document.body.classList.contains("dark")?"dark":"light");
}
if(localStorage.getItem("theme")==="dark"){
  document.body.classList.add("dark");
}

function generatePlan(){
  const amount = +amountInput.value;
  if(!amount) return alert("Enter amount");

  let savePct = amount <= 500 ? 0.5 : amount <= 1000 ? 0.45 : 0.35;
  if(typeInput.value === "hostel") savePct -= 0.1;

  const savings = Math.round(amount * savePct);
  const spending = amount - savings;

  const gold = savings < 500 ? savings : Math.round(savings * 0.6);
  const cash = savings - gold;

  save.textContent = `₹${savings}`;
  goldSave.textContent = `₹${gold}`;
  cashSave.textContent = `₹${cash}`;
  weekly.textContent = `₹${Math.round(spending / 4)}`;
  daily.textContent = `₹${Math.round(spending / 24)}`;

  saveGoldHistory(gold);
  renderGoldHistory();
  renderSplitChart(gold, cash);

  dashboard.style.display = "block";
}

// 📊 Charts
function renderSplitChart(gold, cash){
  if(splitChart) splitChart.destroy();
  splitChart = new Chart(splitChartCanvas,{
    type:"doughnut",
    data:{ labels:["Gold Savings","Cash Savings"],
      datasets:[{ data:[gold, cash] }] },
    options:{ responsive:true, maintainAspectRatio:false }
  });
}

// 📈 History
function saveGoldHistory(gold){
  const h = JSON.parse(localStorage.getItem("goldHistory")) || [];
  h.push({ date:new Date().toLocaleDateString(), amount:gold });
  localStorage.setItem("goldHistory", JSON.stringify(h));
}

function renderGoldHistory(){
  const h = JSON.parse(localStorage.getItem("goldHistory")) || [];
  if(h.length === 0) return;

  if(goldHistoryChart) goldHistoryChart.destroy();
  goldHistoryChart = new Chart(goldHistoryChartCanvas,{
    type:"line",
    data:{
      labels:h.map(x=>x.date),
      datasets:[{
        label:"Gold Saved (₹)",
        data:h.map(x=>x.amount),
        borderColor:"#facc15",
        tension:0.3
      }]
    },
    options:{ responsive:true, maintainAspectRatio:false }
  });
}

// DOM
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const dashboard = document.getElementById("dashboard");
const save = document.getElementById("save");
const goldSave = document.getElementById("goldSave");
const cashSave = document.getElementById("cashSave");
const weekly = document.getElementById("weekly");
const daily = document.getElementById("daily");
const splitChartCanvas = document.getElementById("splitChart");
const goldHistoryChartCanvas = document.getElementById("goldHistoryChart");

// PWA
if("serviceWorker" in navigator){
  navigator.serviceWorker.register("sw.js");
}
