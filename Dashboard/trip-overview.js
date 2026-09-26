// ========================================
// TREKPLAN — TRIP OVERVIEW
// ========================================


// Get selected trip from LocalStorage

const currentTrip =
    JSON.parse(
        localStorage.getItem("trekplan_currentTrip")
    );


// Get HTML elements

const tripName =
    document.getElementById("tripName");

const destination =
    document.getElementById("destination");

const tripDestination =
    document.getElementById("tripDestination");

const startDate =
    document.getElementById("startDate");

const endDate =
    document.getElementById("endDate");

const travelers =
    document.getElementById("travelers");

const budget =
    document.getElementById("budget");

const noTrip =
    document.getElementById("noTrip");


// ========================================
// FORMAT MONEY
// ========================================

function formatMoney(amount) {

    return "₹" +
        Number(amount || 0)
            .toLocaleString("en-IN");

}


// ========================================
// DISPLAY TRIP
// ========================================

function displayTrip() {

    // If no trip is selected

    if (!currentTrip) {

        noTrip.style.display = "block";

        return;
    }


    // Trip name

    tripName.textContent =
        currentTrip.tripName ||
        "My Trip";


    // Destination

    destination.textContent =
        currentTrip.destination ||
        "No destination";


    tripDestination.textContent =
        currentTrip.destination ||
        "-";


    // Dates

    startDate.textContent =
        currentTrip.startDate ||
        "-";


    endDate.textContent =
        currentTrip.endDate ||
        "-";


    // Travelers

    travelers.textContent =
        currentTrip.travelers ||
        1;


    // Budget

    budget.textContent =
        formatMoney(
            currentTrip.budget
        );

}


// ========================================
// OPEN ITINERARY
// ========================================

function openItinerary() {

    if (!currentTrip) {
        return;
    }

    window.location.href =
        "../Budget  Itinerary Checklist/itinerary.html";
}


// ========================================
// OPEN BUDGET
// ========================================

function openBudget() {

    window.location.href =
        "../Budget  Itinerary Checklist/budget.html";
}


// ========================================
// OPEN PROGRESS
// ========================================

function openProgress() {

    window.location.href =
        "../Trip planner,progess TrekDetails/trip-progress.html";
}


// ========================================
// OPEN JOURNAL
// ========================================

function openJournal() {

    window.location.href =
        "../Explore  Journal/journal.html";
}


// ========================================
// DASHBOARD
// ========================================

function goDashboard() {

    window.location.href =
        "../Dashboard/dashboard.html";
}


// ========================================
// INITIAL LOAD
// ========================================

displayTrip();