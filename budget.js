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

const totalBudgetElement = document.getElementById("totalBudget");
const totalSpentElement = document.getElementById("totalSpent");
const remainingBudgetElement = document.getElementById("remainingBudget");

const progressFill = document.getElementById("progressFill");
const percentageElement = document.getElementById("percentage");
const budgetMessage = document.getElementById("budgetMessage");

const expenseList = document.getElementById("expenseList");
const expenseCount = document.getElementById("expenseCount");

const logoutBtn = document.getElementById("logoutBtn");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");


/* ================= LOCAL STORAGE ================= */

let budget = Number(
    localStorage.getItem("trekplanBudget")
) || 0;

let expenses = [];

try {

    expenses =
        JSON.parse(
            localStorage.getItem("trekplanExpenses")
        ) || [];

} catch (error) {

    expenses = [];

}


/* ================= FORMAT MONEY ================= */

function formatMoney(amount) {

    return "₹" + Number(amount).toLocaleString("en-IN");

}


/* ================= SAVE BUDGET ================= */

if (budgetForm) {

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

}


/* ================= ADD EXPENSE ================= */

if (expenseForm) {

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

}


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


    if (totalBudgetElement) {

        totalBudgetElement.textContent =
            formatMoney(budget);

    }


    if (totalSpentElement) {

        totalSpentElement.textContent =
            formatMoney(totalSpent);

    }


    if (remainingBudgetElement) {

        if (remaining < 0) {

            remainingBudgetElement.textContent =
                "-" + formatMoney(Math.abs(remaining));

        } else {

            remainingBudgetElement.textContent =
                formatMoney(remaining);

        }

    }


    /* ================= PROGRESS ================= */

    let percentage = 0;


    if (budget > 0) {

        percentage =
            Math.round(
                (totalSpent / budget) * 100
            );

    }


    if (percentageElement) {

        percentageElement.textContent =
            percentage + "%";

    }


    /* Don't allow progress bar beyond 100% */

    const progress =
        Math.min(percentage, 100);


    if (progressFill) {

        progressFill.style.width =
            progress + "%";


        /* Remove old classes */

        progressFill.classList.remove(
            "warning",
            "danger"
        );

    }


    /* ================= STATUS ================= */

    if (!budgetMessage) {
        return;
    }


    if (budget === 0) {

        budgetMessage.textContent =
            "Set your budget to start tracking your expenses.";

    }

    else if (percentage < 70) {

        budgetMessage.textContent =
            "Great! Your spending is under control.";

    }

    else if (percentage < 100) {

        if (progressFill) {

            progressFill.classList.add("warning");

        }

        budgetMessage.textContent =
            "You are getting close to your budget limit.";

    }

    else {

        if (progressFill) {

            progressFill.classList.add("danger");

        }

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

    if (!expenseList) {
        return;
    }


    expenseList.innerHTML = "";


    /* ================= EMPTY STATE ================= */

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


        if (expenseCount) {

            expenseCount.textContent =
                "0 expenses";

        }

        return;
    }


    /* ================= EXPENSE COUNT ================= */

    if (expenseCount) {

        expenseCount.textContent =
            expenses.length +
            (
                expenses.length === 1
                    ? " expense"
                    : " expenses"
            );

    }


    /* ================= CREATE EXPENSE ITEMS ================= */

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
                        ${escapeHTML(expense.name)}
                    </div>

                    <div class="expense-type">
                        ${escapeHTML(expense.category)}
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


/* ================= ESCAPE HTML ================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}


/* ================= LOGOUT ================= */

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        localStorage.removeItem(
            "trekplan_currentUser"
        );

        window.location.href =
            "login.html";

    });

}


/* ================= MOBILE MENU ================= */

if (menuBtn && sidebar) {

    menuBtn.addEventListener("click", function () {

        sidebar.classList.toggle("open");

    });

}


/* ================= INITIAL LOAD ================= */

updateBudget();

renderExpenses();