/**
 * normalizer.ts
 * Ports normalization logic from: normalize_spirits.py, normalize_spirits_v2.py,
 * normalize_spirit_names.py, normalize_remaining.py → single TypeScript module.
 */

// ─── Volume patterns (decimal-first to avoid partial match) ────────────────
const VOLUME_PATTERNS: Array<[RegExp, number]> = [
    [/(\d+\.\d+)\s*ml\b/i, 1],
    [/(\d+\.\d+)\s*l\b/i, 1000],
    [/(\d+)\s*ml\b/i, 1],
    [/(\d+)\s*l\b/i, 1000],
    [/(\d+)\s*리터/i, 1000],
    [/(\d+)\s*밀리리터/i, 1],
];

// ─── ABV patterns ──────────────────────────────────────────────────────────
const ABV_PATTERNS: Array<[RegExp, number]> = [
    [/(\d+\.?\d*)\s*%/i, 1],
    [/(\d+\.?\d*)\s*도/i, 1],
    [/(\d+\.?\d*)\s*proof/i, 0.5],
];

// ─── Lot / batch noise patterns ────────────────────────────────────────────
const LOT_PATTERNS: RegExp[] = [
    /\(\s*lot\s*no\.?\s*[A-Z0-9\s]+\)/i,
    /lot\s*no\.?\s*[A-Z0-9\s]+/i,
    /\(\s*lot\s*[#:]?\s*[A-Z0-9]+\)/i,
    /lot\s*[#:]?\s*\d+/i,
    /batch\s*[#:]?\s*\d+/i,
    /로트\s*\d+/i,
    /\[\s*[A-Z0-9\s]+\]/i,
    /\(?\s*L\s*\d{4,}[\s\d]*\s*\)?/i,
    /\s+L\s*\d{4,}[\s\d]*\b/i,
];

// ─── Distillery abbreviation expansions ────────────────────────────────────
const ABBREVIATIONS: Record<string, string> = {
    'Dist\\.': 'Distillery',
    'Distilleries': 'Distillery',
    'Co\\.': 'Company',
    'Corp\\.': 'Corporation',
    'Ltd\\.': 'Limited',
    'Inc\\.': 'Incorporated',
    'Mfg\\.': 'Manufacturing',
    'Bros\\.': 'Brothers',
    'Brg\\.': 'Brewing',
    'Brewery': 'Brewing',
    'Breweries': 'Brewing',
};

// ─── Public API ─────────────────────────────────────────────────────────────

export interface NormalizeResult {
    name: string;
    volume: number | null;    // ml
    abv: number | null;       // %
    extractedNotes: string;   // bracketed content moved out of name
}

export function extractVolume(name: string): { volume: number | null; cleaned: string } {
    for (const [pattern, multiplier] of VOLUME_PATTERNS) {
        const match = name.match(pattern);
        if (match) {
            const volume = parseFloat(match[1]) * multiplier;
            const cleaned = name.replace(pattern, '').replace(/\s{2,}/g, ' ').trim();
            return { volume, cleaned };
        }
    }
    return { volume: null, cleaned: name };
}

export function extractAbv(name: string): { abv: number | null; cleaned: string } {
    for (const [pattern, multiplier] of ABV_PATTERNS) {
        const match = name.match(pattern);
        if (match) {
            const abv = parseFloat(match[1]) * multiplier;
            const cleaned = name.replace(pattern, '').replace(/\s{2,}/g, ' ').trim();
            return { abv, cleaned };
        }
    }
    return { abv: null, cleaned: name };
}

export function stripLotNoise(name: string): string {
    let cleaned = name;
    for (const pattern of LOT_PATTERNS) {
        cleaned = cleaned.replace(pattern, '').trim();
    }
    return cleaned.replace(/\s{2,}/g, ' ').trim();
}

/** Extract parenthesized/bracketed sub-notes that aren't volume/abv/lot */
export function extractBracketedNotes(name: string): { notes: string; cleaned: string } {
    const notes: string[] = [];
    const cleaned = name.replace(/\(([^)]+)\)/g, (_, inner) => {
        // Only move to notes if not already handled (volume/abv/lot leave no residue)
        if (inner.trim().length > 0) notes.push(inner.trim());
        return '';
    }).replace(/\s{2,}/g, ' ').trim();
    return { notes: notes.join('; '), cleaned };
}

export function normalizeDistilleryName(name: string): string {
    if (!name) return name;
    let normalized = name.trim();
    for (const [abbr, expansion] of Object.entries(ABBREVIATIONS)) {
        normalized = normalized.replace(new RegExp(abbr, 'gi'), expansion);
    }
    return normalized.replace(/\s{2,}/g, ' ').trim();
}

/**
 * Main normalization entry — runs all extraction passes in sequence.
 * Returns cleaned name + split-out fields. Does NOT mutate the original object.
 */
export function normalizeSpirit(rawName: string, existingAbv?: number | null, existingVolume?: number | null): NormalizeResult {
    let working = rawName;

    // 1. Strip lot noise first (prevents false-positive volume/abv matches inside lot strings)
    working = stripLotNoise(working);

    // 2. Volume
    const { volume, cleaned: afterVolume } = extractVolume(working);
    working = afterVolume;

    // 3. ABV
    const { abv, cleaned: afterAbv } = extractAbv(working);
    working = afterAbv;

    // 4. Bracketed notes
    const { notes, cleaned: afterNotes } = extractBracketedNotes(working);
    working = afterNotes;

    // Final trim
    const name = working.replace(/[-–—,]+$/, '').trim();

    return {
        name,
        volume: volume ?? (existingVolume ?? null),
        abv: abv ?? (existingAbv ?? null),
        extractedNotes: notes,
    };
}
