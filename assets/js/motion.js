/*
 * Real animation-library layer (GSAP + ScrollTrigger), loaded via CDN.
 * Everything here is additive to main.js - if a library fails to load
 * (offline, blocked CDN), each block guards itself and the site still works
 * with main.js's existing IntersectionObserver-based reveal system.
 */
document.addEventListener('DOMContentLoaded', function () {
    // Runs after main.js's DOMContentLoaded handler (registered first, in document
    // order), so main.js's reveal-slide setup sees the original DOM and this
    // script's line-reveal DOM rewrite below never gets caught by that scan.
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hasGsap = typeof gsap !== 'undefined';
    var hasScrollTrigger = hasGsap && typeof ScrollTrigger !== 'undefined';

    if (hasGsap && hasScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    /* ==============================
       Hero cursor-follow photo: tracks the pointer, cycles through
       real photos, and is clipped by the hero's own overflow:hidden
       (position:absolute inside .hero-las, never position:fixed) so
       it can never visually escape the black hero area.
       ============================== */
    var followPhoto = document.getElementById('hero-follow-photo');
    if (followPhoto && window.matchMedia('(pointer: fine)').matches) {
        var heroEl = followPhoto.closest('.hero-las');
        if (heroEl) {
            var photoImg = followPhoto.querySelector('img');
            var PHOTOS = [
                'assets/img/kurs-piyano.jpg',
                'assets/img/kurs-oryantal.jpg',
                'assets/img/kurs-tiyatro.jpg',
                'assets/img/kurs-resim.jpg',
                'assets/img/kurs-baglama.jpg',
                'assets/img/kurs-salsa.jpg'
            ];
            var photoIndex = 0;
            setInterval(function () {
                photoIndex = (photoIndex + 1) % PHOTOS.length;
                if (hasGsap && !prefersReducedMotion) {
                    gsap.to(photoImg, {
                        opacity: 0,
                        duration: 0.25,
                        onComplete: function () {
                            photoImg.src = PHOTOS[photoIndex];
                            gsap.to(photoImg, { opacity: 1, duration: 0.25 });
                        }
                    });
                } else {
                    photoImg.src = PHOTOS[photoIndex];
                }
            }, 1800);

            if (hasGsap && !prefersReducedMotion) {
                var followX = gsap.quickTo(followPhoto, 'x', { duration: 0.45, ease: 'power3' });
                var followY = gsap.quickTo(followPhoto, 'y', { duration: 0.45, ease: 'power3' });

                heroEl.addEventListener('mousemove', function (e) {
                    var rect = heroEl.getBoundingClientRect();
                    followX(e.clientX - rect.left - followPhoto.offsetWidth / 2);
                    followY(e.clientY - rect.top - followPhoto.offsetHeight / 2);
                    followPhoto.classList.add('is-active');
                });
                heroEl.addEventListener('mouseleave', function () {
                    followPhoto.classList.remove('is-active');
                });
            }
        }
    }

    /* ==============================
       Line reveal: masked slide-up text (hero + page headlines)
       ============================== */
    document.querySelectorAll('.line-reveal').forEach(function (el) {
        var rawLines = el.innerHTML.split(/<br\s*\/?>/i);
        el.innerHTML = rawLines.map(function (line) {
            return '<span class="line-reveal-inner"><span class="line-reveal-line">' + line.trim() + '</span></span>';
        }).join('');

        var lineEls = el.querySelectorAll('.line-reveal-line');
        if (!hasGsap || prefersReducedMotion) return;

        gsap.set(lineEls, { yPercent: 110 });
        gsap.to(lineEls, {
            yPercent: 0,
            duration: 0.9,
            ease: 'power4.out',
            stagger: 0.1,
            delay: 0.15
        });
    });

    /* ==============================
       Department card images: base zoom buffer (so hover-zoom and
       parallax below never reveal empty space at the image edges),
       hover scale + rotate, and scroll parallax drift
       ============================== */
    if (hasGsap && !prefersReducedMotion) {
        var BASE_SCALE = 1.15;
        var HOVER_SCALE = 1.24;

        document.querySelectorAll('.las-card-img-wrap img').forEach(function (img) {
            gsap.set(img, { scale: BASE_SCALE, transformOrigin: 'center center' });

            if (hasScrollTrigger) {
                gsap.fromTo(img,
                    { yPercent: -6 },
                    {
                        yPercent: 6,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: img,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true
                        }
                    }
                );
            }
        });

        if (window.matchMedia('(pointer: fine)').matches) {
            document.querySelectorAll('.las-card').forEach(function (card) {
                var img = card.querySelector('.las-card-img-wrap img');
                if (!img) return;
                card.addEventListener('mouseenter', function () {
                    gsap.to(img, { scale: HOVER_SCALE, rotate: 0.6, duration: 0.6, ease: 'power2.out' });
                });
                card.addEventListener('mouseleave', function () {
                    gsap.to(img, { scale: BASE_SCALE, rotate: 0, duration: 0.6, ease: 'power2.out' });
                });
            });
        }
    }
});
