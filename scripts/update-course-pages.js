const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '..');

// Read files in the directory
fs.readdir(directoryPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    
    // Filter for course pages
    const courseFiles = files.filter(file => file.startsWith('kurs-') && file.endsWith('.html'));
    
    console.log(`Found ${courseFiles.length} course files to process...`);
    
    courseFiles.forEach(file => {
        const filePath = path.join(directoryPath, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 1. Replace Stylesheet & Metadata
        content = content.replace('href="assets/css/style.css"', 'href="assets/css/style.css?v=2.0"');
        content = content.replace('<meta name="theme-color" content="#18181b"/>', '<meta name="theme-color" content="#8B263E"/>');
        content = content.replace('<meta name="theme-color" content="#fdb744"/>', '<meta name="theme-color" content="#8B263E"/>');
        
        // 2. Replace Header/Nav
        const navRegex = /<!-- Nav -->[\s\S]*?<\/nav>/;
        const topBarRegex = /<!-- Top Bar -->[\s\S]*?<\/header>/;
        
        const newNav = `<!-- Top Bar -->
<div id="top-bar-2" class="bg-sanat-yellow text-white text-xs font-semibold py-2.5 px-margin-mobile md:px-margin-desktop shadow-sm border-b border-black/5">
    <div class="max-w-container-max mx-auto flex items-center justify-between">
        <div class="flex items-center gap-4">
            <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-base">verified</span> KDS Akademi | MEB Ruhsatlı Özel Eğitim Kurumu</span>
        </div>
        <div class="flex items-center gap-4">
            <a href="https://wa.me/905419050042" target="_blank" rel="noopener" class="flex items-center gap-1 hover:text-zinc-200 transition-colors font-bold"><span class="material-symbols-outlined text-base text-emerald-400 font-bold">call</span> 0541 905 00 42</a>
            <div class="hidden sm:flex items-center gap-3">
                <a href="https://www.instagram.com/konyadansvesanatakademisi/" target="_blank" rel="noopener" aria-label="Instagram" class="hover:opacity-80 transition-opacity"><i class="fab fa-instagram text-sm"></i></a>
                <a href="https://www.facebook.com/profile.php?id=61581400043466" target="_blank" rel="noopener" aria-label="Facebook" class="hover:opacity-80 transition-opacity"><i class="fab fa-facebook-f text-sm"></i></a>
                <a href="mailto:info@kdsakademi.com" class="hover:opacity-80 transition-opacity" aria-label="E-Posta"><span class="material-symbols-outlined text-sm">mail</span></a>
            </div>
        </div>
    </div>
</div>

<!-- Header / Nav -->
<header class="bg-white border-b border-zinc-200/50 sticky top-0 w-full z-50 shadow-sm transition-all duration-200">
    <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex items-center justify-between h-20">
        <!-- Logo -->
        <a class="flex items-center gap-3" href="index.html">
            <img alt="KDS Akademi Logo" class="h-12 w-12 object-contain rounded-xl border border-zinc-200" src="assets/img/kds-logo.jpg"/>
            <span class="flex flex-col justify-center text-zinc-950 font-black uppercase leading-none" style="font-family: 'Roboto', sans-serif;">
                <span class="text-lg tracking-widest font-extrabold text-zinc-900">KDS</span>
                <span class="text-[9px] tracking-wider text-sanat-yellow font-bold mt-0.5">AKADEMİ</span>
            </span>
        </a>

        <!-- Desktop Menu -->
        <div class="hidden lg:flex items-center gap-1" role="navigation" aria-label="Ana navigasyon">
            <a class="nav-link font-medium text-[15px] px-4 py-2 rounded-lg text-zinc-700 hover:text-sanat-yellow transition-colors hover:bg-zinc-50" href="index.html">Anasayfa</a>
            
            <!-- Kurslar Dropdown -->
            <div class="relative group">
                <a class="nav-link font-medium text-[15px] px-4 py-2 rounded-lg text-zinc-900 hover:text-sanat-yellow transition-colors hover:bg-zinc-50 inline-flex items-center gap-1 cursor-pointer active" href="kurslar.html">
                    Kurslar <span class="material-symbols-outlined text-sm font-bold transition-transform group-hover:rotate-180">keyboard_arrow_down</span>
                </a>
                <div class="absolute left-0 top-full mt-1 w-64 bg-white border border-zinc-200/60 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2">
                    <a href="kurslar.html#muzik" class="flex items-center gap-2 px-4 py-3 rounded-lg text-[14px] text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                        <span class="material-symbols-outlined text-lg text-zinc-500">music_note</span> Müzik Bölümü
                    </a>
                    <a href="kurslar.html#dans" class="flex items-center gap-2 px-4 py-3 rounded-lg text-[14px] text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                        <span class="material-symbols-outlined text-lg text-zinc-500">nightlife</span> Dans Akademisi
                    </a>
                    <a href="kurslar.html#tiyatro" class="flex items-center gap-2 px-4 py-3 rounded-lg text-[14px] text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                        <span class="material-symbols-outlined text-lg text-zinc-500">theater_comedy</span> Tiyatro ve Oyunculuk
                    </a>
                    <a href="kurslar.html#resim" class="flex items-center gap-2 px-4 py-3 rounded-lg text-[14px] text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                        <span class="material-symbols-outlined text-lg text-zinc-500">palette</span> Resim Atölyesi
                    </a>
                    <a href="kurslar.html#cocuk" class="flex items-center gap-2 px-4 py-3 rounded-lg text-[14px] text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                        <span class="material-symbols-outlined text-lg text-zinc-500">child_care</span> Çocuk Akademisi
                    </a>
                </div>
            </div>

            <a class="nav-link font-medium text-[15px] px-4 py-2 rounded-lg text-zinc-700 hover:text-sanat-yellow transition-colors hover:bg-zinc-50" href="egitmenler.html">Eğitmenler</a>
            <a class="nav-link font-medium text-[15px] px-4 py-2 rounded-lg text-zinc-700 hover:text-sanat-yellow transition-colors hover:bg-zinc-50" href="galeri.html">Galeri</a>
            
            <!-- Kurumsal Dropdown -->
            <div class="relative group">
                <a class="nav-link font-medium text-[15px] px-4 py-2 rounded-lg text-zinc-700 hover:text-sanat-yellow transition-colors hover:bg-zinc-50 inline-flex items-center gap-1 cursor-pointer">
                    Kurumsal <span class="material-symbols-outlined text-sm font-bold transition-transform group-hover:rotate-180">keyboard_arrow_down</span>
                </a>
                <div class="absolute left-0 top-full mt-1 w-56 bg-white border border-zinc-200/60 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2">
                    <a href="hakkimizda.html" class="flex items-center gap-2 px-4 py-3 rounded-lg text-[14px] text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                        <span class="material-symbols-outlined text-lg text-zinc-500">info</span> Hakkımızda
                    </a>
                    <a href="gizlilik-politikasi.html" class="flex items-center gap-2 px-4 py-3 rounded-lg text-[14px] text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                        <span class="material-symbols-outlined text-lg text-zinc-500">shield</span> Gizlilik Politikası
                    </a>
                </div>
            </div>

            <a class="nav-link font-medium text-[15px] px-4 py-2 rounded-lg text-zinc-700 hover:text-sanat-yellow transition-colors hover:bg-zinc-50" href="iletisim.html">İletişim</a>
        </div>

        <!-- CTA & Mobile Trigger -->
        <div class="flex items-center gap-4">
            <a class="hidden sm:inline-flex bg-sanat-yellow hover:bg-sanat-yellow-dark text-white font-bold px-6 py-2.5 rounded-lg text-[14px] transition-all hover:scale-[1.02] shadow-md shadow-sanat-yellow/20" href="kayit.html">Kayıt Ol</a>
            <button class="lg:hidden text-zinc-900 p-2 hover:bg-zinc-100 rounded-lg" id="mobile-menu-btn" aria-expanded="false" aria-controls="mobile-menu" aria-label="Menüyü aç/kapat">
                <span class="material-symbols-outlined text-2xl" aria-hidden="true">menu</span>
            </button>
        </div>
    </div>

    <!-- Mobile Dropdown -->
    <div class="mobile-menu lg:hidden bg-white border-t border-zinc-200/60" id="mobile-menu">
        <div class="flex flex-col px-margin-mobile py-6 gap-4 font-medium">
            <a class="text-zinc-800 hover:text-sanat-yellow py-1" href="index.html">Anasayfa</a>
            <div class="border-t border-zinc-100 my-1"></div>
            <span class="text-zinc-500 text-xs font-bold uppercase tracking-wider">Kurslar</span>
            <div class="grid grid-cols-2 gap-2 pl-2">
                <a href="kurslar.html#muzik" class="text-sm text-zinc-600 hover:text-sanat-yellow">Müzik Bölümü</a>
                <a href="kurslar.html#dans" class="text-sm text-zinc-600 hover:text-sanat-yellow">Dans Akademisi</a>
                <a href="kurslar.html#tiyatro" class="text-sm text-zinc-600 hover:text-sanat-yellow">Tiyatro</a>
                <a href="kurslar.html#resim" class="text-sm text-zinc-600 hover:text-sanat-yellow">Resim Atölyesi</a>
                <a href="kurslar.html#cocuk" class="text-sm text-zinc-600 hover:text-sanat-yellow">Çocuk Akademisi</a>
            </div>
            <div class="border-t border-zinc-100 my-1"></div>
            <a class="text-zinc-800 hover:text-sanat-yellow py-1" href="egitmenler.html">Eğitmenler</a>
            <a class="text-zinc-800 hover:text-sanat-yellow py-1" href="galeri.html">Galeri</a>
            <a class="text-zinc-800 hover:text-sanat-yellow py-1" href="hakkimizda.html">Kurumsal / Hakkımızda</a>
            <a class="text-zinc-800 hover:text-sanat-yellow py-1" href="iletisim.html">İletişim</a>
            <a class="bg-sanat-yellow text-white font-bold px-6 py-3 rounded-lg text-center mt-2 shadow-md shadow-sanat-yellow/10" href="kayit.html">Kayıt Ol</a>
        </div>
    </div>
</header>`;

        if (content.match(topBarRegex)) {
            content = content.replace(topBarRegex, newNav);
        } else {
            content = content.replace(navRegex, newNav);
        }
        
        // 3. Replace Footer
        const footerRegex = /<!-- Footer -->[\s\S]*?<\/footer>/;
        const newFooter = `<!-- Footer -->
<footer class="bg-zinc-950 text-zinc-400 py-16 border-t border-white/5">
    <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-12">
        <!-- Brand -->
        <div class="space-y-4">
            <a class="flex items-center gap-3" href="index.html">
                <img alt="KDS Akademi logosu" class="h-10 w-10 object-contain rounded-xl" src="assets/img/kds-logo.jpg"/>
                <span class="text-base font-extrabold text-white tracking-widest">KDS AKADEMİ</span>
            </a>
            <p class="text-xs leading-relaxed text-zinc-400">
                Konya'da müzik, dans ve tiyatro alanlarında sanatsal mükemmelliği geliştiriyoruz. Çok disiplinli eğitim anlayışımızla her yaştan sanatsevere kapılarımızı açıyoruz.
            </p>
        </div>
        <!-- Kurumsal -->
        <div>
            <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-6">Kurumsal</h4>
            <div class="flex flex-col gap-3 text-xs">
                <a href="hakkimizda.html" class="hover:text-sanat-yellow transition-colors">Hakkımızda</a>
                <a href="egitmenler.html" class="hover:text-sanat-yellow transition-colors">Eğitmenler</a>
                <a href="galeri.html" class="hover:text-sanat-yellow transition-colors">Galeri</a>
                <a href="iletisim.html" class="hover:text-sanat-yellow transition-colors">İletişim</a>
                <a href="gizlilik-politikasi.html" class="hover:text-sanat-yellow transition-colors">Gizlilik Politikası</a>
            </div>
        </div>
        <!-- Departmanlar -->
        <div>
            <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-6">Departmanlar</h4>
            <div class="flex flex-col gap-3 text-xs">
                <a href="kurslar.html#dans" class="hover:text-sanat-yellow transition-colors">Dans Akademisi</a>
                <a href="kurslar.html#muzik" class="hover:text-sanat-yellow transition-colors">Müzik Bölümü</a>
                <a href="kurslar.html#tiyatro" class="hover:text-sanat-yellow transition-colors">Tiyatro ve Oyunculuk</a>
                <a href="kurslar.html#resim" class="hover:text-sanat-yellow transition-colors">Görsel Sanatlar</a>
                <a href="kurslar.html#cocuk" class="hover:text-sanat-yellow transition-colors">Çocuk Akademisi</a>
            </div>
        </div>
        <!-- İletişim -->
        <div>
            <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-6">İletişim</h4>
            <div class="text-xs space-y-4">
                <p>
                    <strong>Adres:</strong><br/>
                    En Tepe Mall Ofis, B Blok 117/303<br/>
                    Kalenderhane, Karatay / Konya
                </p>
                <p>
                    <strong>Telefon:</strong><br/>
                    <a href="tel:+905419050042" class="hover:text-sanat-yellow transition-colors">+90 (541) 905 00 42</a>
                </p>
            </div>
        </div>
    </div>
    
    <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-12 pt-8 border-t border-white/5 text-center text-xs text-zinc-500">
        <p>© 2026 KDS Akademi - Konya Dans ve Sanat Akademisi. Tüm hakları saklıdır. Karatay, Konya.</p>
    </div>
</footer>`;

        content = content.replace(footerRegex, newFooter);
        
        // 4. Update body class and button classes in content to yellow theme
        content = content.replace('bg-background text-on-background', 'bg-white text-zinc-900');
        content = content.replace('selection:bg-kds-pink selection:text-white', 'selection:bg-sanat-yellow selection:text-white');
        content = content.replace('selection:bg-sanat-yellow selection:text-zinc-950', 'selection:bg-sanat-yellow selection:text-white');
        content = content.replace('style="color:#B03B4D"', 'style="color:#8B263E"');
        content = content.replace('style="color:#8B263E"', 'style="color:#8B263E"');
        content = content.replace('btn-pill-pink', 'btn-pill-yellow bg-zinc-950 text-white font-bold hover:bg-zinc-900');
        content = content.replace('hover:border-kds-pink/30', 'hover:border-sanat-yellow/40');
        content = content.replace('btn-nav-register', 'btn-nav-register bg-sanat-yellow text-white font-bold');
        content = content.replace('badge-dance bg-sanat-yellow text-zinc-950', 'badge-dance bg-sanat-yellow text-white');
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    });
    
    console.log('All course pages have been updated successfully!');
});
