import { GoogleGenerativeAI } from '@google/generative-ai';
import { Spirit } from '../db/schema';
import metadataFn from '../constants/spirits-metadata.json';
import { inferHierarchy } from '../constants/categories';
import fs from 'fs/promises';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY || '';
const MODEL_ID = "gemini-2.0-flash";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_ID });

// We read this for initial prompt context, but for updates we'll read 'fs' to be safe against caching issues
const METADATA_PATH = path.join(process.cwd(), 'lib/constants/spirits-metadata.json');

function getCategoryPrompt(category: string): string {
    // Provide full category context for better matching
    return `전체 카테고리 구조: ${JSON.stringify(metadataFn.categories, null, 2)}`;
}

/**
 * Updates the spirits-metadata.json file if a new subcategory is discovered.
 */
async function updateMetadataFile(category: string, mainCategory: string | null, subcategory: string) {
    if (!subcategory) return;

    try {
        const fileContent = await fs.readFile(METADATA_PATH, 'utf-8');
        const metadata = JSON.parse(fileContent);
        const categories = metadata.categories;

        let updated = false;

        // Locate the array to insert into
        if (categories[category]) {
            const catData = categories[category];

            // Nested Structure (e.g. Whisky -> Scotch -> [])
            if (mainCategory && typeof catData === 'object' && !Array.isArray(catData)) {
                if (catData[mainCategory] && Array.isArray(catData[mainCategory])) {
                    if (!catData[mainCategory].includes(subcategory)) {
                        console.log(`[Metadata] Adding new subcategory '${subcategory}' to ${category} > ${mainCategory}`);
                        catData[mainCategory].push(subcategory);
                        updated = true;
                    }
                }
                // If mainCategory missing but valid? (Handling edge case: user might need to add mainCategory logic too? for now assuming mainCategory exists)
            }
            // Flat Structure (e.g. Gin -> [])
            else if (Array.isArray(catData)) {
                if (!catData.includes(subcategory)) {
                    console.log(`[Metadata] Adding new subcategory '${subcategory}' to ${category}`);
                    catData.push(subcategory);
                    updated = true;
                }
            }
        }

        if (updated) {
            await fs.writeFile(METADATA_PATH, JSON.stringify(metadata, null, 4), 'utf-8');
        }
    } catch (error) {
        console.error("Failed to auto-update spirits-metadata.json:", error);
        // Non-blocking error, we still return the enriched data
    }
}

export async function enrichSpiritMetadata(spirit: Spirit): Promise<Partial<Spirit>> {
    if (!API_KEY) {
        throw new Error("GEMINI_API_KEY is not set");
    }

    const categoryStructure = getCategoryPrompt(spirit.category);
    const tagIndex = (metadataFn as any).tag_index;

    // Legal Category is already determined from the API source
    const legalCategory = spirit.category;

    const prompt = `
너는 세계 최고의 마스터 블렌더이자 주류 전문 소믈리에야. 
아래 주류 정보를 분석하여 전문적인 테이스팅 데이터와 정밀한 카테고리 분류를 수행해줘.

대상 주류:
이름: ${spirit.name} (ID: ${spirit.id})
증류소: ${spirit.distillery}
법적 카테고리: ${legalCategory} (이미 확정됨 - 변경 불가)

[카테고리 분류 규칙]
이 제품은 이미 법적 분류 "${legalCategory}"로 확정되었습니다.
당신의 역할은 이 분류 내에서 더 세부적인 분류를 결정하는 것입니다:

1. MainCategory (중분류): 
   - 아래 "전체 카테고리 구조"에서 "${legalCategory}"의 하위 키를 선택
   - 중분류가 없는 경우(예: 맥주, 탁주): null 또는 ""
   
2. SubCategory (소분류/세부): 
   - **우선순위**: 위 "전체 카테고리 구조"에 있는 항목을 최우선으로 사용해.
   - **신규 생성**: 만약 해당 항목이 전혀 적합하지 않다면, 주류학적으로 통용되는 **새로운 SubCategory 명칭**을 생성해도 좋아.

[전체 카테고리 구조]
${categoryStructure}

[테이스팅 태그 인덱스 가이드]
- 아래 태그들을 참고하여 각 항목별로 적합한 해시태그를 3~5개씩 선택해.
- 향(Nose): ${JSON.stringify(tagIndex.nose)}
- 맛/질감(Palate): ${JSON.stringify(tagIndex.palate)}
- 여운(Finish): ${JSON.stringify(tagIndex.finish)}

[작성 규칙]
1. abv: 정보가 없다면 0.0으로 둬.
2. description: 제품에 대한 매력적인 소개글을 1-2문장으로 작성해(한국어).

반드시 아래 JSON 형식으로만 응답해 (Markdown 없이):
{
  "abv": 40.0,
  "region": "상세 지역",
  "mainCategory": "gin",
  "subcategory": "London Dry Gin",
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

        // Legal Category comes from the original data source (API)
        const finalLegal = spirit.category;
        let finalMain = enriched.mainCategory;
        let finalSub = enriched.subcategory;

        // Auto-Update Metadata Logic
        if (finalSub) {
            await updateMetadataFile(finalLegal, finalMain, finalSub);
        }

        return {
            abv: enriched.abv || spirit.abv,
            category: finalLegal, // Preserve original Legal Category from API
            mainCategory: finalMain,
            subcategory: finalSub,
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
