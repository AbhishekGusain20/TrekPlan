/* =========================================
   TREKPLAN — TRAVEL JOURNAL
   DAY 13
========================================= */


/* =========================================
   GET ELEMENTS
========================================= */

const journalForm = document.getElementById("journalForm");

const locationInput = document.getElementById("location");

const ratingInput = document.getElementById("rating");

const experienceInput = document.getElementById("experience");

const photoInput = document.getElementById("photo");

const memoriesContainer =
    document.getElementById("memoriesContainer");

const formTitle =
    document.getElementById("formTitle");

const saveBtn =
    document.getElementById("saveBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const photoPreview =
    document.getElementById("photoPreview");


/* =========================================
   LOCAL STORAGE KEY
========================================= */

const JOURNAL_KEY = "trekplanTravelJournal";


/* =========================================
   GET SAVED MEMORIES
========================================= */

let memories =
    JSON.parse(localStorage.getItem(JOURNAL_KEY)) || [];


/* =========================================
   EDITING MEMORY ID
========================================= */

let editingId = null;


/* =========================================
   DISPLAY MEMORIES
========================================= */

function displayMemories() {

    memoriesContainer.innerHTML = "";


    /* No memories */

    if (memories.length === 0) {

        memoriesContainer.innerHTML = `
            <div class="empty-message">
                <h3>No memories yet 📖</h3>
                <p>Add your first travel memory above.</p>
            </div>
        `;

        return;
    }


    /* Display every memory */

    memories.forEach(function(memory) {

        const card = document.createElement("div");

        card.className = "memory-card";


        /* Image */

        let imageHTML = "";

        if (memory.photo) {

            imageHTML = `
                <img
                    src="${memory.photo}"
                    alt="${memory.location}"
                >
            `;

        }


        /* Stars */

        const stars =
            "⭐".repeat(Number(memory.rating));


        card.innerHTML = `

            ${imageHTML}

            <div class="memory-content">

                <h3>📍 ${memory.location}</h3>

                <div class="rating">
                    ${stars}
                </div>

                <p class="experience">
                    ${memory.experience}
                </p>


                <div class="memory-buttons">

                    <button
                        class="edit-btn"
                        onclick="editMemory('${memory.id}')"
                    >
                        ✏️ Edit
                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteMemory('${memory.id}')"
                    >
                        🗑️ Delete
                    </button>

                </div>

            </div>
        `;


        memoriesContainer.appendChild(card);

    });

}


/* =========================================
   PHOTO INPUT
========================================= */

photoInput.addEventListener("change", function() {

    const file = photoInput.files[0];

    if (!file) {
        return;
    }


    const reader = new FileReader();


    reader.onload = function(event) {

        photoPreview.innerHTML = `
            <img
                src="${event.target.result}"
                alt="Photo Preview"
            >
        `;

    };


    reader.readAsDataURL(file);

});


/* =========================================
   ADD / UPDATE MEMORY
========================================= */

journalForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const location =
        locationInput.value.trim();

    const rating =
        ratingInput.value;

    const experience =
        experienceInput.value.trim();


    /* Check fields */

    if (!location || !rating || !experience) {

        alert("Please fill all required fields.");

        return;
    }


    /* =====================================
       UPDATE EXISTING MEMORY
    ===================================== */

    if (editingId !== null) {

        const memory =
            memories.find(
                item => item.id === editingId
            );


        if (memory) {

            memory.location = location;

            memory.rating = rating;

            memory.experience = experience;


            /*
                If user selected a new photo,
                update the photo.
            */

            if (photoInput.files[0]) {

                const reader =
                    new FileReader();


                reader.onload = function(event) {

                    memory.photo =
                        event.target.result;


                    saveMemories();

                    resetForm();

                    displayMemories();

                    alert("Memory updated successfully! ✏️");

                };


                reader.readAsDataURL(
                    photoInput.files[0]
                );


                return;
            }


            saveMemories();

            resetForm();

            displayMemories();

            alert("Memory updated successfully! ✏️");

            return;
        }

    }


    /* =====================================
       ADD NEW MEMORY
    ===================================== */

    const newMemory = {

        id: Date.now().toString(),

        location: location,

        rating: rating,

        experience: experience,

        photo: ""

    };


    /*
        Check if photo exists
    */

    if (photoInput.files[0]) {

        const reader =
            new FileReader();


        reader.onload = function(event) {

            newMemory.photo =
                event.target.result;


            memories.push(newMemory);

            saveMemories();

            resetForm();

            displayMemories();

            alert("Travel memory saved! 📸");

        };


        reader.readAsDataURL(
            photoInput.files[0]
        );


    } else {

        memories.push(newMemory);

        saveMemories();

        resetForm();

        displayMemories();

        alert("Travel memory saved! 📖");

    }

});


/* =========================================
   EDIT MEMORY
========================================= */

function editMemory(id) {

    const memory =
        memories.find(
            item => item.id === id
        );


    if (!memory) {
        return;
    }


    /* Store editing ID */

    editingId = id;


    /* Put data inside form */

    locationInput.value =
        memory.location;

    ratingInput.value =
        memory.rating;

    experienceInput.value =
        memory.experience;


    /* Show existing photo */

    if (memory.photo) {

        photoPreview.innerHTML = `
            <p>Current Photo:</p>

            <img
                src="${memory.photo}"
                alt="Current Travel Photo"
            >
        `;

    } else {

        photoPreview.innerHTML = "";

    }


    /* Change form heading */

    formTitle.textContent =
        "Edit Travel Memory ✏️";


    /* Change button */

    saveBtn.textContent =
        "Update Memory";


    /* Show cancel */

    cancelBtn.style.display =
        "block";


    /* Scroll to form */

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================
   DELETE MEMORY
========================================= */

function deleteMemory(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this memory?"
        );


    if (!confirmed) {

        return;

    }


    memories =
        memories.filter(
            memory => memory.id !== id
        );


    saveMemories();

    displayMemories();


    alert("Memory deleted successfully! 🗑️");

}


/* =========================================
   CANCEL EDIT
========================================= */

cancelBtn.addEventListener("click", function() {

    resetForm();

});


/* =========================================
   RESET FORM
========================================= */

function resetForm() {

    journalForm.reset();


    editingId = null;


    formTitle.textContent =
        "Add Travel Memory";


    saveBtn.textContent =
        "Save Memory";


    cancelBtn.style.display =
        "none";


    photoPreview.innerHTML = "";

}


/* =========================================
   SAVE TO LOCAL STORAGE
========================================= */

function saveMemories() {

    localStorage.setItem(

        JOURNAL_KEY,

        JSON.stringify(memories)

    );

}


/* =========================================
   LOAD MEMORIES WHEN PAGE OPENS
========================================= */

displayMemories();