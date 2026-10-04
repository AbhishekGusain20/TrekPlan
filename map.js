/* =========================================
   TREKPLAN REAL MAP
   Leaflet + OpenStreetMap + Nominatim + OSRM
========================================= */


/* =========================================
   VARIABLES
========================================= */

let map;

let userMarker = null;

let destinationMarker = null;

let routeLine = null;

let currentLocation = null;

let destinationLocation = null;


/* =========================================
   ELEMENTS
========================================= */

const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");

const searchResults =
    document.getElementById("searchResults");

const locationBtn =
    document.getElementById("locationBtn");

const routeBtn =
    document.getElementById("routeBtn");

const zoomIn =
    document.getElementById("zoomIn");

const zoomOut =
    document.getElementById("zoomOut");

const mapStatus =
    document.getElementById("mapStatus");

const destinationName =
    document.getElementById("destinationName");

const destinationAddress =
    document.getElementById("destinationAddress");

const distanceElement =
    document.getElementById("distance");

const durationElement =
    document.getElementById("duration");

const navigationSteps =
    document.getElementById("navigationSteps");

const stepCount =
    document.getElementById("stepCount");


/* =========================================
   CREATE MAP
========================================= */

map = L.map("map", {

    zoomControl: false,

    scrollWheelZoom: true

});


/* =========================================
   OPENSTREETMAP
========================================= */

L.tileLayer(

    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

    {

        maxZoom: 19,

        attribution:
            "&copy; OpenStreetMap contributors"

    }

).addTo(map);


/* =========================================
   DEFAULT MAP
========================================= */

map.setView(

    [30.3165, 78.0322],

    7

);


/* =========================================
   MAP SIZE FIX
========================================= */

setTimeout(

    function () {

        map.invalidateSize();

    },

    500

);


/* =========================================
   MAP STATUS
========================================= */

function setStatus(text) {

    mapStatus.textContent = text;

}


/* =========================================
   SEARCH PLACE
========================================= */

async function searchPlace() {

    const query =
        searchInput.value.trim();


    if (!query) {

        alert(
            "Please enter a place."
        );

        return;

    }


    setStatus(
        "Searching..."
    );


    searchResults.style.display =
        "none";


    try {

        const url =
            "https://nominatim.openstreetmap.org/search?" +

            new URLSearchParams({

                q: query,

                format: "json",

                limit: "5",

                addressdetails: "1"

            });


        const response =
            await fetch(url, {

                headers: {

                    "Accept":
                        "application/json"

                }

            });


        if (!response.ok) {

            throw new Error(
                "Search failed"
            );

        }


        const results =
            await response.json();


        if (results.length === 0) {

            setStatus(
                "Place not found"
            );

            alert(
                "No location found. Try another name."
            );

            return;

        }


        showSearchResults(
            results
        );


        setStatus(
            "Location found"
        );


    } catch (error) {

        console.error(error);

        setStatus(
            "Search error"
        );

        alert(
            "Unable to search location."
        );

    }

}


/* =========================================
   SHOW SEARCH RESULTS
========================================= */

function showSearchResults(results) {

    searchResults.innerHTML = "";


    results.forEach(

        function (place) {

            const item =
                document.createElement("div");


            item.className =
                "search-result";


            item.innerHTML = `

                <strong>
                    📍 ${place.display_name
                        .split(",")
                        .slice(0, 2)
                        .join(",")}
                </strong>

                <span>
                    ${place.display_name}
                </span>

            `;


            item.addEventListener(

                "click",

                function () {

                    selectDestination(
                        place
                    );

                    searchResults.style.display =
                        "none";

                }

            );


            searchResults.appendChild(
                item
            );

        }

    );


    searchResults.style.display =
        "block";

}


/* =========================================
   SELECT DESTINATION
========================================= */

function selectDestination(place) {

    const lat =
        parseFloat(place.lat);

    const lng =
        parseFloat(place.lon);


    destinationLocation = {

        lat: lat,

        lng: lng,

        name:
            place.display_name
                .split(",")
                .slice(0, 2)
                .join(","),

        address:
            place.display_name

    };


    /* ===============================
       MAP
    =============================== */

    map.flyTo(

        [lat, lng],

        13,

        {

            duration: 1.5

        }

    );


    /* ===============================
       REMOVE OLD MARKER
    =============================== */

    if (destinationMarker) {

        map.removeLayer(
            destinationMarker
        );

    }


    /* ===============================
       CREATE MARKER
    =============================== */

    destinationMarker =

        L.marker(

            [lat, lng]

        )

        .addTo(map);


    destinationMarker
        .bindPopup(`

            <div class="popup-title">
                📍 ${destinationLocation.name}
            </div>

            <div>
                Destination
            </div>

        `)

        .openPopup();


    /* ===============================
       UPDATE PANEL
    =============================== */

    destinationName.textContent =
        destinationLocation.name;


    destinationAddress.textContent =
        destinationLocation.address;


    distanceElement.textContent =
        "--";


    durationElement.textContent =
        "--";


    navigationSteps.innerHTML = `

        <div class="empty-navigation">

            🛣️

            <p>
                Click "Calculate Route"
                to create your route.
            </p>

        </div>

    `;


    stepCount.textContent =
        "0 steps";


    /* ===============================
       SAVE
    =============================== */

    localStorage.setItem(

        "trekplan_destination",

        JSON.stringify(
            destinationLocation
        )

    );


    setStatus(
        "Destination selected"
    );

}


/* =========================================
   GET USER LOCATION
========================================= */

function getUserLocation() {

    if (!navigator.geolocation) {

        alert(
            "Geolocation is not supported by your browser."
        );

        return;

    }


    locationBtn.textContent =
        "📍 Finding...";


    setStatus(
        "Finding location..."
    );


    navigator.geolocation.getCurrentPosition(

        function (position) {

            const lat =
                position.coords.latitude;

            const lng =
                position.coords.longitude;


            currentLocation = {

                lat: lat,

                lng: lng

            };


            /* =========================
               REMOVE OLD MARKER
            ========================= */

            if (userMarker) {

                map.removeLayer(
                    userMarker
                );

            }


            /* =========================
               USER MARKER
            ========================= */

            userMarker =

                L.marker(

                    [lat, lng]

                )

                .addTo(map);


            userMarker
                .bindPopup(
                    "📍 You are here"
                )
                .openPopup();


            /* =========================
               MOVE MAP
            ========================= */

            map.flyTo(

                [lat, lng],

                13,

                {

                    duration: 1.5

                }

            );


            locationBtn.textContent =
                "📍 My Location";


            setStatus(
                "Your location found"
            );


            /* =========================
               IF DESTINATION EXISTS
            ========================= */

            if (destinationLocation) {

                calculateRoute();

            }

        },


        function (error) {

            console.error(error);


            locationBtn.textContent =
                "📍 My Location";


            setStatus(
                "Location unavailable"
            );


            alert(

                "Location permission was denied or unavailable."

            );

        },

        {

            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 0

        }

    );

}


/* =========================================
   CALCULATE ROUTE
========================================= */

async function calculateRoute() {

    if (!currentLocation) {

        alert(
            "First click 'My Location'."
        );

        getUserLocation();

        return;

    }


    if (!destinationLocation) {

        alert(
            "First search and select a destination."
        );

        return;

    }


    routeBtn.textContent =
        "Calculating...";


    setStatus(
        "Calculating route..."
    );


    try {

        const start =
            `${currentLocation.lng},${currentLocation.lat}`;


        const end =
            `${destinationLocation.lng},${destinationLocation.lat}`;


        const url =

            `https://router.project-osrm.org/route/v1/driving/` +

            `${start};${end}` +

            `?overview=full&geometries=geojson&steps=true`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Routing request failed"
            );

        }


        const data =
            await response.json();


        if (
            data.code !== "Ok" ||
            !data.routes ||
            data.routes.length === 0
        ) {

            throw new Error(
                "No route available"
            );

        }


        const route =
            data.routes[0];


        /* =========================
           REMOVE OLD ROUTE
        ========================= */

        if (routeLine) {

            map.removeLayer(
                routeLine
            );

        }


        /* =========================
           CREATE ROUTE
        ========================= */

        routeLine =

            L.geoJSON(

                route.geometry,

                {

                    style: {

                        color: "#00e5ff",

                        weight: 6,

                        opacity: 0.9

                    }

                }

            ).addTo(map);


        /* =========================
           FIT ROUTE
        ========================= */

        map.fitBounds(

            routeLine.getBounds(),

            {

                padding: [
                    50,
                    50
                ]

            }

        );


        /* =========================
           DISTANCE
        ========================= */

        const distanceKm =
            route.distance / 1000;


        distanceElement.textContent =

            distanceKm < 1

                ? Math.round(
                    route.distance
                ) + " m"

                : distanceKm.toFixed(1) +
                    " km";


        /* =========================
           TIME
        ========================= */

        durationElement.textContent =

            formatDuration(
                route.duration
            );


        /* =========================
           NAVIGATION
        ========================= */

        displayNavigationSteps(
            route.legs
        );


        routeBtn.textContent =
            "✓ Route Ready";


        setStatus(
            "Route calculated"
        );


        setTimeout(

            function () {

                routeBtn.textContent =
                    "🛣️ Recalculate Route";

            },

            2000

        );


    } catch (error) {

        console.error(error);


        routeBtn.textContent =
            "🛣️ Calculate Route";


        setStatus(
            "Route unavailable"
        );


        alert(

            "Unable to calculate route for this location."

        );

    }

}


/* =========================================
   FORMAT TIME
========================================= */

function formatDuration(seconds) {

    const totalMinutes =
        Math.round(
            seconds / 60
        );


    const hours =
        Math.floor(
            totalMinutes / 60
        );


    const minutes =
        totalMinutes % 60;


    if (hours === 0) {

        return `${minutes} min`;

    }


    return `${hours} hr ${minutes} min`;

}


/* =========================================
   NAVIGATION STEPS
========================================= */

function displayNavigationSteps(legs) {

    navigationSteps.innerHTML =
        "";


    let steps = [];


    legs.forEach(

        function (leg) {

            if (leg.steps) {

                steps =
                    steps.concat(
                        leg.steps
                    );

            }

        }

    );


    stepCount.textContent =
        `${steps.length} steps`;


    steps.forEach(

        function (step, index) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "navigation-step";


            const instruction =
                getInstruction(
                    step
                );


            const distance =
                formatStepDistance(
                    step.distance
                );


            div.innerHTML = `

                <div class="step-icon">
                    ${getDirectionIcon(
                        step.maneuver.type,
                        step.maneuver.modifier
                    )}
                </div>

                <div class="step-content">

                    <strong>
                        ${index + 1}. ${instruction}
                    </strong>

                    <span>
                        ${distance}
                    </span>

                </div>

            `;


            navigationSteps.appendChild(
                div
            );

        }

    );

}


/* =========================================
   INSTRUCTION
========================================= */

function getInstruction(step) {

    const type =
        step.maneuver.type;

    const modifier =
        step.maneuver.modifier;


    if (type === "depart") {

        return "Start your journey";

    }


    if (type === "arrive") {

        return "You have arrived";

    }


    if (type === "roundabout") {

        return "Enter the roundabout";

    }


    if (modifier) {

        return capitalize(
            modifier
        );

    }


    return capitalize(
        type
    );

}


/* =========================================
   ICON
========================================= */

function getDirectionIcon(
    type,
    modifier
) {

    if (type === "arrive") {

        return "🏁";

    }


    if (type === "depart") {

        return "🚀";

    }


    if (
        modifier === "left" ||
        modifier === "slight left"
    ) {

        return "↖️";

    }


    if (
        modifier === "right" ||
        modifier === "slight right"
    ) {

        return "↗️";

    }


    if (modifier === "sharp left") {

        return "⬅️";

    }


    if (modifier === "sharp right") {

        return "➡️";

    }


    return "⬆️";

}


/* =========================================
   STEP DISTANCE
========================================= */

function formatStepDistance(
    meters
) {

    if (meters < 1000) {

        return `${Math.round(meters)} m`;

    }


    return `${(
        meters / 1000
    ).toFixed(1)} km`;

}


/* =========================================
   CAPITALIZE
========================================= */

function capitalize(text) {

    if (!text) {

        return "Continue";

    }


    return text
        .replace(
            /\b\w/g,
            function (letter) {

                return letter.toUpperCase();

            }
        );

}


/* =========================================
   BUTTON EVENTS
========================================= */

searchBtn.addEventListener(

    "click",

    searchPlace

);


searchInput.addEventListener(

    "keydown",

    function (event) {

        if (
            event.key === "Enter"
        ) {

            searchPlace();

        }

    }

);


locationBtn.addEventListener(

    "click",

    getUserLocation

);


routeBtn.addEventListener(

    "click",

    calculateRoute

);


zoomIn.addEventListener(

    "click",

    function () {

        map.zoomIn();

    }

);


zoomOut.addEventListener(

    "click",

    function () {

        map.zoomOut();

    }

);


/* =========================================
   CLOSE SEARCH RESULTS
========================================= */

document.addEventListener(

    "click",

    function (event) {

        if (

            !searchResults.contains(
                event.target
            )

            &&

            !searchInput.contains(
                event.target
            )

            &&

            !searchBtn.contains(
                event.target
            )

        ) {

            searchResults.style.display =
                "none";

        }

    }

);


/* =========================================
   RESTORE DESTINATION
========================================= */

const savedDestination =
    localStorage.getItem(
        "trekplan_destination"
    );


if (savedDestination) {

    try {

        destinationLocation =
            JSON.parse(
                savedDestination
            );


        destinationName.textContent =
            destinationLocation.name;


        destinationAddress.textContent =
            destinationLocation.address;


        destinationMarker =

            L.marker(

                [
                    destinationLocation.lat,
                    destinationLocation.lng
                ]

            )

            .addTo(map);


        destinationMarker
            .bindPopup(
                "📍 Saved destination"
            );


    } catch (error) {

        console.log(
            "No saved destination."
        );

    }

}


/* =========================================
   FINAL MAP FIX
========================================= */

setTimeout(

    function () {

        map.invalidateSize();

    },

    1000

);

/* =========================================================
   SIDEBAR LOGOUT
========================================================= */

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        localStorage.removeItem("trekplan_session");
        sessionStorage.removeItem("trekplan_session");
        localStorage.removeItem("trekplan_currentUser");

        window.location.href = "login.html";

    });

}