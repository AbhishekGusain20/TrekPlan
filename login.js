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
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

/* ---------- Active nav link ---------- */
const navItems = document.querySelectorAll(".nav-links > a");

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navItems.forEach((link) => link.classList.remove("active"));
    item.classList.add("active");
  });
});

/* ---------- Scroll-aware navbar ---------- */
const navbar = document.getElementById("navbar");

if (navbar) {
  const updateNavbar = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  };

  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });
}

/* ---------- Footer year ---------- */
const yearElement = document.querySelector(".footer-bottom span");

if (yearElement) {
  const currentYear = new Date().getFullYear();
  yearElement.textContent = `© ${currentYear} TrekPlan. Built for explorers.`;
}

/* ==========================================
   LOGIN (V1 — local demo auth, no backend)
   Seeds a demo account in localStorage so the
   form is testable before a signup flow exists.
========================================== */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  const USERS_KEY = "trekplan_users";
  const SESSION_KEY = "trekplan_session";

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const rememberMe = document.getElementById("rememberMe");
  const formError = document.getElementById("formError");

  // ---- UI wiring first, so it works even if storage is unavailable ----

  // Password visibility toggle
  const passwordToggle = document.getElementById("passwordToggle");
  if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";
      passwordToggle.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
      passwordToggle.classList.toggle("is-visible", isHidden);
    });
  }

  // Forgot password (not implemented in V1)
  const forgotPassword = document.getElementById("forgotPassword");
  if (forgotPassword) {
    forgotPassword.addEventListener("click", (event) => {
      event.preventDefault();
      alert("Password reset isn't available yet — this is a local demo login for now.");
    });
  }

  // Google login (visual only in V1)
  const googleBtn = document.getElementById("googleBtn");
  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      alert("Google sign-in isn't set up yet — coming in a later version.");
    });
  }

  // ---- Storage-dependent logic, guarded so a storage error can't break the UI above ----

  const showError = (message) => {
    if (!formError) return;
    formError.textContent = message;
    formError.hidden = false;
  };
  const hideError = () => {
    if (formError) formError.hidden = true;
  };

  try {
    // Seed a demo account on first visit
    if (!localStorage.getItem(USERS_KEY)) {
      const demoUser = [{ name: "Alex Traveler", email: "demo@trekplan.com", password: "trekplan123" }];
      localStorage.setItem(USERS_KEY, JSON.stringify(demoUser));
    }
  } catch (err) {
    console.warn("TrekPlan: localStorage unavailable, demo login won't persist.", err);
  }

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    hideError();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!email || !password) {
      showError("Please enter both email and password.");
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      const match = users.find(
        (user) => user.email.toLowerCase() === email && user.password === password
      );

      if (!match) {
        showError("Invalid email or password. Try the demo login shown above.");
        return;
      }

      const session = { name: match.name, email: match.email, loggedInAt: Date.now() };

      if (rememberMe && rememberMe.checked) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      } else {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      }

      window.location.href = "index.html";
    } catch (err) {
      showError("Login isn't available right now — this page needs to be opened via a local server, not double-clicked as a file.");
      console.error("TrekPlan: login failed, storage error.", err);
    }
  });
}