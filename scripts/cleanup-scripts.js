const fs = require('fs');
const path = require('path');
const rootDir = path.join(__dirname, '..');

const files = fs.readdirSync(rootDir).filter(file => file.endsWith('.html') && !file.endsWith('.orig') && file !== 'index.html.orig');

files.forEach(file => {
    const filePath = path.join(rootDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    const parts = content.split('</header>');
    if (parts.length > 1) {
        // Prune only duplicate script tags at the very beginning of parts[1] (immediately after </header>)
        const scriptRegex = /^(\s*<script>\s*function toggleMobileSubmenu[\s\S]*?<\/script>)+/i;
        parts[1] = parts[1].replace(scriptRegex, '');
        
        content = parts.join('</header>');
    }
    
    // Also clean up any leading duplicate stylesheet links before the top bar
    const cleanContent = content.replace(/^(\s*<link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.5\.1\/css\/all\.min\.css"\/>\s*<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Material\+Symbols\+Outlined:wght,FILL@100\.\.700,0\.\.1&display=swap" rel="stylesheet"\/>)+/i, '');
    
    fs.writeFileSync(filePath, cleanContent, 'utf8');
});

console.log('Safe cleanup completed successfully!');
