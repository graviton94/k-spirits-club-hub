/**
 * sensory.ts — Stage 2: Gemini 관능 분석 (Nose / Palate / Finish + tastingNote)
 * Re-uses the prompt architecture from lib/services/gemini.ts (enrichSpiritMetadata).
 * Calls Gemini 2.0 Flash and returns structured tag arrays.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import metadataFn from '../../../lib/constants/spirits-metadata.json';

const MODEL_ID = 'gemini-2.0-flash';

export interface SensoryInput {
    id: string;
    name: string;
    category: string;
    distillery?: string;
    abv?: number | null;
    region?: string;
    subcategory?: string;
}

export interface SensoryOutput {
    noseTags: string[];
    palateTags: string[];
    finishTags: string[];
    tastingNote: string;
    mainCategory: string | null;
    subcategory: string | null;
    region: string | null;
    distillery: string | null;
    abv: number | null;
    descriptionKo: string;
}

export async function runSensoryStage(
    spirit: SensoryInput,
    geminiApiKey: string
): Promise<SensoryOutput> {
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_ID });

    const tagIndex = (metadataFn as any).tag_index;
    const categoryStructure = JSON.stringify((metadataFn as any).categories, null, 2);

    const prompt = `
너는 세계 최고의 마스터 블렌더이자 주류 전문 소믈리에야.
아래 주류를 분석하여 전문적인 테이스팅 데이터와 카테고리 분류를 수행해.

대상 주류:
이름: ${spirit.name} (ID: ${spirit.id})
증류소: ${spirit.distillery ?? '미상'}
법적 카테고리: ${spirit.category} (변경 불가)
지역: ${spirit.region ?? '미상'}, ABV: ${spirit.abv ?? '미상'}

[전체 카테고리 구조]
${categoryStructure}

[테이스팅 태그 인덱스]
- 향(Nose): ${JSON.stringify(tagIndex?.nose ?? [])}
- 맛/질감(Palate): ${JSON.stringify(tagIndex?.palate ?? [])}
- 여운(Finish): ${JSON.stringify(tagIndex?.finish ?? [])}

[작성 규칙]
1. abv: 정보 없으면 0.0
2. mainCategory: "${spirit.category}" 바로 아래 중분류. 없으면 null.
3. subcategory: mainCategory 배열 내 소분류. 없으면 전문적 새 명칭 생성.
4. noseTags / palateTags / finishTags: 태그 인덱스에서 각 3~5개 선택, "#태그명" 형식.
5. tastingNote: noseTags + palateTags + finishTags를 조합한 1문장 요약.
6. descriptionKo: 제품 소개 1~2문장 (한국어, 매력적).

반드시 아래 JSON 형식으로만 응답 (Markdown 없이):
{
  "abv": 40.0,
  "mainCategory": "...",
  "subcategory": "...",
  "region": "...",
  "distillery": "...",
  "noseTags": ["#태그1"],
  "palateTags": ["#태그2"],
  "finishTags": ["#태그3"],
  "tastingNote": "...",
  "descriptionKo": "..."
}
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    if (text.startsWith('```json')) text = text.slice(7);
    if (text.startsWith('```')) text = text.slice(3);
    if (text.endsWith('```')) text = text.slice(0, -3);

    const enriched = JSON.parse(text);

    return {
        noseTags: enriched.noseTags ?? [],
        palateTags: enriched.palateTags ?? [],
        finishTags: enriched.finishTags ?? [],
        tastingNote: enriched.tastingNote ?? '',
        mainCategory: enriched.mainCategory ?? null,
        subcategory: enriched.subcategory ?? null,
        region: enriched.region ?? spirit.region ?? null,
        distillery: enriched.distillery ?? spirit.distillery ?? null,
        abv: enriched.abv ?? spirit.abv ?? null,
        descriptionKo: enriched.descriptionKo ?? '',
    };
}
