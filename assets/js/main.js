// SUD ALPES ÉTANCHÉITÉ — interactions
(function () {
  "use strict";

  // Header background on scroll
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile nav
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  var mobileClose = document.querySelector(".mobile-nav-close");

  function openNav() {
    mobileNav.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeNav() {
    mobileNav.classList.remove("open");
    document.body.style.overflow = "";
  }
  if (toggle) toggle.addEventListener("click", openNav);
  if (mobileClose) mobileClose.addEventListener("click", closeNav);
  document.querySelectorAll(".mobile-nav a").forEach(function (a) {
    a.addEventListener("click", closeNav);
  });

  // FAQ accordion
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-question");
    var answer = item.querySelector(".faq-answer");
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (other) {
        if (other !== item) {
          other.classList.remove("open");
          other.querySelector(".faq-answer").style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove("open");
        answer.style.maxHeight = null;
      } else {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  // Reveal on scroll
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // File input label update
  var fileInput = document.querySelector('.file-drop input[type="file"]');
  var fileLabel = document.querySelector(".file-drop .file-drop-text");
  if (fileInput) {
    fileInput.addEventListener("change", function () {
      if (fileInput.files.length > 0) {
        fileLabel.textContent =
          fileInput.files.length + " fichier(s) sélectionné(s)";
      } else {
        fileLabel.textContent = "Glissez vos photos ici ou cliquez pour parcourir";
      }
    });
  }

  // Quote forms (main form + hero quick-quote card): basic front-end handling (no backend wired yet)
  document.querySelectorAll(".quote-form, .hero-quote-card").forEach(function (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var submitBtn = quoteForm.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.textContent = "Envoi en cours...";
      submitBtn.disabled = true;
      setTimeout(function () {
        submitBtn.textContent = "Demande envoyée — merci !";
        quoteForm.reset();
        var fl = quoteForm.querySelector(".file-drop .file-drop-text");
        if (fl) fl.textContent = "Glissez vos photos ici ou cliquez pour parcourir";
        setTimeout(function () {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 3000);
      }, 900);
    });
  });

  // Current year in footer
  var yearEl = document.querySelector("#current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
