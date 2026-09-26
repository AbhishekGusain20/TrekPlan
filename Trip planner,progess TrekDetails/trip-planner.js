/* =====================================================
   TREKPLAN — TRIP PLANNER
===================================================== */


/* ================= ELEMENTS ================= */

const tripForm = document.getElementById("tripForm");

const tripName = document.getElementById("tripName");
const startLocation = document.getElementById("startLocation");
const destination = document.getElementById("destination");

const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");

const travelers = document.getElementById("travelers");
const budget = document.getElementById("budget");

const logoutBtn = document.getElementById("logoutBtn");

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");


/* =====================================================
   SET MINIMUM DATE
===================================================== */

const today = new Date().toISOString().split("T")[0];

startDate.min = today;
endDate.min = today;


/* =====================================================
   UPDATE END DATE
===================================================== */

startDate.addEventListener("change", function () {

    endDate.min = startDate.value;

    if (endDate.value && endDate.value < startDate.value) {

        endDate.value = "";

    }

});


/* =====================================================
   LOAD SELECTED TREK FROM URL
===================================================== */

const urlParams = new URLSearchParams(window.location.search);

const selectedTrek =
    urlParams.get("trek");


/*
   If Trek Details sends a trek name/id
   through the URL, put it into destination.
*/

if (selectedTrek) {

    destination.value =
        selectedTrek
            .replaceAll("-", " ")
            .replace(/\b\w/g, function (letter) {
                return letter.toUpperCase();
            });

}


/* =====================================================
   SAVE TRIP
===================================================== */

tripForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const name =
        tripName.value.trim();

    const startingPoint =
        startLocation.value.trim();

    const place =
        destination.value.trim();

    const start =
        startDate.value;

    const end =
        endDate.value;

    const people =
        Number(travelers.value);

    const totalBudget =
        Number(budget.value);


    /* ================= VALIDATION ================= */

    if (
        !name ||
        !startingPoint ||
        !place ||
        !start ||
        !end ||
        people < 1 ||
        totalBudget <= 0
    ) {

        alert("Please fill all trip details correctly.");

        return;

    }


    if (end < start) {

        alert("End date cannot be before start date.");

        return;

    }


    /* =================================================
       GET EXISTING TRIPS
    ================================================= */

    let trips =
        JSON.parse(
            localStorage.getItem("trekplanTrips")
        ) || [];


    /* =================================================
       CREATE NEW TRIP
    ================================================= */

    const newTrip = {

        id: Date.now(),

        tripName: name,

        startLocation: startingPoint,

        destination: place,

        startDate: start,

        endDate: end,

        travelers: people,

        budget: totalBudget,

        createdAt: new Date().toISOString()

    };


    /* =================================================
       SAVE
    ================================================= */

    trips.push(newTrip);


    localStorage.setItem(
        "trekplanTrips",
        JSON.stringify(trips)
    );


    /* =================================================
       ALSO SAVE CURRENT TRIP
    ================================================= */

    localStorage.setItem(
        "trekplan_currentTrip",
        JSON.stringify(newTrip)
    );


    /* =================================================
       SUCCESS
    ================================================= */

    alert("Trip created successfully! 🎉");


    window.location.href =
        "/Dashboard/dashboard.html#trips";

});


/* =====================================================
   LOGOUT
===================================================== */

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        localStorage.removeItem(
            "trekplan_currentUser"
        );

        window.location.href =
            "/Signup Login/login.html";

    });

}


/* =====================================================
   MOBILE MENU
===================================================== */

if (menuBtn) {

    menuBtn.addEventListener("click", function () {

        sidebar.classList.toggle("open");

    });

}