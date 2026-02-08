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
    - ✅ **Producer/Distillery**: Clean brand name (see rules below)
    - ✅ **Region**: Specific production region (see rules below)
    - ✅ **Country**: Country of production
    
    **CRITICAL RULES FOR DISTILLERY NAME**:
    - Use the SHORT, CLEAN brand name - NOT the full legal company name
    - Remove legal entities: "Ltd", "Inc", "GmbH", "KG", "G. SCHNEIDER & SOHN", etc.
    - Use Title Case, NOT ALL CAPS
    - Examples:
      ✅ Good: "Schneider Weisse" 
      ❌ Bad: "BRAUEREI SCHNEIDER WEISSE, G. SCHNEIDER & SOHN"
      ✅ Good: "Glenfiddich"
      ❌ Bad: "WILLIAM GRANT & SONS LTD"
    
    **CRITICAL RULES FOR REGION**:
    - If you found the distillery/brewery, you MUST also find its location
    - Region = City or production area (e.g., "Kelheim", "Speyside", "Jeju Island")
    - DO NOT return "Unknown" if you know the producer - that's impossible!
    - Search: "[Producer name] + location" to find the region
    
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
    
    ### CRITICAL OUTPUT FORMAT RULES:
    
    ⚠️ **name_en MUST BE IN ENGLISH ONLY - NO KOREAN CHARACTERS ALLOWED**
    ✅ Good: "Glenfiddich 12 Year Old Single Malt Scotch Whisky"
    ❌ Bad: "글렌피딕 12년산 싱글몰트 스카치 위스키"
    
    ⚠️ **subcategory MUST BE EXACT MATCH from the valid list above**
    ✅ Good: "Red Wine" (for Spanish red wines)
    ❌ Bad: "레드 와인" or "Red wine" or "red wine" (case-sensitive!)
    
    ### OUTPUT JSON SCHEMA:
    {
      "name_en": "ENGLISH ONLY - Official English Product Name (Title Case)",
      "category": "${spirit.category}",
      "subcategory": "EXACT MATCH from valid subcategories list above",
      "distillery": "Full producer name (from web search)",
      "region": "Specific region (from web search)",
      "country": "Country (from web search)",
      "abv": ABV as number (from web search)
    }
    
    ### EXAMPLE OUTPUT:
    For a Spanish red wine "Vi de Taula Negre":
    {
      "name_en": "Vi de Taula Negre",
      "category": "과실주",
      "subcategory": "Red Wine",
      "distillery": "Celler de Capcanes",
      "region": "Montsant",
      "country": "Spain",
      "abv": 13.5
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log('[Gemini Identity] ===== RAW RESPONSE =====', text);

        const cleanJson = text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanJson);

        // Handle if Gemini returns an array instead of a single object
        let data = Array.isArray(parsed) ? parsed[0] : parsed;

        // ⚠️ CRITICAL VALIDATION: Enforce output rules

        // 1. Validate name_en is actually English (no Korean characters)
        const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
        if (data.name_en && koreanRegex.test(data.name_en)) {
            console.warn('[Gemini Identity] ⚠️ name_en contains Korean! Auto-translating...');
            console.warn('[Gemini Identity] Original:', data.name_en);

            // Auto-translate Korean to English
            try {
                const translateModel = genAI.getGenerativeModel({
                    model: MODEL_ID,
                    generationConfig: { responseMimeType: "text/plain", temperature: 0.1 }
                });
                const translatePrompt = `Translate this Korean product name to English. Return ONLY the English name, nothing else:\n\n"${data.name_en}"`;
                const translateResult = await translateModel.generateContent(translatePrompt);
                const englishName = translateResult.response.text().trim().replace(/["""]/g, '');

                data.name_en = englishName;
                console.log('[Gemini Identity] ✅ Auto-translated to:', englishName);
            } catch (err) {
                console.error('[Gemini Identity] ❌ Translation failed, using original Korean name');
                // Keep the Korean name as last resort
            }
        }

        // 2. Validate subcategory is from valid list
        if (data.subcategory && validSubcategories.length > 0) {
            if (!validSubcategories.includes(data.subcategory)) {
                console.error('[Gemini Identity] ❌ Invalid subcategory:', data.subcategory);
                console.error('[Gemini Identity] Valid options:', validSubcategories);
                // Keep original subcategory
                data.subcategory = spirit.subcategory;
            }
        }

        // 3. Clean up distillery name if it's too formal or all caps
        if (data.distillery) {
            // Convert ALL CAPS to Title Case
            if (data.distillery === data.distillery.toUpperCase() && data.distillery.length > 3) {
                console.warn('[Gemini Identity] ⚠️ Distillery in ALL CAPS, converting to Title Case');
                data.distillery = data.distillery
                    .toLowerCase()
                    .split(' ')
                    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
            }

            // Remove common legal suffixes
            const legalSuffixes = [', Ltd', ', Inc', ', GmbH', ', KG', ', S.A.', ', Co.', 'Ltd.', 'Inc.'];
            legalSuffixes.forEach((suffix: string) => {
                if (data.distillery.includes(suffix)) {
                    data.distillery = data.distillery.replace(suffix, '').trim();
                }
            });
        }

        // 4. Validate region is not Unknown when distillery is known
        if (data.distillery && (data.region === 'Unknown' || !data.region)) {
            console.warn('[Gemini Identity] ⚠️ Region is Unknown but distillery is known. Searching for brewery location...');
            try {
                const regionModel = genAI.getGenerativeModel({
                    model: MODEL_ID,
                    generationConfig: { responseMimeType: "text/plain", temperature: 0.1 }
                });
                const regionPrompt = `What city or region is "${data.distillery}" located in? Return ONLY the city/region name, nothing else.`;
                const regionResult = await regionModel.generateContent(regionPrompt);
                const foundRegion = regionResult.response.text().trim().replace(/["""]/g, '');

                if (foundRegion && foundRegion !== 'Unknown') {
                    data.region = foundRegion;
                    console.log('[Gemini Identity] ✅ Found region:', foundRegion);
                }
            } catch (err) {
                console.error('[Gemini Identity] ❌ Region search failed');
            }
        }

        // 5. Ensure category is locked
        data.category = spirit.category;

        console.log('[Gemini Identity] subcategory:', data.subcategory, '| region:', data.region, '| country:', data.country);
        console.log('[Gemini Identity] name_en:', data.name_en);
        console.log('[Gemini Identity] distillery:', data.distillery);

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
    
    **STEP 2: EXTRACT RICH FLAVOR TAGS**
    From user reviews and professional notes, identify the TOP 5-7 most commonly mentioned flavors for EACH category:
    
    - **Nose (향)**: 5-7 specific aroma descriptors
      Examples: "Vanilla Pod", "Dark Caramel", "Toasted Oak", "Lemon Zest", "Wildflower Honey", "Green Apple", "Cinnamon"
    
    - **Palate (맛)**: 5-7 specific taste descriptors  
      Examples: "Dark Chocolate", "Black Pepper", "Dried Apricot", "Toffee", "Charred Wood", "Sea Salt", "Almond"
    
    - **Finish (여운)**: 5-7 specific aftertaste descriptors
      Examples: "Long", "Warming", "Sweet Spice", "Dry Oak", "Peppery Heat", "Smooth Vanilla", "Lingering Smoke"
    
    **CRITICAL RULES FOR TAGS**:
    - Be SPECIFIC: "Vanilla Pod" not just "Vanilla", "Dark Chocolate" not just "Chocolate"
    - Use 5-7 tags per category (not just 3)
    - Tags MUST be in English, based on actual user reviews
    - Include variety: primary flavors + secondary nuances + texture/mouthfeel descriptors
    
    **STEP 3: WRITE RICH, DETAILED DESCRIPTIONS**
    Based on the reviews you found, create comprehensive descriptions:
    
    **description_en (4-5 sentences in English)**:
    - Sentence 1: Production method, origin, or unique characteristics
    - Sentence 2-3: Key flavor profile and tasting notes from reviews
    - Sentence 4: Mouthfeel, texture, or finish characteristics
    - Sentence 5: Overall impression or recommended drinking style
    
    **description_ko (4-5 sentences in Korean)**:
    - Same structure as English, translated with professional tone
    - Use rich vocabulary and descriptive language
    
    **tasting_note (5-6 sentences in Korean)**:
    - More detailed expansion of the description
    - Include specific tasting journey: appearance → nose → palate → finish
    - Mention any unique production processes or aging
    - Professional sommelier tone
    
    ### OUTPUT RULES:
    - ALL flavor tags must come from actual reviews you found
    - Descriptions must be RICH and DETAILED (minimum 4-5 sentences each)
    - Use specific, evocative language - avoid generic phrases
    - If you cannot find reviews, research the spirit type and create educated tasting notes based on category characteristics
    
    ### OUTPUT JSON SCHEMA:
    {
      "description_ko": "Detailed Korean description (4-5 sentences, rich vocabulary)",
      "description_en": "Detailed English description (4-5 sentences, professional)",
      "nose_tags": ["Tag1", "Tag2", "Tag3"],
      "palate_tags": ["Tag1", "Tag2", "Tag3"],
      "finish_tags": ["Tag1", "Tag2", "Tag3"],
      "tasting_note": "Comprehensive Korean tasting note (5-6 sentences, sommelier tone)"
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