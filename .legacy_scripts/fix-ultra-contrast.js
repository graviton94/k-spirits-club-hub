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
        // High visibility strategy:
        // Light mode: Strong background (600), White text
        // Dark mode: Deep dim background (900/40), Light text (100)

        let lightBg = '600';
        let lightText = 'white';
        let darkBg = '900/40';
        let darkText = '100';

        // Adjustments for specific colors if needed
        if (color === 'yellow' || color === 'lime') {
            lightBg = '500'; // 600 yellow can be a bit muddy
            lightText = 'zinc-950'; // White on bright yellow is bad
        }

        const newVal = `color: 'bg-${color}-${lightBg} text-${lightText} dark:bg-${color}-${darkBg} dark:text-${color}-${darkText}'`;

        if (match !== newVal) modified = true;
        return newVal;
    });

    if (modified) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${f} with ULTRA contrast`);
    }
});
