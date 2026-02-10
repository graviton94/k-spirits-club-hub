import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || '';
const MODEL_ID = "gemini-2.0-flash";

if (!API_KEY) {
    console.error('[Gemini] 🔴 ERROR: GEMINI_API_KEY is missing from environment variables.');
}

// Category -> Subcategories mapping
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

// 1. Term Guidelines
const TERM_GUIDELINES_TEXT = `
- 'Makgeolli' for 막걸리/탁주 (Do not use Rice Wine)
- 'Distilled Soju' for 증류식 소주
- 'Yakju' or 'Cheongju' for 약주/청주
- 'Gwasilju' for 과실주
`;

// 2. Cliche Ban List
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
 * Uses Google Search to verify official product details.
 */
export async function auditSpiritInfo(spirit: SpiritEnrichmentInput): Promise<EnrichmentAuditResult> {
    if (!API_KEY) throw new Error("GEMINI_API_KEY is not set");
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // ✅ ENABLE SEARCH TOOL
    const model = genAI.getGenerativeModel({ 
        model: MODEL_ID, 
        tools: [{ googleSearch: {} }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.1 } 
    });

    const validSubcategories = CATEGORY_SUBCATEGORIES[spirit.category] || [];
    const subcategoryGuidance = validSubcategories.length > 0
        ? `\n### VALID SUBCATEGORIES: ${validSubcategories.join(', ')}`
        : '';

    const prompt = `
    🔍 **STRICT AUDIT PROTOCOL: OFFICIAL VERIFICATION REQUIRED**
    
    You are a Data Compliance Officer for a global spirits database.
    Your mandate is to verify product metadata against OFFICIAL SOURCES using Google Search.
    
    ### TARGET PRODUCT:
    - Name: "${spirit.name}"
    - Category: ${spirit.category}
    - Input Subcategory: ${spirit.subcategory || 'Unknown'}
    - Input Producer: ${spirit.distillery || 'Unknown'}
    
    ${subcategoryGuidance}

    ### SEARCH EXECUTION STEPS:
    1. **Identify the Official Entity**: Search for the official distillery/brewery website.
    2. **Verify Brand Name**: Find the clean consumer brand name (e.g., "Macallan" not "The Macallan Distillers Ltd").
    3. **Locate Origin**: Find the specific City/Region of production (e.g., "Speyside", "Kyoto").
    4. **Subcategory Match**: Align the product with the *Valid Subcategories* list based on technical classification.
    
    ### OUTPUT RULES:
    - **name_en**: MUST be English. No Korean. Official label name.
    - **distillery**: Remove legal suffixes (Ltd, Inc, Co). Use Title Case.
    - **region**: Specific region (e.g., "Bordeaux", "Highlands"), not just "France" or "Scotland".
    - **subcategory**: Must exactly match a valid option if applicable.
    
    ### OUTPUT JSON SCHEMA:
    {
      "name_en": "Official English Name",
      "category": "${spirit.category}",
      "subcategory": "Validated Subcategory",
      "distillery": "Clean Brand Name",
      "region": "Specific Region",
      "country": "Country",
      "abv": 0.0
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanJson = text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        const data = Array.isArray(parsed) ? parsed[0] : parsed;

        // Validation: Ensure name_en has no Korean
        if (data.name_en && /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(data.name_en)) {
             // Fallback cleanup if search returned Korean
             data.name_en = data.name_en.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '').trim();
        }

        // Validation: Ensure subcategory is valid
        if (validSubcategories.length > 0 && !validSubcategories.includes(data.subcategory)) {
            data.subcategory = spirit.subcategory || validSubcategories[0]; 
        }

        return data;
    } catch (e: any) {
        console.error('[Gemini Identity] ❌ Error:', e);
        // Fallback to input data on failure
        return {
            name_en: spirit.name_en || spirit.name,
            category: spirit.category,
            subcategory: spirit.subcategory || 'Unknown',
            distillery: spirit.distillery || 'Unknown',
            region: spirit.region || 'Unknown',
            country: spirit.country || 'Unknown',
            abv: spirit.abv || 0
        };
    }
}

/**
 * STEP 2: SENSORY ANALYSIS
 * Aggregates global reviews to form a consensus profile.
 */
export async function generateSensoryProfile(spirit: SpiritEnrichmentInput): Promise<EnrichmentSensoryResult> {
    if (!API_KEY) throw new Error("GEMINI_API_KEY is not set");
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // ✅ ENABLE SEARCH TOOL
    const model = genAI.getGenerativeModel({ 
        model: MODEL_ID, 
        tools: [{ googleSearch: {} }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.3 } 
    });

    const prompt = `
    🔍 **GLOBAL SENSORY CONSENSUS: AGGREGATE REAL REVIEWS**
    
    You are a Master Blender aggregating sensory data from global platforms (Vivino, Distiller, Whisky Advocate, RateBeer).
    Do NOT hallucinate. You must find the *consensus* of flavors from real user and professional reviews.
    
    TARGET PRODUCT: "${spirit.name}" (${spirit.category})
    
    ### ANALYSIS PROTOCOL:
    1. **Search**: Query for "${spirit.name} tasting notes", "flavor profile", and "reviews".
    2. **Consensus**: Identify descriptors mentioned by *multiple* sources. Ignore outliers.
    3. **Tags**: Extract 5-7 distinct tags for Nose, Palate, and Finish. Use specific adjectives (e.g., "Burnt Sugar" vs "Sugar").
    
    ### WRITING REQUIREMENTS:
    - **description_en**: Professional summary (4 sentences). Origin -> Key Flavors -> Texture -> Finish.
    - **description_ko**: High-quality Korean translation using sommelier vocabulary (e.g., "풍부한", "복합적인").
    - **tasting_note**: A narrative Korean tasting guide (Appearance -> Nose -> Palate -> Finish).
    
    ### OUTPUT JSON SCHEMA:
    {
      "description_ko": "Korean Description",
      "description_en": "English Description",
      "nose_tags": ["Tag1", "Tag2", ...],
      "palate_tags": ["Tag1", "Tag2", ...],
      "finish_tags": ["Tag1", "Tag2", ...],
      "tasting_note": "Narrative Tasting Note in Korean"
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanJson = text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        return Array.isArray(parsed) ? parsed[0] : parsed;
    } catch (e: any) {
        console.error('[Gemini Sensory] ❌ Error:', e);
        throw new Error(`Sensory analysis failed: ${e.message}`);
    }
}

/**
 * STEP 3: PAIRING GUIDE
 * Generates non-cliche, culturally verified food pairings.
 */
export async function generatePairingGuide(spirit: SpiritEnrichmentInput): Promise<EnrichmentPairingResult> {
    if (!API_KEY) throw new Error("GEMINI_API_KEY is not set");
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // ✅ ENABLE SEARCH TOOL
    const model = genAI.getGenerativeModel({ 
        model: MODEL_ID, 
        tools: [{ googleSearch: {} }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.5 } 
    });

    const prompt = `
    🔍 **GASTRONOMIC PAIRING ENGINE: NO CLICHES ALLOWED**
    
    You are a Michelin-star Sommelier.
    Generate specific pairings based on FLAVOR CHEMISTRY and REGIONAL TRADITION.
    
    TARGET: "${spirit.name}" (${spirit.category})
    REGION: ${spirit.region || 'Unknown'}
    
    ### STRICT PROHIBITIONS:
    ${CLICHE_BAN_LIST}
    
    ### PAIRING LOGIC (SEARCH REQUIRED):
    1. **Regional Match (Terroir)**: A specific dish from the spirit's exact origin region (e.g., "Haggis" for Highland Scotch, not just "Meat").
    2. **Flavor Bridge (Modern)**: A pairing that contrasts or complements the dominant notes found in the sensory analysis.
    
    ### OUTPUT JSON SCHEMA:
    {
      "pairing_guide_ko": "Detailed explanation of 2 distinct pairings in Korean. Explain WHY they work.",
      "pairing_guide_en": "Detailed explanation of 2 distinct pairings in English."
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
        // Step 1: Audit & Identity
        const auditData = await auditSpiritInfo(spirit);

        // Step 2: Sensory Analysis
        const sensoryData = await generateSensoryProfile({
            ...spirit,
            ...auditData // Use audited data for better accuracy
        });

        // Step 3: Pairing Guide
        const pairingData = await generatePairingGuide({
            ...spirit,
            ...auditData // Use audited data for regional pairings
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

export const generateSensoryData = generateSensoryProfile;
export { enrichSpiritWithAI as default };
