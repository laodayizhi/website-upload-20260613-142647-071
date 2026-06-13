(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function setupMenu() {
    var button = document.querySelector(".menu-toggle");
    var menu = document.querySelector(".mobile-menu");
    if (!button || !menu) {
      return;
    }
    button.addEventListener("click", function () {
      menu.classList.toggle("hidden");
      button.textContent = menu.classList.contains("hidden") ? "☰" : "×";
    });
  }

  function setupHero() {
    var carousel = document.querySelector(".hero-carousel");
    if (!carousel) {
      return;
    }
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll(".hero-dot"));
    var prev = carousel.querySelector(".hero-prev");
    var next = carousel.querySelector(".hero-next");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }

    function move(step) {
      show(index + step);
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        move(1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        move(-1);
        start();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        move(1);
        start();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-slide") || 0));
        start();
      });
    });
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    start();
  }

  function setupSearch() {
    var lists = Array.prototype.slice.call(document.querySelectorAll(".movie-list"));
    if (!lists.length) {
      return;
    }
    var input = document.querySelector(".live-search");
    var genre = document.querySelector(".genre-filter");
    var noResults = document.querySelector(".no-results");
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q");
    if (input && query) {
      input.value = query;
    }

    function apply() {
      var term = input ? input.value.trim().toLowerCase() : "";
      var genreValue = genre ? genre.value : "";
      var visible = 0;
      lists.forEach(function (list) {
        Array.prototype.slice.call(list.querySelectorAll(".movie-card")).forEach(function (card) {
          var haystack = [
            card.getAttribute("data-title") || "",
            card.getAttribute("data-region") || "",
            card.getAttribute("data-genre") || "",
            card.getAttribute("data-tags") || ""
          ].join(" ").toLowerCase();
          var matchedText = !term || haystack.indexOf(term) !== -1;
          var matchedGenre = !genreValue || haystack.indexOf(genreValue.toLowerCase()) !== -1;
          var ok = matchedText && matchedGenre;
          card.style.display = ok ? "block" : "none";
          if (ok) {
            visible += 1;
          }
        });
      });
      if (noResults) {
        noResults.classList.toggle("hidden", visible !== 0);
      }
    }

    if (input) {
      input.addEventListener("input", apply);
    }
    if (genre) {
      genre.addEventListener("change", apply);
    }
    apply();
  }

  window.initMoviePlayer = function (streamUrl) {
    var wrapper = document.querySelector(".video-player-block");
    if (!wrapper) {
      return;
    }
    var video = wrapper.querySelector("video");
    var cover = wrapper.querySelector(".player-cover");
    var attached = false;
    var hlsInstance = null;

    function attach() {
      if (attached || !video || !streamUrl) {
        return;
      }
      attached = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls();
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
    }

    function play() {
      attach();
      if (cover) {
        cover.classList.add("hidden-player-overlay");
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener("click", play);
    }
    if (video) {
      video.addEventListener("click", function () {
        if (video.paused) {
          play();
        }
      });
      video.addEventListener("play", function () {
        if (cover) {
          cover.classList.add("hidden-player-overlay");
        }
      });
      window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    }
  };

  ready(function () {
    setupMenu();
    setupHero();
    setupSearch();
  });
})();
