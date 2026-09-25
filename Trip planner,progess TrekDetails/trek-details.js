// ================= TREK DATA =================

const treks = {

    "nag-tibba": {
        id: "nag-tibba",
        name: "Nag Tibba",
        location: "Uttarakhand",
        difficulty: "Easy",
        duration: "2 Days",
        distance: "16 km",
        altitude: "9,915 ft",
        budget: 3500,
        image:
            "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80",
        description:
            "A perfect weekend trek offering beautiful Himalayan views and peaceful trails.",
        about:
            "Nag Tibba is a popular weekend trek in Uttarakhand. It is suitable for beginners and offers beautiful mountain views, peaceful forests and an exciting Himalayan trekking experience."
    },


    "kedarkantha": {
        id: "kedarkantha",
        name: "Kedarkantha",
        location: "Uttarakhand",
        difficulty: "Moderate",
        duration: "5 Days",
        distance: "20 km",
        altitude: "12,500 ft",
        budget: 7500,
        image:
            "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80",
        description:
            "A popular winter trek known for snowy trails, forests and stunning summit views.",
        about:
            "Kedarkantha is one of the most popular winter treks in Uttarakhand. The trail passes through beautiful pine forests and snow-covered landscapes before reaching the summit."
    },


    "valley-of-flowers": {
        id: "valley-of-flowers",
        name: "Valley of Flowers",
        location: "Uttarakhand",
        difficulty: "Moderate",
        duration: "4 Days",
        distance: "38 km",
        altitude: "14,100 ft",
        budget: 6000,
        image:
            "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=900&q=80",
        description:
            "Walk through colourful alpine meadows surrounded by dramatic Himalayan landscapes.",
        about:
            "Valley of Flowers is famous for its colourful alpine meadows and beautiful Himalayan scenery. During the flowering season, the valley becomes a spectacular natural landscape."
    },


    "hampta-pass": {
        id: "hampta-pass",
        name: "Hampta Pass",
        location: "Himachal Pradesh",
        difficulty: "Difficult",
        duration: "5 Days",
        distance: "35 km",
        altitude: "14,100 ft",
        budget: 8500,
        image:
            "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80",
        description:
            "An adventurous high-altitude trek connecting the green Kullu valley with Spiti.",
        about:
            "Hampta Pass is an adventurous Himalayan trek that connects the green landscapes of Kullu with the dramatic terrain of Spiti. The trek offers changing landscapes throughout the journey."
    },


    "tungnath": {
        id: "tungnath",
        name: "Tungnath & Chandrashila",
        location: "Uttarakhand",
        difficulty: "Moderate",
        duration: "3 Days",
        distance: "14 km",
        altitude: "13,123 ft",
        budget: 5000,
        image:
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80",
        description:
            "Experience spectacular Himalayan sunrise views from one of the highest Shiva temples.",
        about:
            "The Tungnath and Chandrashila trek is known for its beautiful Himalayan views and spectacular sunrise. It combines a spiritual experience with an exciting mountain adventure."
    },


    "roopkund": {
        id: "roopkund",
        name: "Roopkund",
        location: "Uttarakhand",
        difficulty: "Difficult",
        duration: "8 Days",
        distance: "53 km",
        altitude: "16,500 ft",
        budget: 10500,
        image:
            "https://images.unsplash.com/photo-1486911278844-a81c5267e227?auto=format&fit=crop&w=900&q=80",
        description:
            "A challenging Himalayan adventure through forests, meadows and high-altitude terrain.",
        about:
            "Roopkund is a challenging high-altitude Himalayan trek featuring forests, alpine meadows and difficult mountain terrain. It is better suited for experienced trekkers."
    }

};


// ================= GET TREK FROM URL =================

const params = new URLSearchParams(window.location.search);

const trekId = params.get("trek");


// Get selected trek
const trek = treks[trekId] || treks["nag-tibba"];


// ================= DISPLAY TREK =================

// Page title
document.title = `${trek.name} — TrekPlan`;


// Trek name
document.getElementById("trekName").textContent =
    trek.name;


// Location
document.getElementById("trekLocation").textContent =
    `📍 ${trek.location}`;


// Description
document.getElementById("trekDescription").textContent =
    trek.description;


// Duration
document.getElementById("trekDuration").textContent =
    trek.duration;


// Distance
document.getElementById("trekDistance").textContent =
    trek.distance;


// Budget
document.getElementById("trekBudget").textContent =
    `₹${trek.budget.toLocaleString("en-IN")}`;


// Sidebar Budget
document.getElementById("sideBudget").textContent =
    `₹${trek.budget.toLocaleString("en-IN")}`;


// About
document.getElementById("aboutTrek").textContent =
    trek.about;


// Image
document.getElementById("trekImage").src =
    trek.image;


// Image alt
document.getElementById("trekImage").alt =
    trek.name;


// Difficulty
document.getElementById("difficultyBadge").textContent =
    trek.difficulty;


// ================= PLAN BUTTON =================

function planTrek() {

    alert(
        `Great choice! 🏔️\n\n` +
        `You selected ${trek.name}.\n\n` +
        `Trip planning will be available soon!`
    );

}


// Main Plan Button
document
    .getElementById("planBtn")
    .addEventListener("click", planTrek);


// Sidebar Plan Button
document
    .getElementById("sidePlanBtn")
    .addEventListener("click", planTrek);