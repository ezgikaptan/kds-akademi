/*
 * Real animation-library layer (GSAP + ScrollTrigger + Lenis), loaded via CDN.
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
    var hasLenis = typeof Lenis !== 'undefined';

    if (hasGsap && hasScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    /* ==============================
       Lenis smooth scroll
       ============================== */
    var lenis = null;
    if (hasLenis && !prefersReducedMotion) {
        lenis = new Lenis({
            duration: 1.05,
            easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
            smoothWheel: true
        });

        var lenisRaf = function (time) {
            lenis.raf(time);
            requestAnimationFrame(lenisRaf);
        };
        requestAnimationFrame(lenisRaf);

        if (hasGsap && hasScrollTrigger) {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
            gsap.ticker.lagSmoothing(0);
        }

        // Smooth in-page anchor scrolling (nav links, "back to top", section jumps)
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.addEventListener('click', function (e) {
                var hash = link.getAttribute('href');
                if (hash.length < 2) return;
                var target = document.querySelector(hash);
                if (!target) return;
                e.preventDefault();
                lenis.scrollTo(target, { offset: -90 });
            });
        });
    }

    /* ==============================
       Hero floating photo card: directly follows the cursor
       ============================== */
    var heroFloatCard = document.querySelector('.hero-float-card');
    if (heroFloatCard) {
        var heroEl = heroFloatCard.closest('.hero-las') || heroFloatCard.parentElement;
        var cardOffsetX = 28;  // keep the card just to the right of the pointer...
        var cardOffsetY = -120; // ...and above it, so the cursor is never hidden underneath

        if (hasGsap && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
            var followX = gsap.quickTo(heroFloatCard, 'x', { duration: 0.5, ease: 'power3' });
            var followY = gsap.quickTo(heroFloatCard, 'y', { duration: 0.5, ease: 'power3' });

            heroEl.addEventListener('mousemove', function (e) {
                followX(e.clientX + cardOffsetX);
                followY(e.clientY + cardOffsetY);
            });
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
