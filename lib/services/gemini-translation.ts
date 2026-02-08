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
    "과실주": ["과실주", "사이더", "미드(벌꿀주)"],
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
    You are a meticulous liquor database auditor.
    Your goal is to verify and correct the basic identity of a spirit.
    
    ### INPUT:
    - Name: ${spirit.name}
    - Category: ${spirit.category} / ${spirit.subcategory || ''}
    - ABV: ${spirit.abv}
    - Distillery: ${spirit.distillery}
    - Region: ${spirit.region}
    - Country: ${spirit.country}
    ${subcategoryGuidance}

    ### INSTRUCTIONS:
    1. **English Name**: Create the OFFICIAL English product name (Title Case).
    2. **Audit**: Verify and correct Distillery, Country, Region, and ABV. Search web if needed.
    3. **Category & Subcategory**: Ensure category matches international standards. IMPORTANT: Select the correct subcategory from the provided list based on the product name and type.

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
 * Generates flavor descriptions and tags.
 */
export async function generateSensoryProfile(spirit: SpiritEnrichmentInput): Promise<EnrichmentSensoryResult> {
    if (!API_KEY) throw new Error("GEMINI_API_KEY is not set");
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_ID, generationConfig: { responseMimeType: "application/json", temperature: 0.8 } });

    const existingTastingNote = spirit.metadata?.tasting_note || spirit.metadata?.description || '';

    const prompt = `
    You are a sommelier and spirits expert.
    Create detailed tasting notes and flavor tags for this product.

    ### PRODUCT DETAILS:
    - Name: ${spirit.name}
    - Category: ${spirit.category} / ${spirit.subcategory || ''}
    - ABV: ${spirit.abv}%
    - Region: ${spirit.region || 'Unknown'}
    - Existing Notes: ${existingTastingNote || 'None'}

    ### INSTRUCTIONS:
    1. Write **description_ko**: Korean description (2-3 sentences, professional tone)
    2. Write **description_en**: English description (2-3 sentences, professional tone)
    3. Generate **nose_tags**: 3-5 aroma tags (Korean only, e.g., "바닐라", "꿀", "오크")
    4. Generate **palate_tags**: 3-5 taste tags (Korean only)
    5. Generate **finish_tags**: 3-5 finish tags (Korean only)
    6. Write **tasting_note**: Comprehensive tasting note in Korean (4-5 sentences)

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
    You are a world-class culinary expert and sommelier.
    Create TWO unique food pairing suggestions for this spirit.

    ### PRODUCT:
    - Name: ${spirit.name}
    - Category: ${spirit.category} / ${spirit.subcategory || ''}
    - Region: ${spirit.region || 'Unknown'}
    - Country: ${spirit.country || 'Unknown'}

    ### EXISTING PAIRINGS (MUST NOT REPEAT):
    ${existingPairings?.join('\n') || 'None'}
    
    **CRITICAL**: Do NOT suggest any dishes that appear in the existing pairings list above.

    ### BANNED CLICHÉS:
    ${CLICHE_BAN_LIST}

    ### PAIRING STRATEGY:
    1. **First Pairing (Terroir Choice)**: A traditional dish from the spirit's country/region of origin
    2. **Second Pairing (Global Adventure)**: A creative pairing from a different cuisine that complements the flavor profile

    Write in a sophisticated, editorial tone. Each pairing should be 2-3 sentences explaining WHY it works.

    ### OUTPUT JSON SCHEMA:
    {
      "pairing_guide_ko": "string (2 pairings, Korean)",
      "pairing_guide_en": "string (2 pairings, English)"
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