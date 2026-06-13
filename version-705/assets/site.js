(function() {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function() {
      mobileNav.classList.toggle('is-open');
    });
  }

  var searchInputs = document.querySelectorAll('[data-search-input]');
  searchInputs.forEach(function(input) {
    input.addEventListener('input', function() {
      var value = input.value.trim().toLowerCase();
      var scopeSelector = input.getAttribute('data-search-scope');
      var scope = scopeSelector ? document.querySelector(scopeSelector) : document;
      var cards = scope ? scope.querySelectorAll('[data-search]') : [];

      cards.forEach(function(card) {
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        if (!value || text.indexOf(value) !== -1) {
          card.classList.remove('is-filtered-out');
        } else {
          card.classList.add('is-filtered-out');
        }
      });
    });
  });

  var players = document.querySelectorAll('[data-player]');
  players.forEach(function(box) {
    var video = box.querySelector('video');
    var button = box.querySelector('[data-play-button]');
    var stream = box.getAttribute('data-stream');
    var ready = false;
    var hlsInstance = null;

    function attachStream() {
      if (!video || !stream || ready) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        ready = true;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new Hls();
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
        ready = true;
        return;
      }

      video.src = stream;
      ready = true;
    }

    function startPlayback() {
      attachStream();
      if (button) {
        button.classList.add('is-hidden');
      }
      if (video) {
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function() {});
        }
      }
    }

    if (button) {
      button.addEventListener('click', startPlayback);
    }

    if (video) {
      video.addEventListener('click', function() {
        if (video.paused) {
          startPlayback();
        }
      });
      video.addEventListener('play', function() {
        if (button) {
          button.classList.add('is-hidden');
        }
      });
    }

    window.addEventListener('pagehide', function() {
      if (hlsInstance && typeof hlsInstance.destroy === 'function') {
        hlsInstance.destroy();
      }
    });
  });
})();
