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
        // CLEAN & VIBRANT STRATEGY:
        // Light mode: Extremely light bg (50), extremely dark text (950), crisp border
        // Dark mode: Muted bg, light text

        // Map some colors to more vibrant counterparts if they are "muddy"
        let baseColor = color;
        if (color === 'stone') baseColor = 'slate';
        if (color === 'amber') baseColor = 'orange'; // Orange is more vibrant than Amber in many palettes

        // We use border to define the shape clearly without "muddy" fills
        const newVal = `color: 'bg-${baseColor}-50 text-${baseColor}-950 border border-${baseColor}-200/50 dark:bg-${baseColor}-950/30 dark:text-${baseColor}-200 dark:border-${baseColor}-800/50'`;

        if (match !== newVal) modified = true;
        return newVal;
    });

    if (modified) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${f} with CLEAN VIBRANT style`);
    }
});
