// ==========================================
// TREKPLAN — TRIP OVERVIEW
// ==========================================

console.log("TRIP OVERVIEW JS LOADED");


// ==========================================
// GET SELECTED TRIP
// ==========================================

const storedTrip =
    localStorage.getItem("trekplan_currentTrip");

console.log("Stored Trip:", storedTrip);

const currentTrip =
    storedTrip ? JSON.parse(storedTrip) : null;

console.log("Current Trip:", currentTrip);


// ==========================================
// ELEMENTS
// ==========================================

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

const duration =
    document.getElementById("duration");

const progressText =
    document.getElementById("progressText");

const progressFill =
    document.getElementById("progressFill");

const progressMessage =
    document.getElementById("progressMessage");

const noTrip =
    document.getElementById("noTrip");

const saveNotesBtn =
    document.getElementById("saveNotesBtn");


// ==========================================
// FORMAT MONEY
// ==========================================

function formatMoney(amount) {

    return "₹" +
        Number(amount || 0)
            .toLocaleString("en-IN");
}


// ==========================================
// CALCULATE DURATION
// ==========================================

function calculateDuration(start, end) {

    if (!start || !end) {
        return "-";
    }

    const startDate =
        new Date(start);

    const endDate =
        new Date(end);

    const difference =
        endDate - startDate;

    const days =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        ) + 1;

    return days > 0
        ? days + " Days"
        : "-";
}


// ==========================================
// DISPLAY TRIP
// ==========================================

function displayTrip() {

    console.log(
        "Displaying Trip:",
        currentTrip
    );

    if (!currentTrip) {

        if (noTrip) {
            noTrip.style.display = "block";
        }

        if (tripName) {
            tripName.textContent =
                "No Trip Selected";
        }

        if (destination) {
            destination.textContent =
                "Please select a trip";
        }

        return;
    }


    // Trip Name

    if (tripName) {

        tripName.textContent =
            currentTrip.tripName ||
            "My Trip";
    }


    // Destination

    if (destination) {

        destination.textContent =
            currentTrip.destination ||
            "No destination";
    }


    if (tripDestination) {

        tripDestination.textContent =
            currentTrip.destination ||
            "-";
    }


    // Dates

    if (startDate) {

        startDate.textContent =
            currentTrip.startDate ||
            "-";
    }


    if (endDate) {

        endDate.textContent =
            currentTrip.endDate ||
            "-";
    }


    // Travelers

    if (travelers) {

        travelers.textContent =
            currentTrip.travelers ||
            "-";
    }


    // Budget

    if (budget) {

        budget.textContent =
            formatMoney(
                currentTrip.budget
            );
    }


    // Duration

    if (duration) {

        duration.textContent =
            calculateDuration(
                currentTrip.startDate,
                currentTrip.endDate
            );
    }


    // Progress

    updateProgress();


    // Notes

    loadNotes();
}


// ==========================================
// TRIP PROGRESS
// ==========================================

function updateProgress() {

    if (!currentTrip) {
        return;
    }

    let progress = 0;


    if (currentTrip.tripName) {
        progress += 20;
    }

    if (currentTrip.destination) {
        progress += 20;
    }

    if (currentTrip.startDate) {
        progress += 20;
    }

    if (currentTrip.endDate) {
        progress += 20;
    }

    if (currentTrip.budget) {
        progress += 20;
    }


    if (progressText) {

        progressText.textContent =
            progress + "%";
    }


    if (progressFill) {

        progressFill.style.width =
            progress + "%";
    }


    if (progressMessage) {

        if (progress === 100) {

            progressMessage.textContent =
                "🎉 Your trip is fully planned!";

        } else if (progress >= 60) {

            progressMessage.textContent =
                "👍 Your trip is taking shape.";

        } else {

            progressMessage.textContent =
                "Start planning your trip.";
        }
    }
}


// ==========================================
// NOTES KEY
// ==========================================

function getNotesKey() {

    if (!currentTrip) {
        return null;
    }

    return "trekplan_notes_" +
        currentTrip.id;
}


// ==========================================
// LOAD NOTES
// ==========================================

function loadNotes() {

    if (!currentTrip) {
        return;
    }

    const notesKey =
        getNotesKey();

    let notes = [];

    try {

        notes =
            JSON.parse(
                localStorage.getItem(notesKey)
            ) || [];

    } catch (error) {

        console.error(
            "Could not load notes:",
            error
        );

        notes = [];
    }

    displayNotes(notes);
}


// ==========================================
// SAVE NOTE
// ==========================================

function saveNotes() {

    console.log(
        "Save Notes button clicked"
    );

    if (!currentTrip) {

        alert(
            "No trip selected. Please open Trip Overview using View Trip."
        );

        return;
    }


    const noteInput =
        document.getElementById("tripNotes");


    if (!noteInput) {

        alert(
            "Notes box not found."
        );

        return;
    }


    const noteText =
        noteInput.value.trim();


    if (!noteText) {

        alert(
            "Please write a note first."
        );

        noteInput.focus();

        return;
    }


    const notesKey =
        getNotesKey();

    let notes = [];


    try {

        notes =
            JSON.parse(
                localStorage.getItem(notesKey)
            ) || [];

    } catch (error) {

        console.error(
            "Could not read existing notes:",
            error
        );

        notes = [];
    }


    // Create new note

    const newNote = {

        id: Date.now(),

        text: noteText,

        date:
            new Date()
                .toLocaleDateString("en-IN")

    };


    // Add note

    notes.push(newNote);


    // Save to LocalStorage

    localStorage.setItem(
        notesKey,
        JSON.stringify(notes)
    );


    // Clear textarea

    noteInput.value = "";


    // Show notes

    displayNotes(notes);


    alert(
        "✅ Note saved successfully!"
    );
}


// ==========================================
// DISPLAY SAVED NOTES
// ==========================================

function displayNotes(notes) {

    const notesList =
        document.getElementById(
            "notesList"
        );


    if (!notesList) {

        console.warn(
            "notesList element not found."
        );

        return;
    }


    notesList.innerHTML = "";


    if (
        !notes ||
        notes.length === 0
    ) {

        notesList.innerHTML = `

            <p class="empty-notes">
                No notes saved yet.
            </p>

        `;

        return;
    }


    notes.forEach(function(note) {

        const noteItem =
            document.createElement("div");


        noteItem.className =
            "note-item";


        noteItem.innerHTML = `

            <div class="note-text">

                ${escapeHTML(note.text)}

                <br>

                <small>
                    📅 ${escapeHTML(note.date)}
                </small>

            </div>


            <button
                class="delete-note"
                type="button">

                🗑️

            </button>

        `;


        const deleteButton =
            noteItem.querySelector(
                ".delete-note"
            );


        deleteButton.addEventListener(
            "click",
            function() {

                deleteNote(
                    note.id
                );

            }
        );


        notesList.appendChild(
            noteItem
        );

    });
}


// ==========================================
// DELETE NOTE
// ==========================================

function deleteNote(noteId) {

    if (!currentTrip) {
        return;
    }


    const notesKey =
        getNotesKey();

    let notes = [];


    try {

        notes =
            JSON.parse(
                localStorage.getItem(notesKey)
            ) || [];

    } catch (error) {

        console.error(
            "Could not read notes:",
            error
        );

        notes = [];
    }


    notes =
        notes.filter(
            function(note) {

                return note.id !== noteId;

            }
        );


    localStorage.setItem(
        notesKey,
        JSON.stringify(notes)
    );


    displayNotes(notes);
}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    return String(value || "")

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}


// ==========================================
// QUICK ACTIONS
// ==========================================

function openItinerary() {

    window.location.href =
        "itinerary.html";
}


function openBudget() {

    window.location.href =
        "budget.html";
}


function openProgress() {

    window.location.href =
        "trip-progress.html";
}


function openJournal() {

    window.location.href =
        "journal.html";
}


function openChecklist() {

    window.location.href =
        "checklist.html";
}


function goDashboard() {

    window.location.href =
        "dashboard.html";
}


// ==========================================
// CONNECT SAVE BUTTON
// ==========================================

if (saveNotesBtn) {

    saveNotesBtn.addEventListener(
        "click",
        saveNotes
    );

} else {

    console.warn(
        "saveNotesBtn not found. Check the button ID in trip-overview.html."
    );
}


// ==========================================
// START
// ==========================================

displayTrip();