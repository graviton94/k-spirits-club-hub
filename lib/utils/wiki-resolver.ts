import { SpiritCategory } from '../constants/wiki/types';

/**
 * Server-only Wiki Resolver
 * 
 * This utility uses dynamic imports to ensure that the Edge Runtime (Cloudflare)
 * ONLY bundles/loads the specific wiki category requested, rather than the 
 * entire 1MB+ wiki dataset.
 */

// Mapping of slugs to their respective static data files
const WIKI_LOADERS: Record<string, () => Promise<any>> = {
    'whisky': () => import('../constants/wiki/whisky'),
    'blended-whisky': () => import('../constants/wiki/blended-whisky'),
    'single-malt': () => import('../constants/wiki/single-malt'),
    'bourbon': () => import('../constants/wiki/bourbon'),
    'grain-whisky': () => import('../constants/wiki/grain-whisky'),
    'cognac': () => import('../constants/wiki/cognac'),
    'brandy': () => import('../constants/wiki/brandy'),
    'champagne': () => import('../constants/wiki/champagne'),
    'sake': () => import('../constants/wiki/sake'),
    'soju-distilled': () => import('../constants/wiki/soju-distilled'),
    'soju-diluted': () => import('../constants/wiki/soju-diluted'),
    'gin': () => import('../constants/wiki/gin'),
    'rum': () => import('../constants/wiki/rum'),
    'vodka': () => import('../constants/wiki/vodka'),
    'tequila': () => import('../constants/wiki/tequila'),
    'wine': () => import('../constants/wiki/wine'),
    'red-wine': () => import('../constants/wiki/red-wine'),
    'white-wine': () => import('../constants/wiki/white-wine'),
    'mezcal': () => import('../constants/wiki/mezcal'),
    'liqueur': () => import('../constants/wiki/liqueur'),
    'baijiu': () => import('../constants/wiki/baijiu'),
    'beer': () => import('../constants/wiki/beer'),
    'yakju': () => import('../constants/wiki/yakju'),
    'cheongju': () => import('../constants/wiki/cheongju'),
    'makgeolli': () => import('../constants/wiki/makgeolli'),
    'shochu': () => import('../constants/wiki/shochu'),
    'oak-barrel': () => import('../constants/wiki/oak-barrel'),
    'cheongju-vs-sake': () => import('../constants/wiki/cheongju-vs-sake'),
    'yakju-vs-cheongju': () => import('../constants/wiki/yakju-vs-cheongju'),
    'single-malt-vs-blended': () => import('../constants/wiki/single-malt-vs-blended'),
    
    // SEO Hubs
    'soju-guide': () => import('../constants/wiki/soju-guide'),
    'makgeolli-guide': () => import('../constants/wiki/makgeolli-guide'),
    'korean-whisky': () => import('../constants/wiki/korean-whisky'),
    'korean-traditional-spirits': () => import('../constants/wiki/korean-traditional-spirits'),
    'korean-spirits-by-abv': () => import('../constants/wiki/korean-spirits-by-abv'),
    
    // Regions
    'scotch-whisky-regions': () => import('../constants/wiki/scotch-whisky-regions'),
    'us-whiskey-regions': () => import('../constants/wiki/us-whiskey-regions'),
    'brandy-regions': () => import('../constants/wiki/brandy-regions'),
    'red-wine-regions': () => import('../constants/wiki/red-wine-regions'),
    'white-wine-regions': () => import('../constants/wiki/white-wine-regions'),
};

// Inline Category Hubs (Tiny)
const STATIC_HUBS: Record<string, SpiritCategory> = {
    'red-grape': {
        slug: 'red-grape',
        emoji: '🍷',
        nameKo: '레드 와인 포도 품종',
        nameEn: 'Red Wine Grape Varieties',
        taglineKo: '카베르네 소비뇽, 피노 누아 등 레드 와인의 주역들',
        taglineEn: 'Master varieties of red wine: Cabernet, Pinot, and more',
        color: 'rose',
    },
    'white-grape': {
        slug: 'white-grape',
        emoji: '🥂',
        nameKo: '화이트 와인 포도 품종',
        nameEn: 'White Wine Grape Varieties',
        taglineKo: '샤르도네, 소비뇽 블랑 등 화이트 와인의 정수',
        taglineEn: 'Essential white wine grapes: Chardonnay, Sauvignon, and more',
        color: 'emerald',
    }
};

const WIKI_CACHE_TTL_MS = 5 * 60 * 1000;
const WIKI_CACHE_MAX_ENTRIES = 64;
const WIKI_CATEGORY_CACHE = new Map<string, { value: Promise<SpiritCategory | null>; expiresAt: number }>();

/**
 * Resolves a full Wiki Category by its slug.
 * Returns only the requested category as a clean SpiritCategory object.
 */
export async function resolveWikiCategory(slug: string): Promise<SpiritCategory | null> {
    // 1. Check static tiny hubs
    if (STATIC_HUBS[slug]) return STATIC_HUBS[slug];

    // 2. Try to load from dynmic loaders
    const loader = WIKI_LOADERS[slug];
    if (!loader) return null;

    const now = Date.now();
    const cached = WIKI_CATEGORY_CACHE.get(slug);
    if (cached && cached.expiresAt > now) {
        return cached.value;
    }
    if (cached) {
        WIKI_CATEGORY_CACHE.delete(slug);
    }

    const loadingPromise = (async () => {
        try {
            const module = await loader();
            // The export name in the wiki files matches the camelCase name of the variable.
            // E.g. blended-whisky.ts exports 'blendedWhisky'.
            // To be safe and generic, we look for any export that looks like a SpiritCategory.
            const categoryData = Object.values(module).find(
                (val: any) => val && typeof val === 'object' && val.slug === slug
            );

            return (categoryData as SpiritCategory) || null;
        } catch (error) {
            console.error(`[WikiResolver] Failed to load wiki for slug: ${slug}`, error);
            return null;
        }
    })();

    if (WIKI_CATEGORY_CACHE.size >= WIKI_CACHE_MAX_ENTRIES) {
        let evictionKey: string | null = null;
        let minExpiresAt = Number.POSITIVE_INFINITY;
        for (const [key, entry] of WIKI_CATEGORY_CACHE.entries()) {
            if (entry.expiresAt < minExpiresAt) {
                minExpiresAt = entry.expiresAt;
                evictionKey = key;
            }
        }
        if (evictionKey) {
            WIKI_CATEGORY_CACHE.delete(evictionKey);
        }
    }

    WIKI_CATEGORY_CACHE.set(slug, {
        value: loadingPromise,
        expiresAt: now + WIKI_CACHE_TTL_MS,
    });

    return loadingPromise;
}
