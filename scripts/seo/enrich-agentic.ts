import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env', override: false });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const TAVILY_API_KEY = process.env.TAVILY_API_KEY || '';
const MODEL_ID = "gemini-2.0-flash";

if (!GEMINI_API_KEY) {
    console.error('🔴 ERROR: GEMINI_API_KEY is missing.');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: MODEL_ID, 
    generationConfig: { responseMimeType: "application/json", temperature: 0.2 } 
});

interface SpiritData {
    id: string;
    name: string;
    category: string;
    subcategory?: string | null;
    distillery?: string | null;
    abv?: number | null;
    country?: string | null;
    region?: string | null;
    [key: string]: any;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Stage 1: Fact-Finding via Tavily
 */
async function researchSpirit(name: string, category: string) {
    console.log(`\n🔍 [Stage 1: Research] Fact-finding for "${name}" via Tavily...`);
    
    if (!TAVILY_API_KEY) {
        console.warn('⚠️ TAVILY_API_KEY missing. Falling back to Gemini-only research.');
        return null;
    }

    const query = `${name} ${category} official characteristics abv distillery region reviews`;
    
    try {
        const response = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                api_key: TAVILY_API_KEY,
                query: query,
                search_depth: "advanced",
                include_answer: true,
                max_results: 5
            })
        });

        const data = await response.json();
        console.log(`✅ [Stage 1] Found ${data.results?.length || 0} external sources.`);
        return data;
    } catch (error) {
        console.error('❌ [Stage 1] Tavily search failed:', error);
        return null;
    }
}

/**
 * Stage 2: Cross-Verification & Identity Correction (CoT)
 */
async function verifyFacts(spirit: SpiritData, researchData: any) {
    console.log(`\n🧠 [Stage 2: Verification] Performing Cross-Verification and Chain-of-Thought reasoning...`);
    
    const context = researchData ? JSON.stringify(researchData.results.map((r: any) => ({
        title: r.title,
        content: r.content,
        url: r.url
    }))) : "No external research available.";

    const prompt = `
    You are an expert Spirits Auditor. Your goal is to verify and correct product data using provided research.
    
    ### CURRENT DATA:
    - Name: "${spirit.name}"
    - Category: "${spirit.category}"
    - ABV: ${spirit.abv || 'Unknown'}%
    - Distillery: "${spirit.distillery || 'Unknown'}"
    - Region: "${spirit.region || 'Unknown'}"
    - Country: "${spirit.country || 'Unknown'}"
    
    ### EXTERNAL RESEARCH:
    ${context}
    
    ### TASK:
    1. **Reasoning (Chain-of-Thought)**: Compare the current data with research. 
       - Is the ABV exactly as stated in official sources?
       - Does the region match the distillery location?
       - If there is a conflict (e.g. 40% vs 43%), check multiple sources in the research to find the consensus or official distillery site.
       - Note your reasoning for any changes.
    2. **Self-Correction**: Update fields if the research provides more accurate or specific data.
    
    Return a JSON object:
    {
      "reasoning": "Step-by-step explanation of your verification process and any corrections made.",
      "corrected_fields": {
        "name_en": "Official English Name",
        "abv": 0.0,
        "distillery": "Cleaned Brand Name",
        "region": "Specific Region",
        "country": "Country",
        "subcategory": "More specific classification if found"
      },
      "verified_facts": ["Fact 1: ...", "Fact 2: ..."]
    }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsed = JSON.parse(responseText.replace(/```json|```/g, '').trim());
    
    console.log(`💬 [Stage 2 Reasoning]:\n${parsed.reasoning}`);
    return parsed;
}

/**
 * Stage 3: High-Quality Bilingual Content Generation (CoT)
 */
async function generateRichContent(spirit: SpiritData, verifiedFacts: any) {
    console.log(`\n✍️ [Stage 3: Generation] Generating deep, factual BILINGUAL content...`);
    
    const prompt = `
    You are a professional Sommelier and Spirits Historian. 
    Using the verified facts below, generate a deep, engaging report for "${spirit.name}".
    
    ### VERIFIED FACTS:
    ${JSON.stringify(verifiedFacts)}
    
    ### INSTRUCTIONS:
    1. **Bilingual Requirement**: Generate ALL content in both Korean (KO) and English (EN).
    2. **Chain-of-Thought Analysis**:
       - Analyze flavor profile based on spirit type and specific distillery notes.
       - Explain WHY certain notes exist (distillation style, cask type, environment).
       - Synthesize food pairings based on flavor chemistry.
    3. **Reporting**:
       - Generate 4-5 sentences for "Description" and "Sommelier Tasting Note".
       - Must be FACT-ONLY. No hallucinations.
    
    Return a JSON object:
    {
      "description_ko": "...",
      "description_en": "...",
      "tasting_note_ko": "Detailed sommelier note in Korean",
      "tasting_note_en": "Detailed sommelier note in English",
      "pairing_guide_ko": "Detailed pairing rationale in Korean",
      "pairing_guide_en": "Detailed pairing rationale in English",
      "sensory_tags": {
        "nose": ["tag1", "tag2", "tag3", "tag4", "tag5"],
        "palate": ["tag1", "tag2", "tag3", "tag4", "tag5"],
        "finish": ["tag1", "tag2", "tag3", "tag4", "tag5"]
      }
    }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsed = JSON.parse(responseText.replace(/```json|```/g, '').trim());
    
    console.log(`✅ [Stage 3] Bilingual content generation complete.`);
    return parsed;
}

/**
 * Single Item Execution
 */
async function processSpirit(spiritId: string, spiritsDb: any) {
    console.log(`\n🚀 [START] Agentic Enrichment for Spirit ID: ${spiritId}`);
    
    const spirit = await spiritsDb.getById(spiritId);
    if (!spirit) {
        console.error(`❌ Spirit not found: ${spiritId}`);
        return false;
    }

    try {
        const research = await researchSpirit(spirit.name, spirit.category);
        const verification = await verifyFacts(spirit as SpiritData, research);
        const content = await generateRichContent(spirit as SpiritData, verification);
        
        console.log(`\n💾 [Stage 4: Commit] Syncing enriched data via Firestore Merge...`);
        
        // Construct metadata with ZERO touching of 'offer' or 'price'
        const updatedMetadata = {
            ...spirit.metadata, // Spread existing metadata
            description_ko: content.description_ko,
            description_en: content.description_en,
            tasting_note: content.tasting_note_ko,
            tasting_note_en: content.tasting_note_en,
            pairing_guide_ko: content.pairing_guide_ko,
            pairing_guide_en: content.pairing_guide_en,
            nose_tags: content.sensory_tags.nose,
            palate_tags: content.sensory_tags.palate,
            finish_tags: content.sensory_tags.finish,
            agentic_enriched_at: new Date().toISOString(),
            verification_audit: verification.reasoning
        };

        // Partial update payload
        const updatePayload = {
            ...verification.corrected_fields,
            metadata: updatedMetadata,
            status: 'ENRICHED'
        };

        // Firestore REST PATCH with UpdateMask will handle the merge safely
        await spiritsDb.upsert(spiritId, updatePayload);
        console.log(`✨ [DONE] ${spirit.name} (ID: ${spiritId}) enriched successfully!`);
        return true;
    } catch (error) {
        console.error(`❌ [ERROR] Failed to process ${spirit.name}:`, error);
        return false;
    }
}

/**
 * Main Executer with Batching & Rate Limiting
 */
async function run() {
    const { spiritsDb } = await import('../../lib/db/firestore-rest');
    
    const targetId = process.argv[2];
    const limitArg = process.argv.find(arg => arg.startsWith('--limit='));
    const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : 1;

    if (targetId && !targetId.startsWith('--')) {
        // Individual processing
        await processSpirit(targetId, spiritsDb);
    } else {
        // Batch processing
        console.log(`\n📦 [BATCH MODE] Starting processing with limit: ${limit}`);
        
        // Fetch spirits that are NOT yet enriched by an agent
        // For simplicity in this script, we'll fetch 'PUBLISHED' but potentially thin ones
        const allSpirits = await spiritsDb.getAll({ status: 'PUBLISHED' });
        const thinSpirits = allSpirits.filter((s: any) => !s.metadata?.agentic_enriched_at).slice(0, limit);
        
        console.log(`📊 Found ${thinSpirits.length} spirits needing enrichment in this batch.`);
        
        for (let i = 0; i < thinSpirits.length; i++) {
            const spirit = thinSpirits[i];
            console.log(`\n[${i + 1}/${thinSpirits.length}] Processing: ${spirit.name}`);
            
            await processSpirit(spirit.id, spiritsDb);
            
            if (i < thinSpirits.length - 1) {
                console.log(`⏳ Respecting rate limits. Waiting 3 seconds...`);
                await delay(3000); // 3-second delay between spirits
            }
        }
    }
}

run().catch(console.error);
