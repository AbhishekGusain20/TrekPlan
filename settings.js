/* =========================================================
   TREKPLAN SETTINGS
========================================================= */


/* =========================================================
   STORAGE KEY
========================================================= */

const SETTINGS_KEY = "trekplan_settings";


/* =========================================================
   DEFAULT SETTINGS
========================================================= */

const defaultSettings = {

    name: "AVI",

    email: "",

    travelerType: "Traveler",

    currency: "INR",

    distanceUnit: "km",

    travelStyle: "Adventure",

    defaultTravelers: "1",

    theme: "light",

    tripNotifications: true,

    budgetNotifications: true,

    communityNotifications: false

};


/* =========================================================
   GET SETTINGS
========================================================= */

function getSettings() {

    const saved =
        localStorage.getItem(SETTINGS_KEY);

    if (!saved) {

        return {
            ...defaultSettings
        };

    }

    try {

        return {
            ...defaultSettings,
            ...JSON.parse(saved)
        };

    } catch (error) {

        console.log(
            "Could not read settings.",
            error
        );

        return {
            ...defaultSettings
        };

    }

}


/* =========================================================
   CURRENT SETTINGS
========================================================= */

let settings = getSettings();


/* =========================================================
   ELEMENTS
========================================================= */

const userName =
    document.getElementById("userName");

const userEmail =
    document.getElementById("userEmail");

const travelerType =
    document.getElementById("travelerType");

const currency =
    document.getElementById("currency");

const distanceUnit =
    document.getElementById("distanceUnit");

const travelStyle =
    document.getElementById("travelStyle");

const defaultTravelers =
    document.getElementById("defaultTravelers");

const tripNotifications =
    document.getElementById("tripNotifications");

const budgetNotifications =
    document.getElementById("budgetNotifications");

const communityNotifications =
    document.getElementById("communityNotifications");


/* =========================================================
   LOAD SETTINGS
========================================================= */

function loadSettings() {

    userName.value =
        settings.name;

    userEmail.value =
        settings.email;

    travelerType.value =
        settings.travelerType;

    currency.value =
        settings.currency;

    distanceUnit.value =
        settings.distanceUnit;

    travelStyle.value =
        settings.travelStyle;

    defaultTravelers.value =
        settings.defaultTravelers;

    tripNotifications.checked =
        settings.tripNotifications;

    budgetNotifications.checked =
        settings.budgetNotifications;

    communityNotifications.checked =
        settings.communityNotifications;


    updateProfilePreview();

    applyTheme(
        settings.theme
    );

}


/* =========================================================
   SAVE SETTINGS
========================================================= */

function saveSettings() {

    localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(settings)
    );

}


/* =========================================================
   PROFILE PREVIEW
========================================================= */

function updateProfilePreview() {

    const name =
        settings.name ||
        "AVI";


    const firstLetter =
        name
            .trim()
            .charAt(0)
            .toUpperCase();


    document.getElementById(
        "profileAvatar"
    ).textContent = firstLetter;


    document.getElementById(
        "sidebarAvatar"
    ).textContent = firstLetter;


    document.getElementById(
        "sidebarName"
    ).textContent = name;


    document.getElementById(
        "profilePreviewName"
    ).textContent = name;

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");


    toastMessage.textContent =
        message;


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* =========================================================
   SAVE PROFILE
========================================================= */

document
    .getElementById("saveProfile")
    .addEventListener(
        "click",
        function () {

            const name =
                userName.value.trim();


            if (!name) {

                showToast(
                    "Please enter your name"
                );

                userName.focus();

                return;

            }


            settings.name =
                name;

            settings.email =
                userEmail.value.trim();

            settings.travelerType =
                travelerType.value;


            saveSettings();

            updateProfilePreview();

            showToast(
                "Profile saved successfully"
            );

        }
    );


/* =========================================================
   SAVE PREFERENCES
========================================================= */

document
    .getElementById("savePreferences")
    .addEventListener(
        "click",
        function () {

            settings.currency =
                currency.value;

            settings.distanceUnit =
                distanceUnit.value;

            settings.travelStyle =
                travelStyle.value;

            settings.defaultTravelers =
                defaultTravelers.value;


            saveSettings();


            showToast(
                "Travel preferences saved"
            );

        }
    );


/* =========================================================
   NOTIFICATIONS
========================================================= */

tripNotifications.addEventListener(
    "change",
    function () {

        settings.tripNotifications =
            this.checked;

        saveSettings();

        showToast(
            "Notification preference updated"
        );

    }
);


budgetNotifications.addEventListener(
    "change",
    function () {

        settings.budgetNotifications =
            this.checked;

        saveSettings();

        showToast(
            "Notification preference updated"
        );

    }
);


communityNotifications.addEventListener(
    "change",
    function () {

        settings.communityNotifications =
            this.checked;

        saveSettings();

        showToast(
            "Notification preference updated"
        );

    }
);


/* =========================================================
   THEME
========================================================= */

const themeButtons =
    document.querySelectorAll(
        ".theme-option"
    );


function applyTheme(theme) {

    if (theme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

    } else {

        document.body.classList.remove(
            "dark-mode"
        );

    }


    themeButtons.forEach(button => {

        button.classList.remove(
            "active"
        );


        if (
            button.dataset.theme ===
            theme
        ) {

            button.classList.add(
                "active"
            );

        }

    });

}


themeButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            const selectedTheme =
                this.dataset.theme;


            settings.theme =
                selectedTheme;


            saveSettings();

            applyTheme(
                selectedTheme
            );


            showToast(
                selectedTheme === "dark"
                    ? "Dark mode enabled"
                    : "Light mode enabled"
            );

        }
    );

});


/* =========================================================
   EXPORT DATA
========================================================= */

document
    .getElementById("exportData")
    .addEventListener(
        "click",
        function () {

            const data = {

                settings: settings,

                trips:
                    localStorage.getItem(
                        "trekplan_currentTrip"
                    ),

                checklist:
                    localStorage.getItem(
                        "trekplan_checklist"
                    ),

                journal:
                    localStorage.getItem(
                        "trekplanTravelJournal"
                    )

            };


            const file =
                new Blob(
                    [
                        JSON.stringify(
                            data,
                            null,
                            2
                        )
                    ],
                    {
                        type:
                            "application/json"
                    }
                );


            const url =
                URL.createObjectURL(
                    file
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href = url;

            link.download =
                "trekplan-data.json";


            link.click();


            URL.revokeObjectURL(
                url
            );


            showToast(
                "Your data has been exported"
            );

        }
    );


/* =========================================================
   RESET SETTINGS
========================================================= */

document
    .getElementById("resetSettings")
    .addEventListener(
        "click",
        function () {

            const confirmReset =
                confirm(
                    "Reset all TrekPlan settings to default?"
                );


            if (!confirmReset) {

                return;

            }


            settings = {
                ...defaultSettings
            };


            saveSettings();

            loadSettings();


            showToast(
                "Settings restored to default"
            );

        }
    );


/* =========================================================
   LOGOUT
========================================================= */

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        function () {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {

                return;

            }


            localStorage.removeItem(
                "trekplan_session"
            );

            sessionStorage.removeItem(
                "trekplan_session"
            );


            window.location.href =
                "login.html";

        }
    );


/* =========================================================
   MOBILE MENU
========================================================= */

const mobileMenu =
    document.getElementById(
        "mobileMenu"
    );


if (mobileMenu) {

    mobileMenu.addEventListener(
        "click",
        function () {

            document
                .getElementById("sidebar")
                .classList.toggle("open");

        }
    );

}


/* =========================================================
   START
========================================================= */

loadSettings();
