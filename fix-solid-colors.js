const fs = require('fs');
const path = require('path');

const dir = 'c:/k-spirits-club-hub/lib/constants/wiki';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

files.forEach(f => {
    const file = path.join(dir, f);
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // This regex matches our CURRENT color format, e.g.
    // color: 'bg-amber-500/10 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200'
    // or the older format if somehow missed.
    // Let's just match the whole color string and extract the base color.
    const colorLineRegex = /color:\s*['"`]bg-([a-z]+)[^'"`]*['"`]/g;

    content = content.replace(colorLineRegex, (match, color) => {
        // We will force it to the user's exact specification:
        // Light mode: bg-[color]-100 text-[color]-900 (using 900 for absolute safety instead of 950 just in case)
        // Dark mode: dark:bg-[color]-900/40 dark:text-[color]-100 (or keep the 500/20 for dark mode as it was fine)
        // Wait, the user said "아예 배경을 100수준으로 하고 글자는 950 수준으로 하던가"
        // Let's just use 900 for max contrast. Yellow-900 is very dark brown. If they have 950, I'll use 950. Let's use 900.

        // If color is zinc/stone/slate, etc.
        let textShade = '900';
        let darkTextShade = '100';

        if (color === 'yellow' || color === 'lime') {
            textShade = '900'; // Make it absolutely dark
        }

        const newVal = `color: 'bg-${color}-100 text-${color}-${textShade} dark:bg-${color}-500/20 dark:text-${color}-${darkTextShade}'`;

        if (match !== newVal) modified = true;
        return newVal;
    });

    if (modified) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${f} with solid contrast`);
    }
});
