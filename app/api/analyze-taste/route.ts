// app/api/analyze-taste/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { 
    dbAdminListUserCabinet,
    dbAdminListUserReviews,
    dbAdminGetUserProfile,
    dbAdminUpsertUser,
    dbAdminSearchSpiritsPublic
} from '@/lib/db/data-connect-admin';
import { buildTasteAnalysisPrompt } from '@/lib/utils/aiPromptBuilder';
import { verifyRequestToken } from '@/lib/auth/verifyToken';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';



function getKSTDate() {
    return new Date().toLocaleString("en-CA", { timeZone: "Asia/Seoul" }).split(' ')[0];
}

async function tryFindSpiritInDb(name: string) {
    try {
        // Optimization: Use keyword search instead of loading full DB
        const results = await dbAdminSearchSpiritsPublic({
            search: name,
            limit: 5
        });
        
        if (results && results.length > 0) {
            const lowerName = name.toLowerCase();
            return results.find((s: any) => 
                s.name.toLowerCase().includes(lowerName) || 
                (s.name_en && s.name_en.toLowerCase().includes(lowerName))
            ) || results[0]; // Return closest match if no perfect include
        }
        return null;
    } catch (e) {
        console.error('[Search Spirit Error]', e);
        return null;
    }
}

import { getEnv } from '@/lib/env';

export async function GET(req: NextRequest) {
    const apiKey = getEnv('GEMINI_API_KEY') || getEnv('GOOGLE_GEMINI_API_KEY');
    const traceId = crypto.randomUUID();
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        if (!userId) return NextResponse.json({ error: 'User ID is required', code: 'ANALYZE_UID_REQUIRED', traceId, source: 'api/analyze-taste' }, { status: 400 });

        const verified = await verifyRequestToken(req.headers.get('authorization'));
        if (!verified) return NextResponse.json({ error: 'Unauthorized', code: 'ANALYZE_UNAUTHORIZED', traceId, source: 'api/analyze-taste' }, { status: 401 });
        if (verified.uid !== userId && !verified.isAdmin) return NextResponse.json({ error: 'Forbidden', code: 'ANALYZE_FORBIDDEN', traceId, source: 'api/analyze-taste' }, { status: 403 });

        const user = await dbAdminGetUserProfile(userId);
        if (!user) return NextResponse.json({ error: 'User not found', code: 'ANALYZE_USER_NOT_FOUND', traceId, source: 'api/analyze-taste' }, { status: 404 });

        const today = getKSTDate();
        // Usage tracking now exists in User metadata or we can keep it in tasteProfile object
        const profile: any = user.tasteProfile || {};
        const usage = profile.usage || { date: today, count: 0 };
        let dailyCount = (usage.date === today) ? usage.count : 0;

        return NextResponse.json({
            profile: user.tasteProfile || null,
            usage: { date: today, count: dailyCount, remaining: Math.max(0, 3 - dailyCount) },
            traceId
        });
    } catch (error) {
        console.error(`[Analyze Taste GET Error][${traceId}]`, error);
        return NextResponse.json({ error: 'Internal Error', code: 'ANALYZE_GET_FAILED', traceId, source: 'api/analyze-taste' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const apiKey = getEnv('GEMINI_API_KEY') || getEnv('GOOGLE_GEMINI_API_KEY');
    const traceId = crypto.randomUUID();
    try {
        const body = await req.json();
        const { userId, lang = 'ko' } = body;
        const isEn = lang === 'en';

        if (!userId) return NextResponse.json({ error: 'User ID missing', code: 'ANALYZE_UID_MISSING', traceId, source: 'api/analyze-taste' }, { status: 400 });

        const verified = await verifyRequestToken(req.headers.get('authorization'));
        if (!verified) return NextResponse.json({ error: 'Unauthorized', code: 'ANALYZE_UNAUTHORIZED', traceId, source: 'api/analyze-taste' }, { status: 401 });
        if (verified.uid !== userId && !verified.isAdmin) return NextResponse.json({ error: 'Forbidden', code: 'ANALYZE_FORBIDDEN', traceId, source: 'api/analyze-taste' }, { status: 403 });

        const user = await dbAdminGetUserProfile(userId);
        if (!user) return NextResponse.json({ error: 'User not found', code: 'ANALYZE_USER_NOT_FOUND', traceId, source: 'api/analyze-taste' }, { status: 404 });

        const today = getKSTDate();
        const existingProfile: any = user.tasteProfile || {};
        const usage = existingProfile.usage || { date: today, count: 0 };
        let currentCount = (usage.date === today) ? usage.count : 0;

        if (currentCount >= 3) return NextResponse.json({ error: 'Limit reached', code: 'ANALYZE_DAILY_LIMIT', traceId, source: 'api/analyze-taste' }, { status: 429 });

        const [cabinetItems, userReviews] = await Promise.all([
            dbAdminListUserCabinet(userId),
            dbAdminListUserReviews(userId)
        ]);

        const spiritsForAnalysis = cabinetItems.map((item: any) => {
            if (!item) return null;
            const spirit = item.spirit || {};
            const review = userReviews.find((r: any) => r.spiritId === item.spiritId);
            
            // Map camelCase (SQL) to snake_case (AI Analysis Expectations)
            return {
                ...item,
                ...spirit,
                name_en: spirit.nameEn,
                description_ko: spirit.descriptionKo,
                description_en: spirit.descriptionEn,
                nose_tags: spirit.noseTags,
                palate_tags: spirit.palateTags,
                finish_tags: spirit.finishTags,
                tasting_note: spirit.tastingNote,
                userReview: review ? {
                    ratingOverall: review.rating,
                    tags: [review.nose, review.palate, review.finish].filter(Boolean),
                    comment: review.content
                } : null
            };
        }).filter(Boolean);

        const promptData = buildTasteAnalysisPrompt(spiritsForAnalysis, isEn, []);

        if (!apiKey) {
            const fallbackProfile = {
                analyzedAt: new Date().toISOString(),
                stats: {
                    sweet: 50,
                    fruity: 50,
                    floral: 50,
                    spicy: 50,
                    woody: 50,
                    peaty: 50,
                },
                persona: {
                    title: isEn ? 'Tasting Profile Pending' : '테이스팅 프로필 준비 중',
                    description: isEn
                        ? 'Your profile was initialized. Full analysis will appear when the recommendation engine is available.'
                        : '프로필이 초기화되었습니다. 추천 엔진이 준비되면 정밀 분석 결과가 표시됩니다.',
                    keywords: [isEn ? '#Profile' : '#프로필']
                },
                recommendationEntries: [],
                usage: { date: today, count: currentCount + 1 }
            };

            await dbAdminUpsertUser({
                id: userId,
                tasteProfile: fallbackProfile
            });

            return NextResponse.json({ success: true, profile: fallbackProfile, traceId });
        }
        
        const systemInstruction = `
        You are a World-Class AI Sommelier.
        
        GOAL:
        1. Analyze user cellar data to create a precise 6D Flavor Vector (0-100).
        2. Propose 3 high-discovery spirit recommendations.
        
        6D VECTOR DIMENSIONS: sweet, fruity, floral, spicy, woody, peaty.
        
        CRITICAL RECOMMENDATION RULES:
        - NEVER suggest pairing one spirit with another. Spirits are NOT food.
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
              "reason": "Detailed sommelier insight",
              "tastingNotes": "Brief profile."
            }
          ]
        }
        `;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash", 
            systemInstruction, 
            generationConfig: { responseMimeType: "application/json" } 
        });

        const result = await model.generateContent(promptData);
        const analysisResult = JSON.parse(result.response.text());

        // Process Recommendations
        const rawRecommendations = Array.isArray(analysisResult.recommendations)
            ? analysisResult.recommendations
            : (analysisResult.recommendation ? [analysisResult.recommendation] : []);

        const enrichedRecs = await Promise.all(rawRecommendations.slice(0, 3).map(async (rec: any) => {
            const dbMatch = await tryFindSpiritInDb(rec.name);
            if (dbMatch) {
                return {
                    ...dbMatch,
                    id: dbMatch.id,
                    score: (rec.matchRate || 0) / 100,
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
            analyzedAt: new Date().toISOString(),
            stats: analysisResult.stats,
            persona: analysisResult.persona,
            recommendationEntries: enrichedRecs,
            usage: { date: today, count: currentCount + 1 }
        };

        // Save back to User.tasteProfile JSONB
        await dbAdminUpsertUser({
            id: userId,
            tasteProfile: profile
        });

        return NextResponse.json({ success: true, profile, traceId });
    } catch (error: any) {
        console.error(`[analyze-taste][${traceId}] Error during taste analysis:`, error);
        return NextResponse.json({
            error: error.message || 'Internal Server Error',
            code: 'TASTE_ANALYSIS_FAILED',
            traceId,
            debug: {
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
                hint: 'Confirm GEMINI_API_KEY is in Cloudflare Secrets'
            }
        }, { status: 500 });
    }
}