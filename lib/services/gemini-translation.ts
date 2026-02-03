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
    description_ko: string;
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
    description_en?: string; // High-quality source for translation
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

    const sourceDescriptionEn = spirit.description_en || '';

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
- Existing English Description (Source): ${sourceDescriptionEn}
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
2. **description_ko**: 
   - [IF SOURCE DESCRIPTION EN EXISTS]: Perform a **'Semantic Context-Preserving Translation'** of the provided English description. 
     - **Constraint**: Maintain a **1:1 sentence count parity** with the English source. If the English has 4 sentences, the Korean MUST have 4 sentences.
     - **Persona**: Write as a top-tier Korean master sommelier/liquor professional. Use elegant, fluid, and professional Korean prose.
     - **Keywords**: Naturally integrate terms such as '페어링' (pairing), '안주 추천' (food recommendation), and '테이스팅' (tasting) within the flow.
     - **Legacy Note**: Ignore any existing short descriptions (e.g., "감자술"). This new masterpiece is the new primary source.
   - [IF NO SOURCE]: Create a 3-4 sentence masterpiece in Korean for domestic SEO. Capture the 'soul' of the liquid.
   - SEO: Naturally include product name, category, and tasting note keywords.
3. **description_en**: 
   - If Source English Description exists and is high quality, use/refine it. Maintain the tone and technical depth.
   - Otherwise, create a 3-4 sentence masterpiece in English for global luxury branding.
   - Content must be equivalent to **description_ko**.

### STEP 3: FLAVOR DNA EXTRACTION (Based on Step 2)
Analyze the **description_en** you just wrote/refined.
- Extract a rich set of tags (5-8 for Nose/Palate, 4-6 for Finish).
- Ensure the tags capture technical nuances (e.g., "Rancio," "Petrichor," "Viscous," "Esoteric Spices").

### STEP 4: GASTRONOMY COLUMNIST'S PAIRING GUIDE (Based on Step 3)
Adopt the persona of a world-renowned food critic. Your goal is to provide **exactly TWO distinct, non-repetitive pairing recommendations**.

**[GLOBAL BAN LIST - ABSOLUTELY NO EXCEPTIONS]**
❌ Cullen Skink, ❌ Haggis, ❌ Moroccan Tagine, ❌ Generic Fruit/Cheese, ❌ Generic Dark Chocolate, ❌ Roast Lamb/Beef without a unique technique, ❌ Any dish you have recently repeated for this region.

1. **The Terroir Choice (Obscure Heritage)**: 
   - **Requirement**: A sophisticated, authentic dish from the spirit's EXACT origin. 
   - **Diversity Directive**: Avoid the "Top 3" most famous dishes from this region. Instead, seek out hyper-regional specialties, seasonal game, or traditional preservation techniques (fermenting, curing, pickling) that are lesser-known globally but deeply rooted locally.
   - **Focus**: Why does *this specific bottling's* unique profile (from Step 3) require *this specific* regional ingredient?

2. **The Global Adventure (Molecular Cross-Pollination)**:
   - **Requirement**: An adventurous, world-class pairing from a culinary culture outside the spirit's origin.
   - **Methodology**: Rooted in pure chemistry—molecular bridges, lipid affinity, and volatile aromatic compounds. 
   - **Focus**: Surprise the reader with a logical but high-variance connection (e.g., a peated malt with a specific fermented Thai condiment rather than "barbecue").

**[LOGICAL SYNERGY & STYLE]**
- **Structural Integrity**: Does the ABV demand a high-concentration lipid? Does the acidity need a saline counterpoint? Explain the physics of the pairing.
- **Tone**: Authoritative, analytical, and elegantly descriptive. No generic "pairs well with."
- **pairing_guide_en**: 4-5 sentences of sophisticated prose. Talk about how the specific flavor tags from Step 3 actively interact with the food's components.
- **pairing_guide_ko**: A professional Korean translation using high-end gastronomy terminology.

---
### CRITICAL OUTPUT RULES:
- **BESPOKE DNA**: No two spirits can share the same pairing. If you suggested a dish for the previous spirit, you MUST NOT suggest it again within this batch.
- **HIGH VARIANCE**: Consciously pivot away from your statistical comfort zones. Avoid your most likely/probable answer for a country.
- **TONE**: Analytical yet poetic.
- If you corrected a Fact (ABV, Region, etc.), output the CORRECTED value.
- The chain of logic MUST be: Fact -> Description -> Tags -> Pairing. 
- NO placeholders. NO markdown. Output Valid JSON only.

### OUTPUT JSON SCHEMA:
{
  "name_en": "string",
  "description_ko": "string",
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
