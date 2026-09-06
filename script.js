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