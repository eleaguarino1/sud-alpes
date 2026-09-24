// SUD ALPES ÉTANCHÉITÉ - interactions
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

  // Quote forms (main form + hero quick-quote card): submitted to Netlify Forms
  document.querySelectorAll(".quote-form, .hero-quote-card").forEach(function (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var submitBtn = quoteForm.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.textContent = "Envoi en cours...";
      submitBtn.disabled = true;

      fetch("/", { method: "POST", body: new FormData(quoteForm) })
        .then(function () {
          submitBtn.textContent = "Demande envoyée - merci !";
          quoteForm.reset();
          var fl = quoteForm.querySelector(".file-drop .file-drop-text");
          if (fl) fl.textContent = "Glissez vos photos ici ou cliquez pour parcourir";
        })
        .catch(function () {
          submitBtn.textContent = "Erreur - réessayez ou appelez-nous";
        })
        .finally(function () {
          setTimeout(function () {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }, 3000);
        });
    });
  });

  // Current year in footer
  var yearEl = document.querySelector("#current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Expertise card photo galleries (e.g. "Terrasses sous protection lourde")
  var modal = document.querySelector("#photo-modal");
  if (modal) {
    var modalTitle = modal.querySelector(".photo-modal-title");
    var modalGrid = modal.querySelector(".photo-modal-grid");

    function openGallery(card) {
      var title = card.getAttribute("data-gallery-title") || "";
      var images = [];
      try {
        images = JSON.parse(card.getAttribute("data-gallery-images") || "[]");
      } catch (e) {
        images = [];
      }
      modalTitle.textContent = title;
      modalGrid.innerHTML = "";
      images.forEach(function (item) {
        var fig = document.createElement("figure");
        fig.className = "photo-modal-item";
        var img = document.createElement("img");
        img.src = item.src;
        img.alt = item.label || "";
        img.loading = "lazy";
        var cap = document.createElement("figcaption");
        cap.textContent = item.label || "";
        fig.appendChild(img);
        fig.appendChild(cap);
        modalGrid.appendChild(fig);
      });
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeGallery() {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    document.querySelectorAll(".has-gallery").forEach(function (card) {
      card.addEventListener("click", function () {
        openGallery(card);
      });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openGallery(card);
        }
      });
    });

    modal.querySelectorAll("[data-modal-close]").forEach(function (el) {
      el.addEventListener("click", closeGallery);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeGallery();
    });
  }

  // Zone d'intervention modal (click on the hero "du Pays d'Aix aux Hautes-Alpes")
  var zoneModal = document.querySelector("#zone-modal");
  var zoneTrigger = document.querySelector("#zone-trigger");
  if (zoneModal && zoneTrigger) {
    var zoneMapInstance = null;

    function initZoneMap() {
      if (zoneMapInstance || typeof L === "undefined") return;
      var mapEl = document.querySelector("#zone-map");
      if (!mapEl) return;

      var hq = [43.567, 5.333];
      // Approximate zones (not exact administrative borders), just enough
      // to show roughly where the company intervenes.
      var zones = [
        { name: "Pays d'Aix", center: [43.55, 5.42], radius: 26000 },
        { name: "Vaucluse", center: [43.98, 5.10], radius: 32000 },
        { name: "Var", center: [43.45, 6.05], radius: 27000 },
        { name: "Alpes-de-Haute-Provence", center: [44.05, 6.05], radius: 42000 },
        { name: "Hautes-Alpes", center: [44.75, 6.42], radius: 46000 }
      ];

      zoneMapInstance = L.map(mapEl, {
        scrollWheelZoom: false,
        attributionControl: true
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\" rel=\"noopener\">OpenStreetMap</a>"
      }).addTo(zoneMapInstance);

      var boundsPoints = [hq];
      zones.forEach(function (zone) {
        var circle = L.circle(zone.center, {
          radius: zone.radius,
          color: "#3E6EB5",
          weight: 1.5,
          fillColor: "#3E6EB5",
          fillOpacity: 0.14
        }).addTo(zoneMapInstance);
        circle.bindTooltip(zone.name, {
          permanent: true,
          direction: "center",
          className: "zone-map-label"
        });
        boundsPoints.push(circle.getBounds().getNorthEast());
        boundsPoints.push(circle.getBounds().getSouthWest());
      });

      var hqIcon = L.divIcon({
        className: "zone-map-hq-marker",
        html: "<span></span>",
        iconSize: [16, 16]
      });
      L.marker(hq, { icon: hqIcon }).addTo(zoneMapInstance).bindTooltip("Sud Alpes Étanchéité", { permanent: false });

      zoneMapInstance.fitBounds(boundsPoints, { padding: [16, 16] });
    }

    function openZone() {
      zoneModal.classList.add("open");
      zoneModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      initZoneMap();
      setTimeout(function () {
        if (zoneMapInstance) zoneMapInstance.invalidateSize();
      }, 60);
    }
    function closeZone() {
      zoneModal.classList.remove("open");
      zoneModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
    zoneTrigger.addEventListener("click", openZone);
    zoneTrigger.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openZone();
      }
    });
    zoneModal.querySelectorAll("[data-zone-close]").forEach(function (el) {
      el.addEventListener("click", closeZone);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeZone();
    });
  }

  // Scroll-linked pan on oversized backdrop photos (reveals them part by part)
  var panTargets = [
    // Hero sits at the very top: pan it over a fixed, short scroll distance
    // so the effect is clearly visible right away, regardless of hero height.
    { section: document.querySelector(".hero"), img: document.querySelector(".hero-media img"), overscan: 90, fixedRange: 450 },
    { section: document.querySelector(".heritage"), img: document.querySelector(".heritage-backdrop img"), overscan: 110 }
  ].filter(function (t) { return t.section && t.img; });

  if (panTargets.length) {
    var panTicking = false;
    function updatePans() {
      var vh = window.innerHeight;
      panTargets.forEach(function (t) {
        var rect = t.section.getBoundingClientRect();
        var progress;
        if (t.fixedRange) {
          progress = -rect.top / t.fixedRange;
        } else {
          progress = (vh - rect.top) / (vh + rect.height);
        }
        progress = Math.max(0, Math.min(1, progress));
        var shift = t.overscan - progress * (t.overscan * 2);
        t.img.style.transform = "translateY(" + shift.toFixed(1) + "px)";
      });
      panTicking = false;
    }
    window.addEventListener("scroll", function () {
      if (!panTicking) {
        window.requestAnimationFrame(updatePans);
        panTicking = true;
      }
    }, { passive: true });
    updatePans();
  }
})();
