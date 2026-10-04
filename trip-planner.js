/* =====================================================
   TREKPLAN — DAY 21
   SMART TRIP PLANNER
===================================================== */


/* =========================
   GET ELEMENTS
========================= */

const tripForm =
    document.getElementById("tripForm");

const tripResult =
    document.getElementById("tripResult");

const saveTripBtn =
    document.getElementById("saveTripBtn");


/* =========================
   FORM SUBMIT
========================= */

tripForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        /* =========================
           GET VALUES
        ========================= */

        const tripName =
            document.getElementById("tripName").value;

        const destination =
            document.getElementById("destination").value;

        const startDate =
            document.getElementById("startDate").value;

        const endDate =
            document.getElementById("endDate").value;

        const travelers =
            Number(
                document.getElementById("travelers").value
            );

        const budget =
            Number(
                document.getElementById("budget").value
            );


        /* =========================
           CALCULATE DURATION
        ========================= */

        const start =
            new Date(startDate);

        const end =
            new Date(endDate);


        const difference =
            end - start;


        const duration =
            Math.ceil(
                difference /
                (1000 * 60 * 60 * 24)
            ) + 1;


        if (duration <= 0) {

            alert(
                "End date must be after start date."
            );

            return;
        }


        /* =========================
           PER PERSON BUDGET
        ========================= */

        const perPerson =
            Math.round(
                budget / travelers
            );


        /* =========================
           DISPLAY RESULT
        ========================= */

        document.getElementById(
            "resultName"
        ).textContent = tripName;


        document.getElementById(
            "resultDestination"
        ).textContent = destination;


        document.getElementById(
            "resultDuration"
        ).textContent =
            duration + " Days";


        document.getElementById(
            "resultTravelers"
        ).textContent =
            travelers;


        document.getElementById(
            "resultBudget"
        ).textContent =
            "₹" + budget.toLocaleString();


        document.getElementById(
            "resultPerPerson"
        ).textContent =
            "₹" + perPerson.toLocaleString();


        document.getElementById(
            "resultStart"
        ).textContent =
            formatDate(startDate);


        document.getElementById(
            "resultEnd"
        ).textContent =
            formatDate(endDate);


        /* =========================
           SMART TIP
        ========================= */

        let tip = "";


        if (perPerson < 5000) {

            tip =
                "Your budget is quite tight. Focus on affordable transport, stays and local food.";

        } else if (perPerson < 10000) {

            tip =
                "You have a balanced budget. Compare transport and accommodation prices before booking.";

        } else {

            tip =
                "You have a comfortable budget. You can consider better stays and experiences.";
        }


        if (duration >= 7) {

            tip +=
                " Since this is a longer trip, keep some extra emergency budget.";
        }


        document.getElementById(
            "recommendationText"
        ).textContent = tip;


        /* =========================
           SHOW RESULT
        ========================= */

        tripResult.classList.remove(
            "hidden"
        );


        /* =========================
           SAVE TEMP DATA
        ========================= */

        const tripData = {

            tripName: tripName,

            destination: destination,

            startDate: startDate,

            endDate: endDate,

            travelers: travelers,

            budget: budget,

            duration: duration,

            perPerson: perPerson
        };


        localStorage.setItem(
            "trekplan_currentTrip",
            JSON.stringify(tripData)
        );

    }
);


/* =========================
   SAVE TRIP
========================= */

saveTripBtn.addEventListener(
    "click",
    function () {

        const currentTrip =
            JSON.parse(
                localStorage.getItem(
                    "trekplan_currentTrip"
                )
            );


        if (!currentTrip) {

            alert(
                "Please create a trip first."
            );

            return;
        }


        /* =========================
           GET OLD TRIPS
        ========================= */

        let trips =
            JSON.parse(
                localStorage.getItem(
                    "trekplanTrips"
                )
            ) || [];


        /* =========================
           ADD NEW TRIP
        ========================= */

        trips.push(currentTrip);


        /* =========================
           SAVE TRIPS
        ========================= */

        localStorage.setItem(
            "trekplanTrips",
            JSON.stringify(trips)
        );


        alert(
            "Trip saved successfully! 🎉"
        );


        /* =========================
           GO DASHBOARD
        ========================= */

        window.location.href =
            "dashboard.html";

    }
);


/* =========================
   DATE FORMAT
========================= */

function formatDate(date) {

    const d =
        new Date(date);


    return d.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}