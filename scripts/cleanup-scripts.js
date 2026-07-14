const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const files = fs.readdirSync(rootDir).filter(file => {
    return file.endsWith('.html') && !file.endsWith('.orig');
});

console.log(`Cleaning up legacy duplicate scripts in ${files.length} HTML files...`);

files.forEach(file => {
    const filePath = path.join(rootDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // We want to remove any <script>...</script> block that defines toggleMobileSubmenu and is located outside of the header
    // The header is defined before </header>. So let's split the file at </header>
    const parts = content.split('</header>');
    if (parts.length > 1) {
        let afterHeader = parts.slice(1).join('</header>');
        
        // Remove any <script> tag block containing toggleMobileSubmenu
        const scriptParts = afterHeader.split('<script>');
        let cleanedAfterHeader = scriptParts[0];
        for (let i = 1; i < scriptParts.length; i++) {
            const subPart = scriptParts[i];
            if (subPart.includes('toggleMobileSubmenu') && subPart.includes('</script>')) {
                cleanedAfterHeader += subPart.substring(subPart.indexOf('</script>') + 9);
            } else {
                cleanedAfterHeader += '<script>' + subPart;
            }
        }
        afterHeader = cleanedAfterHeader;
        
        content = parts[0] + '</header>' + afterHeader;
        fs.writeFileSync(filePath, content, 'utf8');
    }
});

console.log('Cleanup completed successfully!');
