document.addEventListener('DOMContentLoaded', function () {

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
       Course Filters
       ============================== */
    var categoryFilters = document.getElementById('category-filters');
    var ageFilters = document.getElementById('age-filters');
    if (categoryFilters && ageFilters) {
        var deptSections = document.querySelectorAll('.dept-section');
        var activeCategory = 'tumu';
        var activeAge = 'tumu';

        var applyCourseFilters = function () {
            deptSections.forEach(function (section) {
                var cat = section.getAttribute('data-category');
                var categoryMatches = (activeCategory === 'tumu' || activeCategory === cat);
                var anyCardVisible = false;
                
                section.querySelectorAll('.course-tab-btn').forEach(function (btn) {
                    var ages = (btn.getAttribute('data-age') || '').split(' ');
                    var ageMatches = (activeAge === 'tumu' || ages.indexOf(activeAge) !== -1);
                    var visible = categoryMatches && ageMatches;
                    if (visible) {
                        btn.style.display = '';
                        anyCardVisible = true;
                    } else {
                        btn.style.display = 'none';
                    }
                });
                
                if (anyCardVisible) {
                    section.style.display = '';
                    // Click the first visible button if the currently active one is hidden
                    var activeBtn = section.querySelector('.course-tab-btn.active');
                    if (!activeBtn || activeBtn.style.display === 'none') {
                        var firstVisible = section.querySelector('.course-tab-btn:not([style*="display: none"])');
                        if (firstVisible) {
                            firstVisible.click();
                        }
                    }
                } else {
                    section.style.display = 'none';
                }
            });
        };

        categoryFilters.querySelectorAll('[data-filter-category]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                activeCategory = btn.getAttribute('data-filter-category');
                categoryFilters.querySelectorAll('.filter-pill').forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                applyCourseFilters();
            });
        });

        ageFilters.querySelectorAll('[data-filter-age]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                activeAge = btn.getAttribute('data-filter-age');
                ageFilters.querySelectorAll('.filter-pill').forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                applyCourseFilters();
            });
        });
    }

    // Tab switching event binding (independent of the category/age filter bar above)
    document.querySelectorAll('.course-tab-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var deptId = btn.getAttribute('data-dept-id');
            var targetId = btn.getAttribute('data-course-id');
            var section = document.getElementById(deptId);
            if (!section) return;

            // Deactivate all buttons in this section
            section.querySelectorAll('.course-tab-btn').forEach(function(b) {
                b.classList.remove('active', 'bg-zinc-900', 'text-white', 'border-kds-blue', 'border-kds-pink', 'border-kds-purple', 'border-kds-orange', 'border-kds-yellow', 'shadow-[0_0_15px_rgba(255,255,255,0.05)]');
                b.classList.add('bg-zinc-50/50', 'border-zinc-200/50', 'text-zinc-500');
            });

            // Hide all panels
            section.querySelectorAll('.course-tab-panel').forEach(function(p) {
                p.classList.add('hidden', 'opacity-0', 'scale-95');
                p.classList.remove('block', 'opacity-100', 'scale-100');
            });

            // Activate selected button
            btn.classList.add('active', 'bg-zinc-900', 'text-white');
            btn.classList.remove('bg-zinc-50/50', 'border-zinc-200/50', 'text-zinc-500');

            // Choose active border color based on category
            var borderClass = 'border-kds-blue';
            if (deptId === 'dans') borderClass = 'border-kds-pink';
            if (deptId === 'tiyatro') borderClass = 'border-kds-purple';
            if (deptId === 'resim') borderClass = 'border-kds-orange';
            if (deptId === 'cocuk') borderClass = 'border-kds-yellow';

            btn.classList.add(borderClass);

            // Show selected panel
            var panel = document.getElementById(targetId);
            if (panel) {
                panel.classList.remove('hidden');
                setTimeout(function() {
                    panel.classList.add('block', 'opacity-100', 'scale-100');
                    panel.classList.remove('opacity-0', 'scale-95');
                }, 50);
            }
        });
    });

    // Initialize tabs by clicking first button of each section
    document.querySelectorAll('.dept-section').forEach(function(section) {
        var firstBtn = section.querySelector('.course-tab-btn');
        if (firstBtn) {
            firstBtn.click();
        }
    });

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
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function () {
            var isOpen = mobileMenu.classList.toggle('open');
            menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
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
});

