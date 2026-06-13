(function() {
  function ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
      return;
    }
    document.addEventListener('DOMContentLoaded', callback);
  }

  ready(function() {
    var header = document.querySelector('[data-header]');
    var toggle = document.querySelector('[data-mobile-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    function syncHeader() {
      if (!header) {
        return;
      }
      if (window.scrollY > 12) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });

    if (toggle && mobileNav) {
      toggle.addEventListener('click', function() {
        mobileNav.classList.toggle('is-open');
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

      function show(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function(slide, i) {
          slide.classList.toggle('is-active', i === current);
        });
        dots.forEach(function(dot, i) {
          dot.classList.toggle('is-active', i === current);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function() {
          show(current + 1);
        }, 5200);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      if (prev) {
        prev.addEventListener('click', function() {
          show(current - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener('click', function() {
          show(current + 1);
          start();
        });
      }

      dots.forEach(function(dot) {
        dot.addEventListener('click', function() {
          show(Number(dot.getAttribute('data-hero-dot') || 0));
          start();
        });
      });

      hero.addEventListener('mouseenter', stop);
      hero.addEventListener('mouseleave', start);
      show(0);
      start();
    }

    document.querySelectorAll('[data-search-scope]').forEach(function(scope) {
      var input = scope.querySelector('[data-search-input]');
      var items = Array.prototype.slice.call(scope.querySelectorAll('[data-search-item]'));

      if (!input || !items.length) {
        return;
      }

      input.addEventListener('input', function() {
        var value = input.value.trim().toLowerCase();
        items.forEach(function(item) {
          var data = (item.getAttribute('data-search') || item.textContent || '').toLowerCase();
          item.classList.toggle('is-hidden', value.length > 0 && data.indexOf(value) === -1);
        });
      });
    });
  });
})();
