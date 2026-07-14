const fs = require('fs');
const path = require('path');

const kayitPath = path.join(__dirname, '..', 'kayit.html');

if (fs.existsSync(kayitPath)) {
    let content = fs.readFileSync(kayitPath, 'utf8');
    
    // 1. Replace hex colors
    content = content.replace(/#fdb744/gi, '#8B263E');
    
    // 2. Replace rgba colors
    content = content.replace(/rgba\(253,183,68,/gi, 'rgba(139,38,62,');
    
    // 3. Fix text contrast on active step dot
    content = content.replace(
        /\.progress-step-dot\.active\s*\{([\s\S]*?)color:\s*#000;([\s\S]*?)\}/,
        '.progress-step-dot.active {$1color: #fff;$2}'
    );
    
    // 4. Fix text contrast on done step dot
    content = content.replace(
        /\.progress-step-dot\.done\s*\{([\s\S]*?)color:\s*#000;([\s\S]*?)\}/,
        '.progress-step-dot.done {$1color: #8B263E;$2}'
    );
    
    // 5. Fix text contrast on selected age pill
    content = content.replace(
        /\.age-pill\.selected\s*\{([\s\S]*?)color:\s*#000;([\s\S]*?)\}/,
        '.age-pill.selected {$1color: #fff;$2}'
    );
    
    // 6. Fix text contrast on Next Button
    content = content.replace(
        /\.btn-next\s*\{([\s\S]*?)color:\s*#000;([\s\S]*?)\}/,
        '.btn-next {$1color: #fff;$2}'
    );
    
    // 7. Fix selected dept name text color
    content = content.replace(
        /\.dept-card\.selected\s*\.dept-name\s*\{\s*color:\s*#000;\s*\}/,
        '.dept-card.selected .dept-name { color: #8B263E; }'
    );
    
    // 8. Fix summary chip text color
    content = content.replace(
        /\.summary-chip\s*\{([\s\S]*?)color:\s*#000;([\s\S]*?)\}/,
        '.summary-chip {$1color: #8B263E;$2}'
    );
    
    fs.writeFileSync(kayitPath, content, 'utf8');
    console.log('Successfully updated registration wizard styles in kayit.html to KDS Burgundy theme!');
} else {
    console.log('kayit.html not found!');
}
