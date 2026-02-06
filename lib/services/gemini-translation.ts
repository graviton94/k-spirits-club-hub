import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || '';
const MODEL_ID = "gemini-2.0-flash";

// ✅ 1. 용어 가이드 (기존 유지)
const TERM_GUIDELINES_TEXT = `
- 'Makgeolli' for 막걸리/탁주 (Do not use Rice Wine)
- 'Distilled Soju' for 증류식 소주
- 'Yakju' or 'Cheongju' for 약주/청주
- 'Gwasilju' for 과실주
`;

// ✅ 2. 뻔한 페어링을 막기 위한 [금지어 리스트]
const CLICHE_BAN_LIST = `
- Generic: "Steak", "Pasta", "Pizza", "Cheese Plate", "Fruit Platter", "Chocolate", "Nuts"
- For Makgeolli/Takju: NO "Pajeon", "Kimchi-jeon", "Jeon", "Tofu Kimchi", "Bossam"
- For Whisky: NO "Ribeye Steak", "Dark Chocolate", "Smoked Salmon", "Cigar"
- For Soju: NO "Samgyeopsal", "Kimchi Stew", "Sashimi"
- For Wine/Brandy: NO "Charcuterie Board", "Brie Cheese"
`;

export interface EnrichmentAuditResult {
    name_en: string;
    distillery: string;
    region: string;
    country: string;
    abv: number;
    category: string;
    subcategory?: string;
}

export interface EnrichmentSensoryResult {
    description_ko: string;
    description_en: string;
    nose_tags: string[];
    palate_tags: string[];
    finish_tags: string[];
    tasting_note: string;
}

export interface EnrichmentPairingResult {
    pairing_guide_ko: string;
    pairing_guide_en: string;
}

export interface SpiritEnrichmentInput {
    name: string;
    category: string;
    subcategory?: string;
    distillery?: string;
    abv?: number;
    region?: string;
    country?: string;
    name_en?: string;
    description_en?: string;
    description_ko?: string;
    nose_tags?: string[];
    palate_tags?: string[];
    finish_tags?: string[];
    metadata?: {
        tasting_note?: string;
        description?: string;
        [key: string]: any;
    };
}

/**
 * STEP 1: AUDIT & IDENTITY
 * Corrects basic info and verifies product details.
 */
export async function auditSpiritInfo(spirit: SpiritEnrichmentInput): Promise<EnrichmentAuditResult> {
    if (!API_KEY) throw new Error("GEMINI_API_KEY is not set");
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_ID, generationConfig: { responseMimeType: "application/json", temperature: 0.2 } });

    const prompt = `
    You are a meticulous liquor database auditor.
    Your goal is to verify and correct the basic identity of a spirit.
    
    ### INPUT:
    - Name: ${spirit.name}
    - Category: ${spirit.category} / ${spirit.subcategory || ''}
    - ABV: ${spirit.abv}
    - Distillery: ${spirit.distillery}
    - Region: ${spirit.region}
    - Country: ${spirit.country}

    ### INSTRUCTIONS:
    1. **English Name**: Create the OFFICIAL English product name (Title Case).
    2. **Audit**: Verify and correct Distillery, Country, Region, and ABV. Search web if needed.
    3. **Category**: Ensure category matches international standards.

    ### OUTPUT JSON SCHEMA:
    {
      "name_en": "string",
      "distillery": "string",
      "region": "string",
      "country": "string",
      "abv": number,
      "category": "string",
      "subcategory": "string"
    }
    `;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
}

/**
 * STEP 2: SENSORY ANALYSIS
 * Generates Description and 3-5+ Tags for Nose, Palate, and Finish.
 */
export async function generateSensoryData(spirit: SpiritEnrichmentInput): Promise<EnrichmentSensoryResult> {
    if (!API_KEY) throw new Error("GEMINI_API_KEY is not set");
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_ID, generationConfig: { responseMimeType: "application/json", temperature: 0.7 } });

    const prompt = `
    You are a world-class Sommelier and Sensory Scientist.
    Generate a deep sensory analysis based on the audited product info.
    
    ### PRODUCT INFO:
    - Name: ${spirit.name} (${spirit.name_en})
    - Category: ${spirit.category}
    - ABV: ${spirit.abv}%

    ### MANDATORY REQUIREMENTS:
    1. **Description**: Write a evocative, sommelier-style description in both KO and EN (2-3 sentences each).
    2. **Tags**: Generate MINIMUM 3, MAXIMUM 6 specific flavor tags for each category:
       - nose_tags: Aromatic components
       - palate_tags: Taste and mouthfeel
       - finish_tags: Aftertaste and persistence
       - *Example*: Use "Zesty Lemon" instead of "Citrus".
    3. **Tasting Note**: A short hashtag summary (e.g., "#Peaty #Oily #SeaSalt").

    ### OUTPUT JSON SCHEMA:
    {
      "description_ko": "string",
      "description_en": "string",
      "nose_tags": ["string"],
      "palate_tags": ["string"],
      "finish_tags": ["string"],
      "tasting_note": "string"
    }
    `;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
}

/**
 * STEP 3: CREATIVE PAIRING ENGINE
 * Generates food pairings based on product info and sensory data.
 */
export async function generatePairingGuide(spirit: SpiritEnrichmentInput): Promise<EnrichmentPairingResult> {
    if (!API_KEY) throw new Error("GEMINI_API_KEY is not set");
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_ID, generationConfig: { responseMimeType: "application/json", temperature: 0.85 } });

    const prompt = `
    You are an Avant-Garde Gastronomy Consultant.
    Generate two logical pairings based on sensory data. Do not use clichés from the Ban List.

    ### BAN LIST:
    ${CLICHE_BAN_LIST}

    ### INPUT DATA:
    - Name: ${spirit.name}
    - Category: ${spirit.category}
    - Sensory: ${spirit.description_en}
    - Tags: ${[...(spirit.nose_tags || []), ...(spirit.palate_tags || []), ...(spirit.finish_tags || [])].join(', ')}

    ### PAIRING STRATEGY:
    1. **The Flavor Bridge**: Shared molecular compounds.
    2. **The Textural Contrast**: Opposing but harmonious elements.
    *Cross-cultural suggestions only.*

    ### OUTPUT JSON SCHEMA:
    {
      "pairing_guide_ko": "string (4-5 cohesive sentences)",
      "pairing_guide_en": "string (4-5 cohesive sentences)"
    }
    `;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
}