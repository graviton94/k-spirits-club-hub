const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const images = ['mys(1).png', 'mys(2).png', 'mys(3).png', 'mys(4).png', 'mys(5).png', 'background(1).png', 'background(2).png'];

async function convertToWebP() {
    console.log('Starting PNG to WebP conversion...\n');

    for (const image of images) {
        const inputPath = path.join(publicDir, image);
        const outputPath = path.join(publicDir, image.replace('.png', '.webp'));

        if (!fs.existsSync(inputPath)) {
            console.log(`❌ ${image} not found, skipping...`);
            continue;
        }

        try {
            const inputStats = fs.statSync(inputPath);

            await sharp(inputPath)
                .webp({ quality: 85 }) // 85% quality for good balance
                .toFile(outputPath);

            const outputStats = fs.statSync(outputPath);
            const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

            console.log(`✅ ${image} → ${image.replace('.png', '.webp')}`);
            console.log(`   Original: ${(inputStats.size / 1024).toFixed(2)} KB`);
            console.log(`   WebP: ${(outputStats.size / 1024).toFixed(2)} KB`);
            console.log(`   Reduction: ${reduction}%\n`);
        } catch (error) {
            console.error(`❌ Error converting ${image}:`, error.message);
        }
    }

    console.log('✨ Conversion complete!');
}

convertToWebP().catch(console.error);
