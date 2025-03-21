document.getElementById('add-expense-link').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('add-expense-section').style.display = 'block';
    document.getElementById('split-bill-section').style.display = 'none';
});

document.getElementById('split-bill-link').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('add-expense-section').style.display = 'none';
    document.getElementById('split-bill-section').style.display = 'block';
});

document.getElementById('split-bill-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const billAmount = parseFloat(document.getElementById('bill-amount').value);
    const numberOfPeople = parseInt(document.getElementById('number-of-people').value);

    if (isNaN(billAmount) || isNaN(numberOfPeople) || numberOfPeople <= 0) {
        alert('Please enter valid values.');
        return;
    }

    const splitAmount = (billAmount / numberOfPeople).toFixed(2);
    document.getElementById('split-result').innerText = `Each person should pay: $${splitAmount}`;
});

document.addEventListener('DOMContentLoaded', function() {
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const totalAmount = document.getElementById('total-amount');
    const filterCategory = document.getElementById('filter-category');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    expenseForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('expense-name').value;
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const category = document.getElementById('expense-category').value;
        const date = document.getElementById('expense-date').value;

        if (!name || isNaN(amount) || !category || !date) {
            alert('Please fill in all fields.');
            return;
        }

        const expense = {
            id: Date.now(),
            name,
            amount,
            category,
            date
        };

        expenses.push(expense);
        displayExpenses(expenses);
        updateTotalAmount();
        saveExpenses(expenses);

        expenseForm.reset();
    });

    expenseList.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            const id = parseInt(event.target.dataset.id);
            expenses = expenses.filter(expense => expense.id !== id);
            displayExpenses(expenses);
            updateTotalAmount();
            saveExpenses(expenses);
        }

        if (event.target.classList.contains('edit-btn')) {
            const id = parseInt(event.target.dataset.id);
            const expense = expenses.find(expense => expense.id === id);

            document.getElementById('expense-name').value = expense.name;
            document.getElementById('expense-amount').value = expense.amount;
            document.getElementById('expense-category').value = expense.category;
            document.getElementById('expense-date').value = expense.date;

            expenses = expenses.filter(expense => expense.id !== id);
            displayExpenses(expenses);
            updateTotalAmount();
            saveExpenses(expenses);
        }
    });

    filterCategory.addEventListener('change', function(event) {
        const category = event.target.value;
        if (category === 'All') {
            displayExpenses(expenses);
        } else {
            const filteredExpenses = expenses.filter(expense => expense.category === category);
            displayExpenses(filteredExpenses);
        }
    });

    function displayExpenses(expenses) {
        expenseList.innerHTML = '';
        expenses.forEach(expense => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${expense.name}</td>
                <td>$${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                    <button class="edit-btn" data-id="${expense.id}">Edit</button>
                    <button class="delete-btn" data-id="${expense.id}">Delete</button>
                </td>
            `;

            expenseList.appendChild(row);
        });
    }

    function updateTotalAmount() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmount.textContent = total.toFixed(2);
    }

    function saveExpenses(expenses) {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    // Initial display of expenses
    displayExpenses(expenses);
    updateTotalAmount();
});