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
    nameEn: string;
    distillery: string;
    region: string;
    country: string;
    abv: number;
    category: string;
    categoryEn?: string;
    subcategory?: string;
    confidenceScore: number;
    sources?: string[];
}

export interface EnrichmentSensoryResult {
    descriptionKo: string;
    descriptionEn: string;
    noseTags: string[];
    palateTags: string[];
    finishTags: string[];
    tastingNote: string;
    confidenceScore: number;
    sources?: string[];
}

export interface EnrichmentPairingResult {
    pairingGuideKo: string;
    pairingGuideEn: string;
    confidenceScore: number;
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
    nameEn?: string;
    descriptionEn?: string;
    descriptionKo?: string;
    noseTags?: string[];
    palateTags?: string[];
    finishTags?: string[];
    metadata?: {
        tasting_note?: string;
        description?: string;
        [key: string]: any;
    };
}

/**
 * Robust JSON extraction and parsing helper.
 */
function extractAndParseJSON(text: string): any {
    try {
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
        const rawJson = jsonMatch ? jsonMatch[1] : text;
        const cleaned = rawJson.trim()
            .replace(/^[^{]*/, '')
            .replace(/[^}]*$/, '');
        return JSON.parse(cleaned);
    } catch (e) {
        console.error('[Gemini Parser] Raw Output:', text);
        throw new Error('Failed to parse AI response as JSON');
    }
}

/**
 * PHASE 0: TRANSLATION & NAMING
 * Lightweight version for rapid UI translation.
 */
export async function translateSpiritName(name: string, category: string, distillery?: string): Promise<{ nameEn: string }> {
    if (!API_KEY) throw new Error("GEMINI_API_KEY is not set");
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_ID });

    const prompt = `
    Translate the following Korean traditional spirit name to a clean, merchant-friendly English name.
    Name: ${name}
    Category: ${category}
    Distillery: ${distillery || 'Unknown'}

    Return JSON block: { "nameEn": "English Name" }
    `;

    try {
        const result = await model.generateContent(prompt);
        const data = extractAndParseJSON(result.response.text());
        return { nameEn: data.nameEn || data.name_en || name };
    } catch (e) {
        return { nameEn: name };
    }
}

/**
 * PHASE 1: IDENTITY & AUDIT
 */
export async function auditSpiritInfo(spirit: SpiritEnrichmentInput): Promise<EnrichmentAuditResult> {
    if (!API_KEY) throw new Error("GEMINI_API_KEY is not set");
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: MODEL_ID, 
        tools: [{ googleSearch: {} }] as any,
        generationConfig: { temperature: 0.1 } 
    });

    const categoryKey = spirit.category;
    const validSubcategories = CATEGORY_SUBCATEGORIES[categoryKey] || [];
    const subcategoryGuidance = validSubcategories.length > 0
        ? `\n### VALID SUBCATEGORIES for "${categoryKey}":\n${validSubcategories.join(', ')}\n\nYou MUST choose the most appropriate subcategory from this list.`
        : '';

    const prompt = `
    🔍 **MISSION: OFFICIAL DATA DISCOVERY & AUDIT**
    Product Name: "${spirit.name}"
    Current Category: ${spirit.category} (LOCKED)
    Reported ABV: ${spirit.abv}%
    Reported Producer: ${spirit.distillery || 'Unknown'}
    ${subcategoryGuidance}
    
    ### INVESTIGATION PROTOCOL:
    1. SEARCH: "${spirit.name}" "${spirit.distillery || ''}" official site datasheet pdf.
    2. SOURCING: Find exact ABV, Distillery, and Region.
    3. ASSETS: Prioritize links to official catalogs or PDF datasheets.
    4. NORMALIZATION: Clean brand names.
    5. GEOGRAPHY: Find specific producer city/region.

    ### OUTPUT JSON SCHEMA:
    {
      "nameEn": "Official English Name",
      "category": "${spirit.category}",
      "categoryEn": "Category Translation",
      "subcategory": "EXACT MATCH from valid list",
      "distillery": "Cleaned Brand Name",
      "region": "Specific Region/City",
      "country": "Country of Origin",
      "abv": number,
      "confidenceScore": number,
      "sources": ["URL1", "URL2"]
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const data = extractAndParseJSON(result.response.text());
        data.category = spirit.category; 
        return data;
    } catch (e: any) {
        console.error('[Gemini Audit] Failed:', e);
        return {
            nameEn: spirit.nameEn || spirit.name,
            category: spirit.category,
            distillery: spirit.distillery || 'Unknown',
            region: spirit.region || 'Unknown',
            country: spirit.country || 'Unknown',
            abv: spirit.abv || 0,
            confidenceScore: 0,
            sources: []
        };
    }
}

/**
 * PHASE 2: COMMUNITY SENSORY
 */
export async function generateSensoryProfile(spirit: SpiritEnrichmentInput): Promise<EnrichmentSensoryResult> {
    if (!API_KEY) throw new Error("GEMINI_API_KEY is not set");
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: MODEL_ID, 
        tools: [{ googleSearch: {} }] as any,
        generationConfig: { temperature: 0.5 } 
    });

    const prompt = `
    🔍 **MISSION: COMMUNITY SENSORY DISCOVERY**
    Target: "${spirit.name}" (${spirit.category})
    Producer: "${spirit.distillery || ''}"
    
    1. SEARCH: "${spirit.name}" reviews sensory notes.
    2. TAGS: Find descriptors from sites like Whiskybase, Vivino, Reddit.
    3. STORY: Write 4-5 sentences in Korean and English.

    {
      "descriptionKo": "Detailed Korean story",
      "descriptionEn": "Detailed English story",
      "noseTags": ["Tag1", "Tag2"],
      "palateTags": ["Tag1", "Tag2"],
      "finishTags": ["Tag1", "Tag2"],
      "tastingNote": "Sommelier detailed note",
      "confidenceScore": number,
      "sources": ["URL1", "URL2"]
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const data = extractAndParseJSON(result.response.text());
        return data;
    } catch (e: any) {
        console.error('[Gemini Sensory] Failed:', e);
        return {
            descriptionKo: spirit.name,
            descriptionEn: spirit.name,
            noseTags: [],
            palateTags: [],
            finishTags: [],
            tastingNote: spirit.name,
            confidenceScore: 0,
            sources: []
        };
    }
}

/**
 * PHASE 3: SOMMELIER & PAIRING
 */
export async function generatePairingGuide(spirit: SpiritEnrichmentInput): Promise<EnrichmentPairingResult> {
    if (!API_KEY) throw new Error("GEMINI_API_KEY is not set");
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: MODEL_ID, 
        tools: [{ googleSearch: {} }] as any,
        generationConfig: { temperature: 0.8 } 
    });

    const prompt = `
    🔍 **MISSION: CONTEXTUAL PAIRING DISCOVERY**
    Search for food pairings for: "${spirit.name}" by "${spirit.distillery || ''}".
    {
      "pairingGuideKo": "Korean pairing text",
      "pairingGuideEn": "English pairing text",
      "confidenceScore": number,
      "sources": ["URL1", "URL2"]
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const data = extractAndParseJSON(result.response.text());
        return data;
    } catch (e: any) {
        console.error('[Gemini Pairing] Failed:', e);
        return {
            pairingGuideKo: "추천 음식이 없습니다.",
            pairingGuideEn: "No recommendations.",
            confidenceScore: 0,
            sources: []
        };
    }
}

/**
 * ORCHESTRATOR: ENRICH SPIRIT WITH AI
 */
export async function enrichSpiritWithAI(spirit: SpiritEnrichmentInput): Promise<any> {
    console.log('[Gemini Enrichment] 🚀 Starting discovery for:', spirit.name);
    try {
        const auditData = await auditSpiritInfo(spirit);
        const sensoryData = await generateSensoryProfile({ ...spirit, ...auditData });
        const pairingData = await generatePairingGuide({ ...spirit, ...auditData, ...sensoryData });

        const totalConfidence = ((auditData.confidenceScore || 0) + (sensoryData.confidenceScore || 0) + (pairingData.confidenceScore || 0)) / 3;
        const allSources = [...(auditData.sources || []), ...(sensoryData.sources || []), ...(pairingData.sources || [])];

        return {
            ...auditData,
            ...sensoryData,
            ...pairingData,
            status: totalConfidence < 0.7 ? "NEEDS_REVIEW" : "ENRICHED",
            metadata: {
                confidence: totalConfidence,
                sources: Array.from(new Set(allSources))
            }
        };
    } catch (e: any) {
        console.error('[Gemini Enrichment] ❌ Discovery failed:', e);
        throw new Error(`AI discovery failed: ${e.message}`);
    }
}

/**
 * Generates only Korean and English descriptions based on raw facts/tags.
 */
export async function generateDescriptionOnly(spiritData: any): Promise<{ descriptionKo: string; descriptionEn: string }> {
    if (!API_KEY) throw new Error("GEMINI_API_KEY is not set");
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_ID });

    const prompt = `
    Based on the following facts and sensory tags for this spirit, wrap them into a professional, engaging description in both Korean and English (about 3-4 sentences each).
    Name: ${spiritData.name}
    Category: ${spiritData.category}
    ABV: ${spiritData.abv}%
    Distillery: ${spiritData.distillery}
    Region: ${spiritData.region}
    Nose: ${spiritData.nose_tags?.join(', ') || ''}
    Palate: ${spiritData.palate_tags?.join(', ') || ''}
    Finish: ${spiritData.finish_tags?.join(', ') || ''}

    Return ONLY JSON:
    {
      "descriptionKo": "Korean text",
      "descriptionEn": "English text"
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const data = extractAndParseJSON(result.response.text());
        return {
            descriptionKo: data.descriptionKo || spiritData.name,
            descriptionEn: data.descriptionEn || spiritData.name_en || spiritData.name
        };
    } catch (e: any) {
        console.error('[Gemini Description] Failed:', e);
        return {
            descriptionKo: spiritData.name,
            descriptionEn: spiritData.name_en || spiritData.name
        };
    }
}

export default enrichSpiritWithAI;