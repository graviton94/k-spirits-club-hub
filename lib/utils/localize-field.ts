/**
 * Centralized locale mapping for spirit field values.
 *
 * Handles country names and data source labels that are stored in Korean
 * in the database but must render in the visitor's requested language.
 *
 * Rules:
 * - EN pages: map Korean DB values → English display strings
 * - KO pages: map English DB values → Korean display strings (best-effort)
 * - Unknown / unmapped values fall through as-is so no data is silently lost
 */

import metadata from "../constants/spirits-metadata.json";

// ---------------------------------------------------------------------------
// Category / taxonomy localization
// ---------------------------------------------------------------------------

/**
 * Returns the display label for a spirit category / subcategory key.
 * Looks up display_names_en for English, display_names for Korean.
 */
export function localizeCategory(key: string | null | undefined, lang: string): string {
    if (!key) return '';
    if (lang === 'en') {
        return (metadata as any).display_names_en[key] || key;
    }
    return (metadata as any).display_names[key] || key;
}

// ---------------------------------------------------------------------------
// Country localization
// ---------------------------------------------------------------------------

/** Korean country names → English */
const KO_TO_EN_COUNTRY: Record<string, string> = {
    '대한민국': 'South Korea',
    '한국': 'South Korea',
    '일본': 'Japan',
    '일': 'Japan',          // abbreviated MFDS code occasionally stored as '일'
    '미국': 'United States',
    '영국': 'United Kingdom',
    '스코틀랜드': 'Scotland',
    '아일랜드': 'Ireland',
    '프랑스': 'France',
    '독일': 'Germany',
    '이탈리아': 'Italy',
    '스페인': 'Spain',
    '포르투갈': 'Portugal',
    '멕시코': 'Mexico',
    '캐나다': 'Canada',
    '호주': 'Australia',
    '뉴질랜드': 'New Zealand',
    '대만': 'Taiwan',
    '인도': 'India',
    '중국': 'China',
    '러시아': 'Russia',
    '스웨덴': 'Sweden',
    '핀란드': 'Finland',
    '폴란드': 'Poland',
    '네덜란드': 'Netherlands',
    '벨기에': 'Belgium',
    '스위스': 'Switzerland',
    '오스트리아': 'Austria',
    '체코': 'Czech Republic',
    '슬로바키아': 'Slovakia',
    '덴마크': 'Denmark',
    '노르웨이': 'Norway',
    '아이슬란드': 'Iceland',
    '그리스': 'Greece',
    '쿠바': 'Cuba',
    '자메이카': 'Jamaica',
    '바베이도스': 'Barbados',
    '트리니다드': 'Trinidad',
    '페루': 'Peru',
    '칠레': 'Chile',
    '아르헨티나': 'Argentina',
    '브라질': 'Brazil',
    '남아프리카공화국': 'South Africa',
    '이스라엘': 'Israel',
    '아르메니아': 'Armenia',
    '조지아': 'Georgia',
};

/** English / common country names → Korean (for KO page rendering if data was stored in English) */
const EN_TO_KO_COUNTRY: Record<string, string> = {
    'South Korea': '대한민국',
    'Korea': '대한민국',
    'Republic of Korea': '대한민국',
    'Japan': '일본',
    'United States': '미국',
    'USA': '미국',
    'U.S.A.': '미국',
    'America': '미국',
    'United Kingdom': '영국',
    'UK': '영국',
    'Scotland': '스코틀랜드',
    'Ireland': '아일랜드',
    'France': '프랑스',
    'Germany': '독일',
    'Italy': '이탈리아',
    'Spain': '스페인',
    'Portugal': '포르투갈',
    'Mexico': '멕시코',
    'Canada': '캐나다',
    'Australia': '호주',
    'New Zealand': '뉴질랜드',
    'Taiwan': '대만',
    'India': '인도',
    'China': '중국',
    'Russia': '러시아',
    'Sweden': '스웨덴',
    'Finland': '핀란드',
    'Poland': '폴란드',
    'Netherlands': '네덜란드',
    'Belgium': '벨기에',
    'Switzerland': '스위스',
    'Austria': '오스트리아',
    'Czech Republic': '체코',
    'Denmark': '덴마크',
    'Norway': '노르웨이',
    'Iceland': '아이슬란드',
    'Greece': '그리스',
    'Cuba': '쿠바',
    'Jamaica': '자메이카',
    'Barbados': '바베이도스',
    'Trinidad': '트리니다드',
    'Peru': '페루',
    'Chile': '칠레',
    'Argentina': '아르헨티나',
    'Brazil': '브라질',
    'South Africa': '남아프리카공화국',
};

/**
 * Localizes a country value for display.
 *
 * The database stores country values inconsistently — sometimes Korean,
 * sometimes English, occasionally abbreviated MFDS codes.
 * This function normalizes them to the requested display language.
 */
export function localizeCountry(country: string | null | undefined, lang: string): string {
    if (!country) return '';
    const trimmed = country.trim();
    if (!trimmed) return '';

    if (lang === 'en') {
        // Try Korean → English mapping first
        if (KO_TO_EN_COUNTRY[trimmed]) return KO_TO_EN_COUNTRY[trimmed];
        // If already English (or proper noun), return as-is
        return trimmed;
    }

    // lang === 'ko'
    // Try English → Korean mapping
    if (EN_TO_KO_COUNTRY[trimmed]) return EN_TO_KO_COUNTRY[trimmed];
    // Try Korean → English first (to detect it's already Korean), return as-is
    if (KO_TO_EN_COUNTRY[trimmed]) return trimmed; // already Korean
    // Unknown — return as-is
    return trimmed;
}

// ---------------------------------------------------------------------------
// Data source label localization
// ---------------------------------------------------------------------------

/** Human-readable data source labels per locale */
export function localizeDataSource(
    source: string | null | undefined,
    lang: string,
    fallbackManual: string,
    fallbackExternal: string,
): string {
    if (!source) return fallbackExternal;

    if (lang === 'en') {
        switch (source) {
            case 'food_safety_korea': return 'Ministry of Food and Drug Safety (Public Data)';
            case 'imported_food_maru': return 'Import Food Information Maru';
            case 'online': return 'Online';
            case 'manual': return fallbackManual;
            default: return fallbackExternal;
        }
    }

    // KO
    switch (source) {
        case 'food_safety_korea': return '식품의약품안전처 (공공데이터)';
        case 'imported_food_maru': return '수입식품정보마루';
        case 'online': return 'online';
        case 'manual': return fallbackManual;
        default: return fallbackExternal;
    }
}

// ---------------------------------------------------------------------------
// Unified field formatter
// ---------------------------------------------------------------------------

/**
 * Routes a spirit field value through the appropriate localization helper.
 *
 * Use this as the single entry-point for all spirit field localization in:
 *   - server-side page rendering
 *   - metadata generation
 *   - JSON-LD structured data
 *   - breadcrumb names
 *   - spec table cells
 *
 * This guarantees that SSR HTML and hydrated DOM see identical, localized
 * values — preventing crawler-visible discrepancies.
 */
export type SpiritLocalizableField =
    | 'category'
    | 'subcategory'
    | 'mainCategory'
    | 'country'
    | 'source';

export function formatSpiritFieldValue(
    field: SpiritLocalizableField,
    value: string | null | undefined,
    lang: string,
    options?: { fallbackManual?: string; fallbackExternal?: string },
): string {
    if (!value) return '';
    switch (field) {
        case 'category':
        case 'subcategory':
        case 'mainCategory':
            return localizeCategory(value, lang);
        case 'country':
            return localizeCountry(value, lang);
        case 'source':
            return localizeDataSource(
                value,
                lang,
                options?.fallbackManual ?? '',
                options?.fallbackExternal ?? '',
            );
        default:
            return value;
    }
}
