function generatePlan() {
  const amount = parseInt(document.getElementById("amount").value);
  const type = document.getElementById("type").value;
  const goal = document.getElementById("goal").value;

  if (!amount || amount <= 0) {
    alert("Enter a valid monthly amount");
    return;
  }

  // Smart saving logic
  let savePercent;

  if (amount <= 500) savePercent = 0.5;
  else if (amount <= 1000) savePercent = 0.45;
  else savePercent = 0.35;

  if (type === "hostel") savePercent -= 0.1;

  let savings = Math.round(amount * savePercent);
  let spending = amount - savings;

  let weeklyLimit = Math.round(spending / 4);
  let dailyLimit = Math.round(spending / 24);

  // Gold vs Cash logic
  let gold, cash;
  if (savings < 500) {
    gold = savings;
    cash = 0;
  } else {
    gold = Math.round(savings * 0.6);
    cash = savings - gold;
  }

  // Save to localStorage
  const data = {
    amount, savings, spending, gold, cash, weeklyLimit, dailyLimit
  };
  localStorage.setItem("financePlan", JSON.stringify(data));

  document.getElementById("dashboard").innerHTML = `
    <h3>📊 Your Smart Finance Plan</h3>
    <p><b>Total Savings:</b> ₹${savings}</p>
    <p>🪙 <b>Gold Savings:</b> ₹${gold}</p>
    <p>💵 <b>Cash Savings:</b> ₹${cash}</p>
    <p>🍔 <b>Monthly Spending:</b> ₹${spending}</p>
    <p>📆 <b>Weekly Limit:</b> ₹${weeklyLimit}</p>
    <p>📅 <b>Daily Limit:</b> ₹${dailyLimit}</p>
    <p>🎯 <b>Goal:</b> ${goal}</p>
    <p style="color:green;"><b>Status:</b> Disciplined & Sustainable</p>
  `;
}

// Load saved plan on refresh
window.onload = () => {
  const saved = localStorage.getItem("financePlan");
  if (saved) {
    const d = JSON.parse(saved);
    document.getElementById("dashboard").innerHTML = `
      <h3>🔁 Last Saved Plan</h3>
      <p>Total Savings: ₹${d.savings}</p>
      <p>Gold: ₹${d.gold} | Cash: ₹${d.cash}</p>
      <p>Weekly Limit: ₹${d.weeklyLimit}</p>
      <p>Daily Limit: ₹${d.dailyLimit}</p>
    `;
  }
};
