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

        /* ==============================
           Değerlerimiz (Values) Cards Stagger Animation
           ============================== */
        var valueCards = document.querySelectorAll('.value-card');
        if (valueCards.length && hasGsap && !prefersReducedMotion) {
            gsap.fromTo(valueCards,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.0,
                    ease: 'power3.out',
                    stagger: 0.15,
                    scrollTrigger: {
                        trigger: '.values-section',
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }
    }



    /* ==============================
       Değerlerimiz (Values) Cards Auto-Play Highlight Loop (Mobile View)
       ============================== */
    var autoplayCards = document.querySelectorAll('.value-card');
    if (autoplayCards.length) {
        var activeIndex = 0;
        setInterval(function() {
            if (window.innerWidth < 1024) {
                autoplayCards.forEach(function(card, idx) {
                    if (idx === activeIndex) {
                        card.classList.add('active-card');
                    } else {
                        card.classList.remove('active-card');
                    }
                });
                activeIndex = (activeIndex + 1) % autoplayCards.length;
            } else {
                // Clear simulated state on desktop
                autoplayCards.forEach(function(card) {
                    card.classList.remove('active-card');
                });
            }
        }, 2000);
    }
    });
