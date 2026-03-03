import fs from 'fs';

interface SpiritData {
    id: string;
    description_ko?: string;
    description_en?: string;
    imageUrl?: string;
}

function run() {
    try {
        const rawData = fs.readFileSync('scripts/normalization_results.json', 'utf8');
        const data: Record<string, SpiritData> = JSON.parse(rawData);

        const spirits = Object.values(data);
        const thin = spirits.find(s => !s.description_ko || s.description_ko.length < 50);

        if (thin) {
            console.log(`Found thin spirit (Tier B): ${thin.id}`);
            // Also log a normal spirit for Tier A
            const thick = spirits.find(s => s.description_ko && s.description_ko.length >= 300 && s.imageUrl);
            if (thick) {
                console.log(`Found thick spirit (Tier A): ${thick.id}`);
            }
        } else {
            console.log('No thin spirits found.');
        }
    } catch (err) {
        console.error('Error reading JSON:', err);
    }
}

run();
