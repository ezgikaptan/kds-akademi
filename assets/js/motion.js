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
       Hero cursor-follow photo & Dotted Coordinate Lines:
       Tracks the pointer inside .hero-las, updates dotted vertical/horizontal crosshairs,
       and displays dynamic photo descriptions in brackets.
       ============================== */
    var followPhoto = document.getElementById('hero-follow-photo');
    if (followPhoto) {
        var heroEl = followPhoto.closest('.hero-las');
        if (heroEl) {
            var photoImg = followPhoto.querySelector('img');
            var labelEl = document.getElementById('hero-follow-label');
            var crosshairV = document.getElementById('crosshair-v');
            var crosshairH = document.getElementById('crosshair-h');

            var PHOTOS = [
                'assets/img/kurs-piyano.jpg',
                'assets/img/kurs-oryantal.jpg',
                'assets/img/kurs-tiyatro.jpg',
                'assets/img/kurs-resim.jpg',
                'assets/img/kurs-baglama.jpg',
                'assets/img/kurs-salsa.jpg'
            ];
            var LABELS = [
                '[PİYANO]',
                '[DANS]',
                '[TİYATRO]',
                '[RESİM]',
                '[BAĞLAMA]',
                '[SALSA]'
            ];
            var photoIndex = 0;

            var isMobile = window.matchMedia('(pointer: coarse)').matches ||
                           window.matchMedia('(max-width: 767px)').matches;

            /* Shared smooth photo swap function */
            function swapPhoto(nextIndex) {
                if (hasGsap && !prefersReducedMotion) {
                    gsap.to([photoImg, labelEl], {
                        opacity: 0,
                        scale: 0.90,
                        duration: 0.38,
                        ease: 'power2.in',
                        onComplete: function () {
                            photoImg.src = PHOTOS[nextIndex];
                            if (labelEl) labelEl.textContent = LABELS[nextIndex];
                            gsap.to([photoImg, labelEl], {
                                opacity: 1,
                                scale: 1,
                                duration: 0.5,
                                ease: 'power3.out'
                            });
                        }
                    });
                } else {
                    photoImg.style.transition = 'opacity 0.4s ease';
                    photoImg.style.opacity = '0';
                    if (labelEl) { labelEl.style.transition = 'opacity 0.4s ease'; labelEl.style.opacity = '0'; }
                    setTimeout(function () {
                        photoImg.src = PHOTOS[nextIndex];
                        if (labelEl) labelEl.textContent = LABELS[nextIndex];
                        photoImg.style.opacity = '1';
                        if (labelEl) labelEl.style.opacity = '1';
                    }, 420);
                }
            }

            /* Auto-cycle interval: 2s on mobile, 2.2s on desktop */
            var cycleInterval = isMobile ? 2000 : 2200;
            setInterval(function () {
                photoIndex = (photoIndex + 1) % PHOTOS.length;
                swapPhoto(photoIndex);
            }, cycleInterval);

            /* Mobile: show slideshow immediately, centered in hero */
            if (isMobile) {
                followPhoto.classList.add('is-active');
            }

            /* Desktop: cursor-follow behaviour */
            if (!isMobile && hasGsap && !prefersReducedMotion) {
                var followX = gsap.quickTo(followPhoto, 'x', { duration: 0.45, ease: 'power3' });
                var followY = gsap.quickTo(followPhoto, 'y', { duration: 0.45, ease: 'power3' });

                var lineX = crosshairV ? gsap.quickTo(crosshairV, 'left', { duration: 0.45, ease: 'power3' }) : null;
                var lineY = crosshairH ? gsap.quickTo(crosshairH, 'top', { duration: 0.45, ease: 'power3' }) : null;

                heroEl.addEventListener('mousemove', function (e) {
                    var rect = heroEl.getBoundingClientRect();
                    var mouseX = e.clientX - rect.left;
                    var mouseY = e.clientY - rect.top;

                    followX(mouseX - followPhoto.offsetWidth / 2);
                    followY(mouseY - followPhoto.offsetHeight / 2);

                    if (lineX) lineX(mouseX);
                    if (lineY) lineY(mouseY);

                    followPhoto.classList.add('is-active');
                    if (crosshairV) crosshairV.classList.add('is-active');
                    if (crosshairH) crosshairH.classList.add('is-active');
                });

                heroEl.addEventListener('mouseleave', function () {
                    followPhoto.classList.remove('is-active');
                    if (crosshairV) crosshairV.classList.remove('is-active');
                    if (crosshairH) crosshairH.classList.remove('is-active');
                });
            }
        }
    }


    /* ==============================
       Line reveal: masked slide-up text (hero + page headlines)
       ============================== */
    var lineEls = document.querySelectorAll('.line-reveal-line');
    if (lineEls.length && hasGsap && !prefersReducedMotion) {
        gsap.set(lineEls, { yPercent: 110 });
        gsap.to(lineEls, {
            yPercent: 0,
            duration: 0.9,
            ease: 'power4.out',
            stagger: 0.1,
            delay: 0.15
        });
    }


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
