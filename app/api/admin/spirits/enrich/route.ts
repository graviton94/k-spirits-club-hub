export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
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

interface EnrichmentResult {
    name_en: string;
    description_en: string;
    pairing_guide_en: string;
    pairing_guide_ko: string;
}

/**
 * POST /api/admin/spirits/enrich
 * 
 * Generates AI-powered enrichment for a spirit including:
 * - name_en: English name translation
 * - description_en: English description
 * - pairing_guide_en: Global food pairing recommendations
 * - pairing_guide_ko: Korean food pairing recommendations
 */
export async function POST(req: NextRequest) {
    try {
        if (!API_KEY) {
            return NextResponse.json(
                { error: 'GEMINI_API_KEY is not configured' },
                { status: 500 }
            );
        }

        const body = await req.json();
        const { name, category, subcategory, distillery, abv, region, metadata } = body;

        if (!name || !category) {
            return NextResponse.json(
                { error: 'Name and category are required' },
                { status: 400 }
            );
        }

        // Extract tasting notes and other metadata
        const tastingNote = metadata?.tasting_note || metadata?.description || '';
        const noseTags = metadata?.nose_tags?.join(', ') || '';
        const palateTags = metadata?.palate_tags?.join(', ') || '';
        const finishTags = metadata?.finish_tags?.join(', ') || '';

        const prompt = `
You are an expert sommelier and translator specializing in Korean traditional spirits and global liquors.

**Spirit Details:**
- Name (Korean): ${name}
- Distillery: ${distillery || 'Unknown'}
- Category: ${category}${subcategory ? ` / ${subcategory}` : ''}
- Region: ${region || 'Unknown'}
- ABV: ${abv || 'Unknown'}%
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

        return NextResponse.json(enrichmentData);

    } catch (error: any) {
        console.error('[enrich] Error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to enrich spirit data',
                details: error.message 
            },
            { status: 500 }
        );
    }
}
