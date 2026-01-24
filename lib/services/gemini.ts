import { GoogleGenerativeAI } from '@google/generative-ai';
import { Spirit } from '../db/schema';
import metadataFn from '../constants/spirits-metadata.json';

const API_KEY = process.env.GEMINI_API_KEY || '';
const MODEL_ID = "gemini-2.0-flash";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_ID });

const METADATA = metadataFn as any;

function getCategoryPrompt(category: string): string {
    const catLower = (category || '').toLowerCase();
    if (catLower.includes('whisky') || catLower.includes('위스키')) {
        return `- 위스키 카테고리 가이드: ${JSON.stringify(METADATA.categories.whisky)}`;
    } else if (catLower.includes('gin') || catLower.includes('진')) {
        return `- 진(Gin) 카테고리 가이드: ${JSON.stringify(METADATA.categories.gin || [])}`;
    } else if (catLower.includes('rum') || catLower.includes('럼')) {
        return `- 럼(Rum) 카테고리 가이드: ${JSON.stringify(METADATA.categories.rum || [])}`;
    }
    return `- 일반/기타 주류 가이드: ${JSON.stringify(METADATA.categories.korean_spirits || [])}`;
}

export async function enrichSpiritMetadata(spirit: Spirit): Promise<Partial<Spirit>> {
    if (!API_KEY) {
        throw new Error("GEMINI_API_KEY is not set");
    }

    const categoryGuide = getCategoryPrompt(spirit.category);
    const tagIndex = METADATA.tag_index;

    const prompt = `
너는 세계 최고의 마스터 블렌더이자 주류 전문 소믈리에야. 
아래 주류 정보를 분석하여 전문적인 테이스팅 데이터와 정밀한 카테고리 분류를 수행해줘.

대상 주류:
이름: ${spirit.name} (ID: ${spirit.id})
증류소: ${spirit.distillery}
카테고리: ${spirit.category}

[카테고리 가이드]
${categoryGuide}

[테이스팅 태그 인덱스 가이드]
- 아래 태그들을 참고하여 각 항목별로 적합한 해시태그를 3~5개씩 선택해.
- 향(Nose): ${JSON.stringify(tagIndex.nose)}
- 맛/질감(Palate): ${JSON.stringify(tagIndex.palate)}
- 여운(Finish): ${JSON.stringify(tagIndex.finish)}

[작성 규칙]
1. abv: 정보가 없다면 0.0으로 둬.
2. subcategory: 위 가이드의 표준 명칭을 사용해.
3. Tags: 각 영역(nose, palate, finish)에 대해 반드시 위 인덱스의 단어를 해시태그(#) 형식으로 포함해.
4. description: 제품에 대한 매력적인 소개글을 1-2문장으로 작성해(한국어).

반드시 아래 JSON 형식으로만 응답해 (Markdown 없이):
{
  "abv": 40.0,
  "region": "상세 지역",
  "subcategory": "표준 카테고리명",
  "distillery_refined": "공식 제조소 명칭",
  "nose_tags": ["#태그1"],
  "palate_tags": ["#태그2"],
  "finish_tags": ["#태그3"],
  "description": "설명"
}
`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();

        if (text.startsWith('```json')) text = text.slice(7);
        if (text.endsWith('```')) text = text.slice(0, -3);

        const enriched = JSON.parse(text);

        return {
            abv: enriched.abv || spirit.abv,
            subcategory: enriched.subcategory || spirit.subcategory,
            region: enriched.region || spirit.region,
            distillery: enriched.distillery_refined || spirit.distillery,
            metadata: {
                ...spirit.metadata,
                nose_tags: enriched.nose_tags,
                palate_tags: enriched.palate_tags,
                finish_tags: enriched.finish_tags,
                description: enriched.description,
                tasting_note: [...(enriched.nose_tags || []), ...(enriched.palate_tags || []), ...(enriched.finish_tags || [])].join(', ')
            },
            status: 'ENRICHED',
            updatedAt: new Date()
        };
    } catch (error) {
        console.error(`Gemini Enrichment Error for ${spirit.name}:`, error);
        throw error;
    }
}
