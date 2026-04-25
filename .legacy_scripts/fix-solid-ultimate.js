const fs = require('fs');
const path = require('path');

const dir = 'c:/k-spirits-club-hub/lib/constants/wiki';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

files.forEach(f => {
    const file = path.join(dir, f);
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Match any color string starting with bg-[color]
    const colorLineRegex = /color:\s*['"`]bg-([a-z]+)[^'"`]*['"`]/g;

    content = content.replace(colorLineRegex, (match, color) => {
        // ULTIMATE SOLID CONTRAST STRATEGY:
        // Light mode: Solid deep background (600 or 700), White/Very Light text
        // Dark mode: Deep dim background (900/40), Light text (100)

        let lightBg = '600';
        let lightText = 'zinc-50'; // Using zinc-50 for absolute white-ish crispness
        let darkBg = '900/40';
        let darkText = '100';

        // Specific overrides
        if (color === 'yellow' || color === 'lime') {
            lightBg = '400'; // Pure bright background
            lightText = 'zinc-950'; // Black text on yellow/lime
        } else if (color === 'stone' || color === 'zinc' || color === 'gray' || color === 'slate') {
            lightBg = '700'; // Darker for neutral colors
        } else if (color === 'amber' || color === 'orange') {
            lightBg = '600';
        }

        const newVal = `color: 'bg-${color}-${lightBg} text-${lightText} dark:bg-${color}-${darkBg} dark:text-${color}-${darkText}'`;

        if (match !== newVal) modified = true;
        return newVal;
    });

    if (modified) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${f} with SOLID contrast`);
    }
});
