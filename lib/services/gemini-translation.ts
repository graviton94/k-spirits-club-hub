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

// Term guidelines
const TERM_GUIDELINES_TEXT = `
- 'Makgeolli' for 막걸리/탁주 (Do not use Rice Wine)
- 'Distilled Soju' for 증류식 소주
- 'Yakju' or 'Cheongju' for 약주/청주
- 'Gwasilju' for 과실주
`;

// Cliche ban list
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
    category_en?: string;
    subcategory?: string;
    confidence_score: number;
    sources?: string[];
}

export interface EnrichmentSensoryResult {
    description_ko: string;
    description_en: string;
    nose_tags: string[];
    palate_tags: string[];
    finish_tags: string[];
    tasting_note: string;
    confidence_score: number;
    sources?: string[];
}

export interface EnrichmentPairingResult {
    pairing_guide_ko: string;
    pairing_guide_en: string;
    confidence_score: number;
    sources?: string[];
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
 * PHASE 1: IDENTITY & AUDIT
 * Discovers and verifies product facts using official records.
 */
export async function auditSpiritInfo(spirit: SpiritEnrichmentInput): Promise<EnrichmentAuditResult> {
    if (!API_KEY) throw new Error("GEMINI_API_KEY is not set");
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_ID, generationConfig: { responseMimeType: "application/json", temperature: 0.1 } });

    const categoryKey = spirit.category;
    const validSubcategories = CATEGORY_SUBCATEGORIES[categoryKey] || [];
    const subcategoryGuidance = validSubcategories.length > 0
        ? `\n### VALID SUBCATEGORIES for "${categoryKey}":\n${validSubcategories.join(', ')}\n\nYou MUST choose the most appropriate subcategory from this list.`
        : '';

    const prompt = `
    🔍 **MISSION: OFFICIAL DATA DISCOVERY & AUDIT**
    
    You are a Professional Spirits Researcher & Data Auditor. Your mission is to verify the physical facts of this product.
    YOU MUST use Google Search to find official records (Distillery Website, Food Safety Portal, Master of Malt, etc.).
    
    ### PRODUCT TO AUDIT:
    - Product Name: "${spirit.name}"
    - Current Category: ${spirit.category} (LOCKED)
    - Reported ABV: ${spirit.abv}%
    - Reported Producer: ${spirit.distillery || 'Unknown'}
    
    ${subcategoryGuidance}

    ### MANDATORY INVESTIGATION PROTOCOL:
    1. OFFICIAL SOURCING: Search "${spirit.name} official site" to find exact ABV, Distillery, and Region.
    2. BRAND NORMALIZATION: Use clean brand names (e.g., "Macallan" not "The Macallan Distillers Ltd").
    3. GEOGRAPHICAL AUDIT: Find the specific city/region of the producer.
    
    ### OUTPUT JSON SCHEMA:
    {
      "name_en": "Official English Name (Title Case)",
      "category": "${spirit.category}",
      "category_en": "Category Translation",
      "subcategory": "EXACT MATCH from valid subcategories list",
      "distillery": "Cleaned Brand Name",
      "region": "Specific Region/City",
      "country": "Country of Origin",
      "abv": number,
      "confidence_score": number (0.0-1.0),
      "sources": ["URL1", "URL2"]
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanJson = text.replace(/```json|```/g, '').trim();
        const data = JSON.parse(cleanJson);
        
        // Defensive defaults
        data.category = spirit.category; 
        data.confidence_score = typeof data.confidence_score === 'number' ? data.confidence_score : 0;
        data.sources = Array.isArray(data.sources) ? data.sources : [];
        
        return data;
    } catch (e: any) {
        console.error('[Gemini Audit] Failed:', e);
        return {
            name_en: spirit.name_en || spirit.name,
            category: spirit.category,
            distillery: spirit.distillery || 'Unknown',
            region: spirit.region || 'Unknown',
            country: spirit.country || 'Unknown',
            abv: spirit.abv || 0,
            confidence_score: 0,
            sources: []
        };
    }
}

/**
 * PHASE 2: COMMUNITY SENSORY
 * Extracts flavor profiles from real user reviews.
 */
export async function generateSensoryProfile(spirit: SpiritEnrichmentInput): Promise<EnrichmentSensoryResult> {
    if (!API_KEY) throw new Error("GEMINI_API_KEY is not set");
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_ID, generationConfig: { responseMimeType: "application/json", temperature: 0.5 } });

    const prompt = `
    🔍 **MISSION: COMMUNITY SENSORY DISCOVERY**
    
    You are a Spirits Sommelier researching community sentiment.
    YOU MUST search sites like Whiskybase, Vivino, Reddit, and rating forums for real user reviews of: "${spirit.name}".
    
    ### INVESTIGATION PROTOCOL:
    1. IDENTIFY REAL TAGS: Find descriptors users actually use (e.g., "Vanilla", "Peat Smoke").
    2. CROSS-REFERENCE: Compare official notes with user feedback. If users say "it's salty" but official notes don't, include "Salt" in the tags.
    3. DETAILED STORY: Write 4-5 sentences capturing the "Journey" of drinking this spirit.
    
    ### OUTPUT JSON SCHEMA:
    {
      "description_ko": "Detailed Korean description",
      "description_en": "Detailed English description",
      "nose_tags": ["Tag1", "Tag2"],
      "palate_tags": ["Tag1", "Tag2"],
      "finish_tags": ["Tag1", "Tag2"],
      "tasting_note": "Sommelier-style detailed note",
      "confidence_score": number,
      "sources": ["URL1", "URL2"]
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanJson = text.replace(/```json|```/g, '').trim();
        const data = JSON.parse(cleanJson);
        
        // Defensive defaults
        data.confidence_score = typeof data.confidence_score === 'number' ? data.confidence_score : 0;
        data.sources = Array.isArray(data.sources) ? data.sources : [];
        
        return data;
    } catch (e: any) {
        console.error('[Gemini Sensory] Failed:', e);
        return {
            description_ko: spirit.name,
            description_en: spirit.name,
            nose_tags: [],
            palate_tags: [],
            finish_tags: [],
            tasting_note: spirit.name,
            confidence_score: 0,
            sources: []
        };
    }
}

/**
 * PHASE 3: SOMMELIER & PAIRING
 * Generates context-rich food pairings.
 */
export async function generatePairingGuide(spirit: SpiritEnrichmentInput): Promise<EnrichmentPairingResult> {
    if (!API_KEY) throw new Error("GEMINI_API_KEY is not set");
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_ID, generationConfig: { responseMimeType: "application/json", temperature: 0.8 } });

    const prompt = `
    🔍 **MISSION: CONTEXTUAL PAIRING DISCOVERY**
    
    Search for "Real-world food pairings" for: "${spirit.name}".
    Look for Instagram posts, sommelier blogs, and Reddit "What I ate with this" threads.
    
    ### PAIRING RULES:
    1. Avoid generic pairings (Steak, Cheese).
    2. Find a "Terroir Pairing" (Traditional dish from the region).
    3. Find a "Creative Pairing" (Innovative combo found in reviews).
    
    ### OUTPUT JSON SCHEMA:
    {
      "pairing_guide_ko": "Pairing explanation in Korean",
      "pairing_guide_en": "Pairing explanation in English",
      "confidence_score": number,
      "sources": ["URL1", "URL2"]
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanJson = text.replace(/```json|```/g, '').trim();
        const data = JSON.parse(cleanJson);
        
        // Defensive defaults
        data.confidence_score = typeof data.confidence_score === 'number' ? data.confidence_score : 0;
        data.sources = Array.isArray(data.sources) ? data.sources : [];
        
        return data;
    } catch (e: any) {
        console.error('[Gemini Pairing] Failed:', e);
        return {
            pairing_guide_ko: "추천 음식이 없습니다.",
            pairing_guide_en: "No recommended pairings.",
            confidence_score: 0,
            sources: []
        };
    }
}

/**
 * ORCHESTRATOR: ENRICH SPIRIT WITH AI
 * Manages the multi-phase discovery pipeline.
 */
export async function enrichSpiritWithAI(spirit: SpiritEnrichmentInput): Promise<any> {
    console.log('[Gemini Enrichment] 🚀 Phase 1: Identity & Audit for:', spirit.name);
    
    try {
        const auditData = await auditSpiritInfo(spirit);
        
        console.log('[Gemini Enrichment] 🚀 Phase 2: Community Sensory...');
        const sensoryData = await generateSensoryProfile({
            ...spirit,
            ...auditData,
            subcategory: auditData.subcategory || spirit.subcategory
        });

        console.log('[Gemini Enrichment] 🚀 Phase 3: Sommelier & Pairing...');
        const pairingData = await generatePairingGuide({
            ...spirit,
            ...auditData,
            ...sensoryData,
            subcategory: auditData.subcategory || spirit.subcategory
        });

        const conf1 = typeof auditData.confidence_score === 'number' ? auditData.confidence_score : 0;
        const conf2 = typeof sensoryData.confidence_score === 'number' ? sensoryData.confidence_score : 0;
        const conf3 = typeof pairingData.confidence_score === 'number' ? pairingData.confidence_score : 0;

        const totalConfidence = (conf1 + conf2 + conf3) / 3;
        const allSources = [...(auditData.sources || []), ...(sensoryData.sources || []), ...(pairingData.sources || [])];

        console.log('[Gemini Enrichment] ✅ Enrichment complete. Avg confidence:', totalConfidence);

        return {
            ...auditData,
            ...sensoryData,
            ...pairingData,
            admin_status: totalConfidence < 0.7 ? "needs_review" : "verified",
            metadata: {
                confidence: totalConfidence,
                sources: Array.from(new Set(allSources))
            }
        };
    } catch (e: any) {
        console.error('[Gemini Enrichment] ❌ Orchestration failed:', e);
        throw new Error(`AI enrichment failed: ${e.message}`);
    }
}

export default enrichSpiritWithAI;