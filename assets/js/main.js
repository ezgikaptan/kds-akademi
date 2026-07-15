document.addEventListener('DOMContentLoaded', function () {
    // Check if current page is the homepage using DOM check (independent of URL folder layout)
    var isHome = !!document.querySelector('.hero-las-container');

    /* ==============================
       Hero Live Clock (Istanbul time)
       ============================== */
    var heroClock = document.getElementById('hero-clock');
    if (heroClock) {
        var updateHeroClock = function () {
            var time = new Date().toLocaleTimeString('tr-TR', {
                timeZone: 'Europe/Istanbul',
                hour: '2-digit',
                minute: '2-digit'
            });
            heroClock.textContent = 'Güncel Saat: ' + time;
        };
        updateHeroClock();
        setInterval(updateHeroClock, 30000);
    }

    /* ==============================
       Scroll Progress Bar
       ============================== */
    var scrollProgress = document.getElementById('scroll-progress');

    /* ==============================
       Navbar Shrink on Scroll
       ============================== */
    var nav = document.querySelector('nav');
    var navInner = nav ? nav.querySelector(':scope > div:first-child') : null;

    function onScroll() {
        // Progress bar
        if (scrollProgress) {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (scrollHeight > 0) {
                scrollProgress.style.width = ((scrollTop / scrollHeight) * 100) + '%';
            }
        }
        // Navbar shrink
        if (nav) {
            if (window.scrollY > 60) {
                nav.classList.add('nav-scrolled');
                if (navInner) navInner.style.height = '64px';
            } else {
                nav.classList.remove('nav-scrolled');
                if (navInner) navInner.style.height = '';
            }
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ==============================
       Scroll Reveal (Improved Stagger)
       ============================== */
    var slideTargets = document.querySelectorAll(
        'header h1, header p, header span, header .hero-cta, main h1, main h2'
    );
    var scaleTargets = document.querySelectorAll(
        '.glass-panel, .course-card, .card-glow, .stat-card'
    );

    slideTargets.forEach(function (el, i) {
        el.classList.add('reveal-slide');
        el.style.transitionDelay = (Math.min(i % 4, 3) * 0.1) + 's';
    });
    scaleTargets.forEach(function (el, i) {
        el.classList.add('reveal-scale');
        if (!el.querySelector('form, input, textarea, select')) {
            el.classList.add('hover-lift');
        }
        el.style.transitionDelay = (Math.min(i % 6, 5) * 0.07) + 's';
    });

    var revealAll = Array.prototype.slice.call(slideTargets)
        .concat(Array.prototype.slice.call(scaleTargets));

    if ('IntersectionObserver' in window) {
        var revealObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    revealObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealAll.forEach(function (el) { revealObs.observe(el); });
    } else {
        revealAll.forEach(function (el) { el.classList.add('in-view'); });
    }

    /* ==============================
       Animated Counters
       ============================== */
    var counters = document.querySelectorAll('[data-count-to]');
    if (counters.length && 'IntersectionObserver' in window) {
        function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

        var counterObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                var target = parseFloat(el.getAttribute('data-count-to'));
                var suffix = el.getAttribute('data-count-suffix') || '';
                var prefix = el.getAttribute('data-count-prefix') || '';
                var decimal = parseInt(el.getAttribute('data-count-decimal') || '0', 10);
                var duration = 2000;
                var startTime = null;

                function tick(ts) {
                    if (!startTime) startTime = ts;
                    var p = Math.min((ts - startTime) / duration, 1);
                    var val = easeOutQuart(p) * target;
                    el.textContent = prefix + (decimal > 0 ? val.toFixed(decimal) : Math.floor(val)) + suffix;
                    if (p < 1) {
                        requestAnimationFrame(tick);
                    } else {
                        el.textContent = prefix + (decimal > 0 ? target.toFixed(decimal) : target) + suffix;
                    }
                }
                requestAnimationFrame(tick);
                counterObs.unobserve(el);
            });
        }, { threshold: 0.3 });

        counters.forEach(function (el) { counterObs.observe(el); });
    }

    /* ==============================
       Testimonial Carousel
       ============================== */
    var carousel = document.querySelector('.testimonial-carousel');
    var dots = document.querySelectorAll('.carousel-dot');
    if (carousel && dots.length) {
        var cards = carousel.children;
        var currentIdx = 0;
        var autoTimer;

        function getStep() {
            return cards.length ? cards[0].offsetWidth + 24 : 384;
        }
        function setDot(i) {
            dots.forEach(function (d, j) { d.classList.toggle('active', j === i); });
        }
        function goTo(i) {
            currentIdx = i;
            carousel.scrollTo({ left: i * getStep(), behavior: 'smooth' });
            setDot(i);
        }
        function startAuto() {
            autoTimer = setInterval(function () {
                goTo((currentIdx + 1) % cards.length);
            }, 4000);
        }
        function stopAuto() { clearInterval(autoTimer); }

        dots.forEach(function (d, i) {
            d.addEventListener('click', function () {
                goTo(i);
                stopAuto();
                startAuto();
            });
        });

        var prevBtn = document.querySelector('.testimonial-prev');
        var nextBtn = document.querySelector('.testimonial-next');
        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                var prevIdx = currentIdx - 1;
                if (prevIdx < 0) prevIdx = cards.length - 1;
                goTo(prevIdx);
                stopAuto();
                startAuto();
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                goTo((currentIdx + 1) % cards.length);
                stopAuto();
                startAuto();
            });
        }

        carousel.addEventListener('mouseenter', stopAuto);
        carousel.addEventListener('mouseleave', startAuto);
        carousel.addEventListener('touchstart', stopAuto, { passive: true });
        carousel.addEventListener('touchend', function () {
            setTimeout(function () {
                var idx = Math.round(carousel.scrollLeft / getStep());
                currentIdx = Math.max(0, Math.min(idx, cards.length - 1));
                setDot(currentIdx);
            }, 150);
            startAuto();
        }, { passive: true });

        carousel.addEventListener('scroll', function () {
            var idx = Math.round(carousel.scrollLeft / getStep());
            if (idx !== currentIdx && idx >= 0 && idx < cards.length) {
                currentIdx = idx;
                setDot(currentIdx);
            }
        }, { passive: true });

        setDot(0);
        startAuto();
    }

    /* ==============================
       Testimonials Typewriter Animation
       ============================== */
    var testimonialsTitle = document.getElementById('testimonials-title');
    if (testimonialsTitle) {
        var textToType = "Öğrencilerimiz Ne Diyor?";
        var tIndex = 0;
        var hasTyped = false;

        // Clear initially for typewriter start, but keep a spacer
        testimonialsTitle.innerHTML = '&nbsp;';

        var typeText = function() {
            var cursorSpan = document.createElement('span');
            cursorSpan.className = 'typewriter-cursor';
            cursorSpan.innerHTML = '|';

            function cycle() {
                tIndex = 0;
                testimonialsTitle.innerHTML = '';
                testimonialsTitle.appendChild(cursorSpan);

                // Typing phase
                var typeTimer = setInterval(function() {
                    if (tIndex < textToType.length) {
                        var char = textToType.charAt(tIndex);
                        var textNode = document.createTextNode(char);
                        testimonialsTitle.insertBefore(textNode, cursorSpan);
                        tIndex++;
                    } else {
                        clearInterval(typeTimer);
                        // Hold typed text, then start deleting
                        setTimeout(function() {
                            // Deleting phase
                            var deleteTimer = setInterval(function() {
                                if (tIndex > 0) {
                                    tIndex--;
                                    var currentText = textToType.substring(0, tIndex);
                                    testimonialsTitle.innerHTML = '';
                                    var textNode = document.createTextNode(currentText);
                                    testimonialsTitle.appendChild(textNode);
                                    testimonialsTitle.appendChild(cursorSpan);
                                } else {
                                    clearInterval(deleteTimer);
                                    // Wait a bit, then repeat
                                    setTimeout(cycle, 1000);
                                }
                            }, 50); // Deletion speed
                        }, 3000); // Hold time
                    }
                }, 90); // Typing speed
            }
            cycle();
        };

        if ('IntersectionObserver' in window) {
            var titleObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting && !hasTyped) {
                        hasTyped = true;
                        typeText();
                        titleObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            titleObserver.observe(testimonialsTitle);
        } else {
            // Fallback for older browsers
            typeText();
        }
    }

    /* ==============================
       Departments Staggered Reveal Animation
       ============================== */
    var deptGrid = document.querySelector('.las-card-grid');
    if (deptGrid) {
        var deptCards = deptGrid.querySelectorAll('.las-card');
        deptCards.forEach(function(card) {
            card.classList.add('reveal-card');
        });

        if ('IntersectionObserver' in window) {
            var gridObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        deptCards.forEach(function(card, index) {
                            setTimeout(function() {
                                card.classList.add('revealed');
                            }, index * 250); // 250ms staggered delay
                        });
                        gridObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            gridObserver.observe(deptGrid);
        } else {
            deptCards.forEach(function(card) {
                card.classList.add('revealed');
            });
        }
    }

    /* ==============================
       Typed Text Effect
       ============================== */
    var typedEl = document.getElementById('typed-text');
    if (typedEl) {
        var phrases = ['Müzik', 'Dans', 'Tiyatro', 'Görsel Sanatlar'];
        var pi = 0, ci = 0, deleting = false;

        function typeStep() {
            var phrase = phrases[pi];
            if (deleting) { ci--; } else { ci++; }
            typedEl.textContent = phrase.substring(0, ci);

            var delay = deleting ? 50 : 110;
            if (!deleting && ci === phrase.length) {
                delay = 2200;
                deleting = true;
            } else if (deleting && ci === 0) {
                deleting = false;
                pi = (pi + 1) % phrases.length;
                delay = 400;
            }
            setTimeout(typeStep, delay);
        }
        setTimeout(typeStep, 1200);
    }

    /* ==============================
       Course Browser - Unified Tabs
       ============================== */
    var deptTabs = document.querySelectorAll('.dept-tab');
    var sidebarGroups = document.querySelectorAll('.sidebar-group');
    var sidebarBtns = document.querySelectorAll('.sidebar-course-btn');
    var detailPanels = document.querySelectorAll('.course-detail-panel');

    if (deptTabs.length) {
        var premiumCards = document.querySelectorAll('.premium-course-card');
        if (premiumCards.length) {
            // Premium Card Grid Filtering
            var filterCards = function(dept) {
                premiumCards.forEach(function(card) {
                    var cardDept = card.getAttribute('data-dept');
                    if (dept === 'all' || cardDept === dept) {
                        card.style.display = 'flex';
                        setTimeout(function() {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.96) translateY(8px)';
                        setTimeout(function() {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            };

            deptTabs.forEach(function(tab) {
                tab.addEventListener('click', function() {
                    var dept = tab.getAttribute('data-dept');
                    deptTabs.forEach(function(t) { t.classList.remove('active'); });
                    tab.classList.add('active');
                    filterCards(dept);
                });
            });
        } else {
            // Legacy Sidebar / Detail Panels Logic
            deptTabs.forEach(function(tab) {
                tab.addEventListener('click', function() {
                    var dept = tab.getAttribute('data-dept');

                    // Update active tab
                    deptTabs.forEach(function(t) { t.classList.remove('active'); });
                    tab.classList.add('active');

                    // Show matching sidebar group
                    sidebarGroups.forEach(function(g) { g.classList.remove('active'); });
                    var targetGroup = document.querySelector('[data-dept-group="' + dept + '"]');
                    if (targetGroup) {
                        targetGroup.classList.add('active');
                        // Click the first active button in that group
                        var activeBtn = targetGroup.querySelector('.sidebar-course-btn.active');
                        if (activeBtn) {
                            activeBtn.click();
                        }
                    }
                });
            });

            // Sidebar course button switching
            sidebarBtns.forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var target = btn.getAttribute('data-target');
                    var parentGroup = btn.closest('.sidebar-group');

                    // Deactivate siblings
                    if (parentGroup) {
                        parentGroup.querySelectorAll('.sidebar-course-btn').forEach(function(b) {
                            b.classList.remove('active');
                        });
                    }
                    btn.classList.add('active');

                    // Show matching panel
                    detailPanels.forEach(function(p) { p.classList.remove('active'); });
                    var panel = document.getElementById('panel-' + target);
                    if (panel) {
                        panel.classList.add('active');
                    }
                });
            });
        }

        // Initialize: check hash in URL to select department and scroll
        var handleHash = function() {
            var hash = window.location.hash;
            if (hash) {
                var deptName = hash.substring(1); // e.g. "muzik", "dans"
                var targetTab = document.querySelector('.dept-tab[data-dept="' + deptName + '"]');
                if (targetTab) {
                    targetTab.click();
                    setTimeout(function() {
                        var targetSec = document.getElementById('course-browser');
                        if (targetSec) {
                            targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 150);
                }
            }
        };

        // Run on load
        var hash = window.location.hash;
        if (hash) {
            handleHash();
        } else {
            // Default to click the active or first tab
            var activeTab = document.querySelector('.dept-tab.active');
            if (activeTab) {
                activeTab.click();
            } else if (deptTabs.length) {
                deptTabs[0].click();
            }
        }

        // Listen for hash changes
        window.addEventListener('hashchange', handleHash);
    }

    /* ==============================
       Hero Video Start-Time Skipper (Plays from 1.0s and loops from 1.0s)
       ============================== */
    var heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        // Enforce 1s starting time initially
        heroVideo.currentTime = 1;
        
        // Loop back to 1.0s when it updates below 1s (like on loop restart)
        heroVideo.addEventListener('timeupdate', function() {
            if (heroVideo.currentTime < 1) {
                heroVideo.currentTime = 1;
            }
        });
    }

    /* ==============================
       Gallery Filters
       ============================== */
    var galleryFilters = document.getElementById('gallery-filters');
    if (galleryFilters) {
        var galleryItems = document.querySelectorAll('.gallery-item');
        galleryFilters.querySelectorAll('[data-filter-gallery]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var activeGalleryCategory = btn.getAttribute('data-filter-gallery');
                galleryFilters.querySelectorAll('.filter-pill').forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                galleryItems.forEach(function (item) {
                    var cat = item.getAttribute('data-category');
                    item.style.display = (activeGalleryCategory === 'tumu' || activeGalleryCategory === cat) ? '' : 'none';
                });
            });
        });
    }

    /* ==============================
       Mobile Menu
       ============================== */
    var menuBtn = document.getElementById('mobile-menu-btn');
    var mobileMenu = document.getElementById('mobile-menu');
    var mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
    function setMobileMenuOpen(isOpen) {
        mobileMenu.classList.toggle('open', isOpen);
        if (mobileMenuBackdrop) mobileMenuBackdrop.classList.toggle('open', isOpen);
        menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function () {
            setMobileMenuOpen(!mobileMenu.classList.contains('open'));
        });
        if (mobileMenuBackdrop) {
            mobileMenuBackdrop.addEventListener('click', function () {
                setMobileMenuOpen(false);
            });
        }
    }

    /* ==============================
       Site Header Scroll Tint
       ============================== */
    var siteHeader = document.querySelector('header.site-header');
    if (siteHeader) {
        var isHeroHeader = siteHeader.getAttribute('data-header-mode') === 'hero';
        var updateHeaderScroll = function () {
            var shouldTint = !isHeroHeader || window.scrollY > 40;
            siteHeader.classList.toggle('header-scrolled', shouldTint);
        };
        window.addEventListener('scroll', updateHeaderScroll, { passive: true });
        updateHeaderScroll();
    }

    /* ==============================
       Video Modal
       ============================== */
    var videoTriggers = document.querySelectorAll('[data-open-video]');
    var videoModal = document.getElementById('video-modal');
    var videoFrame = document.getElementById('video-modal-frame');
    var videoClose = document.getElementById('video-modal-close');

    if (videoModal && videoFrame) {
        videoTriggers.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var src = videoFrame.getAttribute('data-src');
                videoFrame.setAttribute('src', src);
                videoModal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            });
        });
        function closeModal() {
            videoFrame.setAttribute('src', '');
            videoModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
        if (videoClose) videoClose.addEventListener('click', closeModal);
        videoModal.addEventListener('click', function (e) {
            if (e.target === videoModal) closeModal();
        });
    }

    /* ==============================
       Lightbox
       ============================== */
    var lightboxTriggers = document.querySelectorAll('[data-lightbox]');
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    var lightboxClose = document.getElementById('lightbox-close');

    if (lightbox && lightboxImg) {
        lightboxTriggers.forEach(function (el) {
            el.addEventListener('click', function () {
                lightboxImg.setAttribute('src', el.getAttribute('data-lightbox'));
                lightboxImg.setAttribute('alt', el.getAttribute('data-lightbox-alt') || '');
                lightbox.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            });
        });
        function closeLightbox() {
            lightbox.classList.add('hidden');
            lightboxImg.setAttribute('src', '');
            document.body.style.overflow = '';
        }
        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });
    }

    /* ==============================
       Hero Parallax
       ============================== */
    var heroWrap = document.querySelector('.parallax-hero');
    var heroImg = document.querySelector('.parallax-img');
    if (heroWrap && heroImg && window.matchMedia('(hover: hover)').matches) {
        heroWrap.addEventListener('mousemove', function (e) {
            var rect = heroWrap.getBoundingClientRect();
            var x = (e.clientX - rect.left) / rect.width - 0.5;
            var y = (e.clientY - rect.top) / rect.height - 0.5;
            heroImg.style.transition = 'transform 0.1s linear';
            heroImg.style.transform = 'scale(1.08) translate(' + (x * -16) + 'px, ' + (y * -16) + 'px)';
        });
        heroWrap.addEventListener('mouseleave', function () {
            heroImg.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            heroImg.style.transform = 'scale(1.08) translate(0px, 0px)';
        });
    }

    /* ==============================
       Instructor Filters
       ============================== */
    var instructorFilters = document.getElementById('instructor-filters');
    if (instructorFilters) {
        var instructorCards = document.querySelectorAll('.instructor-card');
        instructorFilters.querySelectorAll('[data-filter-dept]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var dept = btn.getAttribute('data-filter-dept');
                instructorFilters.querySelectorAll('.filter-pill').forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');

                instructorCards.forEach(function (card) {
                    var cardDept = card.getAttribute('data-dept');
                    if (dept === 'all' || dept === cardDept) {
                        card.style.display = '';
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(function () {
                            card.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    /* ==============================
       Contact Form → WhatsApp
       ============================== */
    var contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var name = document.getElementById('cf-name').value.trim();
            var phone = document.getElementById('cf-phone').value.trim();
            var department = document.getElementById('cf-department').value;
            var message = document.getElementById('cf-message').value.trim();

            var text = 'Merhaba, KDS Akademi web sitesinden yazıyorum.%0A' +
                'Ad Soyad: ' + encodeURIComponent(name) + '%0A' +
                'Telefon: ' + encodeURIComponent(phone) + '%0A' +
                'İlgilendiğim Bölüm: ' + encodeURIComponent(department) + '%0A' +
                'Mesaj: ' + encodeURIComponent(message);

            window.open('https://wa.me/905419050042?text=' + text, '_blank');
        });
    }
    /* ==============================
       Course Accordion Toggle
       ============================== */
    window.toggleAccordion = function (btn) {
        var item = btn.parentElement;
        var content = item.querySelector('.accordion-content');
        var icon = btn.querySelector('.accordion-icon');
        var isExpanded = item.classList.contains('expanded');

        // Close all other accordions in the same section
        var siblings = item.parentElement.querySelectorAll('.course-accordion-item');
        siblings.forEach(function (sibling) {
            if (sibling !== item) {
                sibling.classList.remove('expanded');
                var sibContent = sibling.querySelector('.accordion-content');
                var sibIcon = sibling.querySelector('.accordion-icon');
                if (sibContent) sibContent.style.maxHeight = '0px';
                if (sibIcon) sibIcon.style.transform = '';
            }
        });

        if (isExpanded) {
            item.classList.remove('expanded');
            content.style.maxHeight = '0px';
            icon.style.transform = '';
        } else {
            item.classList.add('expanded');
            content.style.maxHeight = content.scrollHeight + 'px';
            icon.style.transform = 'rotate(180deg)';
        }
    };

    /* ==========================================================================
       Roshan Sahu Inspired Page Slide Transitions & Odometer Loader
       ========================================================================== */

    // 1. Dynamic Page Transition Panel Injection
    var isLoaderRunning = !sessionStorage.getItem('kds_loaded'); // Initialize based on session state
    var transOverlay = document.createElement('div');
    transOverlay.id = 'page-transition-panel';
    transOverlay.className = 'page-transition-overlay';
    transOverlay.innerHTML = '<span class="page-transition-label">[ KDS AKADEMİ ]</span>';
    document.body.appendChild(transOverlay);

    // Slide out overlay on page load / pageshow (Optimized to avoid multiple transition overlays)
    window.addEventListener('pageshow', function() {
        var firstVisit = !sessionStorage.getItem('kds_loaded');
        if (isHome && (firstVisit || isLoaderRunning)) {
            // First visit on homepage: odometer loader runs, so hide transition overlay instantly
            transOverlay.style.display = 'none';
            return;
        }
        transOverlay.style.display = 'flex';
        transOverlay.classList.remove('is-animating-in');
        transOverlay.classList.add('is-animating-out');
        setTimeout(function() {
            transOverlay.classList.remove('is-animating-out');
        }, 700);
    });

    // Intercept local links for page cover transition
    document.addEventListener('click', function(e) {
        var link = e.target.closest('a');
        if (!link) return;
        var href = link.getAttribute('href');
        if (!href) return;
        
        // Filter out anchors, external sites, tel, mailto, etc.
        if (href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('javascript:') || link.getAttribute('target') === '_blank') {
            return;
        }
        if (href.indexOf('://') !== -1 && !href.startsWith(window.location.origin)) {
            return;
        }
        
        e.preventDefault();
        transOverlay.classList.remove('is-animating-out');
        transOverlay.classList.add('is-animating-in');
        setTimeout(function() {
            window.location.href = href;
        }, 600);
    });

    // 2. Odometer Rotating Digit Loader Injection (Only on Homepage & First Visit of Session)
    var firstVisit = !sessionStorage.getItem('kds_loaded');
    
    if (isHome && firstVisit) {
        isLoaderRunning = true;
        sessionStorage.setItem('kds_loaded', 'true'); // Set immediately to block on subsequent loads or refreshes
        var loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.className = 'loader-container';
        loader.innerHTML = '<div class="loader-content">' +
            '<div class="loader-logo-wrap">' +
                '<img src="assets/img/kds-logo.jpg" alt="KDS Akademi Logo" class="loader-logo-img" />' +
                '<div class="loader-logo-ring"></div>' +
            '</div>' +
            '<div class="animated-number">' +
                '<div class="rotating-digit-container" id="digit-hundreds">' +
                    '<div class="rotating-digit-column"><div class="rotating-digit">0</div><div class="rotating-digit">1</div></div>' +
                '</div>' +
                '<div class="rotating-digit-container" id="digit-tens">' +
                    '<div class="rotating-digit-column">' +
                        '<div class="rotating-digit">0</div><div class="rotating-digit">1</div><div class="rotating-digit">2</div><div class="rotating-digit">3</div><div class="rotating-digit">4</div>' +
                        '<div class="rotating-digit">5</div><div class="rotating-digit">6</div><div class="rotating-digit">7</div><div class="rotating-digit">8</div><div class="rotating-digit">9</div><div class="rotating-digit">0</div>' +
                    '</div>' +
                '</div>' +
                '<div class="rotating-digit-container" id="digit-ones">' +
                    '<div class="rotating-digit-column">' +
                        '<div class="rotating-digit">0</div><div class="rotating-digit">1</div><div class="rotating-digit">2</div><div class="rotating-digit">3</div><div class="rotating-digit">4</div>' +
                        '<div class="rotating-digit">5</div><div class="rotating-digit">6</div><div class="rotating-digit">7</div><div class="rotating-digit">8</div><div class="rotating-digit">9</div><div class="rotating-digit">0</div>' +
                    '</div>' +
                '</div>' +
                '<span class="loader-percentage">%</span>' +
            '</div>' +
            '<div class="loader-text">Sanatın ve Dansın Akademisi</div>' +
            '<div class="loader-line-wrap">' +
                '<div class="loader-line-progress"></div>' +
            '</div>' +
        '</div>';
        
        document.body.appendChild(loader);
        document.body.style.overflow = 'hidden';
        
        // Setup odometer GSAP animation
        setTimeout(function() {
            var hCol = loader.querySelector('#digit-hundreds .rotating-digit-column');
            var tCol = loader.querySelector('#digit-tens .rotating-digit-column');
            var oCol = loader.querySelector('#digit-ones .rotating-digit-column');
            var digitEl = loader.querySelector('.rotating-digit');
            
            var digitHeight = digitEl ? digitEl.offsetHeight : 0;
            if (digitHeight < 10) {
                // Layout fallback: if offsetHeight is 0 due to rendering race, use standard font height
                digitHeight = window.innerWidth < 768 ? 64 : 96;
            }
            
            if (typeof gsap !== 'undefined') {
                gsap.set([hCol, tCol, oCol], { y: 0 });
                
                var tl = gsap.timeline({
                    onComplete: function() {
                        loader.classList.add('is-loaded');
                        document.body.style.overflow = '';
                        sessionStorage.setItem('kds_loaded', 'true');
                        // Trigger entry animations for hero headline
                        var lineReveal = document.querySelectorAll('.line-reveal-line');
                        if (lineReveal.length) {
                            gsap.set(lineReveal, { yPercent: 110 });
                            gsap.to(lineReveal, {
                                yPercent: 0,
                                duration: 1.0,
                                ease: 'power4.out',
                                stagger: 0.1,
                                delay: 0.2
                            });
                        }
                    }
                });
                
                tl.to(oCol, { y: -digitHeight * 10, duration: 2.2, ease: 'power2.inOut' }, 0);
                tl.to(tCol, { y: -digitHeight * 10, duration: 2.2, ease: 'power2.inOut' }, 0);
                tl.to(hCol, { y: -digitHeight * 1, duration: 0.7, ease: 'power3.out' }, 1.5);
            } else {
                setTimeout(function() {
                    loader.classList.add('is-loaded');
                    document.body.style.overflow = '';
                    sessionStorage.setItem('kds_loaded', 'true');
                }, 2000);
            }
        }, 100);
    } else {
        // If not home page or not first visit, trigger hero headline immediately
        setTimeout(function() {
            if (typeof gsap !== 'undefined') {
                var lineReveal = document.querySelectorAll('.line-reveal-line');
                if (lineReveal.length) {
                    gsap.set(lineReveal, { yPercent: 110 });
                    gsap.to(lineReveal, {
                        yPercent: 0,
                        duration: 1.0,
                        ease: 'power4.out',
                        stagger: 0.1,
                        delay: 0.2
                    });
                }
            }
        }, 100);
    }
});

/* ==============================
   KDS Stories Carousel Slider JS
   ============================== */
(function () {
    var track = document.getElementById('stories-slider-track');
    var dotsContainer = document.getElementById('stories-dots');
    if (!track || !dotsContainer) return;

    var cards = track.children;
    var totalCards = cards.length;
    var currentIdx = 0;
    var autoPlayTimer = null;
    var autoPlayDelay = 3500; // Auto play every 3.5 seconds

    function getCardsPerPage() {
        if (totalCards === 0) return 1;
        var firstCard = cards[0];
        var cardWidth = firstCard.offsetWidth;
        var style = window.getComputedStyle(track);
        var gap = parseInt(style.columnGap || style.gap) || 20;
        var containerWidth = track.parentElement.offsetWidth;
        var cpp = Math.floor((containerWidth + gap) / (cardWidth + gap));
        return cpp > 0 ? cpp : 1;
    }

    // Build dots dynamically based on screen width
    function rebuildDots() {
        dotsContainer.innerHTML = '';
        var cpp = getCardsPerPage();
        var dotsCount = totalCards - cpp + 1;
        if (dotsCount < 1) dotsCount = 1;
        
        for (var i = 0; i < dotsCount; i++) {
            var dot = document.createElement('button');
            dot.className = 'kds-stories-dot' + (i === currentIdx ? ' active' : '');
            dot.setAttribute('aria-label', 'Yorum slaytı ' + (i + 1));
            (function (idx) {
                dot.addEventListener('click', function () {
                    goToSlide(idx);
                    resetAutoPlay();
                });
            })(i);
            dotsContainer.appendChild(dot);
        }
    }

    function getTranslateAmount(idx) {
        if (totalCards === 0) return 0;
        var firstCard = cards[0];
        var cardWidth = firstCard.offsetWidth;
        var style = window.getComputedStyle(track);
        var gap = parseInt(style.columnGap || style.gap) || 20;
        return idx * (cardWidth + gap);
    }

    function goToSlide(idx) {
        var cpp = getCardsPerPage();
        var maxIdx = totalCards - cpp;
        if (maxIdx < 0) maxIdx = 0;
        if (idx > maxIdx) idx = maxIdx;
        if (idx < 0) idx = 0;
        currentIdx = idx;

        var translateVal = getTranslateAmount(currentIdx);
        track.style.transform = 'translateX(-' + translateVal + 'px)';

        var dots = dotsContainer.children;
        for (var i = 0; i < dots.length; i++) {
            if (dots[i]) {
                dots[i].classList.toggle('active', i === currentIdx);
            }
        }
    }

    function startAutoPlay() {
        clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(function () {
            var cpp = getCardsPerPage();
            var maxIdx = totalCards - cpp;
            if (maxIdx < 0) maxIdx = 0;
            var next = currentIdx + 1;
            if (next > maxIdx) {
                next = 0;
            }
            goToSlide(next);
        }, autoPlayDelay);
    }

    function resetAutoPlay() {
        startAutoPlay();
    }

    // Drag-to-slide & Swipe functionality
    var isDragging = false;
    var startX = 0;
    var prevTranslate = 0;

    track.addEventListener('mousedown', dragStart);
    track.addEventListener('touchstart', dragStart, { passive: true });
    
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchend', dragEnd);
    window.addEventListener('mousemove', dragAction);
    window.addEventListener('touchmove', dragAction, { passive: true });

    function getPositionX(event) {
        return event.type.includes('touch') ? event.touches[0].clientX : event.clientX;
    }

    function dragStart(event) {
        var isClickable = event.target.closest('a, button');
        if (isClickable) return;

        isDragging = true;
        startX = getPositionX(event);
        clearInterval(autoPlayTimer);
        
        track.style.transition = 'none';
        prevTranslate = -getTranslateAmount(currentIdx);
    }

    function dragAction(event) {
        if (!isDragging) return;
        var currentX = getPositionX(event);
        var currentTranslate = prevTranslate + (currentX - startX);
        
        var cpp = getCardsPerPage();
        var maxIdx = totalCards - cpp;
        if (maxIdx < 0) maxIdx = 0;
        var maxTranslate = 0;
        var minTranslate = -getTranslateAmount(maxIdx);
        
        if (currentTranslate > maxTranslate) {
            currentTranslate = maxTranslate + (currentTranslate - maxTranslate) * 0.3;
        } else if (currentTranslate < minTranslate) {
            currentTranslate = minTranslate + (currentTranslate - minTranslate) * 0.3;
        }
        
        track.style.transform = 'translateX(' + currentTranslate + 'px)';
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        
        track.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        
        var finalTranslate = getTranslateX(track);
        var firstCard = cards[0];
        var cardWidth = firstCard.offsetWidth;
        var style = window.getComputedStyle(track);
        var gap = parseInt(style.columnGap || style.gap) || 20;
        var step = cardWidth + gap;
        
        var targetIdx = Math.round(-finalTranslate / step);
        var cpp = getCardsPerPage();
        var maxIdx = totalCards - cpp;
        if (maxIdx < 0) maxIdx = 0;
        
        if (targetIdx < 0) targetIdx = 0;
        if (targetIdx > maxIdx) targetIdx = maxIdx;
        
        goToSlide(targetIdx);
        startAutoPlay();
    }

    function getTranslateX(el) {
        var style = window.getComputedStyle(el);
        var transform = style.transform || style.webkitTransform;
        if (!transform || transform === 'none') return 0;
        var matrix = transform.match(/^matrix3d\((.+)\)$/);
        if (matrix) return parseFloat(matrix[1].split(', ')[12]);
        matrix = transform.match(/^matrix\((.+)\)$/);
        if (matrix) return parseFloat(matrix[1].split(', ')[4]);
        return 0;
    }

    // Prev / Next button listeners
    var prevBtn = document.getElementById('stories-prev');
    var nextBtn = document.getElementById('stories-next');
    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            goToSlide(currentIdx - 1);
            resetAutoPlay();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            goToSlide(currentIdx + 1);
            resetAutoPlay();
        });
    }

    // Initialize
    rebuildDots();
    goToSlide(0);
    startAutoPlay();

    window.addEventListener('resize', function () {
        rebuildDots();
        goToSlide(currentIdx);
    });
})();

// Dropdown click/touch toggle logic for desktop view
document.addEventListener('DOMContentLoaded', function() {
    var dropdownGroups = document.querySelectorAll('.relative.group');
    dropdownGroups.forEach(function(group) {
        var trigger = group.querySelector('a.nav-link');
        var menu = group.querySelector('div.absolute');
        if (trigger && menu) {
            trigger.addEventListener('click', function(e) {
                if (window.innerWidth >= 1024) {
                    var isVisible = menu.classList.contains('show-dropdown-active');
                    if (!isVisible) {
                        e.preventDefault();
                        e.stopPropagation();
                        document.querySelectorAll('.relative.group div.absolute').forEach(function(m) {
                            m.classList.remove('show-dropdown-active');
                        });
                        menu.classList.add('show-dropdown-active');
                    }
                }
            });
        }
    });
    document.addEventListener('click', function() {
        document.querySelectorAll('.relative.group div.absolute').forEach(function(m) {
            m.classList.remove('show-dropdown-active');
        });
    });
});






