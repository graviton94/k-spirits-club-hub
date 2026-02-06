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

export interface EnrichmentResult {
    name_en: string;
    distillery: string;
    region: string;
    country: string;
    abv: number;
    description_ko: string;
    description_en: string;
    tasting_note_en: string;
    nose_tags: string[];
    palate_tags: string[];
    finish_tags: string[];
    pairing_guide_ko: string;
    pairing_guide_en: string;
    tasting_note: string;
}

export interface SpiritEnrichmentInput {
    name: string;
    category: string;
    subcategory?: string;
    distillery?: string;
    abv?: number;
    region?: string;
    country?: string;
    description_en?: string;
    metadata?: {
        tasting_note?: string;
        description?: string;
        nose_tags?: string[];
        palate_tags?: string[];
        finish_tags?: string[];
        [key: string]: any;
    };
}

export async function enrichSpiritWithAI(spirit: SpiritEnrichmentInput): Promise<EnrichmentResult> {
    if (!API_KEY) throw new Error("GEMINI_API_KEY is not set");

    const genAI = new GoogleGenerativeAI(API_KEY);

    const model = genAI.getGenerativeModel({
        model: MODEL_ID,
        generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.85 // 창의성을 위해 온도를 약간 높임 (0.7 -> 0.85)
        }
    });

    const inputContext = {
        raw_name: spirit.name,
        raw_category: `${spirit.category} / ${spirit.subcategory || ''}`,
        raw_abv: spirit.abv,
        existing_notes: spirit.metadata?.tasting_note || spirit.metadata?.description || '',
        existing_tags: [
            ...(spirit.metadata?.nose_tags || []),
            ...(spirit.metadata?.palate_tags || []),
            ...(spirit.metadata?.finish_tags || [])
        ].join(', ')
    };

    const prompt = `
You are an Avant-Garde Gastronomy Consultant and Master Sommelier.
Your goal is to provide **novel, scientifically grounded, and exciting** data for a liquor database.
You hate clichés. You love unexpected flavor bridges.

### 0. STRICT RULES:
${TERM_GUIDELINES_TEXT}

### 1. BAN LIST (DO NOT SUGGEST THESE):
${CLICHE_BAN_LIST}
*If you suggest anything from the Ban List, the user will be bored and leave the site.*

### 2. INPUT DATA:
${JSON.stringify(inputContext, null, 2)}

---

### INSTRUCTION: EXECUTE THIS REASONING CHAIN

#### STEP 1: AUDIT & IDENTITY
- **English Name**: Create the OFFICIAL English product name (Title Case).
- **Audit**: Fix Distillery/Country/Region spellings. Verify ABV if possible.

#### STEP 2: SENSORY ANALYSIS (The Hook)
- **tasting_note_en**: Summarize the profile in 1 sentence. Focus on the *dominant molecule* (e.g., Lactic acid, Vanillin, Peat, Esters).
- **Tags**: Extract 5-6 specific tags for Nose/Palate/Finish. (e.g., instead of "Fruity", use "Overripe Pineapple" or "Dried Apricot").

#### STEP 3: CREATIVE PAIRING ENGINE (The Core Value)
Generate exactly TWO pairings using the rules below.

**Concept A: The "Flavor Bridge" (Scientific Resonance)**
- Find a dish that shares a *dominant flavor compound* with the spirit, but from a DIFFERENT cuisine.
- *Logic*: "This Makgeolli has lactic acid (yogurt notes) -> Pair with spicy Indian Tandoori Chicken (yogurt marinade)."
- *Logic*: "This Bourbon has vanillin -> Pair with Cantonese Char Siu (sweet glaze)."
- **Avoid matching Country to Country.** Cross the borders.

**Concept B: The "Textural Contrast" (The Cut)**
- Find a dish where the spirit solves a problem in the food (Cuts fat, soothes heat, cleanses palate).
- *Logic*: "This high-proof Rye cuts through the richness of a Truffle Risotto."
- *Logic*: "This oily Mezcal stands up to the funk of Blue Cheese Gnocchi."

**Writing the Guide (pairing_guide_en/ko):**
- Combine A and B into a cohesive, appetizing paragraph (4-5 sentences).
- Do not use bullet points in the text. Write like a food columnist.
- Explain *WHY* it works (The Bridge or The Cut).
- **Korean Tone**: "미식가의 노트", "뜻밖의 조화", "풍미의 층위" (Sophisticated).

---

### OUTPUT JSON SCHEMA:
{
  "name_en": "string",
  "distillery": "string",
  "region": "string",
  "country": "string",
  "abv": number,
  "description_ko": "string",
  "description_en": "string",
  "tasting_note_en": "string",
  "nose_tags": ["string"],
  "palate_tags": ["string"],
  "finish_tags": ["string"],
  "pairing_guide_en": "string",
  "pairing_guide_ko": "string",
  "tasting_note": "string (Hashtag summary)"
}
`;

    try {
        const result = await model.generateContent(prompt);
        const data = JSON.parse(result.response.text());
        if (typeof data.abv !== 'number') data.abv = Number(spirit.abv) || 0;
        return data;
    } catch (error) {
        console.error(`Gemini Enrichment Error for ${spirit.name}:`, error);
        throw error;
    }
}