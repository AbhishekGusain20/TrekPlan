// ================= TREKPLAN AUTHENTICATION =================

const SESSION_KEY = "trekplan_session";

// Check both localStorage and sessionStorage
const localSession = localStorage.getItem(SESSION_KEY);
const temporarySession = sessionStorage.getItem(SESSION_KEY);

const session = localSession || temporarySession;

// If user is not logged in, go to login page
if (!session) {
    window.location.href = "login.html";
}

/* =========================================================
   TREKPLAN DASHBOARD JAVASCRIPT
========================================================= */


/* ================= ELEMENTS ================= */

const tripModal = document.getElementById("tripModal");

const createTripBtn =
    document.getElementById("createTripBtn");

const heroCreateBtn =
    document.getElementById("heroCreateBtn");

const quickCreate =
    document.getElementById("quickCreate");

const closeModal =
    document.getElementById("closeModal");

const tripForm =
    document.getElementById("tripForm");

const tripGrid =
    document.getElementById("tripGrid");

const toast =
    document.getElementById("toast");

const mobileMenu =
    document.getElementById("mobileMenu");

const sidebar =
    document.getElementById("sidebar");


/* =========================================================
   OPEN MODAL
========================================================= */

function openTripModal() {

    tripModal.classList.add("show");

    document.body.style.overflow = "hidden";

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeTripModal() {

    tripModal.classList.remove("show");

    document.body.style.overflow = "";

}


/* ================= BUTTONS ================= */

createTripBtn.addEventListener(
    "click",
    openTripModal
);


heroCreateBtn.addEventListener(
    "click",
    openTripModal
);


quickCreate.addEventListener(
    "click",
    openTripModal
);


closeModal.addEventListener(
    "click",
    closeTripModal
);


/* =========================================================
   CLOSE WHEN CLICK OUTSIDE
========================================================= */

tripModal.addEventListener(
    "click",
    function (event) {

        if (event.target === tripModal) {

            closeTripModal();

        }

    }
);


/* =========================================================
   CREATE TRIP
========================================================= */

tripForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        /* Get form values */

        const tripName =
            document.getElementById("tripName").value.trim();

        const startLocation =
            document.getElementById("startLocation").value.trim();

        const destination =
            document.getElementById("destination").value.trim();

        const startDate =
            document.getElementById("startDate").value;

        const endDate =
            document.getElementById("endDate").value;

        const people =
            document.getElementById("people").value;

        const budget =
            document.getElementById("budget").value;


        /* ================= VALIDATION ================= */

        if (endDate < startDate) {

            alert(
                "End date cannot be before start date."
            );

            return;

        }


        /* ================= TRIP OBJECT ================= */

        const newTrip = {

            id: Date.now(),

            name: tripName,

            startLocation: startLocation,

            destination: destination,

            startDate: startDate,

            endDate: endDate,

            people: people,

            budget: budget

        };


        /* ================= GET EXISTING TRIPS ================= */

        let trips =
            JSON.parse(
                localStorage.getItem("trekplanTrips")
            ) || [];


        /* ================= ADD NEW TRIP ================= */

        trips.push(newTrip);


        /* ================= SAVE ================= */

        localStorage.setItem(
            "trekplanTrips",
            JSON.stringify(trips)
        );


        /* ================= UPDATE UI ================= */

        renderTrips();


        /* ================= CLOSE MODAL ================= */

        closeTripModal();


        /* ================= RESET FORM ================= */

        tripForm.reset();


        /* ================= SHOW MESSAGE ================= */

        showToast();

    }
);


/* =========================================================
   RENDER SAVED TRIPS
========================================================= */

function renderTrips() {

    const savedTrips =
        JSON.parse(
            localStorage.getItem("trekplanTrips")
        ) || [];


    const defaultCards =
        tripGrid.querySelectorAll(".trip-card");


    /* Don't remove original demo cards */

    savedTrips.forEach(
        function (trip) {

            const existing =
                document.querySelector(
                    `[data-trip-id="${trip.id}"]`
                );

            if (existing) return;


            const card =
                document.createElement("article");

            card.className = "trip-card";

            card.setAttribute(
                "data-trip-id",
                trip.id
            );


            card.innerHTML = `

                <div class="trip-image rishikesh">

                    <span class="trip-status">
                        New Trip
                    </span>

                </div>


                <div class="trip-info">

                    <div>

                        <h3>
                            ${escapeHTML(trip.name)}
                        </h3>

                        <p>
                            ${trip.people} People
                            • ${escapeHTML(trip.destination)}
                        </p>

                    </div>

                    <strong>
                        ₹${Number(trip.budget).toLocaleString("en-IN")}
                    </strong>

                </div>


                <button class="view-trip">
                    View Trip →
                </button>

            `;


            tripGrid.prepend(card);

        }
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   TOAST
========================================================= */

function showToast() {

    toast.classList.add("show");


    setTimeout(
        function () {

            toast.classList.remove("show");

        },
        3500
    );

}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

mobileMenu.addEventListener(
    "click",
    function () {

        sidebar.classList.toggle("open");

    }
);


/* =========================================================
   CLOSE SIDEBAR AFTER CLICK
========================================================= */

document
    .querySelectorAll(".nav-link")
    .forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    if (
                        window.innerWidth <= 850
                    ) {

                        sidebar.classList.remove(
                            "open"
                        );

                    }

                }
            );

        }
    );


/* =========================================================
   QUICK ACTIONS
========================================================= */

document
    .getElementById("budgetButton")
    .addEventListener(
        "click",
        function () {

            alert(
                "Budget Planner will be available soon."
            );

        }
    );


document
    .getElementById("mapButton")
    .addEventListener(
        "click",
        function () {

            alert(
                "Interactive TrekPlan Map is coming soon."
            );

        }
    );


document
    .getElementById("exploreBtn")
    .addEventListener(
        "click",
        function () {

            alert(
                "Destination Explorer is coming soon."
            );

        }
    );


/* =========================================================
   SEARCH
========================================================= */

const searchInput =
    document.getElementById("searchInput");


searchInput.addEventListener(
    "input",
    function () {

        const search =
            searchInput.value
                .toLowerCase()
                .trim();


        const cards =
            document.querySelectorAll(".trip-card");


        cards.forEach(
            function (card) {

                const text =
                    card.innerText.toLowerCase();


                if (
                    text.includes(search)
                ) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            }
        );

    }
);


/* =========================================================
   LOAD SAVED DATA
========================================================= */

renderTrips();






// ================= LOGOUT =================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        // Remove login session
        localStorage.removeItem("trekplan_session");
        sessionStorage.removeItem("trekplan_session");

        // Go back to login page
        window.location.href = "login.html";

    });

}