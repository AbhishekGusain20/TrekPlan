/* =====================================================
   TREKPLAN — EXPLORE PAGE
===================================================== */


/* ================= TREK DATA ================= */

const treks = [

    {
        name: "Nag Tibba",
        location: "Uttarakhand",
        difficulty: "easy",
        duration: "2 Days",
        distance: "16 km",
        altitude: "9,915 ft",
        price: 3500,
        image:
            "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80",
        description:
            "A perfect weekend trek offering beautiful Himalayan views and peaceful trails."
    },


    {
        name: "Kedarkantha",
        location: "Uttarakhand",
        difficulty: "moderate",
        duration: "5 Days",
        distance: "20 km",
        altitude: "12,500 ft",
        price: 7500,
        image:
            "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80",
        description:
            "A popular winter trek known for snowy trails, forests and stunning summit views."
    },


    {
        name: "Valley of Flowers",
        location: "Uttarakhand",
        difficulty: "moderate",
        duration: "4 Days",
        distance: "38 km",
        altitude: "14,100 ft",
        price: 6000,
        image:
            "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=900&q=80",
        description:
            "Walk through colourful alpine meadows surrounded by dramatic Himalayan landscapes."
    },


    {
        name: "Hampta Pass",
        location: "Himachal Pradesh",
        difficulty: "difficult",
        duration: "5 Days",
        distance: "35 km",
        altitude: "14,100 ft",
        price: 8500,
        image:
            "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80",
        description:
            "An adventurous high-altitude trek connecting the green Kullu valley with Spiti."
    },


    {
        name: "Tungnath & Chandrashila",
        location: "Uttarakhand",
        difficulty: "moderate",
        duration: "3 Days",
        distance: "14 km",
        altitude: "13,123 ft",
        price: 5000,
        image:
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80",
        description:
            "Experience spectacular Himalayan sunrise views from one of the highest Shiva temples."
    },


    {
        name: "Roopkund",
        location: "Uttarakhand",
        difficulty: "difficult",
        duration: "8 Days",
        distance: "53 km",
        altitude: "16,500 ft",
        price: 10500,
        image:
            "https://images.unsplash.com/photo-1486911278844-a81c5267e227?auto=format&fit=crop&w=900&q=80",
        description:
            "A challenging Himalayan adventure through forests, meadows and high-altitude terrain."
    }

];


/* ================= ELEMENTS ================= */

const trekGrid =
    document.getElementById("trekGrid");

const searchInput =
    document.getElementById("searchInput");

const difficultyFilter =
    document.getElementById("difficultyFilter");

const budgetFilter =
    document.getElementById("budgetFilter");

const resetBtn =
    document.getElementById("resetBtn");

const clearFilters =
    document.getElementById("clearFilters");

const noResults =
    document.getElementById("noResults");

const trekCount =
    document.getElementById("trekCount");


/* ================= DISPLAY TREKS ================= */

function displayTreks(list) {

    trekGrid.innerHTML = "";


    list.forEach((trek, index) => {

        const card =
            document.createElement("article");

        card.className = "trek-card";

        card.innerHTML = `

            <div class="card-image">

                <img
                    src="${trek.image}"
                    alt="${trek.name}"
                    loading="lazy"
                >

                <span class="difficulty">
                    ${trek.difficulty}
                </span>

                <button
                    class="favorite-btn"
                    aria-label="Add ${trek.name} to favorites"
                >
                    ♡
                </button>

            </div>


            <div class="card-content">

                <div class="location">
                    ${trek.location}
                </div>

                <h3>
                    ${trek.name}
                </h3>

                <p>
                    ${trek.description}
                </p>


                <div class="card-details">

                    <div class="detail">

                        <span>
                            Duration
                        </span>

                        <strong>
                            ${trek.duration}
                        </strong>

                    </div>


                    <div class="detail">

                        <span>
                            Distance
                        </span>

                        <strong>
                            ${trek.distance}
                        </strong>

                    </div>


                    <div class="detail">

                        <span>
                            Altitude
                        </span>

                        <strong>
                            ${trek.altitude}
                        </strong>

                    </div>

                </div>


                <div class="card-footer">

                    <div class="price">

                        ₹${trek.price.toLocaleString("en-IN")}

                        <small>
                            / person
                        </small>

                    </div>


                    <a
                        href="#"
                        class="view-btn"
                        data-trek="${trek.name}"
                    >
                        View Details →
                    </a>

                </div>

            </div>
        `;


        trekGrid.appendChild(card);


        /* FAVORITE BUTTON */

        const favoriteBtn =
            card.querySelector(".favorite-btn");

        favoriteBtn.addEventListener(
            "click",
            () => {

                favoriteBtn.classList.toggle("active");

                favoriteBtn.textContent =
                    favoriteBtn.classList.contains("active")
                        ? "♥"
                        : "♡";

            }
        );


        /* VIEW DETAILS */

        const viewBtn =
            card.querySelector(".view-btn");

        viewBtn.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                alert(
                    `Trek details for ${trek.name} will be available soon!`
                );

            }
        );

    });


    /* COUNT */

    trekCount.textContent =
        list.length;


    /* NO RESULTS */

    if (list.length === 0) {

        noResults.classList.add("show");

        trekGrid.style.display = "none";

    } else {

        noResults.classList.remove("show");

        trekGrid.style.display = "grid";

    }

}


/* ================= FILTER FUNCTION ================= */

function filterTreks() {

    const searchValue =
        searchInput.value
            .toLowerCase()
            .trim();

    const difficultyValue =
        difficultyFilter.value;

    const budgetValue =
        budgetFilter.value;


    const filtered =
        treks.filter((trek) => {


            /* SEARCH */

            const matchesSearch =

                trek.name
                    .toLowerCase()
                    .includes(searchValue)

                ||

                trek.location
                    .toLowerCase()
                    .includes(searchValue);


            /* DIFFICULTY */

            const matchesDifficulty =

                difficultyValue === "all"

                ||

                trek.difficulty === difficultyValue;


            /* BUDGET */

            let matchesBudget = true;


            if (budgetValue === "low") {

                matchesBudget =
                    trek.price < 5000;

            }

            else if (budgetValue === "medium") {

                matchesBudget =
                    trek.price >= 5000 &&
                    trek.price <= 8000;

            }

            else if (budgetValue === "high") {

                matchesBudget =
                    trek.price > 8000;

            }


            return (

                matchesSearch &&
                matchesDifficulty &&
                matchesBudget

            );

        });


    displayTreks(filtered);

}


/* ================= RESET ================= */

function resetFilters() {

    searchInput.value = "";

    difficultyFilter.value = "all";

    budgetFilter.value = "all";

    displayTreks(treks);

}


/* ================= EVENTS ================= */

searchInput.addEventListener(
    "input",
    filterTreks
);

difficultyFilter.addEventListener(
    "change",
    filterTreks
);

budgetFilter.addEventListener(
    "change",
    filterTreks
);

resetBtn.addEventListener(
    "click",
    resetFilters
);

clearFilters.addEventListener(
    "click",
    resetFilters
);


/* ================= MOBILE MENU ================= */

const menuBtn =
    document.getElementById("menuBtn");

const mobileMenu =
    document.getElementById("mobileMenu");


menuBtn.addEventListener(
    "click",
    () => {

        mobileMenu.classList.toggle("open");

        menuBtn.textContent =
            mobileMenu.classList.contains("open")
                ? "✕"
                : "☰";

    }
);


/* ================= INITIAL LOAD ================= */

displayTreks(treks);