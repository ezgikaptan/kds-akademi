document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('kayit-form');
    if (!form) return;

    /* ==============================
       Real course catalog (mirrors kurslar.html data-course-id / data-dept-id)
       ============================== */
    var COURSES_BY_DEPARTMENT = {
        muzik: [
            { id: 'muzik-piano', name: 'Piyano' },
            { id: 'muzik-violin', name: 'Keman' },
            { id: 'muzik-kanun', name: 'Kanun' },
            { id: 'muzik-flute', name: 'Yan Flüt' },
            { id: 'muzik-guitar', name: 'Gitar' },
            { id: 'muzik-cello', name: 'Çello' },
            { id: 'muzik-baglama', name: 'Bağlama' }
        ],
        dans: [
            { id: 'dans-salsa', name: 'Salsa' },
            { id: 'dans-bachata', name: 'Bachata' },
            { id: 'dans-zeybek', name: 'Zeybek' },
            { id: 'dans-hiphop', name: 'Hip Hop' },
            { id: 'dans-break', name: 'Breakdance' },
            { id: 'dans-rumba', name: 'Rumba' },
            { id: 'dans-zumba', name: 'Zumba' },
            { id: 'dans-oriental', name: 'Oryantal' },
            { id: 'dans-roman', name: 'Roman' }
        ],
        tiyatro: [
            { id: 'tiyatro-impro', name: 'Doğaçlama' },
            { id: 'tiyatro-speech', name: 'Diksiyon' },
            { id: 'tiyatro-drama', name: 'Tiyatro / Oyunculuk' }
        ],
        resim: [
            { id: 'resim-basic', name: 'Temel Resim' },
            { id: 'resim-exam', name: 'Sınav Hazırlık' },
            { id: 'resim-kids', name: 'Çocuk Resim' }
        ],
        cocuk: [
            { id: 'cocuk-dance', name: 'Halk Dansları' },
            { id: 'cocuk-drama', name: 'Yaratıcı Drama' }
        ]
    };

    /* ==============================
       Step wizard
       ============================== */
    var TOTAL_STEPS = 4;
    var currentStep = 1;

    var steps = form.querySelectorAll('.kayit-step');
    var indicatorItems = document.querySelectorAll('.step-indicator-item');
    var indicatorLines = document.querySelectorAll('.step-indicator-line');
    var backBtn = document.getElementById('kayit-back-btn');
    var nextBtn = document.getElementById('kayit-next-btn');
    var submitBtn = document.getElementById('kayit-submit-btn');
    var kayitNav = document.getElementById('kayit-nav');
    var confirmation = document.getElementById('kayit-confirmation');

    function showStep(step) {
        steps.forEach(function (panel) {
            panel.classList.toggle('hidden', parseInt(panel.dataset.step, 10) !== step);
        });
        indicatorItems.forEach(function (item) {
            var itemStep = parseInt(item.dataset.step, 10);
            var dot = item.querySelector('.step-indicator-dot');
            dot.classList.remove('step-indicator-dot--active', 'step-indicator-dot--done');
            if (itemStep === step) {
                dot.classList.add('step-indicator-dot--active');
            } else if (itemStep < step) {
                dot.classList.add('step-indicator-dot--done');
            }
        });
        indicatorLines.forEach(function (line, idx) {
            line.classList.toggle('step-indicator-line--done', idx + 1 < step);
        });

        backBtn.classList.toggle('invisible', step === 1);
        if (step === TOTAL_STEPS) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }

        if (step === TOTAL_STEPS) {
            updatePaymentSummary();
        }

        currentStep = step;
    }

    function validateStep(step) {
        var panel = form.querySelector('.kayit-step[data-step="' + step + '"]');
        var requiredFields = panel.querySelectorAll('[required]');
        var firstInvalid = null;

        requiredFields.forEach(function (field) {
            var valid = field.type === 'radio'
                ? panel.querySelectorAll('input[name="' + field.name + '"]:checked').length > 0
                : field.value.trim() !== '';
            if (!valid && !firstInvalid) firstInvalid = field;
        });

        if (firstInvalid) {
            firstInvalid.reportValidity ? firstInvalid.reportValidity() : firstInvalid.focus();
            return false;
        }
        return true;
    }

    nextBtn.addEventListener('click', function () {
        if (!validateStep(currentStep)) return;
        if (currentStep < TOTAL_STEPS) showStep(currentStep + 1);
    });

    backBtn.addEventListener('click', function () {
        if (currentStep > 1) showStep(currentStep - 1);
    });

    /* ==============================
       Department -> Course dropdown
       ============================== */
    var departmentSelect = document.getElementById('k-department');
    var courseSelect = document.getElementById('k-course');

    departmentSelect.addEventListener('change', function () {
        var dept = departmentSelect.value;
        var courses = COURSES_BY_DEPARTMENT[dept] || [];

        courseSelect.innerHTML = '';
        if (!courses.length) {
            courseSelect.appendChild(new Option('Önce departman seçin', ''));
            courseSelect.disabled = true;
            return;
        }
        courseSelect.appendChild(new Option('Kurs seçin', ''));
        courses.forEach(function (course) {
            courseSelect.appendChild(new Option(course.name, course.id));
        });
        courseSelect.disabled = false;
    });

    /* ==============================
       Age group pills (radio-driven active state)
       ============================== */
    var ageInputs = form.querySelectorAll('input[name="ageGroup"]');
    ageInputs.forEach(function (input) {
        input.addEventListener('change', function () {
            ageInputs.forEach(function (i) {
                i.closest('.age-group-pill').classList.toggle('age-group-pill--active', i.checked);
            });
        });
    });

    /* ==============================
       Guardian fields required only for child students
       ============================== */
    var guardianName = document.getElementById('k-guardian-name');
    var guardianPhone = document.getElementById('k-guardian-phone');
    var guardianNameOptionalTag = document.getElementById('guardian-name-optional');
    var guardianPhoneOptionalTag = document.getElementById('guardian-phone-optional');

    function syncGuardianRequirement() {
        var isChild = form.querySelector('input[name="ageGroup"][value="cocuk"]').checked;
        [guardianName, guardianPhone].forEach(function (field) {
            field.required = isChild;
        });
        var display = isChild ? 'none' : '';
        guardianNameOptionalTag.style.display = display;
        guardianPhoneOptionalTag.style.display = display;
    }
    ageInputs.forEach(function (input) {
        input.addEventListener('change', syncGuardianRequirement);
    });

    /* ==============================
       Payment summary (course name only - no fabricated pricing)
       ============================== */
    function updatePaymentSummary() {
        var summaryCourse = document.getElementById('summary-course');
        var selectedOption = courseSelect.options[courseSelect.selectedIndex];
        summaryCourse.textContent = selectedOption && selectedOption.value ? selectedOption.text : '—';
    }

    /* ==============================
       Card field formatting
       ============================== */
    var cardNumberInput = document.getElementById('k-card-number');
    cardNumberInput.addEventListener('input', function () {
        var digits = cardNumberInput.value.replace(/\D/g, '').slice(0, 16);
        cardNumberInput.value = digits.replace(/(.{4})/g, '$1 ').trim();
    });

    var cardExpiryInput = document.getElementById('k-card-expiry');
    cardExpiryInput.addEventListener('input', function () {
        var digits = cardExpiryInput.value.replace(/\D/g, '').slice(0, 4);
        cardExpiryInput.value = digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;
    });

    var cardCvvInput = document.getElementById('k-card-cvv');
    cardCvvInput.addEventListener('input', function () {
        cardCvvInput.value = cardCvvInput.value.replace(/\D/g, '').slice(0, 4);
    });

    /* ==============================
       Submit
       ============================== */
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validateStep(TOTAL_STEPS)) return;

        // NOTE: This site is a static frontend with no backend. Real card
        // processing requires a server that creates an iyzico Checkout Form
        // session (secret API key) and embeds the returned iyzico iframe here
        // in place of the custom card fields above. Until that backend exists,
        // submission only collects the form data locally and shows a
        // confirmation message - no payment is actually processed.
        steps.forEach(function (panel) { panel.classList.add('hidden'); });
        kayitNav.classList.add('hidden');
        document.getElementById('step-indicator').classList.add('hidden');
        confirmation.classList.remove('hidden');
        confirmation.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    showStep(1);
});
