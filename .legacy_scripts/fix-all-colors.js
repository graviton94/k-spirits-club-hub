const fs = require('fs');
const path = require('path');

const dir = 'c:/k-spirits-club-hub/lib/constants/wiki';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

files.forEach(f => {
    const file = path.join(dir, f);
    let content = fs.readFileSync(file, 'utf8');

    let modified = false;

    // We will find all lines matching: color: 'bg-([a-z]+)-(\d+)\/20 text-zinc-950 dark:text-([a-z]+)-(\d+)'
    // Sometimes the class might be slightly different. Let's make a more robust regex that just replaces the whole color string if it matches the pattern.
    // Basically any string that looks like: "bg-xxx-yyy/20 text-zinc-950 dark:text-xxx-yyy"
    // and turns it into the new format.

    // Regex to match the old format
    const oldRegex = /color:\s*['"`]bg-([a-z]+)-\d+\/(10|20)\s+text-[a-z]+-950\s+dark:text-[a-z]+-\d+['"`]/g;

    // Also match the ones that have already been converted to `bg-xxx-xx text-zinc-950`
    const generalRegex = /color:\s*['"`]bg-([a-z]+)-\d+\/20\s+text-zinc-950\s+dark:text-[a-z]+-\d+['"`]/g;

    // Simplest way: just regex any `color: '[classes]'` and parse it if it has bg-xxx.
    const colorLineRegex = /color:\s*['"`](.*?)['"`]/g;

    content = content.replace(colorLineRegex, (match, classes) => {
        // Find the bg color e.g. bg-amber-600/20
        const bgMatch = classes.match(/bg-([a-z]+)-\d+/);
        if (bgMatch) {
            const color = bgMatch[1];

            // Special cases
            let textShade = '900';
            let darkTextShade = '200';
            if (color === 'yellow' || color === 'lime') {
                textShade = '800'; // 900 can be muddy for yellow/lime
            }

            // Output the beautiful dual-mode format
            const newVal = `color: 'bg-${color}-500/10 text-${color}-${textShade} dark:bg-${color}-500/20 dark:text-${color}-${darkTextShade}'`;
            if (match !== newVal) modified = true;
            return newVal;
        }
        return match;
    });

    if (modified) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${f}`);
    }
});
