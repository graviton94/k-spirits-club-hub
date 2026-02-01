import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || '';
const MODEL_ID = "gemini-2.0-flash";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_ID });

const TERM_GUIDELINES = `
- 'Makgeolli' for 막걸리
- 'Distilled Soju' for 증류식 소주
- 'Takju' for 탁주
- 'Yakju' for 약주
- 'Cheongju' for 청주
`;

export interface EnrichmentResult {
    name_en: string;
    description_en: string;
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
 * Enriches spirit data with AI-generated content.
 * Generates: name_en, description_en, pairing_guide_en, pairing_guide_ko
 * EDGE-COMPATIBLE: Does not use 'fs' or 'path'.
 */
export async function enrichSpiritWithAI(spirit: SpiritEnrichmentInput): Promise<EnrichmentResult> {
    if (!API_KEY) {
        throw new Error("GEMINI_API_KEY is not set");
    }

    // Extract tasting notes and other metadata
    const tastingNote = spirit.metadata?.tasting_note || spirit.metadata?.description || '';
    const noseTags = spirit.metadata?.nose_tags?.join(', ') || '';
    const palateTags = spirit.metadata?.palate_tags?.join(', ') || '';
    const finishTags = spirit.metadata?.finish_tags?.join(', ') || '';

    const prompt = `
You are an expert sommelier and translator specializing in Korean traditional spirits and global liquors.

**Spirit Details:**
- Name (Korean): ${spirit.name}
- Distillery: ${spirit.distillery || 'Unknown'}
- Category: ${spirit.category}${spirit.subcategory ? ` / ${spirit.subcategory}` : ''}
- Region: ${spirit.region || 'Unknown'}
- ABV: ${spirit.abv || 'Unknown'}%
- Tasting Notes: ${tastingNote}
- Nose: ${noseTags}
- Palate: ${palateTags}
- Finish: ${finishTags}

**Your Tasks:**

1. **name_en** - Translate the Korean name to English using these terminology rules:
${TERM_GUIDELINES}
   - Keep brand names as-is (romanized)
   - Follow format: [Brand/Distillery] [Product Name] [Edition/Age]
   - Use Title Case

2. **description_en** - Create a compelling 2-3 sentence description in English that:
   - Explains what this spirit is to someone unfamiliar with Korean spirits
   - Highlights unique characteristics based on the category, subcategory, and tasting notes
   - Mentions distillery heritage or regional significance if notable
   - Uses specific sensory details (e.g., "oak-aged", "floral notes", "smooth finish")
   - VARIES in structure and vocabulary - avoid repetitive phrasing
   - NO medical claims or exaggerated marketing

3. **pairing_guide_en** - Recommend 2-3 globally recognizable foods (2-3 sentences) that:
   - Match the spirit's flavor profile based on ABV, category, and tasting notes
   - Consider: lighter spirits → lighter foods, higher ABV → richer foods
   - Use international cuisine (e.g., BBQ ribs, grilled seafood, aged cheeses, spicy tacos, pasta carbonara)
   - Explain WHY the pairing works based on flavor harmony or contrast
   - VARY recommendations significantly based on the spirit's unique characteristics
   - Be specific and creative - no generic "pairs well with everything"

4. **pairing_guide_ko** - Korean translation of pairing_guide_en that:
   - Maintains the same food recommendations (don't change to Korean foods)
   - Uses natural, conversational Korean
   - Accurately conveys the reasoning behind pairings

**CRITICAL REQUIREMENTS:**
✓ Each spirit is unique - tailor your response to its specific ABV, region, and flavor profile
✓ Vary sentence structure, vocabulary, and recommendations 
✓ Use the provided tasting notes and metadata to inform your suggestions
✓ NO medical claims (e.g., "good for health", "aids digestion")
✓ NO generic marketing language
✓ Output ONLY valid JSON (no markdown formatting)

**Output JSON Format:**
{
  "name_en": "English Name",
  "description_en": "Detailed description...",
  "pairing_guide_en": "Food pairing recommendations...",
  "pairing_guide_ko": "음식 페어링 추천..."
}
`;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        let text = response.text().trim();

        // Clean up markdown formatting if present
        if (text.startsWith('```json')) text = text.slice(7);
        if (text.startsWith('```')) text = text.slice(3);
        if (text.endsWith('```')) text = text.slice(0, -3);
        text = text.trim();

        // Extract JSON (non-greedy to handle edge cases)
        const jsonMatch = text.match(/\{[\s\S]*?\}/);
        if (!jsonMatch) {
            throw new Error("No valid JSON found in AI response");
        }

        const enrichmentData: EnrichmentResult = JSON.parse(jsonMatch[0]);

        // Validate required fields
        if (!enrichmentData.name_en || !enrichmentData.description_en || 
            !enrichmentData.pairing_guide_en || !enrichmentData.pairing_guide_ko) {
            throw new Error("AI response missing required fields");
        }

        return enrichmentData;
    } catch (error) {
        console.error(`Gemini Enrichment Error for ${spirit.name}:`, error);
        throw error;
    }
}

/**
 * Translates spirit name and description to English specialized for the liquor industry.
 * Optimized for SEO and correct terminology.
 * EDGE-COMPATIBLE: Does not use 'fs' or 'path'.
 */
export async function translateSpiritName(name: string, category: string, brewery?: string): Promise<{ name_en: string }> {
    if (!API_KEY) {
        throw new Error("GEMINI_API_KEY is not set");
    }

    const prompt = `
당신은 고급 주류 전문 번역가이자 SEO 전문가입니다. 
한국어 주류 제품명을 영어권 소비자가 이해하기 쉽고 검색에 최적화된 형태로 번역하세요.

[특수 용어 번역 지침]
- 탁주, 막걸리 -> Makgeolli (Takju 병행 표기 지양, Makgeolli 우선)
- 약주, 청주 -> Yakju 또는 Cheongju (제품의 성격에 따라 선택, 일반적으로 Yakju)
- 증류식 소주 -> Distilled Soju (Korean Spirit)
- 희석식 소주 -> Soju
- 고유 명사(브랜드명): 소리나는 대로 표기(Romanization)하되, 의미가 중요한 경우 괄호 안에 병기 가능.
- 순서: [브랜드/제조사] [제품명] [에디션/숙성년수]

대상 정보:
- 제품명(국문): ${name}
- 카테고리: ${category}
- 제조사: ${brewery || 'Unknown'}

번역 시 주의사항:
- "술", "주"와 같은 접미사는 문맥에 따라 생략하거나 'Liquor', 'Spirit' 등으로 적절히 번역.
- 불필요한 관사나 미사여구 배제.
- 대문자 표기 규칙 준수 (Title Case).

반드시 아래 JSON 형식으로만 응답해 (Markdown 없이):
{
  "name_en": "Translated English Name"
}
`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();

        if (text.startsWith('```json')) text = text.slice(7);
        if (text.endsWith('```')) text = text.slice(0, -3);

        return JSON.parse(text);
    } catch (error) {
        console.error(`Gemini Translation Error for ${name}:`, error);
        return { name_en: name }; // Fallback to Korean name
    }
}
