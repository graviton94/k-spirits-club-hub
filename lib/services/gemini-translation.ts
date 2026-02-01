import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || '';
const MODEL_ID = "gemini-2.0-flash";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_ID });

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
