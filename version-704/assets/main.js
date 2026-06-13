(function () {
  const toggle = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      mobileNav.classList.toggle("open", !expanded);
    });
  }

  const searchInput = document.querySelector("[data-search-input]");
  const cards = Array.from(document.querySelectorAll("[data-search-card]"));
  const filterButtons = Array.from(document.querySelectorAll("[data-filter-value]"));
  let activeFilter = "all";

  function applyFilters() {
    const keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";

    cards.forEach(function (card) {
      const text = (card.dataset.text || "").toLowerCase();
      const type = card.dataset.type || "";
      const matchKeyword = !keyword || text.indexOf(keyword) !== -1;
      const matchType = activeFilter === "all" || type === activeFilter;
      card.classList.toggle("hidden", !(matchKeyword && matchType));
    });
  }

  if (searchInput && cards.length) {
    searchInput.addEventListener("input", applyFilters);
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activeFilter = button.dataset.filterValue || "all";
      filterButtons.forEach(function (item) {
        item.classList.toggle("active", item === button);
      });
      applyFilters();
    });
  });

  window.initMoviePlayer = function (source) {
    const shell = document.querySelector("[data-player-shell]");
    const video = document.querySelector(".movie-player");
    const button = document.querySelector("[data-play-button]");

    if (!shell || !video || !button || !source) {
      return;
    }

    let started = false;
    let hlsInstance = null;

    function attachSource() {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function startPlayback() {
      if (!started) {
        started = true;
        attachSource();
      }

      shell.classList.add("is-playing");
      button.classList.add("is-hidden");
      const playPromise = video.play();

      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
          button.classList.remove("is-hidden");
        });
      }
    }

    button.addEventListener("click", function (event) {
      event.preventDefault();
      startPlayback();
    });

    shell.addEventListener("click", function (event) {
      if (!started && (event.target === shell || event.target === video)) {
        startPlayback();
      }
    });

    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
