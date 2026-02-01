import { GoogleGenerativeAI } from "@google/generative-ai";
import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';

// Environmental variables setup
dotenv.config({ path: '.env.local' });
dotenv.config();

// --- Configuration ---
const BATCH_SIZE = 10; // Number of spirits to process concurrently
const DELAY_MS = 2000; // Delay between batches to avoid rate limits
const MAX_RETRIES = 3;

// --- Firebase Initialization ---
if (!process.env.FIREBASE_PROJECT_ID) {
    console.error("❌ Error: FIREBASE_PROJECT_ID is not set.");
    process.exit(1);
}

const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
        }),
    });
}
const db = admin.firestore();

// --- Gemini AI Initialization ---
if (!process.env.GEMINI_API_KEY) {
    console.error("❌ Error: GEMINI_API_KEY is not set.");
    process.exit(1);
}
console.log(`🔑 Gemini API Key loaded: ...${process.env.GEMINI_API_KEY.slice(-4)}`);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Using gemini-2.0-flash as per python scripts
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// --- Types ---
interface ProcessingResult {
    name_en: string;
    description_en: string;
    pairing_guide_en: string;
    pairing_guide_ko: string;
}

// --- Constants ---
const TERM_GUIDELINES = `
- 'Makgeolli' for 막걸리
- 'Distilled Soju' for 증류식 소주
- 'Takju' for 탁주
- 'Yakju' for 약주
- 'Cheongju' for 청주
`;

// --- Helper Functions ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function processSpiritWithAI(spirit: any): Promise<ProcessingResult | null> {
    // Extract detailed metadata for better prompts
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

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            // Extract JSON
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("No JSON found in response");

            const data = JSON.parse(jsonMatch[0]) as ProcessingResult;

            // Basic validation
            if (!data.name_en || !data.pairing_guide_en || !data.description_en || !data.pairing_guide_ko) throw new Error("Missing fields in JSON");

            return data;
        } catch (e: any) {
            console.warn(`    ⚠️ Attempt ${attempt} failed for ${spirit.name}: ${e.message}`);
            if (e.message.includes('404')) console.warn('        (Model not found? Check model name)');
            // console.dir(e, { depth: null }); 
            if (attempt === MAX_RETRIES) return null;
            await delay(1000 * attempt); // Exponential backoffish
        }
    }
    return null;
}

// --- CLI Arguments ---
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const limitArgIndex = args.indexOf('--limit');
const limitVal = limitArgIndex !== -1 ? parseInt(args[limitArgIndex + 1]) : 0;

async function bulkProcessor() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 Bulk Data Processor (AI Enrichment)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🔧 Mode: ${isDryRun ? 'DRY RUN (No Writes)' : 'PRODUCTION (Writes Enabled)'}`);
    console.log(`🎯 Target: Published Spirits only`);
    if (limitVal > 0) console.log(`🛑 Limit: ${limitVal} spirits`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
        // Query construction
        let query: admin.firestore.Query = db.collection('spirits').where('isPublished', '==', true);

        if (limitVal > 0) {
            query = query.limit(limitVal);
        }

        const snapshot = await query.get();
        const docs = snapshot.docs;

        if (docs.length === 0) {
            console.log("No published spirits found to process.");
            return;
        }

        console.log(`📊 Found ${docs.length} published spirits.`);

        let processedCount = 0;
        let skippedCount = 0;
        let failedCount = 0;

        // Process in batches
        for (let i = 0; i < docs.length; i += BATCH_SIZE) {
            const batch = docs.slice(i, i + BATCH_SIZE);
            const batchPromises = batch.map(async (doc) => {
                const data = doc.data();

                // Skip condition
                if (data.metadata?.pairing_guide_en && data.name_en) {
                    skippedCount++;
                    // console.log(`⏩ Skipping ${data.name} (Already processed)`);
                    return;
                }

                console.log(`🤖 Processing: ${data.name}...`);
                const aiResult = await processSpiritWithAI(data);

                if (aiResult) {
                    if (isDryRun) {
                        console.log(`    [DRY-RUN] Would update ${data.name}:`);
                        console.log(`      + name_en: "${aiResult.name_en}"`);
                        console.log(`      + pairing_guide_en: "${aiResult.pairing_guide_en}"`);
                    } else {
                        // Update Firestore
                        await doc.ref.set({
                            name_en: data.name_en || aiResult.name_en,
                            description_en: data.description_en || aiResult.description_en,
                            metadata: {
                                ...data.metadata,
                                pairing_guide_en: aiResult.pairing_guide_en,
                                pairing_guide_ko: aiResult.pairing_guide_ko
                            },
                            updatedAt: new Date().toISOString()
                        }, { merge: true });
                        console.log(`    ✅ Updated ${data.name}`);
                    }
                    processedCount++;
                } else {
                    failedCount++;
                    console.error(`    ❌ Failed to process ${data.name}`);
                }
            });

            await Promise.all(batchPromises);

            if (i + BATCH_SIZE < docs.length) {
                console.log(`⏳ Batch done. Sleeping for ${DELAY_MS}ms...`);
                await delay(DELAY_MS);
            }
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ PROCESSING COMPLETED');
        console.log(`   Processed: ${processedCount}`);
        console.log(`   Skipped: ${skippedCount}`);
        console.log(`   Failed: ${failedCount}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    } catch (error) {
        console.error("❌ Fatal Error:", error);
        process.exit(1);
    }
}

bulkProcessor();
