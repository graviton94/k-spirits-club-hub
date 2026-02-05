const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = 'c:/k-spirits-club-hub/Gemini_Generated_Image_ykg4rkykg4rkykg4.jpg';
const outputPath = 'c:/k-spirits-club-hub/public/MBTI/og-mbti.webp';

async function convert() {
    try {
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        await sharp(inputPath)
            .webp({ quality: 85 })
            .toFile(outputPath);

        console.log('Successfully converted image to WebP:', outputPath);
    } catch (err) {
        console.error('Error converting image:', err);
        process.exit(1);
    }
}

convert();
