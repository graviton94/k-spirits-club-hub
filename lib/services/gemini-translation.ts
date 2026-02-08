import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || '';
const MODEL_ID = "gemini-2.0-flash";

if (!API_KEY) {
    console.error('[Gemini] 🔴 ERROR: GEMINI_API_KEY is missing from environment variables.');
}

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

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log('[Gemini Identity] Response:', text);

        const cleanJson = text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanJson);

        // Handle if Gemini returns an array instead of a single object
        const data = Array.isArray(parsed) ? parsed[0] : parsed;

        console.log('[Gemini Identity] Parsed data:', data);
        return data;
    } catch (e: any) {
        console.error('[Gemini Identity] ❌ Error:', e);
        throw new Error(`Identity audit failed: ${e.message}`);
    }
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
    Generate a deep sensory analysis based on the VERIFIED product information below.
    
    ### VERIFIED PRODUCT INFO (from Audit):
    - Name: ${spirit.name} ${spirit.name_en ? `(${spirit.name_en})` : ''}
    - Category: ${spirit.category} ${spirit.subcategory ? `/ ${spirit.subcategory}` : ''}
    - Distillery: ${spirit.distillery || 'Unknown'}
    - Country: ${spirit.country || 'Unknown'}
    - Region: ${spirit.region || 'N/A'}
    - ABV: ${spirit.abv}%
    
    **CRITICAL**: Base your sensory analysis STRICTLY on the country and category above. 
    Do NOT make assumptions about origin or style that contradict the verified information.
    
    ### MANDATORY REQUIREMENTS:
    1. **Description**: Write an evocative, sommelier-style description in both KO and EN (2-3 sentences each).
       - Reflect the VERIFIED country and distillery heritage in your description.
       - Example: If country is "India", describe Indian whisky characteristics, NOT Irish or Scottish.
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

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log('[Gemini Sensory] Response:', text);

        const cleanJson = text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        const data = Array.isArray(parsed) ? parsed[0] : parsed;

        console.log('[Gemini Sensory] Parsed data:', data);
        return data;
    } catch (e: any) {
        console.error('[Gemini Sensory] ❌ Error:', e);
        throw new Error(`Sensory analysis failed: ${e.message}`);
    }
}

/**
 * STEP 3: CREATIVE PAIRING ENGINE
 * Generates food pairings based on product info and sensory data.
 */
export async function generatePairingGuide(spirit: SpiritEnrichmentInput): Promise<EnrichmentPairingResult> {
    if (!API_KEY) throw new Error("GEMINI_API_KEY is not set");
    const genAI = new GoogleGenerativeAI(API_KEY);
    // Increase temperature for more diversity (0.85 → 1.2)
    const model = genAI.getGenerativeModel({ model: MODEL_ID, generationConfig: { responseMimeType: "application/json", temperature: 1.2 } });

    const prompt = `
    You are an Avant-Garde Gastronomy Consultant specializing in UNCOMMON and CREATIVE pairings.
    Create TWO distinct food pairings based on verified product information and sensory data.
    
    ### VERIFIED PRODUCT INFO:
    - Name: ${spirit.name} ${spirit.name_en ? `(${spirit.name_en})` : ''}
    - Category: ${spirit.category} ${spirit.subcategory ? `/ ${spirit.subcategory}` : ''}
    - Distillery: ${spirit.distillery || 'Unknown'}
    - Country of Origin: ${spirit.country || 'Unknown'}
    - Region: ${spirit.region || 'N/A'}
    - ABV: ${spirit.abv}%
    
    ### SENSORY PROFILE (USE THESE AS PAIRING ANCHORS):
    - **Aroma Notes**: ${(spirit.nose_tags || []).join(', ')}
    - **Palate Notes**: ${(spirit.palate_tags || []).join(', ')}
    - **Finish Notes**: ${(spirit.finish_tags || []).join(', ')}
    - **Description**: ${spirit.description_en || spirit.description_ko || 'N/A'}
    
    **CRITICAL**: Each pairing MUST directly reference and build upon AT LEAST 2-3 specific sensory tags above.
    - Example: If "Green Apple" + "Toasted Almond" tags exist → suggest a dish with apple and almonds
    - Example: If "Smoky Bacon" + "Maple Syrup" → suggest a dish that mirrors these flavors
    - Example: If "Oceanic Brine" + "Citrus Zest" → suggest seafood with citrus marinade

    ### BAN LIST (NEVER suggest these overused pairings):
    ${CLICHE_BAN_LIST}
    
    **ADDITIONAL BANNED PAIRINGS** (too common, avoid at all costs):
    - Ceviche, Peruvian/Mexican Ceviche
    - Moroccan Tagine, any tagine dishes
    - Haggis, Scottish Haggis
    - Haddock, Smoked Haddock
    - Duck Breast, Roasted Duck
    - Lamb Chops, Grilled Lamb
    - Pork Belly, any belly dishes
    - Oysters, raw oysters
    - Truffle anything, foie gras
    - Chocolate desserts, dark chocolate
    - Swedish Meatballs, any meatball dishes
    - Cheese platters, charcuterie boards
    - Sushi, sashimi
    - BBQ ribs, pulled pork
    - Beef Wellington, beef tartare
    - 닭갈비, 삼겹살, 불고기, 갈비찜 (Korean clichés)
    
    ### PAIRING STRATEGY (MANDATORY):
    
    **CRITICAL DIVERSITY RULES**:
    1. **TAG-DRIVEN PAIRING**: Each dish MUST echo 2-3 specific sensory tags from the profile above
       - If tags include "Honeyed Malt" + "Green Apple" → find a dish with honey and apple
       - If tags include "Spicy Ginger" + "Tropical Fruit" → suggest a dish with ginger and mango/pineapple
    2. **BE UNCONVENTIONAL**: Avoid obvious tourist foods or national stereotypes
    3. **REGIONAL SPECIFICITY**: Instead of broad categories, pick hyper-local specialties
       - ❌ "Indian curry", "Korean BBQ", "Japanese ramen"
       - ✅ "Konkani Sol Kadhi", "Andong Jjimdak", "Okinawan Rafute"
    4. **ROTATE CUISINES**: Do not default to the same 5 cuisines (Peru, Morocco, Japan, Korea, Scotland)
    5. **EXPLORE LESSER-KNOWN DISHES**: Think beyond restaurant menus
    
    **Pairing #1 - Terroir Choice (REQUIRED)**:
    - MUST be a traditional dish from the spirit's country of origin (${spirit.country})
    - **DO NOT** use the most famous dish from that country
    - Choose a REGIONAL SPECIALTY or lesser-known traditional preparation
    - **INGREDIENT MATCHING**: The dish MUST contain ingredients that mirror the sensory tags
      - Example: "Honeyed Malt" tag → dish with honey or malt-based ingredients
      - Example: "Citrus Zest" tag → dish with lemon, yuzu, or lime
    - For Scotland: avoid haggis, haddock → try Cullen Skink, Stovies, Clootie Dumpling
    - For Korea: avoid 삼겹살, 갈비 → try 추어탕, 간장게장, 보쌈김치
    - For Japan: avoid sushi, ramen → try Natto, Hoba Miso, Kusaya
    - Explain which specific sensory tags the dish complements
    
    **Pairing #2 - Global Adventure**:
    - A creative pairing from a DIFFERENT global cuisine (NOT ${spirit.country})
    - **AVOID** the usual suspects (Peru, Morocco, Scotland, France, Japan)
    - **EXPLORE**: Vietnamese, Filipino, Ethiopian, Georgian, Turkish, Nordic, Eastern European cuisines
    - **SENSORY BRIDGE**: Explain which 2-3 sensory tags from the profile are mirrored in the dish
      - Example: "Creamy Texture" + "Caramel Sweetness" → Georgian Satsivi (walnut cream sauce)
      - Example: "Smoky" + "Earthy" → Filipino Pinapaitan (bitter goat soup)
    - Focus on molecular harmony (Flavor Bridge) or Textural Contrast
    - Explain the scientific/structural reasoning based on specific tags
    
    ### OUTPUT JSON SCHEMA:
    Return an array with exactly 2 pairing objects:
    [
      {
        "pairing_guide_ko": "상세한 한국어 페어링 가이드 (3-4 문장). 반드시 2-3개의 구체적인 sensory tag를 언급하며, 해당 음식의 재료/조리법이 어떻게 그 태그와 연결되는지 설명.",
        "pairing_guide_en": "Detailed English pairing guide (3-4 sentences). MUST mention 2-3 specific sensory tags and explain how the dish's ingredients/preparation mirror those tags."
      },
      {
        "pairing_guide_ko": "상세한 한국어 페어링 가이드 (3-4 문장). 반드시 2-3개의 구체적인 sensory tag를 언급하며, 해당 음식의 재료/조리법이 어떻게 그 태그와 연결되는지 설명.",
        "pairing_guide_en": "Detailed English pairing guide (3-4 sentences). MUST mention 2-3 specific sensory tags and explain how the dish's ingredients/preparation mirror those tags."
      }
    ]
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log('[Gemini Pairing] Response:', text);

        const cleanJson = text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanJson);

        // Pairing returns an array of pairing guides, extract the fields we need
        if (Array.isArray(parsed) && parsed.length > 0) {
            return {
                pairing_guide_ko: parsed.map(p => p.pairing_guide_ko).join('\n\n'),
                pairing_guide_en: parsed.map(p => p.pairing_guide_en).join('\n\n')
            };
        }

        return parsed;
    } catch (e: any) {
        console.error('[Gemini Pairing] ❌ Error:', e);
        throw new Error(`Pairing guide failed: ${e.message}`);
    }
}

/**
 * BACKWARD COMPATIBILITY WRAPPER
 * Runs all 3 steps sequentially for bulk operations or full enrichment.
 */
export async function enrichSpiritWithAI(spirit: SpiritEnrichmentInput) {
    console.log('[Enrichment] 🚀 Starting enrichment for:', spirit.name);

    try {
        // Stage 1: Audit
        console.log('[Enrichment] 📋 Stage 1: Audit & Identity...');
        const auditData = await auditSpiritInfo(spirit);
        console.log('[Enrichment] ✅ Audit complete:', {
            name_en: auditData.name_en,
            distillery: auditData.distillery,
            country: auditData.country
        });

        // Stage 2: Sensory
        console.log('[Enrichment] 👃 Stage 2: Sensory Analysis...');
        const sensoryData = await generateSensoryData({
            ...spirit,
            ...auditData
        });
        console.log('[Enrichment] ✅ Sensory complete:', {
            nose_tags: sensoryData.nose_tags?.length || 0,
            palate_tags: sensoryData.palate_tags?.length || 0,
            finish_tags: sensoryData.finish_tags?.length || 0
        });

        // Stage 3: Pairing
        console.log('[Enrichment] 🍽️ Stage 3: Pairing Guide...');
        const pairingData = await generatePairingGuide({
            ...spirit,
            ...auditData,
            ...sensoryData
        });
        console.log('[Enrichment] ✅ Pairing complete');

        const finalData = {
            ...auditData,
            ...sensoryData,
            ...pairingData
        };

        console.log('[Enrichment] 🎉 All stages complete for:', spirit.name);
        return finalData;
    } catch (e: any) {
        console.error('[Enrichment] ❌ CRITICAL ERROR for', spirit.name, ':', e);
        console.error('[Enrichment] ❌ Error stack:', e.stack);
        throw e;
    }
}

/**
 * BACKWARD COMPATIBILITY WRAPPER
 * Just translates the name using the Audit logic.
 */
export async function translateSpiritName(name: string, category: string, distillery?: string) {
    const result = await auditSpiritInfo({ name, category, distillery });
    return { name_en: result.name_en };
}