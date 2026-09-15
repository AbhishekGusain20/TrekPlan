/* =====================================================
   TREKPLAN — BUDGET PLANNER
===================================================== */


/* ================= GET ELEMENTS ================= */

const budgetForm = document.getElementById("budgetForm");
const budgetInput = document.getElementById("budgetInput");

const expenseForm = document.getElementById("expenseForm");

const expenseName = document.getElementById("expenseName");
const expenseCategory = document.getElementById("expenseCategory");
const expenseAmount = document.getElementById("expenseAmount");

const totalBudgetElement =
    document.getElementById("totalBudget");

const totalSpentElement =
    document.getElementById("totalSpent");

const remainingBudgetElement =
    document.getElementById("remainingBudget");

const progressFill =
    document.getElementById("progressFill");

const percentageElement =
    document.getElementById("percentage");

const budgetMessage =
    document.getElementById("budgetMessage");

const expenseList =
    document.getElementById("expenseList");

const expenseCount =
    document.getElementById("expenseCount");

const logoutBtn =
    document.getElementById("logoutBtn");

const menuBtn =
    document.getElementById("menuBtn");

const sidebar =
    document.getElementById("sidebar");


/* ================= LOCAL STORAGE ================= */

let budget =
    Number(localStorage.getItem("trekplanBudget")) || 0;

let expenses =
    JSON.parse(
        localStorage.getItem("trekplanExpenses")
    ) || [];


/* ================= FORMAT MONEY ================= */

function formatMoney(amount) {

    return "₹" + Number(amount).toLocaleString("en-IN");

}


/* ================= SAVE BUDGET ================= */

budgetForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const newBudget =
        Number(budgetInput.value);

    if (newBudget <= 0) {

        alert("Please enter a valid budget.");

        return;
    }

    budget = newBudget;

    localStorage.setItem(
        "trekplanBudget",
        budget
    );

    budgetInput.value = "";

    updateBudget();

    alert("Budget saved successfully!");

});


/* ================= ADD EXPENSE ================= */

expenseForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name =
        expenseName.value.trim();

    const category =
        expenseCategory.value;

    const amount =
        Number(expenseAmount.value);


    if (!name || !category || amount <= 0) {

        alert("Please enter valid expense details.");

        return;
    }


    const expense = {

        id: Date.now(),

        name: name,

        category: category,

        amount: amount

    };


    expenses.push(expense);


    localStorage.setItem(
        "trekplanExpenses",
        JSON.stringify(expenses)
    );


    expenseForm.reset();

    updateBudget();

    renderExpenses();

});


/* ================= DELETE EXPENSE ================= */

function deleteExpense(id) {

    expenses =
        expenses.filter(function (expense) {

            return expense.id !== id;

        });


    localStorage.setItem(
        "trekplanExpenses",
        JSON.stringify(expenses)
    );


    updateBudget();

    renderExpenses();

}


/* ================= CALCULATE TOTAL ================= */

function calculateTotalSpent() {

    return expenses.reduce(

        function (total, expense) {

            return total + Number(expense.amount);

        },

        0

    );

}


/* ================= UPDATE BUDGET ================= */

function updateBudget() {

    const totalSpent =
        calculateTotalSpent();

    const remaining =
        budget - totalSpent;


    totalBudgetElement.textContent =
        formatMoney(budget);

    totalSpentElement.textContent =
        formatMoney(totalSpent);


    if (remaining < 0) {

        remainingBudgetElement.textContent =
            "-" + formatMoney(Math.abs(remaining));

    } else {

        remainingBudgetElement.textContent =
            formatMoney(remaining);

    }


    /* ================= PROGRESS ================= */

    let percentage = 0;


    if (budget > 0) {

        percentage =
            Math.round(
                (totalSpent / budget) * 100
            );

    }


    percentageElement.textContent =
        percentage + "%";


    /* Don't allow progress bar beyond 100% */

    const progress =
        Math.min(percentage, 100);

    progressFill.style.width =
        progress + "%";


    /* Reset classes */

    progressFill.classList.remove(
        "warning",
        "danger"
    );


    /* ================= STATUS ================= */

    if (budget === 0) {

        budgetMessage.textContent =
            "Set your budget to start tracking your expenses.";

    }

    else if (percentage < 70) {

        budgetMessage.textContent =
            "Great! Your spending is under control.";

    }

    else if (percentage < 100) {

        progressFill.classList.add("warning");

        budgetMessage.textContent =
            "You are getting close to your budget limit.";

    }

    else {

        progressFill.classList.add("danger");

        budgetMessage.textContent =
            "You have reached or exceeded your budget.";

    }

}


/* ================= CATEGORY ICON ================= */

function getCategoryIcon(category) {

    const icons = {

        Travel: "🚗",

        Stay: "🏨",

        Food: "🍔",

        Gear: "🎒",

        Other: "📌"

    };

    return icons[category] || "📌";

}


/* ================= DISPLAY EXPENSES ================= */

function renderExpenses() {

    expenseList.innerHTML = "";


    if (expenses.length === 0) {

        expenseList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ₹
                </div>

                <h3>No expenses yet</h3>

                <p>
                    Add your first expense to start tracking your trip budget.
                </p>

            </div>

        `;

        expenseCount.textContent =
            "0 expenses";

        return;
    }


    expenseCount.textContent =
        expenses.length +
        (expenses.length === 1
            ? " expense"
            : " expenses");


    expenses.forEach(function (expense) {

        const expenseItem =
            document.createElement("div");

        expenseItem.className =
            "expense-item";


        expenseItem.innerHTML = `

            <div class="expense-info">

                <div class="expense-category">
                    ${getCategoryIcon(expense.category)}
                </div>

                <div>

                    <div class="expense-name">
                        ${expense.name}
                    </div>

                    <div class="expense-type">
                        ${expense.category}
                    </div>

                </div>

            </div>


            <div class="expense-right">

                <span class="expense-amount">
                    ${formatMoney(expense.amount)}
                </span>

                <button
                    class="delete-btn"
                    onclick="deleteExpense(${expense.id})"
                    title="Delete expense"
                >
                    🗑
                </button>

            </div>

        `;


        expenseList.appendChild(expenseItem);

    });

}


/* ================= LOGOUT ================= */

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        localStorage.removeItem("trekplan_currentUser");

        window.location.href =
            "login.html";

    });

}


/* ================= MOBILE MENU ================= */

if (menuBtn) {

    menuBtn.addEventListener("click", function () {

        sidebar.classList.toggle("open");

    });

}


/* ================= INITIAL LOAD ================= */

updateBudget();

renderExpenses();