import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config({ path: '.env.local' });
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function dryRun() {
    const testSpirits = [
        {
            name: "진모 한라산 21",
            category: "증류식 소주",
            distillery: "한라산",
            abv: 21,
            region: "제주도",
            metadata: {
                nose_tags: ["#깔끔함", "#정제된"],
                palate_tags: ["#매끄러움", "#곡물향"],
                finish_tags: ["#드라이"]
            }
        },
        {
            name: "라가불린 16년",
            category: "위스키",
            subcategory: "싱글 몰트 스카치 위스키",
            distillery: "Lagavulin",
            abv: 43.0,
            region: "아일라",
            metadata: {
                nose_tags: ["#피트", "#해조류", "#스모키"],
                palate_tags: ["#강렬함", "#소금기", "#바닐라"],
                finish_tags: ["#긴여운", "#피트향"]
            }
        }
    ];

    const results: string[] = [];
    for (const spirit of testSpirits) {
        console.log(`\n🤖 Analyzing: ${spirit.name}...`);
        const prompt = `
You are a World-Class Gastronomy Columnist.

**Spirit Details:**
- Name: ${spirit.name}
- Category: ${spirit.category} (${spirit.subcategory || ''})
- Location: ${spirit.region}
- ABV: ${spirit.abv}%
- Tags: ${[...spirit.metadata.nose_tags, ...spirit.metadata.palate_tags, ...spirit.metadata.finish_tags].join(', ')}

**Task:** Create exactly TWO food pairing recommendations.

**Principles:**
1. **The Terroir Choice (Heritage Pairing)**: A sophisticated, authentic dish from the spirit's EXACT country or region of origin.
2. **The Global Adventure (Structural Harmony)**: A creative pairing from a different culinary culture based on flavor science.
3. **Anti-Repetition**: NO "Moroccan Tagine", "Fruit/Cheese", or "Dark Chocolate".

**Output JSON:**
{
  "pairing_guide_en": "Narrative prose combining both recommendations (4-5 sentences)...",
  "pairing_guide_ko": "두 가지 추천을 포함한 고급스러운 한국어 설명..."
}
`;
        try {
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            results.push(`=== ${spirit.name} ===\n${text}\n`);
            console.log("✅ Analysis complete.");
        } catch (e: any) {
            console.error(`❌ Error for ${spirit.name}: ${e.message}`);
        }
    }
    await fs.writeFile('scripts/test_results.txt', results.join('\n'));
    console.log("\n📄 Results written to scripts/test_results.txt");
}

dryRun();
