const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const userIconsDir = path.join(__dirname, '../public/icons/user');
const rootIconsDir = path.join(__dirname, '../public/icons');

async function convertDir(directory) {
    if (!fs.existsSync(directory)) {
        console.log(`Directory not found: ${directory}`);
        return;
    }

    const files = fs.readdirSync(directory);
    const jpgFiles = files.filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg'));

    console.log(`Found ${jpgFiles.length} JPG files in ${directory}`);

    for (const file of jpgFiles) {
        const inputPath = path.join(directory, file);
        const outputPath = path.join(directory, file.replace(/\.(jpg|jpeg)$/, '.webp'));

        try {
            await sharp(inputPath)
                .webp({ quality: 80 })
                .toFile(outputPath);

            console.log(`✅ Converted: ${file} -> ${path.basename(outputPath)}`);

            // Delete original
            fs.unlinkSync(inputPath);
            console.log(`🗑️ Deleted original: ${file}`);
        } catch (error) {
            console.error(`❌ Error converting ${file}:`, error);
        }
    }
}

async function main() {
    console.log("Starting conversion to WebP...");
    await convertDir(userIconsDir);
    await convertDir(rootIconsDir); // For icon.jpg
    console.log("Done!");
}

main();
