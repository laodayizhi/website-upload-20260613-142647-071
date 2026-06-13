(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('[data-search-form]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var input = form.querySelector('input[type="search"]');
            var value = input ? input.value.trim() : '';
            var target = form.getAttribute('data-search-target') || 'browse.html';
            window.location.href = value ? target + '?q=' + encodeURIComponent(value) : target;
        });
    });

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var heroIndex = 0;

    function showHero(index) {
        if (!slides.length) {
            return;
        }
        heroIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, current) {
            slide.classList.toggle('is-active', current === heroIndex);
        });
        dots.forEach(function (dot, current) {
            dot.classList.toggle('is-active', current === heroIndex);
        });
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            showHero(Number(dot.getAttribute('data-hero-dot')) || 0);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showHero(heroIndex + 1);
        }, 5600);
    }

    var inlineForm = document.querySelector('[data-inline-filter]');
    var searchInput = document.getElementById('movieSearch');
    var grid = document.querySelector('[data-movie-grid]');
    var emptyState = document.querySelector('[data-empty-state]');
    var activeCategory = '';

    function getQueryParam() {
        var params = new URLSearchParams(window.location.search);
        return params.get('q') || '';
    }

    function applyFilter() {
        if (!grid) {
            return;
        }
        var value = searchInput ? searchInput.value.trim().toLowerCase() : '';
        var visible = 0;
        var cards = grid.querySelectorAll('.movie-card, .ranking-card');
        cards.forEach(function (card) {
            var text = [
                card.getAttribute('data-title') || '',
                card.getAttribute('data-category') || '',
                card.getAttribute('data-genre') || '',
                card.getAttribute('data-tags') || ''
            ].join(' ').toLowerCase();
            var category = card.getAttribute('data-category') || '';
            var matchText = !value || text.indexOf(value) !== -1;
            var matchCategory = !activeCategory || category === activeCategory;
            var show = matchText && matchCategory;
            card.classList.toggle('is-hidden-card', !show);
            if (show) {
                visible += 1;
            }
        });
        if (emptyState) {
            emptyState.classList.toggle('is-visible', visible === 0);
        }
    }

    if (searchInput) {
        var initialQuery = getQueryParam();
        if (initialQuery) {
            searchInput.value = initialQuery;
        }
        searchInput.addEventListener('input', applyFilter);
    }

    if (inlineForm) {
        inlineForm.addEventListener('submit', function (event) {
            event.preventDefault();
            applyFilter();
        });
    }

    document.querySelectorAll('[data-filter-value]').forEach(function (button) {
        button.addEventListener('click', function () {
            document.querySelectorAll('[data-filter-value]').forEach(function (current) {
                current.classList.remove('is-active');
            });
            button.classList.add('is-active');
            activeCategory = button.getAttribute('data-filter-value') || '';
            applyFilter();
        });
    });

    applyFilter();

    document.querySelectorAll('.player-shell').forEach(function (shell) {
        var video = shell.querySelector('video');
        var overlay = shell.querySelector('.player-overlay');
        var stream = shell.getAttribute('data-stream');
        var loaded = false;

        function startVideo() {
            if (!video || !stream) {
                return;
            }
            if (!loaded) {
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = stream;
                } else if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                    video._hlsInstance = hls;
                } else {
                    video.src = stream;
                }
                loaded = true;
            }
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {});
            }
        }

        if (overlay) {
            overlay.addEventListener('click', startVideo);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    startVideo();
                }
            });
            video.addEventListener('play', function () {
                if (overlay) {
                    overlay.classList.add('is-hidden');
                }
            });
        }
    });
})();
