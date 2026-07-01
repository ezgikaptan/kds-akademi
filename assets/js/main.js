document.addEventListener('DOMContentLoaded', function () {
    var revealTargets = document.querySelectorAll(
        'header h1, header p, header span, main h1, main h2, .glass-panel, main .grid > a, main .grid > div'
    );
    revealTargets.forEach(function (el, i) {
        el.classList.add('reveal');
        el.style.transitionDelay = (Math.min(i % 6, 5) * 0.08) + 's';
    });
    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealTargets.forEach(function (el) { revealObserver.observe(el); });
    } else {
        revealTargets.forEach(function (el) { el.classList.add('in-view'); });
    }

    var menuBtn = document.getElementById('mobile-menu-btn');
    var mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function () {
            mobileMenu.classList.toggle('open');
        });
    }

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
});
