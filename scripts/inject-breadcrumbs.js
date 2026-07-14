const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const breadcrumbs = {
    'egitmenler.html': `
<!-- Breadcrumb -->
<div class="bg-zinc-50 border-b border-zinc-200/50 py-4 px-margin-mobile md:px-margin-desktop text-xs text-zinc-500 text-left">
    <div class="max-w-container-max mx-auto flex items-center gap-2">
        <a href="index.html" class="hover:text-sanat-yellow transition-colors flex items-center gap-1"><span class="material-symbols-outlined text-sm">home</span> Anasayfa</a>
        <span class="material-symbols-outlined text-[12px]">chevron_right</span>
        <span class="text-zinc-500 font-medium">Kurumsal</span>
        <span class="material-symbols-outlined text-[12px]">chevron_right</span>
        <span class="text-zinc-900 font-medium">Eğitmenler</span>
    </div>
</div>`,
    'gizlilik-politikasi.html': `
<!-- Breadcrumb -->
<div class="bg-zinc-50 border-b border-zinc-200/50 py-4 px-margin-mobile md:px-margin-desktop text-xs text-zinc-500 text-left">
    <div class="max-w-container-max mx-auto flex items-center gap-2">
        <a href="index.html" class="hover:text-sanat-yellow transition-colors flex items-center gap-1"><span class="material-symbols-outlined text-sm">home</span> Anasayfa</a>
        <span class="material-symbols-outlined text-[12px]">chevron_right</span>
        <span class="text-zinc-500 font-medium">Kullanım Şartları</span>
        <span class="material-symbols-outlined text-[12px]">chevron_right</span>
        <span class="text-zinc-900 font-medium">Gizlilik Politikası</span>
    </div>
</div>`,
    'iletisim.html': `
<!-- Breadcrumb -->
<div class="bg-zinc-50 border-b border-zinc-200/50 py-4 px-margin-mobile md:px-margin-desktop text-xs text-zinc-500 text-left">
    <div class="max-w-container-max mx-auto flex items-center gap-2">
        <a href="index.html" class="hover:text-sanat-yellow transition-colors flex items-center gap-1"><span class="material-symbols-outlined text-sm">home</span> Anasayfa</a>
        <span class="material-symbols-outlined text-[12px]">chevron_right</span>
        <span class="text-zinc-900 font-medium">İletişim</span>
    </div>
</div>`,
    'kayit.html': `
<!-- Breadcrumb -->
<div class="bg-zinc-50 border-b border-zinc-200/50 py-4 px-margin-mobile md:px-margin-desktop text-xs text-zinc-500 text-left">
    <div class="max-w-container-max mx-auto flex items-center gap-2">
        <a href="index.html" class="hover:text-sanat-yellow transition-colors flex items-center gap-1"><span class="material-symbols-outlined text-sm">home</span> Anasayfa</a>
        <span class="material-symbols-outlined text-[12px]">chevron_right</span>
        <span class="text-zinc-900 font-medium">Ön Kayıt Formu</span>
    </div>
</div>`,
    'kurslar.html': `
<!-- Breadcrumb -->
<div class="bg-zinc-50 border-b border-zinc-200/50 py-4 px-margin-mobile md:px-margin-desktop text-xs text-zinc-500 text-left">
    <div class="max-w-container-max mx-auto flex items-center gap-2">
        <a href="index.html" class="hover:text-sanat-yellow transition-colors flex items-center gap-1"><span class="material-symbols-outlined text-sm">home</span> Anasayfa</a>
        <span class="material-symbols-outlined text-[12px]">chevron_right</span>
        <span class="text-zinc-900 font-medium">Kurslar</span>
    </div>
</div>`
};

console.log('Injecting breadcrumbs into core pages...');

Object.keys(breadcrumbs).forEach(file => {
    const filePath = path.join(rootDir, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('Breadcrumb')) {
        console.log(`- ${file}: Breadcrumb already exists, skipping.`);
        return;
    }
    
    // Find </header> tag and inject
    if (content.includes('</header>')) {
        content = content.replace('</header>', `</header>${breadcrumbs[file]}`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`- ${file}: Breadcrumb injected successfully.`);
    } else {
        console.log(`- ${file}: Error - </header> tag not found.`);
    }
});

console.log('Breadcrumb injection completed!');
