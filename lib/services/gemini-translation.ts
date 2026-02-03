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
Adopt the persona of a **Master Sommelier & Renowned Food Columnist** who has mastered both global food culture and fine spirits.
Your writing must be **immersive, evocative, and appetizing**, allowing the reader to vividly imagine the combination of flavors in their mouth.

**[LOGIC CHAIN FOR RECOMMENDATION]**
You must mentally follow this sequence before generating the output:
1. **Spirit Category**: What is the fundamental base? (e.g., Single Malt, Rum, Soju)
2. **Product Character**: What are the specific Nose/Palate/Finish tags from Step 3? (e.g., Sherry bomb, saline, grassy)
3. **Origin Context**: Where is it from? (Country -> Region).
4. **Synthesis**: How does the Region + Spirit Category interact? (e.g., Islay + Peat = Maritime; Kentucky + Bourbon = Sweet Oak).
5. **Recommendation**: Propose **exactly TWO distinct pairings** based on **Character & Flavor Harmony**.

**[PAIRING SELECTION CRITERIA]**
1. **The Regional Classic (Terroir & Tradition)**:
   - A dish that represents the spirit's **specific region or country**.
   - Explain how the local ingredients or cooking methods complement the spirit's character.
   - Example: A saline Islay whisky with fresh Oysters; A spicy Rye with smoked brisket.

2. **The Gastronomic Twist (Flavor Bridge)**:
   - A creative, often international, pairing that works on a **molecular/flavor level**.
   - Ignore geography; focus on **texture, contrast, and complementary flavors**.
   - Example: A floral Gin with a citrus-cured ceviche; A rich Cognac with dark chocolate truffle.

**[WRITING STYLE & TONE]**
- **Immersive & Descriptive**: Don't just list food. Describe the **texture, temperature, and specific flavors** of the dish.
- **Explain the "Why"**: Connect the spirit's specific notes (Step 3) to the dish's elements. "The acidity of the wine cuts through the richness of the..."
- **No Generic Lists**: Avoid "Cheese, fruit, chocolate." be specific: "Aged Comté," "Poached pear," "70% Ecuadorian dark chocolate."
- **pairing_guide_en**: 4-5 sentences of sophisticated, appetizing prose. Make the reader hungry.
- **pairing_guide_ko**: A professional, elegant Korean translation. Use terms that evoke appetite and sophistication (e.g., "마리아주", "풍미의 조화", "입안을 감싸는").

**[GLOBAL BAN LIST - STRICT ENFORCEMENT]**
❌ **Generic Terms**: "Steak", "Pasta", "Pizza" without specific details.
❌ **Lazy Tropes**: **Absolutely NO "Seared Scallops", "Carpaccio", "Yuzu Vinaigrette", "Moroccan Tagine", "Spring Rolls", or "Gỏi cuốn"** (These are currently overused).
❌ **Phrasing**: "Pairs well with...", "Perfect match" (Use more creative transitions).
❌ **Repetition**: Do NOT repeat the same main ingredient (e.g., Pork, Seafood) across the two pairings.

**[GLOBAL TWIST MATRIX LOGIC]**
Instead of random guessing, follow this strict decision tree:

**STEP 1: ANALYZE SPIRIT CHARACTER**
Determine if the spirit is primarily:
- **(A) Light/Crisp/Fruity/Floral** (e.g., Gin, Vodka, White Wine, Makgeolli)
- **(B) Rich/Dark/Spicy/Oaky** (e.g., Whisky, Cognac, Aged Rum, Soju 40%+)

**STEP 2: SELECT INGREDIENT & STYLE (From Matrix)**
Based on Step 1, select *one* cell from this matrix (do not stick to the first option):
- **If (A)**: [White Fish / Shellfish / Poultry / Soft Cheese] x [Cured / Fried / Steamed / Herbaceous]
- **If (B)**: [Red Meat / Game / Hard Cheese / Chocolate] x [Braised / Grilled / Roasted / Creamy]

**STEP 3: APPLY CULTURAL VARIANCE (Virtual D2 Roll)**
Apply a cultural filter to your selection from Step 2:
- **Odd (ODD)**: **Western Twist** (Mediterranean, Nordic, Latin, French) -> *e.g., Ceviche, Tartare, Ragout*
- **Even (EVEN)**: **Eastern Twist** (Japanese, Thai, Indian, Cantonese) -> *e.g., Tataki, Yakitori, Curry*

*Example: Spirit is Light (A) -> Ingredient: Poultry -> Style: Fried -> Roll: Eastern = "Chicken Karaage with Yuzu Mayo"*

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
