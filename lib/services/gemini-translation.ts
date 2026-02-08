import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || '';
const MODEL_ID = "gemini-2.0-flash";

if (!API_KEY) {
    console.error('[Gemini] 🔴 ERROR: GEMINI_API_KEY is missing from environment variables.');
}

// Category -> Subcategories mapping (inline to avoid JSON import issues in Edge Runtime)
const CATEGORY_SUBCATEGORIES: Record<string, string[]> = {
    "소주": ["희석식 소주", "증류식 소주", "혼카쿠 쇼추", "코루이 쇼추", "오토루이 쇼추", "이모 쇼추", "무기 쇼추", "코메 쇼추", "소바 쇼추", "아와모리", "숙성 아와모리"],
    "위스키": ["싱글 몰트 스카치 위스키", "블렌디드 스카치 위스키", "싱글 그레인 스카치 위스키", "블렌디드 몰트 스카치 위스키", "버번 위스키", "테네시 위스키", "라이 위스키", "콘 위스키", "아이리쉬 위스키", "일본 위스키", "캐나다 위스키", "타이완 위스키", "한국 위스키", "인도 위스키", "아우스트리아 위스키", "유럽 대륙 위스키"],
    "맥주": ["필스너", "헬레스", "듄켈", "복", "메르첸", "페일에일", "IPA", "잉글랜드 IPA", "벨지안 에일", "세종", "스타우트", "포터", "슈바르츠비어", "발틱 포터", "사워", "밀맥주", "오크 숙성 맥주", "가향 가당 맥주", "기타 맥주"],
    "일반증류주": ["런던 드라이 진", "플리머스 진", "올드 톰 진", "네이비 스트렝스 진", "제네버", "뉴 웨스턴 / 컨템포러리 진", "슬로 진", "스페니시 스타일 럼", "잉글리시 스타일 럼", "프렌치 스타일 럼(럼 아그리콜)", "오버프루프 럼", "스파이스드 럼", "카샤사", "블랑코", "레포사도", "아네호", "엑스트라 아네호", "크리스탈리노", "메즈칼", "오리지널 보드카", "플레이버드 보드카", "농향형", "장향형", "청향형", "미향형", "겸향형", "이과두주", "분주", "서봉주"],
    "탁주": ["탁주", "막걸리", "동동주"],
    "약주": ["약주", "청주", "한국 청주"],
    "사케": ["사케(니혼슈)", "준마이", "긴조", "다이긴조"],
    "포도주": ["와인", "스파클링 와인"],
    "과실주": ["Red Wine", "White Wine", "Rosé Wine", "Sparkling Wine", "Dessert Wine", "Fortified Wine", "과실주", "사이더", "미드(벌꿀주)"],
    "브랜디": ["코냑", "아르마냑", "깔바도스", "피스코", "그라파", "과일 브랜디"],
    "리큐르": ["우메슈", "과일 리큐르", "크림 리큐르", "커피 리큐르", "허브 리큐르", "향신료 리큐르", "비터스"]
};


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
 * NOW WITH SUBCATEGORY INFERENCE from metadata.json
 */
export async function auditSpiritInfo(spirit: SpiritEnrichmentInput): Promise<EnrichmentAuditResult> {
    if (!API_KEY) throw new Error("GEMINI_API_KEY is not set");
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_ID, generationConfig: { responseMimeType: "application/json", temperature: 0.2 } });

    // Get valid subcategories for the given category
    const categoryKey = spirit.category;
    const validSubcategories = CATEGORY_SUBCATEGORIES[categoryKey] || [];

    const subcategoryGuidance = validSubcategories.length > 0
        ? `\n### VALID SUBCATEGORIES for "${categoryKey}":\n${validSubcategories.join(', ')}\n\nYou MUST choose the most appropriate subcategory from this list based on the product name and characteristics. If unsure, use the first one.`
        : '';

    const prompt = `
    🔍 **CRITICAL: YOU MUST SEARCH THE WEB FOR ALL INFORMATION BELOW**
    
    You are a spirits database auditor. You MUST use web search to find factual, objective data.
    DO NOT make up or guess any information. If you cannot find data via web search, return the original value.
    
    ### PRODUCT TO RESEARCH:
    - Product Name: "${spirit.name}"
    - Current Category: ${spirit.category} (⚠️ LOCKED - return exactly as is)
    - Current Subcategory: ${spirit.subcategory || 'Unknown'}
    - Current ABV: ${spirit.abv}%
    - Current Producer: ${spirit.distillery || 'Unknown'}
    - Current Region: ${spirit.region || 'Unknown'}
    - Current Country: ${spirit.country || 'Unknown'}
    
    ${subcategoryGuidance}

    ### MANDATORY WEB SEARCH STEPS:
    
    **STEP 1: SEARCH THE PRODUCT**
    - Google: "${spirit.name}" + "spirits" OR "wine" OR "whisky"
    - Find OFFICIAL product pages (distillery/winery website, Master of Malt, Wine-Searcher, Vivino, etc.)
    
    **STEP 2: EXTRACT OBJECTIVE DATA**
    From official sources, find and verify:
    - ✅ **Official English Name**: Exact product name as written on the label
    - ✅ **ABV (Alcohol %)**: Exact percentage from the label/website
    - ✅ **Producer/Distillery**: Full legal name of the producer
    - ✅ **Region**: Specific production region (e.g., "Speyside", "Napa Valley", "Jeju Island")
    - ✅ **Country**: Country of production
    
    **STEP 3: DETERMINE SUBCATEGORY**
    
    **FOR WINES (Category "과실주"):**
    - Check wine color: Red/White/Rosé/Sparkling/Dessert/Fortified
    - Spanish/French/Italian/Chilean wines = grape wines → MUST use wine color subcategories
    - ONLY use "과실주"/"사이더" for fruit wines made from apples/plums/berries (NOT grapes)
    
    **FOR ALL OTHER SPIRITS:**
    - Match the product type to the most specific subcategory from the valid list
    - Use official product descriptions and classifications
    
    ### OUTPUT RULES:
    - Return ONLY data you found via web search
    - If you cannot find a field, return the original input value
    - DO NOT invent, guess, or hallucinate any information
    
    ### OUTPUT JSON SCHEMA:
    {
      "name_en": "Official English Product Name (from web search)",
      "category": "${spirit.category}",
      "subcategory": "From valid list, based on web search",
      "distillery": "Full producer name (from web search)",
      "region": "Specific region (from web search)",
      "country": "Country (from web search)",
      "abv": ABV as number (from web search)
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log('[Gemini Identity] ===== RAW RESPONSE =====', text);

        const cleanJson = text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanJson);

        // Handle if Gemini returns an array instead of a single object
        const data = Array.isArray(parsed) ? parsed[0] : parsed;

        console.log('[Gemini Identity] subcategory:', data.subcategory, '| region:', data.region, '| country:', data.country);
        return data;
    } catch (e: any) {
        console.error('[Gemini Identity] ❌ Error:', e);
        throw new Error(`Identity audit failed: ${e.message}`);
    }
}

/**
 * STEP 2: SENSORY ANALYSIS
 * Generates flavor descriptions and tags.
 */
export async function generateSensoryProfile(spirit: SpiritEnrichmentInput): Promise<EnrichmentSensoryResult> {
    if (!API_KEY) throw new Error("GEMINI_API_KEY is not set");
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_ID, generationConfig: { responseMimeType: "application/json", temperature: 0.8 } });

    const existingTastingNote = spirit.metadata?.tasting_note || spirit.metadata?.description || '';

    const prompt = `
    🔍 **CRITICAL: SEARCH THE WEB FOR USER REVIEWS & PROFESSIONAL TASTING NOTES**
    
    You are a spirits critic compiling objective data from real sources.
    DO NOT create fictional tasting notes. Find REAL reviews and flavor descriptors.
    
    ### PRODUCT TO RESEARCH:
    - Product: "${spirit.name}"
    - Type: ${spirit.category} / ${spirit.subcategory || ''}
    - ABV: ${spirit.abv}%
    - Region: ${spirit.region || 'Unknown'}
    - Existing Notes: ${existingTastingNote || 'None'}

    ### MANDATORY WEB SEARCH STEPS:
    
    **STEP 1: SEARCH FOR REVIEWS**
    Search these sources:
    - Google: "${spirit.name}" + "review" OR "tasting notes"
    - Whisky Advocate, Wine Enthusiast, Vivino, Distiller, Master of Malt
    - Reddit, user forums, rating sites
    
    **STEP 2: EXTRACT FLAVOR TAGS**
    From user reviews and professional notes, identify the TOP 3-5 most commonly mentioned flavors for:
    - **Nose (향)**: Aroma descriptors (e.g., "Vanilla", "Caramel", "Oak", "Citrus", "Honey")
    - **Palate (맛)**: Taste descriptors (e.g., "Chocolate", "Spice", "Fruit", "Smoke")
    - **Finish (여운)**: Aftertaste descriptors (e.g., "Long", "Sweet", "Peppery", "Smooth")
    
    **IMPORTANT**: Tags MUST be in English, based on actual user reviews, NOT made up!
    
    **STEP 3: WRITE DESCRIPTIONS**
    Based on the reviews you found:
    - **description_en**: 2-3 sentences summarizing common themes from reviews (English)
    - **description_ko**: Same content, translated to Korean (professional tone)
    - **tasting_note**: More detailed 4-5 sentence tasting note in Korean, synthesizing multiple reviews
    
    ### OUTPUT RULES:
    - ALL flavor tags must come from actual reviews you found
    - Descriptions must reflect real user/professional opinions, not your imagination
    - If you cannot find reviews, use generic tasting notes for the spirit type
    
    ### OUTPUT JSON SCHEMA:
    {
      "description_ko": "Korean description (2-3 sentences)",
      "description_en": "English description (2-3 sentences)",
      "nose_tags": ["Tag1", "Tag2", "Tag3"],
      "palate_tags": ["Tag1", "Tag2", "Tag3"],
      "finish_tags": ["Tag1", "Tag2", "Tag3"],
      "tasting_note": "Detailed Korean tasting note (4-5 sentences)"
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanJson = text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        const data = Array.isArray(parsed) ? parsed[0] : parsed;

        console.log('[Gemini Sensory] Generated tags:', data.nose_tags, data.palate_tags, data.finish_tags);
        return data;
    } catch (e: any) {
        console.error('[Gemini Sensory] ❌ Error:', e);
        throw new Error(`Sensory analysis failed: ${e.message}`);
    }
}

/**
 * STEP 3: PAIRING GUIDE
 * Generates food pairing recommendations.
 */
export async function generatePairingGuide(spirit: SpiritEnrichmentInput): Promise<EnrichmentPairingResult> {
    if (!API_KEY) throw new Error("GEMINI_API_KEY is not set");
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_ID, generationConfig: { responseMimeType: "application/json", temperature: 1.2 } });

    // Get existing pairings to avoid duplicates
    const existingPairings = [
        spirit.metadata?.pairing_guide_ko,
        spirit.metadata?.pairing_guide_en
    ].filter(Boolean);

    const prompt = `
    🔍 **SEARCH THE WEB FOR REAL FOOD PAIRING RECOMMENDATIONS**
    
    You are a sommelier compiling expert pairing suggestions.
    Find REAL pairing recommendations from sommeliers, not fictional ones.
    
    ### PRODUCT TO RESEARCH:
    - Product: "${spirit.name}"
    - Type: ${spirit.category} / ${spirit.subcategory || ''}
    - Region: ${spirit.region || 'Unknown'}
    - Country: ${spirit.country || 'Unknown'}
    
    ### EXISTING PAIRINGS (DO NOT REPEAT):
    ${existingPairings?.join('\n') || 'None'}
    
    ### BANNED CLICHÉS:
    ${CLICHE_BAN_LIST}

    ### WEB SEARCH STEPS:
    
    **STEP 1: SEARCH FOR PAIRING RECOMMENDATIONS**
    - Google: "${spirit.name}" + "food pairing" OR "what to eat with"
    - Check sommelier blogs, distillery websites, wine pairing guides
    - Reddit threads, food & wine magazines
    
    **STEP 2: SELECT TWO PAIRINGS**
    From your web search, select TWO unique pairings:
    1. **Terroir Pairing**: Traditional dish from the spirit's region/country (if available)
    2. **Creative Pairing**: Innovative pairing recommended by sommeliers/experts
    
    - DO NOT repeat any dishes from "EXISTING PAIRINGS" above
    - DO NOT use banned clichés
    - Explain WHY each pairing works (2-3 sentences each)
    
    ### OUTPUT JSON SCHEMA:
    {
      "pairing_guide_ko": "Two pairings in Korean (professional tone)",
      "pairing_guide_en": "Two pairings in English (professional tone)"
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanJson = text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        return Array.isArray(parsed) ? parsed[0] : parsed;
    } catch (e: any) {
        console.error('[Gemini Pairing] ❌ Error:', e);
        throw new Error(`Pairing guide generation failed: ${e.message}`);
    }
}

/**
 * MASTER ENRICHMENT FUNCTION
 * Orchestrates all AI enrichment steps.
 */
export async function enrichSpiritWithAI(spirit: SpiritEnrichmentInput): Promise<any> {
    console.log('[Gemini Enrichment] 🚀 Starting enrichment for:', spirit.name);

    try {
        // Step 1: Audit & Identity (includes subcategory inference)
        const auditData = await auditSpiritInfo(spirit);

        // Step 2: Sensory Analysis
        const sensoryData = await generateSensoryProfile({
            ...spirit,
            subcategory: auditData.subcategory || spirit.subcategory
        });

        // Step 3: Pairing Guide
        const pairingData = await generatePairingGuide({
            ...spirit,
            subcategory: auditData.subcategory || spirit.subcategory
        });

        console.log('[Gemini Enrichment] ✅ Enrichment complete');

        return {
            ...auditData,
            ...sensoryData,
            ...pairingData
        };
    } catch (e: any) {
        console.error('[Gemini Enrichment] ❌ Failed:', e);
        throw new Error(`AI enrichment failed: ${e.message}`);
    }
}

// Export aliases for backward compatibility
export const generateSensoryData = generateSensoryProfile;
export { enrichSpiritWithAI as default };