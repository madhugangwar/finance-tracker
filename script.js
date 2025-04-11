let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');
const typeInput = document.getElementById('type');
const list = document.getElementById('transaction-list');
const balanceDisplay = document.getElementById('balance');
const incomeDisplay = document.getElementById('income');
const expenseDisplay = document.getElementById('expense');
const filterDateInput = document.getElementById('filter-date');

// Add transaction
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const date = dateInput.value;
  const type = typeInput.value;

  if (description === '' || isNaN(amount) || !date) {
    alert('Please fill out all fields correctly!');
    return;
  }

  const signedAmount = type === 'expense' ? -Math.abs(amount) : Math.abs(amount);

  const transaction = {
    id: Date.now(),
    description,
    amount: signedAmount,
    date,
    type
  };

  transactions.push(transaction);
  updateLocalStorage();
  updateUI();
  form.reset();
});

// Delete transaction
function deleteTransaction(id) {
  transactions = transactions.filter(txn => txn.id !== id);
  updateLocalStorage();
  updateUI();
}

// Update UI
function updateUI() {
  list.innerHTML = '';

  let income = 0;
  let expense = 0;

  transactions.forEach(txn => {
    const li = document.createElement('li');
    li.classList.add(txn.amount < 0 ? 'expense' : 'income');

    li.innerHTML = `
      ${txn.date} - ${txn.description}: Rs ${Math.abs(txn.amount)}
      <button class="delete-btn" onclick="deleteTransaction(${txn.id})">X</button>
    `;

    list.appendChild(li);

    if (txn.amount < 0) {
      expense += Math.abs(txn.amount);
    } else {
      income += txn.amount;
    }
  });

  incomeDisplay.textContent = `+Rs ${income}`;
  expenseDisplay.textContent = `-Rs ${expense}`;
  balanceDisplay.textContent = `Rs ${income - expense}`;
}

// Store data in localStorage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Filter transactions by selected date
filterDateInput.addEventListener('change', function () {
  const selectedDate = this.value;

  const filtered = transactions.filter(txn => txn.date === selectedDate);
  renderFilteredList(filtered);
});

// Render filtered transactions
function renderFilteredList(filteredTxns) {
  list.innerHTML = '';

  filteredTxns.forEach(txn => {
    const li = document.createElement('li');
    li.classList.add(txn.amount < 0 ? 'expense' : 'income');

    li.innerHTML = `
      ${txn.date} - ${txn.description}: Rs ${Math.abs(txn.amount)}
      <button class="delete-btn" onclick="deleteTransaction(${txn.id})">X</button>
    `;

    list.appendChild(li);
  });
}

// Initial render
updateUI();
