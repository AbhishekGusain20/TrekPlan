// =====================================================
// TREKPLAN — TRAVEL JOURNAL
// =====================================================


// ================= ELEMENTS =================

const journalForm =
    document.getElementById("journalForm");

const journalList =
    document.getElementById("journalList");

const entryCount =
    document.getElementById("entryCount");

const journalImage =
    document.getElementById("journalImage");


// ================= GET JOURNAL =================

function getJournalEntries() {

    return JSON.parse(
        localStorage.getItem("trekplanJournal")
    ) || [];

}


// ================= SAVE JOURNAL =================

function saveJournalEntries(entries) {

    localStorage.setItem(
        "trekplanJournal",
        JSON.stringify(entries)
    );

}


// ================= ADD MEMORY =================

journalForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const title =
            document
                .getElementById("journalTitle")
                .value
                .trim();


        const date =
            document
                .getElementById("journalDate")
                .value;


        const location =
            document
                .getElementById("journalLocation")
                .value
                .trim();


        const rating =
            document
                .getElementById("journalRating")
                .value;


        const description =
            document
                .getElementById("journalDescription")
                .value
                .trim();


        const imageFile =
            journalImage.files[0];


        // ================= NO IMAGE =================

        if (!imageFile) {

            createJournalEntry(
                title,
                date,
                location,
                rating,
                description,
                ""
            );

            return;

        }


        // ================= READ IMAGE =================

        const reader =
            new FileReader();


        reader.onload = function () {

            createJournalEntry(
                title,
                date,
                location,
                rating,
                description,
                reader.result
            );

        };


        reader.readAsDataURL(imageFile);

    }
);


// ================= CREATE JOURNAL ENTRY =================

function createJournalEntry(
    title,
    date,
    location,
    rating,
    description,
    image
) {

    const newEntry = {

        id: Date.now(),

        title: title,

        date: date,

        location: location,

        rating: Number(rating),

        description: description,

        image: image

    };


    const entries =
        getJournalEntries();


    entries.unshift(newEntry);


    saveJournalEntries(entries);


    journalForm.reset();


    renderJournal();

}


// ================= RENDER JOURNAL =================

function renderJournal() {

    const entries =
        getJournalEntries();


    // ================= COUNT =================

    entryCount.textContent =
        entries.length +
        (
            entries.length === 1
                ? " Memory"
                : " Memories"
        );


    // ================= EMPTY STATE =================

    if (entries.length === 0) {

        journalList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📖
                </div>

                <h3>
                    No memories yet
                </h3>

                <p>
                    Add your first travel memory above.
                </p>

            </div>

        `;

        return;

    }


    // ================= CLEAR LIST =================

    journalList.innerHTML = "";


    // ================= DISPLAY ENTRIES =================

    entries.forEach(function (entry) {


        const card =
            document.createElement("article");


        card.className =
            "memory-card";


        // ================= STARS =================

        const stars =
            "⭐".repeat(entry.rating);


        // ================= CARD =================

        card.innerHTML = `

            ${
                entry.image
                    ? `
                        <img
                            src="${entry.image}"
                            class="memory-image"
                            alt="Travel memory"
                        >
                    `
                    : ""
            }


            <div class="memory-top">

                <div>

                    <h3 class="memory-title">
                        ${escapeHTML(entry.title)}
                    </h3>

                    <p class="memory-location">
                        📍 ${escapeHTML(entry.location)}
                    </p>

                </div>


                <span class="memory-date">
                    📅 ${escapeHTML(entry.date)}
                </span>

            </div>


            <div class="memory-rating">
                ${stars}
            </div>


            <p class="memory-description">
                ${escapeHTML(entry.description)}
            </p>


            <div class="memory-footer">

                <button
                    class="delete-btn"
                    type="button"
                    onclick="deleteMemory(${entry.id})"
                >
                    Delete
                </button>

            </div>

        `;


        journalList.appendChild(card);

    });

}


// ================= DELETE MEMORY =================

function deleteMemory(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this memory?"
        );


    if (!confirmDelete) {

        return;

    }


    let entries =
        getJournalEntries();


    entries =
        entries.filter(
            function (entry) {

                return entry.id !== id;

            }
        );


    saveJournalEntries(entries);


    renderJournal();

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

renderJournal();