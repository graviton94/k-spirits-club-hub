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
당신의 역할은 이 분류 내에서 "가장 하위 단계"의 항목을 찾아 정밀하게 매칭하는 것입니다.

1. 전체 카테고리 구조에서 "${legalCategory}" 섹션을 찾으세요.
2. 해당 섹션의 계층 구조를 끝까지 추적하여 가장 적합한 최종 항목을 선택하세요.

- **MainCategory (중분류)**: 
  - "${legalCategory}" 바로 아래에 있는 첫 번째 단계의 키(Key) 이름을 선택하세요.
  - 예: "소주"인 경우 "한국 소주", "일본 쇼추", "아와모리" 중 하나를 반드시 선택해야 함.
  - 중분류가 아예 없는 카테고리라면 null 또는 ""로 응답하세요.

- **SubCategory (소분류)**: 
  - **필수 사항**: 선택한 MainCategory 내의 배열(Array)에 포함된 항목 중 하나를 반드시 선택하세요.
  - **우선순위**: 기존 구조에 있는 명칭을 최우선으로 사용하세요.
  - **신규 생성**: 기존 항목 중 어느 것도 주류학적으로 일치하지 않을 때만, 전문적인 새로운 명칭을 생성하세요.

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
  "mainCategory": "MainCategory 명칭",
  "subcategory": "SubCategory 명칭",
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

/**
 * Translates spirit name and description to English specialized for the liquor industry.
 * Optimized for SEO and correct terminology.
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
