/* =========================
   CREATE MAP
========================= */

// Default location: Dehradun

const map = L.map("map").setView(
    [30.3165, 78.0322],
    10
);


/* =========================
   OPENSTREETMAP
========================= */

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution:
            '&copy; OpenStreetMap contributors'
    }
).addTo(map);


/* =========================
   DEFAULT MARKER
========================= */

let marker = L.marker(
    [30.3165, 78.0322]
).addTo(map);


marker.bindPopup(
    "<b>Dehradun</b><br>TrekPlan Location"
).openPopup();


/* =========================
   HTML ELEMENTS
========================= */

const locationInput =
    document.getElementById("locationInput");

const searchBtn =
    document.getElementById("searchBtn");

const locationName =
    document.getElementById("locationName");

const locationDetails =
    document.getElementById("locationDetails");


/* =========================
   SEARCH LOCATION
========================= */

searchBtn.addEventListener("click", searchLocation);


/* =========================
   SEARCH FUNCTION
========================= */

async function searchLocation() {

    const location =
        locationInput.value.trim();


    if (location === "") {

        alert("Please enter a destination");

        return;
    }


    try {

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
        );


        const data = await response.json();


        if (data.length === 0) {

            alert("Location not found");

            return;
        }


        /* =========================
           GET LOCATION
        ========================= */

        const latitude =
            parseFloat(data[0].lat);

        const longitude =
            parseFloat(data[0].lon);

        const displayName =
            data[0].display_name;


        /* =========================
           MOVE MAP
        ========================= */

        map.setView(
            [latitude, longitude],
            12
        );


        /* =========================
           REMOVE OLD MARKER
        ========================= */

        map.removeLayer(marker);


        /* =========================
           ADD NEW MARKER
        ========================= */

        marker = L.marker(
            [latitude, longitude]
        ).addTo(map);


        marker.bindPopup(
            `<b>${location}</b><br>${displayName}`
        ).openPopup();


        /* =========================
           SHOW INFORMATION
        ========================= */

        locationName.textContent =
            location;

        locationDetails.textContent =
            displayName;


    } catch (error) {

        console.log(error);

        alert(
            "Unable to search location"
        );
    }
}