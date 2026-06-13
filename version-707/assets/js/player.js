(function () {
  window.setupPlayer = function (source) {
    var video = document.querySelector('[data-player-video]');
    var mask = document.querySelector('[data-player-mask]');
    var ready = false;
    var hls = null;

    if (!video || !source) {
      return;
    }

    function prepare() {
      if (ready) {
        return;
      }

      ready = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function playVideo() {
      prepare();
      video.controls = true;
      if (mask) {
        mask.classList.add('is-hidden');
      }

      var attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {
          if (mask) {
            mask.classList.remove('is-hidden');
          }
        });
      }
    }

    video.addEventListener('click', playVideo);
    if (mask) {
      mask.addEventListener('click', playVideo);
    }
    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
