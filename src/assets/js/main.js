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

  // ── Project gallery lightbox ─────────────────────────────────────────────
  var lightbox        = document.getElementById("lightbox");
  var lightboxImg      = document.getElementById("lightbox-img");
  var lightboxCaption  = document.getElementById("lightbox-caption");
  var lightboxClose    = document.getElementById("lightbox-close");
  var lightboxTriggers = document.querySelectorAll(".js-lightbox-trigger");

  if (lightbox && lightboxImg && lightboxClose && lightboxTriggers.length) {
    var lightboxLastFocused = null;

    function openLightbox(trigger) {
      lightboxLastFocused = trigger;
      lightboxImg.src = trigger.getAttribute("data-lightbox-src") || "";
      lightboxImg.alt = trigger.getAttribute("data-lightbox-alt") || "";
      lightboxCaption.textContent = trigger.getAttribute("data-lightbox-caption") || "";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
      lightboxClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");
      lightboxImg.src = "";
      if (lightboxLastFocused) lightboxLastFocused.focus();
    }

    lightboxTriggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        openLightbox(trigger);
      });
    });

    lightboxClose.addEventListener("click", closeLightbox);

    // Click on the dark backdrop (not the image/caption/close button) closes it
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  }

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
