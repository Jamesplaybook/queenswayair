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
  var lightboxPrev     = document.getElementById("lightbox-prev");
  var lightboxNext     = document.getElementById("lightbox-next");
  var lightboxTriggers = Array.prototype.slice.call(document.querySelectorAll(".js-lightbox-trigger"));

  if (lightbox && lightboxImg && lightboxClose && lightboxTriggers.length) {
    var lightboxLastFocused = null;
    var lightboxIndex = 0;
    var hasMultiple = lightboxTriggers.length > 1;

    function showImage(index) {
      lightboxIndex = (index + lightboxTriggers.length) % lightboxTriggers.length;
      var trigger = lightboxTriggers[lightboxIndex];
      lightboxImg.src = trigger.getAttribute("data-lightbox-src") || "";
      lightboxImg.alt = trigger.getAttribute("data-lightbox-alt") || "";
      lightboxCaption.textContent = trigger.getAttribute("data-lightbox-caption") || "";
    }

    function showNext() { showImage(lightboxIndex + 1); }
    function showPrev() { showImage(lightboxIndex - 1); }

    function openLightbox(index) {
      showImage(index);
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

    lightboxTriggers.forEach(function (trigger, i) {
      trigger.addEventListener("click", function () {
        lightboxLastFocused = trigger;
        openLightbox(i);
      });
    });

    lightboxClose.addEventListener("click", closeLightbox);

    if (hasMultiple) {
      lightboxPrev.addEventListener("click", showPrev);
      lightboxNext.addEventListener("click", showNext);
    } else {
      lightboxPrev.hidden = true;
      lightboxNext.hidden = true;
    }

    // Click on the dark backdrop (not the image/caption/close/nav buttons) closes it
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      else if (hasMultiple && e.key === "ArrowRight") showNext();
      else if (hasMultiple && e.key === "ArrowLeft") showPrev();
    });

    // Touch swipe (left = next, right = previous)
    var touchStartX = null;
    lightbox.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener("touchend", function (e) {
      if (touchStartX === null || !hasMultiple) return;
      var deltaX = e.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(deltaX) < 40) return;
      if (deltaX < 0) showNext();
      else showPrev();
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
