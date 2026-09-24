/* =====================================================
   TREKPLAN — TRIP PROGRESS
   DAY 14
===================================================== */


/* ================= GET CURRENT TRIP ================= */

const currentTrip =
    JSON.parse(
        localStorage.getItem("trekplan_currentTrip")
    );


/* ================= ELEMENTS ================= */

const tripName =
    document.getElementById("tripName");

const destination =
    document.getElementById("destination");

const statusBadge =
    document.getElementById("statusBadge");

const progressPercent =
    document.getElementById("progressPercent");

const progressFill =
    document.getElementById("progressFill");

const daysCompleted =
    document.getElementById("daysCompleted");

const totalDays =
    document.getElementById("totalDays");

const tripDates =
    document.getElementById("tripDates");

const duration =
    document.getElementById("duration");

const travelers =
    document.getElementById("travelers");

const budget =
    document.getElementById("budget");

const statusTitle =
    document.getElementById("statusTitle");

const statusMessage =
    document.getElementById("statusMessage");

const statusDot =
    document.getElementById("statusDot");

const backBtn =
    document.getElementById("backBtn");

const dashboardBtn =
    document.getElementById("dashboardBtn");

const itineraryBtn =
    document.getElementById("itineraryBtn");


/* ================= CHECK TRIP ================= */

if (!currentTrip) {

    alert("No trip selected.");

    window.location.href =
        "dashboard.html";

}


/* ================= FORMAT MONEY ================= */

function formatMoney(amount) {

    return "₹" +
        Number(amount || 0)
            .toLocaleString("en-IN");

}


/* ================= FORMAT DATE ================= */

function formatDate(dateString) {

    if (!dateString) {
        return "--";
    }

    const date =
        new Date(dateString);

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* ================= CALCULATE DAYS ================= */

function calculateDays(startDate, endDate) {

    if (!startDate || !endDate) {
        return 1;
    }

    const start =
        new Date(startDate);

    const end =
        new Date(endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const difference =
        end - start;

    const days =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        ) + 1;

    return days > 0 ? days : 1;

}


/* ================= GET TRIP STATUS ================= */

function getTripStatus(startDate, endDate) {

    const today =
        new Date();

    today.setHours(0, 0, 0, 0);


    const start =
        new Date(startDate);

    const end =
        new Date(endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);


    if (today < start) {

        return "Upcoming";

    }


    if (today > end) {

        return "Completed";

    }


    return "Ongoing";

}


/* ================= CALCULATE PROGRESS ================= */

function calculateProgress(startDate, endDate) {

    const today =
        new Date();

    today.setHours(0, 0, 0, 0);


    const start =
        new Date(startDate);

    const end =
        new Date(endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);


    const totalTime =
        end - start;


    /* Upcoming */

    if (today < start) {

        return {
            percentage: 0,
            completed: 0
        };

    }


    /* Completed */

    if (today > end) {

        const total =
            calculateDays(
                startDate,
                endDate
            );

        return {
            percentage: 100,
            completed: total
        };

    }


    /* Ongoing */

    const elapsed =
        today - start;


    let percentage =
        Math.round(
            (elapsed / totalTime) * 100
        );


    percentage =
        Math.max(
            0,
            Math.min(
                100,
                percentage
            )
        );


    const completed =
        Math.floor(
            elapsed /
            (1000 * 60 * 60 * 24)
        );


    return {
        percentage: percentage,
        completed: completed
    };

}


/* ================= UPDATE PAGE ================= */

function updateProgressPage() {

    const total =
        calculateDays(
            currentTrip.startDate,
            currentTrip.endDate
        );


    const status =
        getTripStatus(
            currentTrip.startDate,
            currentTrip.endDate
        );


    const progress =
        calculateProgress(
            currentTrip.startDate,
            currentTrip.endDate
        );


    /* Trip information */

    tripName.textContent =
        currentTrip.tripName ||
        "My Trip";


    destination.textContent =
        currentTrip.destination ||
        "Destination";


    /* Status */

    statusBadge.textContent =
        status;


    /* Progress */

    progressPercent.textContent =
        progress.percentage + "%";


    progressFill.style.width =
        progress.percentage + "%";


    daysCompleted.textContent =
        progress.completed +
        " days completed";


    totalDays.textContent =
        total +
        (total === 1
            ? " day"
            : " days");


    /* Dates */

    tripDates.textContent =
        formatDate(
            currentTrip.startDate
        ) +
        " — " +
        formatDate(
            currentTrip.endDate
        );


    /* Duration */

    duration.textContent =
        total +
        (total === 1
            ? " Day"
            : " Days");


    /* Travelers */

    const people =
        Number(
            currentTrip.travelers || 1
        );


    travelers.textContent =
        people +
        (people === 1
            ? " Person"
            : " People");


    /* Budget */

    budget.textContent =
        formatMoney(
            currentTrip.budget
        );


    /* Status message */

    if (status === "Upcoming") {

        statusTitle.textContent =
            "Your trip is coming up";


        statusMessage.textContent =
            "Get ready for your adventure. " +
            "Your journey will begin soon.";

        statusDot.style.background =
            "#e47c45";

    }


    else if (status === "Ongoing") {

        statusTitle.textContent =
            "Your adventure is in progress";


        statusMessage.textContent =
            "Enjoy your journey and make " +
            "every moment count.";

        statusDot.style.background =
            "#2e8b57";

    }


    else {

        statusTitle.textContent =
            "Trip completed";


        statusMessage.textContent =
            "Your journey is complete. " +
            "Time to create your next adventure!";

        statusDot.style.background =
            "#6b7280";

    }

}


/* ================= DASHBOARD ================= */

function goToDashboard() {

    window.location.href =
        "dashboard.html";

}


backBtn.addEventListener(
    "click",
    goToDashboard
);


dashboardBtn.addEventListener(
    "click",
    goToDashboard
);


/* ================= ITINERARY ================= */

itineraryBtn.addEventListener(
    "click",
    function () {

        window.location.href =
            "itinerary.html";

    }
);


/* ================= INITIAL LOAD ================= */

if (currentTrip) {

    updateProgressPage();

}