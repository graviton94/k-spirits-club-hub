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
        // ULTIMATE CLEAN CONTRAST (NO BORDER, NO TRANSPARENCY)
        // Light mode: Vibrant but light background (100 or 200), Ultimate dark text (950)
        // Dark mode: Deep dim background (900/40), Light text (100)

        let lightBg = '100';
        let lightText = '950';

        // Colors that look muddy in 100 often look better in 200
        if (color === 'amber' || color === 'stone' || color === 'orange') {
            lightBg = '200';
        }

        const newVal = `color: 'bg-${color}-${lightBg} text-${color}-${lightText} dark:bg-${color}-900/40 dark:text-${color}-100'`;

        if (match !== newVal) modified = true;
        return newVal;
    });

    if (modified) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${f} with ULTIMATE CLEAN style`);
    }
});
