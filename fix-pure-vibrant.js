const fs = require('fs');
const path = require('path');

const dir = 'c:/k-spirits-club-hub/lib/constants/wiki';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

files.forEach(f => {
    const file = path.join(dir, f);
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    const colorLineRegex = /color:\s*['"`]bg-([a-z]+)[^'"`]*['"`]/g;

    content = content.replace(colorLineRegex, (match, color) => {
        // ENHANCED PURE COLORS (NO TRANSPARENCY, VIBRANT SHADES)
        // Using level 100/200/300 for backgrounds without transparency to avoid "blurry gray"
        // Let's go for level 200/300 backgrounds for more saturation (선명함)

        // Map some colors back to their original names if they were changed
        let baseColor = color;
        if (color === 'slate') baseColor = 'stone';

        // Light mode: Vibrant background (200), dark text (950)
        // Dark mode: Muted dark background, light text
        let lightBg = '200';
        let lightText = '950';

        if (baseColor === 'yellow' || baseColor === 'lime') {
            lightBg = '300'; // Make yellow pop more
        }

        const newVal = `color: 'bg-${baseColor}-${lightBg} text-${baseColor}-${lightText} dark:bg-${baseColor}-900/40 dark:text-${baseColor}-100'`;

        if (match !== newVal) modified = true;
        return newVal;
    });

    if (modified) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${f} with PURE SATURATED style`);
    }
});
