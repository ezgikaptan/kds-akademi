/*
 * One-off/rerunnable image optimization pass for assets/img.
 * - Hero photo: PNG -> compressed JPEG + WebP (biggest win, was 1.3MB+ as PNG).
 * - Content photos: re-encode JPEG via mozjpeg + generate WebP sibling.
 * Run with: npm run optimize:images
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMG_DIR = path.join(__dirname, '..', 'assets', 'img');

const HERO = { file: 'kds-sahne-performans.png', maxWidth: 1920 };
const CONTENT_PHOTOS = [
    'kds-muzik-eller.jpg',
    'kds-dans-provasi.jpg',
    'kds-tiyatro-provasi.jpg',
    'kds-cocuk-drama.jpg',
    'kds-gala-sahne.jpg',
    'kds-tanitim-kapak.jpg',
    'kds-entepe-mall-bina.jpg'
];

function formatKb(bytes) {
    return (bytes / 1024).toFixed(0) + 'KB';
}

async function optimizeHero() {
    const srcPath = path.join(IMG_DIR, HERO.file);
    const baseName = path.parse(HERO.file).name;
    const originalSize = fs.statSync(srcPath).size;
    const image = sharp(srcPath);
    const meta = await image.metadata();
    const width = Math.min(meta.width, HERO.maxWidth);

    const jpgPath = path.join(IMG_DIR, baseName + '.jpg');
    const webpPath = path.join(IMG_DIR, baseName + '.webp');

    const jpgInfo = await image.clone().resize({ width }).jpeg({ quality: 92, mozjpeg: true }).toFile(jpgPath);
    const webpInfo = await sharp(srcPath).resize({ width }).webp({ quality: 88 }).toFile(webpPath);

    console.log(`${HERO.file}: ${formatKb(originalSize)} (png) -> ${formatKb(jpgInfo.size)} (jpg, ${jpgInfo.width}x${jpgInfo.height}) / ${formatKb(webpInfo.size)} (webp)`);
}

async function optimizeContentPhoto(file) {
    const srcPath = path.join(IMG_DIR, file);
    const baseName = path.parse(file).name;
    const originalSize = fs.statSync(srcPath).size;

    const jpgPath = path.join(IMG_DIR, file);
    const webpPath = path.join(IMG_DIR, baseName + '.webp');

    const buffer = fs.readFileSync(srcPath);
    const jpgInfo = await sharp(buffer).jpeg({ quality: 80, mozjpeg: true }).toBuffer({ resolveWithObject: true });
    fs.writeFileSync(jpgPath, jpgInfo.data);
    const webpInfo = await sharp(buffer).webp({ quality: 80 }).toFile(webpPath);

    console.log(`${file}: ${formatKb(originalSize)} -> ${formatKb(jpgInfo.data.length)} (jpg, ${jpgInfo.info.width}x${jpgInfo.info.height}) / ${formatKb(webpInfo.size)} (webp)`);
}

(async () => {
    await optimizeHero();
    for (const file of CONTENT_PHOTOS) {
        await optimizeContentPhoto(file);
    }
    console.log('Done.');
})();
