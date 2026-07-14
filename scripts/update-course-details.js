const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const files = fs.readdirSync(rootDir).filter(file => {
    return file.startsWith('kurs-') && file.endsWith('.html') && !file.endsWith('.orig');
});

// Map of departments
const getDeptInfo = (filename) => {
    const fn = filename.toLowerCase();
    if (['piyano', 'keman', 'yan-flut', 'cello', 'gitar', 'kanun', 'baglama'].some(m => fn.includes(m))) {
        return {
            dept: 'muzik',
            label: 'Müzik Bölümü',
            heroImg: 'assets/img/kurs-piyano.jpg',
            ageGroup: 'Tüm Yaşlar (Çocuk / Yetişkin)',
            classType: 'Birebir Özel Ders',
            curriculum: [
                'Doğru duruş ve el/parmak pozisyonları',
                'Temel solfej ve nota okuma teknikleri',
                'Klasik batı müziği ve modern eser çalışmaları',
                'Ritim algısı ve işitsel duyu egzersizleri'
            ],
            outcomes: [
                'Seviyeye uygun klasik ve popüler eserleri çalabilme',
                'Nota ve solfej okuma becerisi',
                'Topluluk önünde sahne alabilme özgüveni',
                'İşitsel odaklanma ve ritim koordinasyonu'
            ]
        };
    }
    if (['salsa', 'bachata', 'rumba', 'zumba', 'breakdance', 'hip-hop', 'oryantal', 'roman', 'zeybek', 'halk'].some(d => fn.includes(d))) {
        return {
            dept: 'dans',
            label: 'Dans Akademisi',
            heroImg: 'assets/img/kurs-salsa.jpg',
            ageGroup: 'Genç ve Yetişkin Grupları',
            classType: 'Grup Sınıfı (Özel Ders Seçenekli)',
            curriculum: [
                'Temel adımlar, duruş ve ritim kontrolü',
                'Eşli danslarda liderlik ve takip prensipleri',
                'Koreografi, solo adımlar ve dönüş teknikleri',
                'Müzikalite ve sosyal dans pratikleri'
            ],
            outcomes: [
                'Sosyal ortamlarda özgüvenle dans edebilme',
                'Beden koordinasyonu ve esneklik artışı',
                'Ritim algısı ve müzikle uyumlu hareket',
                'Sosyal çevre edinimi ve stres azaltma'
            ]
        };
    }
    if (['resim', 'görsel', 'sanatlara'].some(r => fn.includes(r))) {
        return {
            dept: 'resim',
            label: 'Resim Atölyesi',
            heroImg: 'assets/img/kurs-resim.jpg',
            ageGroup: 'Çocuk / Genç / Yetişkin',
            classType: 'Atölye Sınıfı',
            curriculum: [
                'Temel çizim, karakalem gölgelendirme ve oran/orantı',
                'Perspektif kuralları ve kompozisyon oluşturma',
                'Renk teorisi, suluboya ve akrilik boyama teknikleri',
                'Özgün proje ve portfolyo hazırlık çalışmaları'
            ],
            outcomes: [
                'Görsel algı ve gözlem yeteneğinin gelişimi',
                'Farklı resim tekniklerinde (akrilik, karakalem) uzmanlaşma',
                'Yıl sonu sergisinde eser sergileme deneyimi',
                'Sanat tarihi vizyonu ve estetik algı kazanımı'
            ]
        };
    }
    // Default to Tiyatro / Drama
    return {
        dept: 'tiyatro',
        label: 'Tiyatro ve Sahne Sanatları',
        heroImg: 'assets/img/kurs-tiyatro.jpg',
        ageGroup: 'Çocuk / Genç / Yetişkin grupları',
        classType: 'Grup Atölyesi',
        curriculum: [
            'Beden dili, sahne duruşu ve pandomim egzersizleri',
            'Doğru nefes (diyafram) kullanımı ve diksiyon',
            'Rol analizi, karakter oluşturma ve metin okuma',
            'Doğaçlama, tiyatro oyun sahneleme pratikleri'
        ],
        outcomes: [
            'Topluluk önünde rahatça konuşabilme özgüveni',
            'Diksiyon ve etkili hitabet gücü',
            'Empati yeteneği ve yaratıcı düşünme becerisi',
            'Grup içi uyum ve sosyal adaptasyon'
        ]
    };
};

console.log(`Updating ${files.length} detailed course pages...`);

files.forEach(file => {
    const filePath = path.join(rootDir, file);
    let originalHtml = fs.readFileSync(filePath, 'utf8');
    
    // Extract title & desc if possible
    let courseName = '';
    const titleMatch = originalHtml.match(/<title>([\s\S]*?)<\/title>/);
    if (titleMatch) {
        courseName = titleMatch[1].replace(' | KDS Akademi', '').trim();
    } else {
        courseName = file.replace('kurs-', '').replace('-egitimi.html', '').replace('-dansi.html', '').replace('.html', '').replace(/-/g, ' ');
        courseName = courseName.charAt(0).toUpperCase() + courseName.slice(1);
    }
    
    let courseDesc = '';
    const descMatch = originalHtml.match(/<meta name="description" content="([\s\S]*?)"/);
    if (descMatch) {
        courseDesc = descMatch[1].trim();
    } else {
        courseDesc = `${courseName} hakkında detaylı bilgi, ders programları ve kayıt formu.`;
    }
    
    const info = getDeptInfo(file);
    
    const aboutText = `KDS Akademi ${info.label} bünyesinde sunulan ${courseName}, alanında uzman ve akademik formasyona sahip eğitmenlerimiz eşliğinde gerçekleştirilmektedir. Derslerimizde teknik donanımın yanı sıra sanatsal ifade gücü, ritim algısı ve sahne estetiği kazanımı hedeflenmektedir.`;
    
    const targetText = `${courseName} programı, sanata ilgi duyan, enstrüman veya dans çalma hayalini gerçekleştirmek isteyen, beden koordinasyonunu ve estetik algısını güçlendirmek isteyen her yaştan sanatsever için uygundur. Yaş gruplarına özel olarak tasarlanmış seviye sınıflarımız bulunmaktadır.`;
    
    const scheduleText = `Derslerimiz haftalık programlar halinde, hafta içi veya hafta sonu seçenekleriyle düzenlenmektedir. Birebir veya grup halinde işlenen dersler, uygulama ağırlıklı eğitim modelleriyle yürütülür. Her ders saati, teknik pratikler ve teorik altyapının dengeli dağılımıyla öğrencilerin ilgisini canlı tutacak şekilde tasarlanmıştır.`;

    const curriculumList = info.curriculum.map(c => `
        <li class="flex items-start gap-2 py-1">
            <span class="material-symbols-outlined text-sanat-yellow text-sm font-bold mt-0.5">check_circle</span>
            <span>${c}</span>
        </li>`).join('');
        
    const outcomesList = info.outcomes.map(o => `
        <li class="flex items-start gap-2 py-1">
            <span class="material-symbols-outlined text-sanat-yellow text-sm font-bold mt-0.5">stars</span>
            <span>${o}</span>
        </li>`).join('');

    // Sibling recommendations (3 other courses from same dept)
    const allCoursesOfSameDept = files.filter(f => {
        return f !== file && getDeptInfo(f).dept === info.dept;
    }).slice(0, 3);
    
    let recommendationsHtml = '';
    if (allCoursesOfSameDept.length > 0) {
        recommendationsHtml = allCoursesOfSameDept.map(f => {
            const siblingName = f.replace('kurs-', '').replace('-egitimi.html', '').replace('-dansi.html', '').replace('.html', '').replace(/-/g, ' ');
            const formattedName = siblingName.charAt(0).toUpperCase() + siblingName.slice(1);
            return `
            <a href="${f}" class="bg-white border border-zinc-200 rounded-xl p-5 hover:border-sanat-yellow transition-all block shadow-sm hover-lift text-left">
                <span class="text-[9px] font-bold text-sanat-yellow uppercase tracking-widest block mb-1">${info.label}</span>
                <h3 class="text-sm font-bold text-zinc-900 mb-2">${formattedName}</h3>
                <p class="text-zinc-500 text-[10px] leading-relaxed line-clamp-2">KDS Akademi ${info.label} bünyesinde verilen profesyonel sanat dersleri...</p>
            </a>`;
        }).join('');
    } else {
        recommendationsHtml = `
        <a href="kurslar.html" class="bg-white border border-zinc-200 rounded-xl p-5 hover:border-sanat-yellow transition-all block shadow-sm hover-lift text-left col-span-3">
            <span class="text-[9px] font-bold text-sanat-yellow uppercase tracking-widest block mb-1">TÜM PROGRAMLAR</span>
            <h3 class="text-sm font-bold text-zinc-900 mb-2">Tüm Kurs Listesini Gör</h3>
            <p class="text-zinc-500 text-[10px] leading-relaxed">Müzik, dans, tiyatro ve görsel sanatlar alanındaki tüm eğitimlerimizi görmek için tıklayın.</p>
        </a>`;
    }

    const template = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>${courseName} | KDS Akademi</title>
    <meta name="description" content="${courseDesc}"/>
    <meta name="theme-color" content="#8B263E"/>
    <link rel="icon" href="assets/img/kds-logo.jpg" type="image/jpeg"/>
    
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    
    <link rel="stylesheet" href="assets/css/tailwind.build.css"/>
    <link rel="stylesheet" href="assets/css/style.css?v=2.0"/>
</head>
<body class="bg-white text-zinc-900 font-body-md antialiased selection:bg-sanat-yellow selection:text-white">
<div id="scroll-progress"></div>
<a href="#main" class="skip-link">İçeriğe geç</a>

<!-- Top Bar -->
<!-- Header / Nav -->
</header>

<!-- Breadcrumb -->
<div class="bg-zinc-50 border-b border-zinc-200/50 py-4 px-margin-mobile md:px-margin-desktop text-xs text-zinc-500 text-left">
    <div class="max-w-container-max mx-auto flex items-center gap-2">
        <a href="index.html" class="hover:text-sanat-yellow transition-colors flex items-center gap-1"><span class="material-symbols-outlined text-sm">home</span> Anasayfa</a>
        <span class="material-symbols-outlined text-[12px]">chevron_right</span>
        <a href="kurslar.html" class="hover:text-sanat-yellow transition-colors">Kurslar</a>
        <span class="material-symbols-outlined text-[12px]">chevron_right</span>
        <span class="text-zinc-900 font-medium">${courseName}</span>
    </div>
</div>

<main id="main">
<!-- MOCK CONTENT: Gerçek KDS verisi geldiğinde güncellenecek -->

<!-- Course Hero -->
<header class="pt-32 pb-20 bg-zinc-950 text-white relative">
    <div class="absolute inset-0 bg-gradient-to-b from-zinc-900/60 to-zinc-950/90 z-0"></div>
    <div class="absolute inset-0 z-0 opacity-30">
        <img src="${info.heroImg}" alt="${courseName}" class="w-full h-full object-cover" />
    </div>
    <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
        <div class="lg:col-span-8 space-y-6">
            <span class="bracket-tag font-label-md text-label-md text-sanat-yellow uppercase tracking-widest block">${info.label}</span>
            <h1 class="text-3xl md:text-5xl font-black leading-tight">${courseName}</h1>
            <p class="font-body-lg text-body-lg text-zinc-350 max-w-2xl leading-relaxed">${courseDesc}</p>
            <div class="flex flex-wrap gap-4 pt-4">
                <a href="#register-section" class="bg-sanat-yellow hover:bg-sanat-yellow-dark text-white font-bold px-8 py-3.5 rounded-lg text-xs transition-all shadow-lg inline-flex items-center gap-1.5">
                    Ücretsiz Deneme Dersi Al <span class="material-symbols-outlined text-xs">arrow_forward</span>
                </a>
            </div>
        </div>
        <div class="lg:col-span-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4 text-xs text-zinc-350">
            <h3 class="font-bold text-white text-sm border-b border-white/10 pb-2 mb-3">Kurs Detayları</h3>
            <div class="flex justify-between py-1 border-b border-white/5">
                <span>Yaş Grubu:</span>
                <span class="text-white font-bold">${info.ageGroup}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-white/5">
                <span>Eğitim Türü:</span>
                <span class="text-white font-bold">${info.classType}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-white/5">
                <span>Eğitmenler:</span>
                <span class="text-white font-bold">Konservatuvar / Alan Mezunu</span>
            </div>
            <div class="flex justify-between py-1">
                <span>Ders Günleri:</span>
                <span class="text-white font-bold">Hafta Sonu / Hafta İçi</span>
            </div>
        </div>
    </div>
</header>

<!-- Course Details Main -->
<section class="py-20 bg-white">
    <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
        
        <!-- Left Side Details (8 cols) -->
        <div class="lg:col-span-8 space-y-12">
            
            <!-- About Course -->
            <div class="space-y-4">
                <h2 class="text-xl font-bold text-zinc-900 border-l-4 border-sanat-yellow pl-4">Kurs Hakkında</h2>
                <p class="text-zinc-650 text-xs md:text-sm leading-relaxed">${aboutText}</p>
            </div>

            <!-- Target Audience -->
            <div class="space-y-4">
                <h2 class="text-xl font-bold text-zinc-900 border-l-4 border-sanat-yellow pl-4">Kimler Katılabilir?</h2>
                <p class="text-zinc-650 text-xs md:text-sm leading-relaxed">${targetText}</p>
            </div>

            <!-- Curriculum -->
            <div class="space-y-4">
                <h2 class="text-xl font-bold text-zinc-900 border-l-4 border-sanat-yellow pl-4">Eğitim İçeriği</h2>
                <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-650">
                    ${curriculumList}
                </ul>
            </div>

            <!-- Outcomes / Achievements -->
            <div class="space-y-4">
                <h2 class="text-xl font-bold text-zinc-900 border-l-4 border-sanat-yellow pl-4">Kazanımlar</h2>
                <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-650">
                    ${outcomesList}
                </ul>
            </div>

            <!-- Schedule -->
            <div class="space-y-4">
                <h2 class="text-xl font-bold text-zinc-900 border-l-4 border-sanat-yellow pl-4">Ders Programı ve Yöntem</h2>
                <p class="text-zinc-650 text-xs md:text-sm leading-relaxed">${scheduleText}</p>
            </div>
            
            <!-- Gallery / Media -->
            <div class="space-y-4">
                <h2 class="text-xl font-bold text-zinc-900 border-l-4 border-sanat-yellow pl-4">Kurs Galerisi</h2>
                <div class="grid grid-cols-3 gap-4">
                    <div class="rounded-xl overflow-hidden aspect-video border border-zinc-200"><img src="${info.heroImg}" class="w-full h-full object-cover" /></div>
                    <div class="rounded-xl overflow-hidden aspect-video border border-zinc-200"><img src="assets/img/kurs-piyano.jpg" class="w-full h-full object-cover" /></div>
                    <div class="rounded-xl overflow-hidden aspect-video border border-zinc-200"><img src="assets/img/kurs-salsa.jpg" class="w-full h-full object-cover" /></div>
                </div>
            </div>

            <!-- FAQ (SSS Accordion) -->
            <div class="space-y-4">
                <h2 class="text-xl font-bold text-zinc-900 border-l-4 border-sanat-yellow pl-4">Sıkça Sorulan Sorular</h2>
                <div class="space-y-3">
                    <details class="group bg-zinc-50 border border-zinc-200 rounded-xl p-4 cursor-pointer">
                        <summary class="font-bold text-xs flex justify-between items-center text-zinc-900">
                            Derslere katılmak için enstrüman sahibi olmalı mıyım?
                            <span class="material-symbols-outlined text-sm transition-transform group-open:rotate-180">keyboard_arrow_down</span>
                        </summary>
                        <p class="text-zinc-650 text-xs mt-3 leading-relaxed">Başlangıç aşamasında kendi enstrümanınızın olması ev çalışmaları için önerilir. Ancak stüdyomuzdaki enstrümanları ders süresince ücretsiz olarak kullanabilirsiniz.</p>
                    </details>
                    <details class="group bg-zinc-50 border border-zinc-200 rounded-xl p-4 cursor-pointer">
                        <summary class="font-bold text-xs flex justify-between items-center text-zinc-900">
                            Dönem sonunda sertifika veriliyor mu?
                            <span class="material-symbols-outlined text-sm transition-transform group-open:rotate-180">keyboard_arrow_down</span>
                        </summary>
                        <p class="text-zinc-650 text-xs mt-3 leading-relaxed">KDS Akademi bünyesinde eğitim alan tüm öğrencilerimize dönem sonunda katılım ve başarı belgesi takdim edilir.</p>
                    </details>
                </div>
            </div>

        </div>

        <!-- Right Side Contact Form (4 cols) -->
        <div class="lg:col-span-4" id="register-section">
            <div class="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 sticky top-24 shadow-sm text-left">
                <h3 class="text-base font-bold text-zinc-900 mb-2">Ücretsiz Bilgi Alın</h3>
                <p class="text-zinc-500 text-xs mb-6 leading-relaxed">Formu doldurarak ücretsiz deneme derslerimize ön kayıt yaptırabilirsiniz. Eğitim koordinatörlerimiz en kısa sürede size dönüş sağlayacaktır.</p>
                
                <form id="course-contact-form" class="space-y-4" onsubmit="handleCourseContactSubmit(event)">
                    <input type="hidden" id="form-course-name" value="${courseName}" />
                    <div>
                        <label class="block text-zinc-700 text-[10px] font-bold uppercase tracking-wider mb-1" for="name">Adınız Soyadınız</label>
                        <input class="w-full bg-white border border-zinc-300 rounded-lg py-2.5 px-4 text-xs text-zinc-900 focus:outline-none focus:border-sanat-yellow transition-colors" type="text" id="name" required />
                    </div>
                    <div>
                        <label class="block text-zinc-700 text-[10px] font-bold uppercase tracking-wider mb-1" for="phone">Telefon Numaranız</label>
                        <input class="w-full bg-white border border-zinc-300 rounded-lg py-2.5 px-4 text-xs text-zinc-900 focus:outline-none focus:border-sanat-yellow transition-colors" type="tel" id="phone" required placeholder="0555 555 5555" />
                    </div>
                    <div>
                        <label class="block text-zinc-700 text-[10px] font-bold uppercase tracking-wider mb-1" for="message">Sorularınız / Notunuz</label>
                        <textarea class="w-full bg-white border border-zinc-300 rounded-lg py-2.5 px-4 text-xs text-zinc-900 focus:outline-none focus:border-sanat-yellow transition-colors h-24 resize-none" id="message" placeholder="Ders günleri, saatleri ve ücret bilgisi hakkında..."></textarea>
                    </div>
                    <button class="w-full bg-sanat-yellow hover:bg-sanat-yellow-dark text-white font-bold py-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5" type="submit">
                        WhatsApp ile Bilgi Al <span class="material-symbols-outlined text-sm">send</span>
                    </button>
                </form>
            </div>
        </div>

    </div>
</section>

<!-- Similar Recommendations -->
<section class="py-20 bg-zinc-50 border-t border-zinc-200/50">
    <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-left">
        <h2 class="text-xl font-bold text-zinc-900 mb-8">Benzer Kurs Programları</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            ${recommendationsHtml}
        </div>
    </div>
</section>

</main>

<script>
function handleCourseContactSubmit(e) {
    e.preventDefault();
    var course = document.getElementById('form-course-name').value;
    var name = document.getElementById('name').value;
    var phone = document.getElementById('phone').value;
    var msg = document.getElementById('message').value;
    
    var text = "Merhaba KDS Akademi, *" + course + "* dersiniz hakkında bilgi almak istiyorum.\\n\\n";
    text += "*Adım Soyadım:* " + name + "\\n";
    text += "*Telefonum:* " + phone + "\\n";
    if(msg) text += "*Mesajım:* " + msg;
    
    var encodedText = encodeURIComponent(text);
    var url = "https://wa.me/905419050042?text=" + encodedText;
    window.open(url, '_blank');
}
</script>

<!-- Footer -->
<script src="assets/js/main.js?v=2.0"></script>
</body>
</html>`;

    fs.writeFileSync(filePath, template, 'utf8');
});

console.log('Successfully completed details page updates!');
