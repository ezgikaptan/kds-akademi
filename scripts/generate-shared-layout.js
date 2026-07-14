const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const partialsDir = path.join(rootDir, 'partials');

const headerPath = path.join(partialsDir, 'header.html');
const footerPath = path.join(partialsDir, 'footer.html');

if (!fs.existsSync(headerPath) || !fs.existsSync(footerPath)) {
    console.error('Header or Footer partial missing!');
    process.exit(1);
}

const rawHeader = fs.readFileSync(headerPath, 'utf8');
const rawFooter = fs.readFileSync(footerPath, 'utf8');

// Find all HTML files in the root folder
const files = fs.readdirSync(rootDir).filter(file => {
    return file.endsWith('.html') && !file.endsWith('.orig') && file !== 'index.html.orig';
});

console.log(`Compiling layouts for ${files.length} HTML files...`);

files.forEach(file => {
    const filePath = path.join(rootDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Determine active nav item state
    const isActive = (menu) => {
        if (menu === 'home' && file === 'index.html') {
            return 'text-zinc-900 active font-bold';
        }
        if (menu === 'kurslar' && (file === 'kurslar.html' || file.startsWith('kurs-'))) {
            return 'text-zinc-900 active font-bold';
        }
        if (menu === 'kurumsal' && [
            'hakkimizda.html', 'kurucumuz.html', 'akademimiz.html', 'tv-programlari.html',
            'gazete-haberleri.html', 'dergi-roportajlari.html', 'tanitim-videolari.html',
            'fotograf-albumleri.html', 'cocuk-basari-hikayeleri.html', 'yetiskin-basari-hikayeleri.html',
            'cocuk-ogrenci-yorumlari.html', 'yetiskin-ogrenci-yorumlari.html', 'etkinlikler.html',
            'bizden-haberler.html', 'projeler.html', 'dokumanlar.html', 'is-ilanlari.html',
            'staj-ilanlari.html', 'kvkk.html', 'site-kullanim-sartlari.html'
        ].includes(file)) {
            return 'text-zinc-900 active font-bold';
        }
        if (menu === 'galeri' && file === 'galeri.html') {
            return 'text-zinc-900 active font-bold';
        }
        if (menu === 'iletisim' && file === 'iletisim.html') {
            return 'text-zinc-900 active font-bold';
        }
        return 'text-zinc-700';
    };
    
    let compiledHeader = rawHeader
        .replace(/{{activeHome}}/g, isActive('home'))
        .replace(/{{activeKurslar}}/g, isActive('kurslar'))
        .replace(/{{activeKurumsal}}/g, isActive('kurumsal'))
        .replace(/{{activeGaleri}}/g, isActive('galeri'))
        .replace(/{{activeIletisim}}/g, isActive('iletisim'));
        
    // 2. Replace Header block in HTML file
    const headerRegex = /(<!-- Top Bar -->|<!-- Header \/ Nav -->)[\s\S]*?<\/header>/;
    if (content.match(headerRegex)) {
        content = content.replace(headerRegex, compiledHeader);
    } else {
        // If no placeholder, insert after <body> tag
        const bodyRegex = /<body[^>]*>/;
        const bodyMatch = content.match(bodyRegex);
        if (bodyMatch) {
            content = content.replace(bodyRegex, `${bodyMatch[0]}\n${compiledHeader}`);
        }
    }
    
    // 3. Replace Footer block in HTML file
    const footerRegex = /<!-- Footer -->[\s\S]*?<\/footer>/;
    if (content.match(footerRegex)) {
        content = content.replace(footerRegex, rawFooter);
    } else {
        // If no placeholder, insert before </body> tag
        content = content.replace('</body>', `${rawFooter}\n</body>`);
    }
    
    // 4. Update Contrast in badges/texts (bg-sanat-yellow text-zinc-950) -> (bg-sanat-yellow text-white)
    content = content.replace(/text-zinc-950 bg-sanat-yellow/g, 'bg-sanat-yellow text-white');
    content = content.replace(/bg-sanat-yellow text-zinc-950/g, 'bg-sanat-yellow text-white');
    content = content.replace(/selection:bg-sanat-yellow selection:text-zinc-950/g, 'selection:bg-sanat-yellow selection:text-white');
    
    fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Layout compilation completed successfully for all pages!');
