/* ==========================================
   TREKPLAN LANDING PAGE
========================================== */

/* ---------- Mobile menu ---------- */

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {

  const closeMenu = () => {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  };

  menuBtn.addEventListener("click", () => {

    const isOpen = navLinks.classList.toggle("open");

    menuBtn.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

  });

  navLinks.querySelectorAll("a").forEach((link) => {

    link.addEventListener("click", closeMenu);

  });

  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
      closeMenu();
    }

  });

}


/* ---------- Active nav link ---------- */

const navItems = document.querySelectorAll(".nav-links > a");

navItems.forEach((item) => {

  item.addEventListener("click", () => {

    navItems.forEach((link) => {
      link.classList.remove("active");
    });

    item.classList.add("active");

  });

});


/* ---------- Scroll-aware navbar ---------- */

const navbar = document.getElementById("navbar");

if (navbar) {

  const updateNavbar = () => {

    navbar.classList.toggle(
      "scrolled",
      window.scrollY > 40
    );

  };

  updateNavbar();

  window.addEventListener(
    "scroll",
    updateNavbar,
    { passive: true }
  );

}


/* ---------- Footer year ---------- */

const yearElement =
  document.querySelector(".footer-bottom span");

if (yearElement) {

  const currentYear = new Date().getFullYear();

  yearElement.textContent =
    `© ${currentYear} TrekPlan. Built for explorers.`;

}


/* ==========================================
   LOGIN
   Uses users created from Signup page
========================================== */

const loginForm =
  document.getElementById("loginForm");

if (loginForm) {

  const USERS_KEY = "trekplan_users";
  const SESSION_KEY = "trekplan_session";

  const emailInput =
    document.getElementById("email");

  const passwordInput =
    document.getElementById("password");

  const rememberMe =
    document.getElementById("rememberMe");

  const formError =
    document.getElementById("formError");


  /* ---------- Password visibility ---------- */

  const passwordToggle =
    document.getElementById("passwordToggle");

  if (passwordToggle && passwordInput) {

    passwordToggle.addEventListener("click", () => {

      const isHidden =
        passwordInput.type === "password";

      passwordInput.type =
        isHidden ? "text" : "password";

      passwordToggle.setAttribute(
        "aria-label",
        isHidden
          ? "Hide password"
          : "Show password"
      );

      passwordToggle.classList.toggle(
        "is-visible",
        isHidden
      );

    });

  }


  /* ---------- Forgot password ---------- */

  const forgotPassword =
    document.getElementById("forgotPassword");

  if (forgotPassword) {

    forgotPassword.addEventListener(
      "click",
      (event) => {

        event.preventDefault();

        alert(
          "Password reset isn't available yet."
        );

      }
    );

  }


  /* ---------- Google login ---------- */

  const googleBtn =
    document.getElementById("googleBtn");

  if (googleBtn) {

    googleBtn.addEventListener("click", () => {

      alert(
        "Google sign-in isn't set up yet — coming in a later version."
      );

    });

  }


  /* ---------- Error messages ---------- */

  const showError = (message) => {

    if (!formError) return;

    formError.textContent = message;

    formError.hidden = false;

  };


  const hideError = () => {

    if (formError) {
      formError.hidden = true;
    }

  };


  /* ==========================================
     LOGIN FORM
  ========================================== */

  loginForm.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();

      hideError();


      /* ---------- Get input values ---------- */

      const email =
        emailInput.value
          .trim()
          .toLowerCase();

      const password =
        passwordInput.value;


      /* ---------- Validate ---------- */

      if (!email || !password) {

        showError(
          "Please enter both email and password."
        );

        return;

      }


      /* ---------- Check users ---------- */

      try {

        const users =
          JSON.parse(
            localStorage.getItem(USERS_KEY) || "[]"
          );


        const match =
          users.find(
            (user) =>
              user.email.toLowerCase() === email &&
              user.password === password
          );


        /* ---------- Invalid login ---------- */

        if (!match) {

          showError(
            "Invalid email or password."
          );

          return;

        }


        /* ---------- Create session ---------- */

        const session = {

          name: match.name,

          email: match.email,

          loggedInAt: Date.now()

        };


        /* ---------- Remember Me ---------- */

        if (
          rememberMe &&
          rememberMe.checked
        ) {

          localStorage.setItem(
            SESSION_KEY,
            JSON.stringify(session)
          );

        } else {

          sessionStorage.setItem(
            SESSION_KEY,
            JSON.stringify(session)
          );

        }


        /* ---------- Go to Dashboard ---------- */

        window.location.href =
          "dashboard.html";

      }


      /* ---------- Storage error ---------- */

      catch (err) {

        showError(
          "Login isn't available right now. Please open TrekPlan using a local server."
        );

        console.error(
          "TrekPlan: login failed.",
          err
        );

      }

    }
  );

}