const fs = require('fs');
const path = require('path');

const dir = 'c:/k-spirits-club-hub/lib/constants/wiki';
const files = fs.readdirSync(dir).filter(f => f.endsWith('-regions.ts'));

files.forEach(f => {
    const file = path.join(dir, f);
    let content = fs.readFileSync(file, 'utf8');

    // color: 'bg-stone-800/20 text-zinc-950 dark:text-stone-200'
    // -> color: 'bg-stone-500/10 text-stone-900 dark:bg-stone-500/20 dark:text-stone-200'
    // To make it beautiful in Light mode: bg-[color]-500/10 text-[color]-900
    // To make it beautiful in Dark mode: dark:bg-[color]-500/20 dark:text-[color]-200

    // We will find all lines matching: color: 'bg-([a-z]+)-(\d+)\/20 text-zinc-950 dark:text-([a-z]+)-(\d+)'
    content = content.replace(/color:\s*'bg-([a-z]+)-\d+\/20\s+text-zinc-950\s+dark:text-[a-z]+-\d+'/g, (match, color) => {
        // Special case for stone/slate/zinc/gray etc
        let textShade = '900';
        let darkTextShade = '200';
        if (color === 'yellow' || color === 'lime') {
            textShade = '800'; // 900 can be muddy for yellow/lime
        }

        return `color: 'bg-${color}-500/10 text-${color}-${textShade} dark:bg-${color}-500/20 dark:text-${color}-${darkTextShade}'`;
    });

    fs.writeFileSync(file, content);
    console.log(`Updated ${f}`);
});
