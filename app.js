const STORAGE_KEY = "budgify_transactions_v1";

let transactions = [];

const balanceAmountEl = document.getElementById("balanceAmount");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const transactionForm = document.getElementById("transactionForm");
const transactionsListEl = document.getElementById("transactionsList");
const clearAllBtn = document.getElementById("clearAll");

init();

function init() {
  loadTransactions();
  render();
  setupForm();
  clearAllBtn.onclick = clearAll;
}

/* LOAD */
function loadTransactions() {
  const raw = localStorage.getItem(STORAGE_KEY);
  transactions = raw ? JSON.parse(raw) : [];
}
function saveTransactions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

/* RENDER */
function render() {
  renderSummary();
  renderTransactions();
}

function renderSummary() {
  let income = 0;
  let expense = 0;

  transactions.forEach(t => {
    if (t.type === "income") income += Number(t.amount);
    else expense += Number(t.amount);
  });

  balanceAmountEl.textContent = formatCurrency(income - expense);
  totalIncomeEl.textContent = formatCurrency(income);
  totalExpenseEl.textContent = formatCurrency(expense);
}

function renderTransactions() {
  transactionsListEl.innerHTML = "";

  if (transactions.length === 0) {
    transactionsListEl.innerHTML = "<li style='color:#9ca3af'>Geen transacties.</li>";
    return;
  }

  transactions.forEach(t => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${t.type === "income" ? "Inkomst" : "Uitgave"}</strong> –
      ${t.category} – ${t.date} – € ${t.amount.toFixed(2)}
    `;
    transactionsListEl.appendChild(li);
  });
}

/* FORM */
function setupForm() {
  transactionForm.addEventListener("submit", e => {
    e.preventDefault();

    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;
    const amount = Number(document.getElementById("amount").value);
    const date = document.getElementById("date").value;
    const note = document.getElementById("note").value;

    transactions.push({ type, category, amount, date, note });
    saveTransactions();
    render();
    transactionForm.reset();
  });
}

/* CLEAR */
function clearAll() {
  if (!confirm("Alles verwijderen?")) return;
  transactions = [];
  saveTransactions();
  render();
}

/* HELPERS */
function formatCurrency(v) {
  return `€ ${v.toFixed(2).replace(".", ",")}`;
}
