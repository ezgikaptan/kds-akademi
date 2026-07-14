const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const targetFiles = [
    'tv-programlari.html',
    'gazete-haberleri.html',
    'dergi-roportajlari.html',
    'cocuk-basari-hikayeleri.html',
    'yetiskin-basari-hikayeleri.html',
    'cocuk-ogrenci-yorumlari.html',
    'yetiskin-ogrenci-yorumlari.html',
    'etkinlikler.html',
    'bizden-haberler.html',
    'projeler.html',
    'dokumanlar.html',
    'is-ilanlari.html',
    'staj-ilanlari.html',
    'tanitim-videolari.html',
    'fotograf-albumleri.html'
];

targetFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // We want to find the first </section> inside <main> and insert our additional sections after it, but before </main>
    const mainParts = content.split('</main>');
    if (mainParts.length < 2) return;
    
    let mainContent = mainParts[0];
    
    // Check if the additional sections are already injected
    if (mainContent.includes('id="additional-info-section"')) {
        console.log(`- ${file}: Already enriched.`);
        return;
    }
    
    const pageName = file.replace('.html', '').replace(/-/g, ' ');
    const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    
    const extraSections = `
<!-- Enriched Sections: Aşama 5 Tasarım Yoğunluğu -->
<section id="additional-info-section" class="py-16 bg-zinc-50 border-t border-zinc-200/50 text-left">
    <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
            <span class="text-xs text-sanat-yellow font-bold uppercase tracking-widest block mb-2">SANATLA BÜTÜNLEŞİN</span>
            <h2 class="text-xl md:text-3xl font-extrabold text-zinc-900 leading-tight">KDS Akademi'de Sanatsal Gelişim Süreci</h2>
            <p class="text-zinc-650 text-xs md:text-sm mt-4 leading-relaxed">
                Akademimiz bünyesinde gerçekleştirdiğimiz her etkinlik, yayınlanan her içerik ve katıldığımız her program, öğrencilerimizin sanatsal özgüvenini artırmayı hedefler. Eğitim kadromuzun rehberliğinde hazırlanan bu içeriklerle, Konya'da sanatı daha erişilebilir kılmak için çalışıyoruz.
            </p>
        </div>
        <div class="bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm space-y-4">
            <h3 class="text-sm font-bold text-zinc-950 border-b border-zinc-100 pb-2">Neden KDS Akademi?</h3>
            <div class="flex items-start gap-3">
                <span class="material-symbols-outlined text-sanat-yellow text-lg font-bold">verified</span>
                <div>
                    <h4 class="text-xs font-bold text-zinc-900">Nitelikli Eğitim Modeli</h4>
                    <p class="text-zinc-500 text-[10px] leading-relaxed">Öğrencinin seviyesine ve ilgi alanlarına göre özelleştirilen modern ders müfredatı.</p>
                </div>
            </div>
            <div class="flex items-start gap-3">
                <span class="material-symbols-outlined text-sanat-yellow text-lg font-bold">celebration</span>
                <div>
                    <h4 class="text-xs font-bold text-zinc-900">Sahne Deneyimi</h4>
                    <p class="text-zinc-500 text-[10px] leading-relaxed">Yıl sonu galaları ve halka açık dinletilerle sahne korkusunu yenme imkanı.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="py-16 bg-white border-t border-zinc-200/50 text-left">
    <div class="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop">
        <h2 class="text-xl font-bold text-zinc-900 text-center mb-8">Sıkça Sorulan Sorular</h2>
        <div class="space-y-4">
            <details class="group bg-zinc-50 border border-zinc-200 rounded-xl p-4 cursor-pointer">
                <summary class="font-bold text-xs flex justify-between items-center text-zinc-900">
                    Akademideki etkinlik ve yayınları dışarıdan takip edebilir miyim?
                    <span class="material-symbols-outlined text-sm transition-transform group-open:rotate-180">keyboard_arrow_down</span>
                </summary>
                <p class="text-zinc-650 text-xs mt-3 leading-relaxed">Evet, düzenlediğimiz konserler, sergiler ve açık atölye çalışmaları tüm sanatseverlerin katılımına açıktır. Instagram sayfamız üzerinden tarihleri takip edebilirsiniz.</p>
            </details>
            <details class="group bg-zinc-50 border border-zinc-200 rounded-xl p-4 cursor-pointer">
                <summary class="font-bold text-xs flex justify-between items-center text-zinc-900">
                    Öğrenciler için katılım zorunlu mu?
                    <span class="material-symbols-outlined text-sm transition-transform group-open:rotate-180">keyboard_arrow_down</span>
                </summary>
                <p class="text-zinc-650 text-xs mt-3 leading-relaxed">Etkinlikler ve sahne performansları tamamen gönüllülük esasına dayanmaktadır. Öğrencilerimizin hazır hissetme durumuna göre sahne alması teşvik edilir.</p>
            </details>
        </div>
    </div>
</section>

<section class="py-16 bg-zinc-950 text-white relative border-t border-white/5 text-center">
    <div class="max-w-2xl mx-auto px-6 space-y-6">
        <h2 class="text-xl md:text-3xl font-extrabold">Hayallerinizi Ertelemeyin</h2>
        <p class="text-zinc-400 text-xs md:text-sm leading-relaxed max-w-lg mx-auto">Sanat yolculuğunuza bizimle başlamak ve ücretsiz deneme derslerimize randevu oluşturmak için şimdi ön kayıt yaptırın.</p>
        <div class="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <a href="kayit.html" class="bg-sanat-yellow hover:bg-sanat-yellow-dark text-zinc-950 font-bold px-8 py-3.5 rounded-lg text-xs transition-all shadow-lg">Hemen Başvur</a>
            <a href="https://wa.me/905419050042" class="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3.5 rounded-lg text-xs transition-all border border-white/20">WhatsApp ile İletişime Geç</a>
        </div>
    </div>
</section>
`;

    // Append extraSections before </main>
    fs.writeFileSync(filePath, mainContent + extraSections + '</main>' + mainParts.slice(1).join('</main>'), 'utf8');
    console.log(`- ${file}: Enriched with additional sections successfully.`);
});
