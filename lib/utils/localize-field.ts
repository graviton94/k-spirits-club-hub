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
 * Automatically splits and translates grape varieties in parentheses.
 */
export function localizeCategory(key: string | null | undefined, lang: string): string {
    if (!key) return '';

    // Check if key has parentheses for varieties: e.g., "레드 와인 (샤르도네)"
    const match = key.match(/^(.*?)\s*\((.*?)\)$/);
    if (match) {
        const mainPart = match[1].trim();
        const varietyPart = match[2].trim();

        const localizedMain = localizeMainCategoryOnly(mainPart, lang);
        const localizedVariety = localizeVariety(varietyPart, lang);

        return `${localizedMain} (${localizedVariety})`;
    }

    return localizeMainCategoryOnly(key, lang);
}

function localizeMainCategoryOnly(key: string, lang: string): string {
    if (lang === 'en') {
        return (metadata as any).display_names_en[key] || key;
    }
    return (metadata as any).display_names[key] || key;
}

// ---------------------------------------------------------------------------
// Variety dictionary (Grape Types, etc.)
// ---------------------------------------------------------------------------

const KO_TO_EN_VARIETY: Record<string, string> = {
    '샤르도네': 'Chardonnay',
    '소비뇽 블랑': 'Sauvignon Blanc',
    '쇼비뇽 블랑': 'Sauvignon Blanc',
    '피노 누아': 'Pinot Noir',
    '피노누아': 'Pinot Noir',
    '까베르네 소비뇽': 'Cabernet Sauvignon',
    '카베르네 소비뇽': 'Cabernet Sauvignon',
    '까베르네 프랑': 'Cabernet Franc',
    '카베르네 프랑': 'Cabernet Franc',
    '메를로': 'Merlot',
    '쉬라즈': 'Shiraz',
    '시라': 'Syrah',
    '말벡': 'Malbec',
    '진판델': 'Zinfandel',
    '네비올로': 'Nebbiolo',
    '산지오베제': 'Sangiovese',
    '템프라니요': 'Tempranillo',
    '가르나차': 'Garnacha',
    '그르나슈': 'Grenache',
    '알리고테': 'Aligote',
    '알리고테 도레': 'Aligote',
    '프리미티보': 'Primitivo',
    '아기오르기티코': 'Agiorgitiko',
    '코르비나': 'Corvina',
    '론디넬라': 'Rondinella',
    '몰리나라': 'Molinara',
    '세미용': 'Semillon',
    '모스카토': 'Moscato',
    '리슬링': 'Riesling',
    '슈냉 블랑': 'Chenin Blanc',
    '카르메네르': 'Carmenere',
    '가메': 'Gamay',
    '비오니에': 'Viognier'
};

const EN_TO_KO_VARIETY: Record<string, string> = {
    'Chardonnay': '샤르도네',
    'Sauvignon Blanc': '소비뇽 블랑',
    'Pinot Noir': '피노 누아',
    'Cabernet Sauvignon': '까베르네 소비뇽',
    'Cabernet Franc': '까베르네 프랑',
    'Merlot': '메를로',
    'Shiraz': '쉬라즈',
    'Syrah': '시라',
    'Malbec': '말벡',
    'Zinfandel': '진판델',
    'Nebbiolo': '네비올로',
    'Sangiovese': '산지오베제',
    'Tempranillo': '템프라니요',
    'Garnacha': '가르나차',
    'Grenache': '그르나슈',
    'Aligote': '알리고테',
    'Agiorgitiko': '아기오르기티코',
    'Primitivo': '프리미티보',
    'Corvina': '코르비나',
    'Rondinella': '론디넬라',
    'Molinara': '몰리나라',
    'Semillon': '세미용',
    'Moscato': '모스카토',
    'Riesling': '리슬링',
    'Chenin Blanc': '슈냉 블랑',
    'Carmenere': '카르메네르',
    'Gamay': '가메',
    'Viognier': '비오니에'
};

function localizeVariety(variety: string, lang: string): string {
    // split by commas or " 블렌드" indicating multiple grapes
    const parts = variety.split(',').map(p => p.trim());
    const translated = parts.map(part => {
        if (lang === 'en') {
            if (KO_TO_EN_VARIETY[part]) return KO_TO_EN_VARIETY[part];

            if (part.endsWith(' 블렌드')) {
                const base = part.replace(' 블렌드', '').trim();
                if (KO_TO_EN_VARIETY[base]) return KO_TO_EN_VARIETY[base] + ' Blend';
                return base + ' Blend';
            }
            return part; // fallback
        } else {
            // KO
            if (EN_TO_KO_VARIETY[part]) return EN_TO_KO_VARIETY[part];

            if (part.toLowerCase().endsWith(' blend')) {
                const base = part.substring(0, part.length - 6).trim();
                const mappedBase = Object.keys(EN_TO_KO_VARIETY).find(k => k.toLowerCase() === base.toLowerCase());
                if (mappedBase) return EN_TO_KO_VARIETY[mappedBase] + ' 블렌드';
                return base + ' 블렌드';
            }
            return part; // fallback
        }
    });

    return translated.join(', ');
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
    '아르메니아': 'Armenia',
    '조지아': 'Georgia',
    '도미니카 공화국': 'Dominican Republic',
    '푸에르토리코': 'Puerto Rico',
    '베네수엘라': 'Venezuela',
    '파나마': 'Panama',
    '가이아나': 'Guyana',
    '니카라과': 'Nicaragua',
    '코스타리카': 'Costa Rica',
    '과테말라': 'Guatemala',
    '엘살바도르': 'El Salvador',
    '몰도바': 'Moldova',
    '마케도니아': 'Macedonia',
    '루마니아': 'Romania',
    '모리셔스': 'Mauritius'
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
    'Dominican Republic': '도미니카 공화국',
    'Puerto Rico': '푸에르토리코',
    'Venezuela': '베네수엘라',
    'Panama': '파나마',
    'Guyana': '가이아나',
    'Nicaragua': '니카라과',
    'Costa Rica': '코스타리카',
    'Guatemala': '과테말라',
    'El Salvador': '엘살바도르',
    'Moldova': '몰도바',
    'Macedonia': '마케도니아',
    'Romania': '루마니아',
    'Mauritius': '모리셔스'
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
