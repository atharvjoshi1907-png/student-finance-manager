let splitChart, goldHistoryChart;

// Theme
function toggleTheme(){
  document.body.classList.toggle("dark");
  localStorage.setItem("theme",
    document.body.classList.contains("dark")?"dark":"light");
}
if(localStorage.getItem("theme")==="dark"){
  document.body.classList.add("dark");
}

// Gold price
async function fetchGoldPrice(){
  try{
    const res = await fetch(
      "https://api.exchangerate.host/latest?base=XAU&symbols=INR"
    );
    const data = await res.json();
    return data.rates.INR / 31.1035;
  }catch{
    return null;
  }
}

async function generatePlan(){
  const amount = +amountInput.value;
  if(!amount) return alert("Enter amount");

  let savePct = amount<=500?0.5:amount<=1000?0.45:0.35;
  if(typeInput.value==="hostel") savePct-=0.1;

  const savings = Math.round(amount*savePct);
  const spending = amount - savings;
  const goldInvest = savings<500?savings:Math.round(savings*0.6);

  const price = await fetchGoldPrice();
  if(!price) return alert("Gold price unavailable");

  const grams = goldInvest / price;
  const current = Math.round(grams * price);
  const diff = current - goldInvest;

  save.textContent = `₹${savings}`;
  weekly.textContent = `₹${Math.round(spending/4)}`;
  daily.textContent = `₹${Math.round(spending/24)}`;
  goldValue.textContent = `₹${current}`;
  goldPL.innerHTML = diff>=0
    ? `<span class="profit">+₹${diff}</span>`
    : `<span class="loss">−₹${Math.abs(diff)}</span>`;

  goldPriceText.textContent =
    `🪙 Gold Price: ₹${price.toFixed(2)} / gram`;

  saveGoldHistory(diff);
  renderGoldHistory();
  renderSplitChart(goldInvest, spending);

  dashboard.style.display="block";
}

// Charts
function renderSplitChart(g,s){
  if(splitChart) splitChart.destroy();
  splitChart = new Chart(splitChartCanvas,{
    type:"doughnut",
    data:{labels:["Gold","Spending"],
      datasets:[{data:[g,s]}]},
    options:{responsive:true,maintainAspectRatio:false}
  });
}

function saveGoldHistory(p){
  const h = JSON.parse(localStorage.getItem("goldHistory"))||[];
  h.push({date:new Date().toLocaleDateString(),profit:p});
  localStorage.setItem("goldHistory",JSON.stringify(h));
}

function renderGoldHistory(){
  const h = JSON.parse(localStorage.getItem("goldHistory"))||[];
  if(h.length===0) return;
  if(goldHistoryChart) goldHistoryChart.destroy();

  goldHistoryChart = new Chart(goldHistoryChartCanvas,{
    type:"line",
    data:{
      labels:h.map(x=>x.date),
      datasets:[{
        data:h.map(x=>x.profit),
        borderColor:"#22c55e",
        tension:0.3
      }]
    },
    options:{responsive:true,maintainAspectRatio:false}
  });
}

// DOM
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const alertLimit = document.getElementById("alertLimit");
const dashboard = document.getElementById("dashboard");
const save = document.getElementById("save");
const weekly = document.getElementById("weekly");
const daily = document.getElementById("daily");
const goldValue = document.getElementById("goldValue");
const goldPL = document.getElementById("goldPL");
const goldPriceText = document.getElementById("goldPriceText");
const splitChartCanvas = document.getElementById("splitChart");
const goldHistoryChartCanvas =
  document.getElementById("goldHistoryChart");

// PWA
if("serviceWorker" in navigator){
  navigator.serviceWorker.register("sw.js");
}
