const fs = require('fs');
const path = require('path');

const dir = 'c:/k-spirits-club-hub/lib/constants/wiki';

const pairs = [
    { en: 'korean-soju.ts', ko: 'soju-guide-ko.ts' },
    { en: 'makgeolli-guide.ts', ko: 'makgeolli-guide-ko.ts' },
    { en: 'korean-whisky.ts', ko: 'korean-whisky-distilleries-ko.ts' },
    { en: 'korean-traditional-spirits.ts', ko: 'traditional-spirits-ko.ts' },
    { en: 'korean-spirits-by-abv.ts', ko: 'spirits-by-abv-ko.ts' }
];

for (const pair of pairs) {
    const enPath = path.join(dir, pair.en);
    const koPath = path.join(dir, pair.ko);

    let enContent = fs.readFileSync(enPath, 'utf8');
    let koContent = fs.readFileSync(koPath, 'utf8');

    const sectionsIndex = koContent.indexOf('sections: {');

    let braceCount = 0;
    let endIdx = -1;
    for (let i = sectionsIndex; i < koContent.length; i++) {
        if (koContent[i] === '{') braceCount++;
        if (koContent[i] === '}') {
            braceCount--;
            if (braceCount === 0 && sectionsIndex !== -1 && i > sectionsIndex + 10) {
                endIdx = i;
                break;
            }
        }
    }

    if (endIdx === -1) {
        console.error('Failed to parse KO file', koPath);
        continue;
    }

    const koSectionsBlock = koContent.substring(sectionsIndex, endIdx + 1);

    enContent = enContent.replace('sections: {', koSectionsBlock + ',\n    sectionsEn: {');

    fs.writeFileSync(enPath, enContent, 'utf8');
    console.log('Merged', pair.en);
}
