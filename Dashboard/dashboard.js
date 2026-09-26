// =====================================================
// TREKPLAN — DASHBOARD
// Day 8: Dynamic Trip + Budget Data
// =====================================================


// ================= AUTHENTICATION =================

const SESSION_KEY = "trekplan_session";

const localSession = localStorage.getItem(SESSION_KEY);
const temporarySession = sessionStorage.getItem(SESSION_KEY);

const session = localSession || temporarySession;

if (!session) {
    window.location.href = "/Signup Login/login.html";
}


// ================= ELEMENTS =================

const tripGrid = document.getElementById("tripGrid");

const createTripBtn =
    document.getElementById("createTripBtn");

const heroCreateBtn =
    document.getElementById("heroCreateBtn");

const quickCreate =
    document.getElementById("quickCreate");

const budgetButton =
    document.getElementById("budgetButton");

const mapButton =
    document.getElementById("mapButton");

const exploreBtn =
    document.getElementById("exploreBtn");

const mobileMenu =
    document.getElementById("mobileMenu");

const sidebar =
    document.getElementById("sidebar");

const logoutBtn =
    document.getElementById("logoutBtn");

const searchInput =
    document.getElementById("searchInput");


// ================= GET SAVED TRIPS =================

function getTrips() {

    return JSON.parse(
        localStorage.getItem("trekplanTrips")
    ) || [];

}


// ================= FORMAT MONEY =================

function formatMoney(amount) {

    return "₹" + Number(amount || 0)
        .toLocaleString("en-IN");

}


// ================= CALCULATE DAYS =================

function calculateDays(startDate, endDate) {

    if (!startDate || !endDate) {
        return 1;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference =
        end - start;

    const days =
        Math.ceil(
            difference / (1000 * 60 * 60 * 24)
        ) + 1;

    return days > 0 ? days : 1;

}


// ================= UPDATE DASHBOARD STATS =================

function updateStats() {

    const trips = getTrips();

    // Total trips
    const totalTrips =
        document.getElementById("totalTrips");

    if (totalTrips) {
        totalTrips.textContent =
            trips.length;
    }


    // Upcoming trips
    const today =
        new Date();

    today.setHours(0, 0, 0, 0);

    const upcomingTrips =
        trips.filter(function (trip) {

            if (!trip.startDate) {
                return false;
            }

            const start =
                new Date(trip.startDate);

            return start >= today;

        });


    const upcomingElement =
        document.querySelector(
            ".stats-grid .stat-card:nth-child(2) strong"
        );

    if (upcomingElement) {

        upcomingElement.textContent =
            upcomingTrips.length;

    }


    // Total trip budget
    const totalBudget =
        trips.reduce(function (total, trip) {

            return total +
                Number(trip.budget || 0);

        }, 0);


    const budgetElement =
        document.querySelector(
            ".stats-grid .stat-card:nth-child(3) strong"
        );

    if (budgetElement) {

        budgetElement.textContent =
            formatMoney(totalBudget);

    }


    // Places explored
    const destinations =
        new Set(
            trips.map(function (trip) {

                return trip.destination
                    ?.trim()
                    .toLowerCase();

            }).filter(Boolean)
        );


    const placesElement =
        document.querySelector(
            ".stats-grid .stat-card:nth-child(4) strong"
        );

    if (placesElement) {

        placesElement.textContent =
            destinations.size;

    }

}


// ================= RENDER TRIPS =================

function renderTrips() {

    const trips =
        getTrips();

    if (!tripGrid) {
        return;
    }


    // Remove only dynamically created cards
    const oldCards =
        tripGrid.querySelectorAll(
            ".dynamic-trip-card"
        );

    oldCards.forEach(function (card) {

        card.remove();

    });


    // If no trips exist
    if (trips.length === 0) {

        return;

    }


    trips.forEach(function (trip) {

        const card =
            document.createElement("article");

        card.className =
            "trip-card dynamic-trip-card";


        const days =
            calculateDays(
                trip.startDate,
                trip.endDate
            );


        card.innerHTML = `

            <div class="trip-image rishikesh">

                <span class="trip-status">
                    Upcoming
                </span>

            </div>


            <div class="trip-info">

                <div>

                    <h3>
                        ${escapeHTML(
                            trip.tripName ||
                            "My Trip"
                        )}
                    </h3>

                    <p>
                        ${days} Days •
                        ${trip.travelers || 1} People
                        •
                        ${escapeHTML(
                            trip.destination || ""
                        )}
                    </p>

                </div>


                <strong>
                    ${formatMoney(trip.budget)}
                </strong>

            </div>


           <div class="trip-actions">

    <button
        class="view-trip"
        type="button"
        onclick="viewTrip(${trip.id})"
    >
        View Trip →
    </button>

    <button
        class="itinerary-btn"
        type="button"
        onclick="openItinerary(${trip.id})"
    >
        Itinerary
    </button>

    <button
        class="progress-btn"
        type="button"
        onclick="openProgress(${trip.id})"
    >
        <span class="progress-icon">◔</span>
        Progress
    </button>

    <button
        class="delete-trip"
        type="button"
        onclick="deleteTrip(${trip.id})"
    >
        Delete
    </button>

</div>

           `;


        tripGrid.prepend(card);

    });

}


// ================= VIEW TRIP =================

function viewTrip(id) {

    const trips = getTrips();

    const trip = trips.find(function (item) {

        return item.id === id;

    });


    if (!trip) {

        alert("Trip not found.");

        return;
    }


    // Save selected trip

    localStorage.setItem(
        "trekplan_currentTrip",
        JSON.stringify(trip)
    );


    // Open Trip Overview

    window.location.href =
        "trip-overview.html";
}




// ================= OPEN ITINERARY =================

function openItinerary(id) {

    const trips = getTrips();

    const trip = trips.find(function (item) {

        return item.id === id;

    });

    if (!trip) {

        alert("Trip not found.");

        return;

    }

    // Save selected trip
    localStorage.setItem(
        "trekplan_currentTrip",
        JSON.stringify(trip)
    );

    // Open itinerary page
    window.location.href = "../Budget  Itinerary Checklist/itinerary.html";

}

// ================= TRIP PROGRESS =================

function openProgress(id) {

    const trips = getTrips();

    const trip = trips.find(function (item) {
        return item.id === id;
    });

    if (!trip) {
        alert("Trip not found.");
        return;
    }

    // Save selected trip
    localStorage.setItem(
        "trekplan_currentTrip",
        JSON.stringify(trip)
    );

    // Open progress page
    window.location.href = "../Trip planner,progess TrekDetails/trip-progress.html";
}




// ================= DELETE TRIP =================

function deleteTrip(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this trip?"
    );

    if (!confirmDelete) {
        return;
    }

    let trips = getTrips();

    trips = trips.filter(function (trip) {
        return trip.id !== id;
    });

    localStorage.setItem(
        "trekplanTrips",
        JSON.stringify(trips)
    );

    // Remove current trip if it was deleted
    const currentTrip =
        JSON.parse(
            localStorage.getItem("trekplan_currentTrip")
        );

    if (currentTrip && currentTrip.id === id) {

        localStorage.removeItem(
            "trekplan_currentTrip"
        );

    }

    // Refresh dashboard
    updateStats();
    renderTrips();

}


// ================= ESCAPE HTML =================

function escapeHTML(value) {

    return String(value || "")

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


// ================= CREATE TRIP BUTTONS =================

if (createTripBtn) {

    createTripBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "../Trip planner,progess TrekDetails/trip-planner.html";

        }
    );

}


if (heroCreateBtn) {

    heroCreateBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "../Trip planner,progess TrekDetails/trip-planner.html";

        }
    );

}


if (quickCreate) {

    quickCreate.addEventListener(
        "click",
        function () {

            window.location.href =
                "../Trip planner,progess TrekDetails/trip-planner.html";

        }
    );

}


// ================= BUDGET BUTTON =================

if (budgetButton) {

    budgetButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "../Budget  Itinerary Checklist/budget.html";

        }
    );

}


// ================= MAP BUTTON =================

if (mapButton) {

    mapButton.addEventListener(
        "click",
        function () {

            alert(
                "Interactive TrekPlan Map is coming soon."
            );

        }
    );

}


// ================= EXPLORE BUTTON =================

if (exploreBtn) {

    exploreBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "../Explore  Journal/explore.html";

        }
    );

}


// ================= MOBILE MENU =================

if (mobileMenu) {

    mobileMenu.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle("open");

        }
    );

}


// ================= SEARCH =================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            const search =
                searchInput.value
                    .toLowerCase()
                    .trim();


            const cards =
                document.querySelectorAll(
                    ".trip-card"
                );


            cards.forEach(function (card) {

                const text =
                    card.innerText
                        .toLowerCase();


                if (text.includes(search)) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            });

        }
    );

}


// ================= LOGOUT =================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "trekplan_session"
            );

            sessionStorage.removeItem(
                "trekplan_session"
            );

            localStorage.removeItem(
                "trekplan_currentUser"
            );

            window.location.href =
                "../Signup Login/login.html";

        }
    );

}


// ================= INITIAL LOAD =================

updateStats();

renderTrips();