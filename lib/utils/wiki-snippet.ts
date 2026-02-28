import { SPIRIT_CATEGORIES } from '@/lib/constants/spirits-guide-data';

export interface WikiSnippet {
    title: string;
    content: string;
    link: string;
}

export function getRandomWikiSnippet(lang: string): WikiSnippet | null {
    const isEn = lang === 'en';
    const possibleSnippets: WikiSnippet[] = [];

    SPIRIT_CATEGORIES.forEach(cat => {
        const baseLink = `/${lang}/contents/wiki/${cat.slug}`;

        if (cat.sections?.definition) {
            possibleSnippets.push({
                title: isEn ? `What is ${cat.nameEn}?` : `${cat.nameKo}(이)란?`,
                content: cat.sections.definition,
                link: baseLink
            });
        }

        if (cat.sections?.classifications) {
            cat.sections.classifications.forEach(c => {
                possibleSnippets.push({
                    title: isEn ? `What is ${c.name}?` : `${c.name}(이)란?`,
                    content: c.description,
                    link: baseLink
                });
            });
        }

        if (cat.sections?.servingGuidelines?.methods) {
            cat.sections.servingGuidelines.methods.forEach(m => {
                possibleSnippets.push({
                    title: isEn ? `How to enjoy ${cat.nameEn} - ${m.name}` : `${cat.nameKo} 즐기는 법 - ${m.name}`,
                    content: m.description,
                    link: baseLink
                });
            });
        }
    });

    if (possibleSnippets.length === 0) return null;

    // Use current date to seed the random selection so it stays consistent per day
    // This maintains SEO stability while still giving variety over time
    // If you prefer strictly random per request, omit the date seeding.
    // We'll use a simple daily hash.
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

    // Simple hash function for the date string
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        const char = dateString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }

    // Ensure positive index
    const index = Math.abs(hash) % possibleSnippets.length;

    return possibleSnippets[index];
}
