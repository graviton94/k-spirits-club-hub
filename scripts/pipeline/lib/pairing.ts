/**
 * pairing.ts — Stage 3: Gemini 페어링 가이드 (pairingGuideKo + pairingGuideEn)
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL_ID = 'gemini-2.0-flash';

export interface PairingInput {
    id: string;
    name: string;
    category: string;
    noseTags?: string[];
    palateTags?: string[];
    finishTags?: string[];
    tastingNote?: string;
    descriptionKo?: string;
}

export interface PairingOutput {
    pairingGuideKo: string;
    pairingGuideEn: string;
    nameEn: string;
    descriptionEn: string;
}

export async function runPairingStage(
    spirit: PairingInput,
    geminiApiKey: string
): Promise<PairingOutput> {
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_ID });

    const flavorSummary = [
        ...(spirit.noseTags ?? []),
        ...(spirit.palateTags ?? []),
        ...(spirit.finishTags ?? []),
    ].join(', ') || spirit.tastingNote || '(flavor data not yet available)';

    const prompt = `
너는 세계 최고의 푸드&드링크 페어링 전문가야.
아래 주류의 관능 프로파일을 바탕으로 페어링 가이드와 영문 정보를 작성해.

제품명: ${spirit.name}
카테고리: ${spirit.category}
향미 요약: ${flavorSummary}
한국어 설명: ${spirit.descriptionKo ?? ''}

[작성 지침]
1. pairingGuideKo: 어울리는 한국 음식 3가지 + 글로벌 안주 2가지를 2~3문장으로 (한국어).
2. pairingGuideEn: Same content in English, professional tone, 2~3 sentences.
3. nameEn: Official English product name (if known) or best romanized form.
4. descriptionEn: 1~2 sentence product introduction (English, engaging).

반드시 아래 JSON 형식으로만 응답 (Markdown 없이):
{
  "nameEn": "...",
  "descriptionEn": "...",
  "pairingGuideKo": "...",
  "pairingGuideEn": "..."
}
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    if (text.startsWith('```json')) text = text.slice(7);
    if (text.startsWith('```')) text = text.slice(3);
    if (text.endsWith('```')) text = text.slice(0, -3);

    const enriched = JSON.parse(text);

    return {
        nameEn: enriched.nameEn ?? '',
        descriptionEn: enriched.descriptionEn ?? '',
        pairingGuideKo: enriched.pairingGuideKo ?? '',
        pairingGuideEn: enriched.pairingGuideEn ?? '',
    };
}
