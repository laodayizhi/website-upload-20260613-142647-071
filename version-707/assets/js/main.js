(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function startTimer() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        startTimer();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        startTimer();
      });
    }

    showSlide(0);
    startTimer();
  }

  var searchInput = document.querySelector('[data-search-input]');
  var typeFilter = document.querySelector('[data-filter-type]');
  var yearFilter = document.querySelector('[data-filter-year]');
  var categoryFilter = document.querySelector('[data-filter-category]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function matchesYear(card, value) {
    if (value === 'all') {
      return true;
    }

    var year = normalize(card.getAttribute('data-year'));
    if (value === 'older') {
      var number = parseInt(year, 10);
      return Number.isFinite(number) && number <= 2021;
    }

    return year === value;
  }

  function runFilters() {
    if (!cards.length) {
      return;
    }

    var keyword = normalize(searchInput ? searchInput.value : '');
    var typeValue = normalize(typeFilter ? typeFilter.value : 'all');
    var yearValue = normalize(yearFilter ? yearFilter.value : 'all');
    var categoryValue = normalize(categoryFilter ? categoryFilter.value : 'all');

    cards.forEach(function (card) {
      var text = normalize(card.getAttribute('data-search'));
      var type = normalize(card.getAttribute('data-type'));
      var category = normalize(card.getAttribute('data-category'));
      var okKeyword = !keyword || text.indexOf(keyword) !== -1;
      var okType = typeValue === 'all' || type.indexOf(typeValue) !== -1;
      var okYear = matchesYear(card, yearValue);
      var okCategory = categoryValue === 'all' || category === categoryValue;
      card.classList.toggle('hidden-card', !(okKeyword && okType && okYear && okCategory));
    });
  }

  [searchInput, typeFilter, yearFilter, categoryFilter].forEach(function (control) {
    if (control) {
      control.addEventListener('input', runFilters);
      control.addEventListener('change', runFilters);
    }
  });
})();
