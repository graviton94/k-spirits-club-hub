// app/api/analyze-taste/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { cabinetDb, tasteProfileDb, reviewsDb, spiritsDb } from '@/lib/db/firestore-rest';
import { buildTasteAnalysisPrompt } from '@/lib/utils/aiPromptBuilder';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const preferredRegion = 'iad1';

const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || '';

function getKSTDate() {
    return new Date().toLocaleString("en-CA", { timeZone: "Asia/Seoul" }).split(' ')[0];
}

async function tryFindSpiritInDb(name: string) {
    try {
        // Search by name using exact match first, then broader
        const results = await spiritsDb.getAll({ searchTerm: name, isPublished: true }, { page: 1, pageSize: 5 });
        if (results && results.length > 0) {
            // Find best name match
            const lowerName = name.toLowerCase();
            return results.find(s => 
                s.name.toLowerCase().includes(lowerName) || 
                (s.name_en && s.name_en.toLowerCase().includes(lowerName))
            ) || results[0];
        }
        return null;
    } catch (e) {
        console.error('[Search Spirit Error]', e);
        return null;
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        if (!userId) return NextResponse.json({ error: 'User ID is required' }, { status: 400 });

        const [profile, usage] = await Promise.all([
            tasteProfileDb.get(userId),
            tasteProfileDb.getUsage(userId)
        ]);

        const today = getKSTDate();
        let dailyCount = (usage && usage.date === today) ? usage.count : 0;

        return NextResponse.json({
            profile: profile || null,
            usage: { date: today, count: dailyCount, remaining: Math.max(0, 3 - dailyCount) }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    if (!API_KEY) return NextResponse.json({ error: 'API Key missing' }, { status: 500 });

    try {
        const body = await req.json();
        const { userId, lang = 'ko' } = body;
        const isEn = lang === 'en';

        if (!userId) return NextResponse.json({ error: 'User ID missing' }, { status: 400 });

        const today = getKSTDate();
        let usage = await tasteProfileDb.getUsage(userId);
        let currentCount = (usage && usage.date === today) ? usage.count : 0;

        if (currentCount >= 3) return NextResponse.json({ error: 'Limit reached' }, { status: 429 });

        const [cabinetItems, userReviews] = await Promise.all([
            cabinetDb.getAll(userId),
            reviewsDb.getAllForUser(userId, true)
        ]);

        const spiritsForAnalysis = cabinetItems.map((item: any) => {
            const review = userReviews.find((r: any) => r.spiritId === item.spiritId);
            return {
                ...item,
                userReview: review ? {
                    ratingOverall: review.rating,
                    tags: [...(review.tagsN || []), ...(review.tagsP || []), ...(review.tagsF || [])],
                    comment: review.notes
                } : null
            };
        });

        const promptData = buildTasteAnalysisPrompt(spiritsForAnalysis, isEn, []);
        
        const systemInstruction = `
        You are a World-Class AI Sommelier.
        
        GOAL:
        1. Analyze user cellar data to create a precise 6D Flavor Vector (0-100).
        2. Propose 3 high-discovery spirit recommendations.
        
        6D VECTOR DIMENSIONS: sweet, fruity, floral, spicy, woody, peaty.
        
        CRITICAL RECOMMENDATION RULES:
        - NEVER suggest pairing one spirit with another (e.g., "Goes well with Whiskey X"). Spirits are NOT food.
        - ALWAYS explain the match based on the User's Flavor DNA (e.g., "Your high Peaty score at 85 makes this an ideal match").
        - SUGGEST actual Food Pairings (e.g., "Matches perfectly with smoked salmon or dark chocolate").
        - COMPARATIVE ANALYSIS: Use phrases like "If you enjoyed X in your cabinet, you'll appreciate the Y notes in this bottle."
        - Avoid repetitive or generic brands. Aim for "Discovery".
        - Respond strictly in the ${isEn ? 'English' : 'Professional Korean (Honorifics)'} language.
        
        JSON FORMAT:
        {
          "stats": { "sweet": 0-100, "fruity": 0-100, "floral": 0-100, "spicy": 0-100, "woody": 0-100, "peaty": 0-100 },
          "persona": { "title": "Title", "description": "Analysis insight.", "keywords": ["#tag"] },
          "recommendations": [
            {
              "name": "Exact Name",
              "category": "Whisky/Traditional/etc",
              "abv": 40.0,
              "matchRate": 95,
              "reason": "Detailed sommelier insight (No spirit-to-spirit pairing!)",
              "tastingNotes": "Brief profile."
            }
          ]
        }
        `;

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction, generationConfig: { responseMimeType: "application/json" } });

        const result = await model.generateContent(promptData);
        const analysisResult = JSON.parse(result.response.text());

        // Process Recommendations with Live Firestore Sync
        const enrichedRecs = await Promise.all(analysisResult.recommendations.slice(0, 3).map(async (rec: any) => {
            const dbMatch = await tryFindSpiritInDb(rec.name);
            if (dbMatch) {
                return {
                    ...dbMatch,
                    id: dbMatch.id,
                    score: rec.matchRate / 100,
                    analysisReason: rec.reason,
                    isAiDiscovery: false
                };
            }
            return {
                ...rec,
                isAiDiscovery: true,
                externalSearchUrl: `https://www.google.com/search?q=${encodeURIComponent(rec.name + ' spirits')}`
            };
        }));

        const profile = {
            userId,
            analyzedAt: new Date().toISOString(),
            stats: analysisResult.stats,
            persona: analysisResult.persona,
            recommendationEntries: enrichedRecs // New list format
        };

        await Promise.all([
            tasteProfileDb.save(userId, profile),
            tasteProfileDb.setUsage(userId, today, currentCount + 1)
        ]);

        return NextResponse.json({ success: true, profile });
    } catch (error: any) {
        console.error('[Analyze Taste Error]', error);
        return NextResponse.json({ error: 'AI Error', details: error.message }, { status: 500 });
    }
}