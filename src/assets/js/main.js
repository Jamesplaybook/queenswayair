(function () {
  "use strict";

  // ── Mobile nav ──────────────────────────────────────────────────────────────
  var hamburger  = document.getElementById("hamburger-btn");
  var mobileNav  = document.getElementById("mobile-nav");
  var closeBtn   = document.getElementById("mobile-nav-close");

  function openNav() {
    mobileNav.classList.add("is-open");
    mobileNav.setAttribute("aria-hidden", "false");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
    closeBtn.focus();
  }

  function closeNav() {
    mobileNav.classList.remove("is-open");
    mobileNav.setAttribute("aria-hidden", "true");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
    hamburger.focus();
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", openNav);
    closeBtn.addEventListener("click", closeNav);

    // Close on Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileNav.classList.contains("is-open")) {
        closeNav();
      }
    });
  }

  // ── Submenu accordion (mobile) ──────────────────────────────────────────────
  var toggles = document.querySelectorAll(".submenu-toggle");
  toggles.forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      var item = toggle.closest(".mobile-nav__item");
      var isOpen = item.classList.contains("is-open");
      // Close all first
      document.querySelectorAll(".mobile-nav__item.is-open").forEach(function (el) {
        el.classList.remove("is-open");
        el.querySelector(".submenu-toggle").textContent = "+";
      });
      if (!isOpen) {
        item.classList.add("is-open");
        toggle.textContent = "−";
      }
    });
  });

  // ── Scroll-reveal (fade-in on scroll) ──────────────────────────────────────
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".fade-in").forEach(function (el) {
      io.observe(el);
    });
  } else {
    // No IO support — show everything immediately
    document.querySelectorAll(".fade-in").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();
