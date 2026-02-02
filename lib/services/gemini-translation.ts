import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || '';
const MODEL_ID = "gemini-2.0-flash";

const TERM_GUIDELINES = `
- 'Makgeolli' for 막걸리
- 'Distilled Soju' for 증류식 소주
- 'Takju' for 탁주
- 'Yakju' for 약주
- 'Cheongju' for 청주
`;

export interface EnrichmentResult {
    // Stage 1: Identity & Audit
    name_en: string;
    description_en: string;
    distillery: string;  // Corrected/Normalized Distillery Name (KO)
    region: string;      // Corrected/Normalized Region Name (KO)
    country: string;     // Corrected/Normalized Country Name (KO)
    abv: number;         // Corrected/Verified ABV

    // Stage 2: Flavor DNA (From Stage 1)
    nose_tags: string[];
    palate_tags: string[];
    finish_tags: string[];

    // Stage 3: Pairing (From Stage 2 Tags)
    pairing_guide_en: string;
    pairing_guide_ko: string;
}

export interface SpiritEnrichmentInput {
    name: string;
    category: string;
    subcategory?: string;
    distillery?: string;
    abv?: number;
    region?: string;
    country?: string;
    metadata?: {
        tasting_note?: string;
        description?: string;
        nose_tags?: string[];
        palate_tags?: string[];
        finish_tags?: string[];
        [key: string]: any;
    };
}

/**
 * Enriches spirit data with a strict 4-step sequential AI reasoning process.
 * 1. Metadata Audit -> 2. Identity Branding -> 3. Flavor Tagging -> 4. Pairing Design.
 */
export async function enrichSpiritWithAI(spirit: SpiritEnrichmentInput): Promise<EnrichmentResult> {
    if (!API_KEY) {
        throw new Error("GEMINI_API_KEY is not set");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_ID });

    const tastingNote = spirit.metadata?.tasting_note || spirit.metadata?.description || '';
    const existingTags = [
        ...(spirit.metadata?.nose_tags || []),
        ...(spirit.metadata?.palate_tags || []),
        ...(spirit.metadata?.finish_tags || [])
    ].join(', ');

    const prompt = `
You are a World-Class Spirit Auditor and Master Sommelier. 
You MUST process the following spirit data using a **Strict 4-Step Sequential Reasoning Chain**. 

---
### INPUT DATA:
- Raw Name: ${spirit.name}
- Raw Distillery: ${spirit.distillery}
- Raw Category: ${spirit.category} / ${spirit.subcategory}
- Raw Location: ${spirit.region}, ${spirit.country}
- Raw ABV: ${spirit.abv}%
- Tasting Notes: ${tastingNote}
- Current Tags: ${existingTags}

---
### STEP 1: KNOWLEDGE STUDY & METADATA AUDIT
Compare the input data with your internal global liquor database. 
- **Verify Distillery (KO)**: Ensure the distillery name is correct in Korean.
- **Verify Region (KO)**: Standardize the location to Korean administrative regions (e.g., '전라남도', '경상북도', '제주도', '경기도'). 
  - If the input is 'Seoul' or '서울' but this distillery is strategically located in 'Andong', the truth is '경상북도'.
- **Verify ABV**: If the input says 10% but this specific spirit is legally 40%, the truth is 40.0.
- **Action**: Determine the 'Absolute Truth' in Korean for distillery and region.

### STEP 2: GLOBAL IDENTITY & BRANDING (Based on Step 1)
Using the 'Absolute Truth' from Step 1:
1. **name_en**: Professional English name.
2. **description_en**: A 3-4 sentence masterpiece for a luxury spirits catalog. 
   - Capture the 'soul' of the liquid. Use evocative language (e.g., "haunting smoke," "velvety opulence," "structural precision"). 
   - Explain the technical process's impact on flavor.

### STEP 3: FLAVOR DNA EXTRACTION (Based on Step 2)
Analyze the **description_en** you just wrote.
- Extract a rich set of tags (5-8 for Nose/Palate, 4-6 for Finish).
- Ensure the tags capture technical nuances (e.g., "Rancio," "Petrichor," "Viscous," "Esoteric Spices").

### STEP 4: GASTRONOMY COLUMNIST'S PAIRING GUIDE (Based on Step 3)
Adopt the persona of a world-renowned food critic. Your goal is to find the perfect structural harmony between the spirit and a dish. 

- **Autonomous Selection**: You have full creative freedom. Do NOT rely on a fixed list of common pairings. Explore the entire global culinary map—from obscure regional specialties to modern molecular gastronomy.
- **Methodology (First Principles)**: Every pairing must be a logical derivation of the spirit's chemical properties:
  - **Lipid Affinity**: How does the spirit interact with fats (dairy, animal fat, oils)?
  - **Protein Structure**: Does it complement delicate white meats or stand up to heavy, gamey proteins?
  - **Aromatic Bridge**: Find an ingredient that shares a molecular aroma with the spirit (e.g., stone fruit notes in a brandy bridge with a specific spice or herb).
  - **Textural Contrast**: Does the liquid's viscosity need a crunch, or a velvety emulsion?
- **Anti-Repetition Protocol**: Consciously avoid your own "statistical comfort zones." If you find yourself frequently suggesting the same few dishes (even if they are high-end), pivot to a different culinary culture or a different structural approach.
- **Logic**: Explain the "Synergy." Does the spirit's acidity cut through fat? Does its smokiness bridge with a charred element? 
- **pairing_guide_en**: 3-4 sentences of sophisticated prose. Talk about how the specific flavor tags from Step 3 actively interact with the food's components (salt, fat, acid, heat).
- **pairing_guide_ko**: An equally sophisticated Korean translation that captures the nuance of a high-end food column.

---
### CRITICAL OUTPUT RULES:
- **UNIQUE PAIRINGS**: Each recommendation must feel bespoke to *this specific spirit*. 
- **NO CLICHÉS**: Avoid "fruit and cheese" or repetitive "exotic" tropes.
- **TONE**: Authoritative, analytical, and elegantly descriptive.

---
### CRITICAL OUTPUT RULES:
- If you corrected a Fact (ABV, Region, etc.), output the CORRECTED value.
- The chain of logic MUST be: Fact -> Description -> Tags -> Pairing. 
- NO placeholders. NO markdown. Output Valid JSON only.

### OUTPUT JSON SCHEMA:
{
  "name_en": "string",
  "description_en": "string",
  "distillery": "string (Corrected KO)",
  "region": "string (Corrected KO)",
  "country": "string (Corrected KO)",
  "abv": number (Verified),
  "nose_tags": ["string"],
  "palate_tags": ["string"],
  "finish_tags": ["string"],
  "pairing_guide_en": "string",
  "pairing_guide_ko": "string"
}
`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim().replace(/```json|```/g, '');
        const jsonMatch = text.match(/\{[\s\S]*?\}/);
        if (!jsonMatch) throw new Error("AI failed to return valid JSON");

        const data: EnrichmentResult = JSON.parse(jsonMatch[0]);

        // Final sanity check for ABV
        if (typeof data.abv !== 'number') data.abv = Number(spirit.abv) || 0;

        return data;
    } catch (error) {
        console.error(`Gemini Sequential Enrichment Error for ${spirit.name}:`, error);
        throw error;
    }
}

/**
 * Optimized for SEO and correct terminology.
 */
export async function translateSpiritName(name: string, category: string, brewery?: string): Promise<{ name_en: string }> {
    if (!API_KEY) throw new Error("API_KEY not set");
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_ID });

    const prompt = `Translate '${name}' (${category}) from ${brewery} to a professional English liquor name. Use Title Case. Rule: ${TERM_GUIDELINES}. Output JSON: {"name_en": "..."}`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim().replace(/```json|```/g, '');
        return JSON.parse(text);
    } catch (error) {
        return { name_en: name };
    }
}
