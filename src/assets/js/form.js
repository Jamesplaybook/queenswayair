(function () {
  "use strict";

  // ── Phone formatter ─────────────────────────────────────────────────────────
  function formatPhone(input) {
    var digits = input.value.replace(/\D/g, "").slice(0, 10);
    var formatted = digits;
    if (digits.length >= 7) {
      formatted = "(" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6);
    } else if (digits.length >= 4) {
      formatted = "(" + digits.slice(0, 3) + ") " + digits.slice(3);
    } else if (digits.length >= 1) {
      formatted = "(" + digits;
    }
    input.value = formatted;
  }

  document.querySelectorAll("input[type=tel]").forEach(function (tel) {
    tel.addEventListener("input", function () { formatPhone(tel); });
  });

  // ── Form submission (progressive enhancement) ───────────────────────────────
  document.querySelectorAll("form[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Clear previous errors
      form.querySelectorAll(".form__error-msg").forEach(function (el) {
        el.textContent = "";
        el.classList.remove("is-visible");
      });

      // Honeypot check
      var bot = form.querySelector("[name=bot-field]");
      if (bot && bot.value) { return; } // silent reject

      // Basic required-field validation
      var valid = true;
      form.querySelectorAll("[required]").forEach(function (field) {
        if (!field.value.trim()) {
          valid = false;
          var err = form.querySelector("[data-error='" + field.name + "']");
          if (err) { err.textContent = "This field is required."; err.classList.add("is-visible"); }
        }
      });
      // Radio group check
      var radioGroup = form.querySelector("input[type=radio][required]");
      if (radioGroup) {
        var radios = form.querySelectorAll("input[type=radio][name='" + radioGroup.name + "']");
        var checked = Array.from(radios).some(function (r) { return r.checked; });
        if (!checked) {
          valid = false;
          var err = form.querySelector("[data-error='service']");
          if (err) { err.textContent = "Please select an option."; err.classList.add("is-visible"); }
        }
      }
      if (!valid) { return; }

      // Submit via fetch
      var data = new FormData(form);
      var submitBtn = form.querySelector("[type=submit]");
      var originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      })
        .then(function (res) {
          if (!res.ok) { throw new Error("Server error " + res.status); }
          return res.json();
        })
        .then(function () {
          form.querySelectorAll(".form__input, .form__select, .form__textarea, .btn").forEach(function (el) {
            el.style.display = "none";
          });
          form.querySelectorAll("label, legend, fieldset, .form__row, .form__title").forEach(function (el) {
            el.style.display = "none";
          });
          var success = form.querySelector(".form__success");
          if (success) { success.classList.add("is-visible"); }
        })
        .catch(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          alert("Something went wrong. Please call us at the number above.");
        });
    });
  });
})();
