import type { Locale } from '@/i18n-config';

// We enumerate all dictionaries here for better linting and typescript support
// We also use the 'next/dynamic' or just standard dynamic imports
const dictionaries = {
    ko: () => import('@/dictionaries/ko.json').then((module) => module.default),
    en: () => import('@/dictionaries/en.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale): Promise<any> => {
    // If the dictionary doesn't exist yet, return an empty object to prevent crashes
    try {
        return await dictionaries[locale]();
    } catch (error) {
        console.error(`Failed to load dictionary for locale: ${locale}`, error);
        return {};
    }
};
