(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var header = document.getElementById("siteHeader");
    var navToggle = document.getElementById("navToggle");
    var mobileNav = document.getElementById("mobileNav");

    function updateHeader() {
      if (!header) {
        return;
      }
      if (window.scrollY > 20) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    if (navToggle && mobileNav) {
      navToggle.addEventListener("click", function () {
        var open = mobileNav.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    var carousel = document.getElementById("heroCarousel");
    if (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(carousel.querySelectorAll(".hero-dot"));
      var prev = carousel.querySelector("[data-hero-prev]");
      var next = carousel.querySelector("[data-hero-next]");
      var current = 0;
      var timer = null;

      function showSlide(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("active", i === current);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("active", i === current);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          showSlide(current + 1);
        }, 5200);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          showSlide(Number(dot.getAttribute("data-slide")) || 0);
          start();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          showSlide(current - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          showSlide(current + 1);
          start();
        });
      }

      carousel.addEventListener("mouseenter", stop);
      carousel.addEventListener("mouseleave", start);
      showSlide(0);
      start();
    }

    var searchInput = document.getElementById("movieSearch");
    if (searchInput) {
      var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card, .compact-card"));
      var empty = document.getElementById("emptyState");
      searchInput.addEventListener("input", function () {
        var query = searchInput.value.trim().toLowerCase();
        var visible = 0;
        cards.forEach(function (card) {
          var text = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
          var match = !query || text.indexOf(query) !== -1;
          card.style.display = match ? "" : "none";
          if (match) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("show", visible === 0);
        }
      });
    }
  });
})();
