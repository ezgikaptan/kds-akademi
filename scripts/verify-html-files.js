const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const files = fs.readdirSync(rootDir).filter(file => {
    return file.endsWith('.html') && !file.endsWith('.orig') && file !== 'index.html.orig';
});

console.log(`Checking ${files.length} HTML files...`);

const results = [];

files.forEach(file => {
    const filePath = path.join(rootDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Checks
    const hasHeader = content.includes('top-bar-2') && content.includes('<header') && content.includes('KDS Akademi Logo');
    const hasMegaMenu = content.includes('id="mega-menu-desktop"');
    
    // Breadcrumb: index.html and 404.html don't need breadcrumbs
    const needsBreadcrumb = file !== 'index.html' && file !== '404.html';
    const hasBreadcrumb = content.toLowerCase().includes('breadcrumb') || content.includes('chevron_right');
    
    // Content sections count
    const sectionCount = (content.match(/<section/g) || []).length;
    const blockCount = (content.match(/<!-- [\s\S]*?Section -->/g) || []).length;
    const totalSections = Math.max(sectionCount, blockCount);
    
    // CTA check
    const hasCTA = content.includes('kayit.html') || content.includes('wa.me/905419050042');
    
    // Footer check
    const hasFooter = content.includes('<footer') && content.includes('Tüm hakları saklıdır');
    
    // Mobile classes
    const hasMobile = content.includes('mobile-menu') && content.includes('mobile-menu-btn');
    
    // Check local broken links
    const hrefs = [];
    const hrefRegex = /href="([^"]+)"/g;
    let match;
    const brokenLinks = [];
    
    while ((match = hrefRegex.exec(content)) !== null) {
        let href = match[1];
        if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http') || href.startsWith('#')) {
            continue;
        }
        // Remove hash / query
        href = href.split('#')[0].split('?')[0];
        if (!href) continue;
        
        const targetPath = path.join(rootDir, href);
        if (!fs.existsSync(targetPath)) {
            brokenLinks.push(href);
        }
    }
    
    // Mock content required & present
    const isMockRequired = [
        'tv-programlari.html', 'gazete-haberleri.html', 'dergi-roportajlari.html',
        'cocuk-basari-hikayeleri.html', 'yetiskin-basari-hikayeleri.html',
        'cocuk-ogrenci-yorumlari.html', 'yetiskin-ogrenci-yorumlari.html',
        'etkinlikler.html', 'bizden-haberler.html', 'projeler.html', 'dokumanlar.html',
        'is-ilanlari.html', 'staj-ilanlari.html'
    ].includes(file) || file.startsWith('kurs-');
    
    const hasMockComment = content.includes('MOCK CONTENT');
    
    results.push({
        file,
        hasHeader: hasHeader ? 'Evet' : 'HAYIR',
        hasMegaMenu: hasMegaMenu ? 'Evet' : 'HAYIR',
        hasBreadcrumb: (needsBreadcrumb ? (hasBreadcrumb ? 'Evet' : 'HAYIR') : 'N/A'),
        totalSections,
        hasCTA: hasCTA ? 'Evet' : 'HAYIR',
        hasFooter: hasFooter ? 'Evet' : 'HAYIR',
        hasMobile: hasMobile ? 'Evet' : 'HAYIR',
        brokenLinks: brokenLinks.length > 0 ? brokenLinks.join(', ') : 'Yok',
        mockStatus: isMockRequired ? (hasMockComment ? 'Evet (Yorumlu)' : 'Gerekli/Eksik') : 'Gerekmiyor'
    });
});

// Format as markdown table
console.log('\n--- VERIFICATION REPORT ---\n');
console.log('| Dosya Adı | Yeni Header? | Mega Menü? | Breadcrumb? | Bölüm Sayısı | CTA? | Yeni Footer? | Mobil? | Kırık Linkler | Mock Durumu |');
console.log('|---|---|---|---|---|---|---|---|---|---|');
results.forEach(r => {
    console.log(`| ${r.file} | ${r.hasHeader} | ${r.hasMegaMenu} | ${r.hasBreadcrumb} | ${r.totalSections} | ${r.hasCTA} | ${r.hasFooter} | ${r.hasMobile} | ${r.brokenLinks} | ${r.mockStatus} |`);
});
console.log('\n--- END OF REPORT ---\n');
