// =====================================================
// TREKPLAN — DAY-BY-DAY ITINERARY
// =====================================================


// ================= GET CURRENT TRIP =================

const currentTrip =
    JSON.parse(
        localStorage.getItem("trekplan_currentTrip")
    );


// ================= ELEMENTS =================

const tripTitle =
    document.getElementById("tripTitle");

const tripDestination =
    document.getElementById("tripDestination");

const itineraryForm =
    document.getElementById("itineraryForm");

const itineraryList =
    document.getElementById("itineraryList");

const activityCount =
    document.getElementById("activityCount");


// ================= CHECK ELEMENTS =================

if (!tripTitle || !tripDestination || !itineraryList || !activityCount) {

    console.error("Required itinerary elements are missing.");

}


// ================= CHECK TRIP =================

if (!currentTrip) {

    if (tripTitle) {
        tripTitle.textContent = "No Trip Selected";
    }

    if (tripDestination) {
        tripDestination.textContent =
            "Please select a trip from your dashboard.";
    }

}


// ================= SHOW TRIP =================

if (currentTrip) {

    if (tripTitle) {
        tripTitle.textContent =
            currentTrip.tripName || "My Trip";
    }

    if (tripDestination) {
        tripDestination.textContent =
            currentTrip.destination || "Your Destination";
    }

}


// ================= GET ITINERARY =================

function getItinerary() {

    return JSON.parse(
        localStorage.getItem("trekplanItinerary")
    ) || [];

}


// ================= SAVE ITINERARY =================

function saveItinerary(itinerary) {

    localStorage.setItem(
        "trekplanItinerary",
        JSON.stringify(itinerary)
    );

}


// ================= ADD ACTIVITY =================

if (itineraryForm) {

    itineraryForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            if (!currentTrip) {

                alert(
                    "Please select a trip first."
                );

                return;

            }


            const day =
                document.getElementById("day").value;

            const time =
                document.getElementById("time").value;

            const activity =
                document
                    .getElementById("activity")
                    .value
                    .trim();

            const location =
                document
                    .getElementById("location")
                    .value
                    .trim();

            const notes =
                document
                    .getElementById("notes")
                    .value
                    .trim();


            // ================= NEW ACTIVITY =================

            const newActivity = {

                id: Date.now(),

                tripId: currentTrip.id,

                day: day,

                time: time,

                activity: activity,

                location: location,

                notes: notes

            };


            // Get existing activities

            const itinerary =
                getItinerary();


            // Add new activity

            itinerary.push(newActivity);


            // Save updated itinerary

            saveItinerary(itinerary);


            // Clear form

            itineraryForm.reset();


            // Display activities

            renderItinerary();

        }
    );

}


// ================= RENDER ITINERARY =================

function renderItinerary() {

    if (!itineraryList || !activityCount) {
        return;
    }


    let itinerary =
        getItinerary();


    // If no trip is selected

    if (!currentTrip) {

        itineraryList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📅
                </div>

                <h3>
                    No Trip Selected
                </h3>

                <p>
                    Please select a trip from your dashboard.
                </p>

            </div>

        `;

        activityCount.textContent =
            "0 Activities";

        return;

    }


    // Only show activities for current trip

    itinerary =
        itinerary.filter(function (item) {

            return item.tripId === currentTrip.id;

        });


    // Activity count

    activityCount.textContent =
        itinerary.length +
        (
            itinerary.length === 1
                ? " Activity"
                : " Activities"
        );


    // No activities

    if (itinerary.length === 0) {

        itineraryList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📅
                </div>

                <h3>
                    No activities yet
                </h3>

                <p>
                    Add your first activity to start planning your trip.
                </p>

            </div>

        `;

        return;

    }


    // ================= SORT =================

    itinerary.sort(function (a, b) {

        const dayA =
            parseInt(
                a.day.replace(/\D/g, "")
            ) || 0;

        const dayB =
            parseInt(
                b.day.replace(/\D/g, "")
            ) || 0;


        if (dayA !== dayB) {

            return dayA - dayB;

        }


        return a.time.localeCompare(b.time);

    });


    // Clear old cards

    itineraryList.innerHTML = "";


    // ================= CREATE CARDS =================

    itinerary.forEach(function (item) {

        const card =
            document.createElement("div");

        card.className =
            "activity-card";


        card.innerHTML = `

            <div class="activity-left">

                <div class="activity-day">
                    ${escapeHTML(item.day)}
                </div>

                <div class="activity-time">
                    ⏰ ${escapeHTML(item.time)}
                </div>

                <h3 class="activity-title">
                    ${escapeHTML(item.activity)}
                </h3>

                <p class="activity-location">
                    📍 ${escapeHTML(item.location)}
                </p>

                ${
                    item.notes
                        ? `
                            <p class="activity-notes">
                                📝 ${escapeHTML(item.notes)}
                            </p>
                        `
                        : ""
                }

            </div>


            <button
                class="delete-btn"
                type="button"
                onclick="deleteActivity(${item.id})"
            >
                Delete
            </button>

        `;


        itineraryList.appendChild(card);

    });

}


// ================= DELETE ACTIVITY =================

function deleteActivity(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this activity?"
        );


    if (!confirmDelete) {
        return;
    }


    let itinerary =
        getItinerary();


    itinerary =
        itinerary.filter(function (item) {

            return item.id !== id;

        });


    saveItinerary(itinerary);


    renderItinerary();

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


// ================= INITIAL LOAD =================

renderItinerary();