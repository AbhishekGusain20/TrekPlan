/* =====================================================
   TREKPLAN — BUDGET PLANNER
   Dashboard Blue Theme
===================================================== */


/* ================= GET ELEMENTS ================= */

const budgetForm =
    document.getElementById("budgetForm");

const budgetInput =
    document.getElementById("budgetInput");

const expenseForm =
    document.getElementById("expenseForm");

const expenseName =
    document.getElementById("expenseName");

const expenseCategory =
    document.getElementById("expenseCategory");

const expenseAmount =
    document.getElementById("expenseAmount");

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


/* =====================================================
   CURRENT TRIP
===================================================== */

let currentTrip = null;

try {

    currentTrip =
        JSON.parse(
            localStorage.getItem(
                "trekplan_currentTrip"
            )
        );

} catch (error) {

    currentTrip = null;

}


/* =====================================================
   GET BUDGET
===================================================== */

let budget = 0;


/*
   Priority:

   1. Current trip budget
   2. Saved budget
   3. 0
*/

if (
    currentTrip &&
    Number(currentTrip.budget) > 0
) {

    budget =
        Number(currentTrip.budget);

} else {

    budget =
        Number(
            localStorage.getItem(
                "trekplanBudget"
            )
        ) || 0;

}


/* =====================================================
   GET EXPENSES
===================================================== */

let expenses = [];

try {

    expenses =
        JSON.parse(
            localStorage.getItem(
                "trekplanExpenses"
            )
        ) || [];

} catch (error) {

    expenses = [];

}


/* =====================================================
   FORMAT MONEY
===================================================== */

function formatMoney(amount) {

    return (
        "₹" +
        Number(amount || 0)
            .toLocaleString("en-IN")
    );

}


/* =====================================================
   SAVE BUDGET
===================================================== */

if (budgetForm) {

    budgetForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* ================= GET INPUT ================= */

            const inputValue =
                budgetInput.value.trim();

            const newBudget =
                Number(inputValue);


            /* ================= VALIDATION ================= */

            if (
                inputValue === "" ||
                !Number.isFinite(newBudget) ||
                newBudget <= 0
            ) {

                alert(
                    "Please enter a valid budget."
                );

                return;

            }


            /* ================= UPDATE BUDGET ================= */

            budget =
                newBudget;


            /* ================= CURRENT TRIP ================= */

            let trip = null;

            try {

                trip =
                    JSON.parse(
                        localStorage.getItem(
                            "trekplan_currentTrip"
                        )
                    );

            } catch (error) {

                trip = null;

            }


            /* =================================================
               UPDATE CURRENT TRIP
            ================================================= */

            if (trip) {

                trip.budget =
                    newBudget;


                /* Save current trip */

                localStorage.setItem(
                    "trekplan_currentTrip",
                    JSON.stringify(trip)
                );


                /* ================= UPDATE ALL TRIPS ================= */

                let trips = [];

                try {

                    trips =
                        JSON.parse(
                            localStorage.getItem(
                                "trekplanTrips"
                            )
                        ) || [];

                } catch (error) {

                    trips = [];

                }


                /*
                   Find current trip.

                   First try ID.
                */

                let tripIndex =
                    trips.findIndex(
                        function (savedTrip) {

                            return (
                                savedTrip.id &&
                                trip.id &&
                                savedTrip.id === trip.id
                            );

                        }
                    );


                /*
                   If ID is not available,
                   try matching destination + trip name.
                */

                if (tripIndex === -1) {

                    tripIndex =
                        trips.findIndex(
                            function (savedTrip) {

                                return (
                                    savedTrip.tripName ===
                                        trip.tripName &&

                                    savedTrip.destination ===
                                        trip.destination
                                );

                            }
                        );

                }


                /* ================= UPDATE TRIP ================= */

                if (tripIndex !== -1) {

                    trips[tripIndex].budget =
                        newBudget;


                    localStorage.setItem(
                        "trekplanTrips",
                        JSON.stringify(trips)
                    );

                }

            }


            /* =================================================
               SAVE GENERAL BUDGET
            ================================================= */

            localStorage.setItem(
                "trekplanBudget",
                String(newBudget)
            );


            /* =================================================
               CLEAR INPUT
            ================================================= */

            budgetInput.value = "";


            /* =================================================
               UPDATE UI
            ================================================= */

            updateBudget();


            /* =================================================
               SUCCESS MESSAGE
            ================================================= */

            alert(
                "Budget updated successfully! 🎉"
            );

        }
    );

}


/* =====================================================
   ADD EXPENSE
===================================================== */

if (expenseForm) {

    expenseForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                expenseName.value.trim();

            const category =
                expenseCategory.value;

            const amount =
                Number(
                    expenseAmount.value
                );


            /* ================= VALIDATION ================= */

            if (
                !name ||
                !category ||
                !Number.isFinite(amount) ||
                amount <= 0
            ) {

                alert(
                    "Please enter valid expense details."
                );

                return;

            }


            /* ================= CREATE EXPENSE ================= */

            const expense = {

                id: Date.now(),

                name: name,

                category: category,

                amount: amount

            };


            /* ================= ADD ================= */

            expenses.push(
                expense
            );


            /* ================= SAVE ================= */

            localStorage.setItem(
                "trekplanExpenses",
                JSON.stringify(expenses)
            );


            /* ================= RESET ================= */

            expenseForm.reset();


            /* ================= UPDATE ================= */

            updateBudget();

            renderExpenses();

        }
    );

}


/* =====================================================
   DELETE EXPENSE
===================================================== */

function deleteExpense(id) {

    expenses =
        expenses.filter(
            function (expense) {

                return expense.id !== id;

            }
        );


    localStorage.setItem(
        "trekplanExpenses",
        JSON.stringify(expenses)
    );


    updateBudget();

    renderExpenses();

}


/* =====================================================
   CALCULATE TOTAL SPENT
===================================================== */

function calculateTotalSpent() {

    return expenses.reduce(

        function (total, expense) {

            return (
                total +
                Number(expense.amount || 0)
            );

        },

        0

    );

}


/* =====================================================
   UPDATE BUDGET
===================================================== */

function updateBudget() {

    const totalSpent =
        calculateTotalSpent();


    const remaining =
        budget - totalSpent;


    /* ================= TOTAL BUDGET ================= */

    if (totalBudgetElement) {

        totalBudgetElement.textContent =
            formatMoney(budget);

    }


    /* ================= TOTAL SPENT ================= */

    if (totalSpentElement) {

        totalSpentElement.textContent =
            formatMoney(totalSpent);

    }


    /* ================= REMAINING ================= */

    if (remainingBudgetElement) {

        if (remaining < 0) {

            remainingBudgetElement.textContent =
                "-" +
                formatMoney(
                    Math.abs(remaining)
                );

        } else {

            remainingBudgetElement.textContent =
                formatMoney(remaining);

        }

    }


    /* =================================================
       CALCULATE PERCENTAGE
    ================================================= */

    let percentage = 0;


    if (budget > 0) {

        percentage =
            Math.round(
                (totalSpent / budget) * 100
            );

    }


    /* ================= PERCENTAGE ================= */

    if (percentageElement) {

        percentageElement.textContent =
            percentage + "%";

    }


    /* =================================================
       PROGRESS BAR
    ================================================= */

    const progress =
        Math.min(
            Math.max(percentage, 0),
            100
        );


    if (progressFill) {

        progressFill.style.width =
            progress + "%";


        progressFill.classList.remove(
            "warning",
            "danger"
        );


        if (percentage >= 100) {

            progressFill.classList.add(
                "danger"
            );

        } else if (percentage >= 70) {

            progressFill.classList.add(
                "warning"
            );

        }

    }


    /* =================================================
       BUDGET MESSAGE
    ================================================= */

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

        budgetMessage.textContent =
            "You are getting close to your budget limit.";

    }

    else {

        budgetMessage.textContent =
            "You have reached or exceeded your budget.";

    }

}


/* =====================================================
   CATEGORY ICON
===================================================== */

function getCategoryIcon(category) {

    const icons = {

        Travel: "🚗",

        Stay: "🏨",

        Food: "🍔",

        Gear: "🎒",

        Other: "📌"

    };


    return (
        icons[category] ||
        "📌"
    );

}


/* =====================================================
   DISPLAY EXPENSES
===================================================== */

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

                <h3>
                    No expenses yet
                </h3>

                <p>
                    Add your first expense to
                    start tracking your trip budget.
                </p>

            </div>

        `;


        if (expenseCount) {

            expenseCount.textContent =
                "0 expenses";

        }

        return;

    }


    /* ================= COUNT ================= */

    if (expenseCount) {

        expenseCount.textContent =
            expenses.length +
            (
                expenses.length === 1
                    ? " expense"
                    : " expenses"
            );

    }


    /* ================= CREATE ITEMS ================= */

    expenses.forEach(
        function (expense) {

            const expenseItem =
                document.createElement("div");


            expenseItem.className =
                "expense-item";


            expenseItem.innerHTML = `

                <div class="expense-info">

                    <div class="expense-category">

                        ${getCategoryIcon(
                            expense.category
                        )}

                    </div>


                    <div>

                        <div class="expense-name">

                            ${escapeHTML(
                                expense.name
                            )}

                        </div>


                        <div class="expense-type">

                            ${escapeHTML(
                                expense.category
                            )}

                        </div>

                    </div>

                </div>


                <div class="expense-right">

                    <span class="expense-amount">

                        ${formatMoney(
                            expense.amount
                        )}

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


            expenseList.appendChild(
                expenseItem
            );

        }
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;

}


/* =====================================================
   LOGOUT
===================================================== */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "trekplan_currentUser"
            );


            window.location.href =
                "login.html";

        }
    );

}


/* =====================================================
   MOBILE MENU
===================================================== */

if (menuBtn && sidebar) {

    menuBtn.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "open"
            );

        }
    );

}


/* =====================================================
   INITIAL LOAD
===================================================== */

updateBudget();

renderExpenses();