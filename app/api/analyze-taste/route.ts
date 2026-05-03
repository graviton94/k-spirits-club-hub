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
import { runWithGeminiModelFallback, getGeminiModelCandidates } from '@/lib/services/gemini-model-fallback';

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
                (s.nameEn && s.nameEn.toLowerCase().includes(lowerName))
            ) || results[0];
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
    
    console.log(`[analyze-taste][${traceId}] 🔍 Start Analysis. API Key present: ${!!apiKey}`);
    if (apiKey) {
        console.log(`[analyze-taste][${traceId}] 🔑 Key Hint: ${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`);
    }

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

        console.log(`[analyze-taste][${traceId}] 📈 Usage: ${currentCount}/3 for user ${userId}`);

        if (currentCount >= 3) return NextResponse.json({ error: 'Limit reached', code: 'ANALYZE_DAILY_LIMIT', traceId, source: 'api/analyze-taste' }, { status: 429 });

        const [cabinetItems, userReviews] = await Promise.all([
            dbAdminListUserCabinet(userId),
            dbAdminListUserReviews(userId)
        ]);

        console.log(`[analyze-taste][${traceId}] 📦 Cabinet: ${cabinetItems.length} items, Reviews: ${userReviews.length} items`);

        if (cabinetItems.length === 0) {
            return NextResponse.json({ 
                error: 'Collection too small', 
                code: 'ANALYZE_INSUFFICIENT_DATA', 
                traceId,
                message: isEn ? "Add more spirits to your cabinet first!" : "먼저 술장에 최소 1개 이상의 술을 담아주세요!"
            }, { status: 400 });
        }

        const spiritsForAnalysis = cabinetItems.map((item: any) => {
            if (!item) return null;
            const spirit = item.spirit || {};
            const review = userReviews.find((r: any) => r.spiritId === (spirit.id || item.spiritId));
            const cabinetNote = typeof item.notes === 'string' ? item.notes.trim() : '';
            const reviewContent = typeof review?.content === 'string' ? review.content.trim() : '';
            const mergedComment = [reviewContent, cabinetNote].filter(Boolean).join('\n\n');
            const fallbackRating = typeof item.rating === 'number' ? Number(item.rating) : 0;
            const reviewRating = typeof review?.rating === 'number' ? Number(review.rating) : fallbackRating;
            
            // Map REAL SCHEMA (CamelCase) to AI Expected (Snake_Case)
            return {
                name: spirit.name,
                nameEn: spirit.nameEn,
                category: spirit.category,
                distillery: spirit.distillery,
                abv: spirit.abv,
                isWishlist: Boolean(item.isWishlist),
                addedAt: item.addedAt,
                lastActivityAt: review?.createdAt || item.addedAt,
                noseTags: spirit.noseTags || [],
                palateTags: spirit.palateTags || [],
                finishTags: spirit.finishTags || [],
                tastingNote: spirit.tastingNote,
                userReview: review ? {
                    ratingOverall: reviewRating,
                    tagsN: typeof review.nose === 'string' ? review.nose.split(',') : [],
                    tagsP: typeof review.palate === 'string' ? review.palate.split(',') : [],
                    tagsF: typeof review.finish === 'string' ? review.finish.split(',') : [],
                    comment: mergedComment,
                    createdAt: review.createdAt,
                } : (cabinetNote || fallbackRating > 0 ? {
                    ratingOverall: fallbackRating,
                    tagsN: [],
                    tagsP: [],
                    tagsF: [],
                    comment: mergedComment,
                    createdAt: item.addedAt,
                } : null)
            };
        }).filter(Boolean);

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
        
        const buildSystemInstruction = (forEn: boolean) => `
        You are 'The K-Spirits Master Sommelier' - a refined, world-class AI authority on global spirits, specializing in Korean Traditional Liquors, Whiskies, and Artisanal Spirits.
        
        IDENTITY & TONE:
        - Professional, sophisticated, yet deeply passionate.
        - Speak like a top-tier luxury hotel sommelier.
        - Language: ${forEn ? 'Elegant British English exclusively.' : 'Strict Professional Korean (Honorifics/존댓말) exclusively.'}
        
        GOAL:
        1. Deep Analysis: Based on the user's current 'Cellar' (Cabinet) and 'Tasting Memoirs' (Reviews), construct a precise 6D Flavor Vector.
        2. Insightful Persona: Assign a unique, evocative title and description to the user's tasting journey.
        3. Strategic Recommendations: Propose 3 spirits that balance 'Match Accuracy' (what they like) and 'Discovery Potential' (what they haven't tried).
        
        FLAVOR PHYSICS (6D VECTOR):
        - sweet: 0-100
        - fruity: 0-100
        - floral: 0-100
        - spicy: 0-100
        - woody: 0-100
        - peaty: 0-100
        
        CONSTRAINTS:
        - Logic: Recommendations must be spirits, NEVER cocktails or food pairings.
        - Safety: Alcohol is for responsible enjoyment.
        
        JSON STRUCTURE (MUST FOLLOW EXACTLY):
        {
          "stats": { "sweet": 85, "fruity": 40, "floral": 10, "spicy": 60, "woody": 90, "peaty": 15 },
          "persona": { 
            "title": "Evocative Title", 
            "description": "Deep multi-paragraph analysis of their palate trend.", 
            "keywords": ["#keyword1", "#keyword2", "#keyword3"] 
          },
          "recommendations": [
            {
              "name": "Full Spirit Name",
              "category": "Whisky/Traditional/etc",
              "abv": 43.0,
              "matchRate": 98,
              "reason": "Why this specific bottle fits their history.",
              "tastingNotes": "Brief flavor profile."
            }
          ]
        }
        `;

        const parseAnalysisResult = (rawText: string) => {
            const cleanText = rawText.replace(/```json|```/g, '').trim();
            const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
            return JSON.parse(jsonMatch ? jsonMatch[0] : cleanText);
        };

        const enrichRecs = async (rawRecs: any[]) => {
            const results = [];
            for (const rec of rawRecs.slice(0, 3)) {
                const dbMatch = await tryFindSpiritInDb(rec.name);
                if (dbMatch) {
                    results.push({ ...dbMatch, id: dbMatch.id, score: (rec.matchRate || 0) / 100, analysisReason: rec.reason, isAiDiscovery: false });
                } else {
                    results.push({ ...rec, isAiDiscovery: true, externalSearchUrl: `https://www.google.com/search?q=${encodeURIComponent(rec.name + ' spirits')}` });
                }
            }
            return results;
        };

        const genAI = new GoogleGenerativeAI(apiKey);

        // Sequential bilingual analysis: KO first, then EN
        const promptKo = buildTasteAnalysisPrompt(spiritsForAnalysis, false, []);
        const resultKoRaw = await runWithGeminiModelFallback({
            genAI,
            modelIds: getGeminiModelCandidates(),
            createModel: (client, modelId) => client.getGenerativeModel({
                model: modelId,
                systemInstruction: buildSystemInstruction(false),
                generationConfig: { responseMimeType: "application/json", temperature: 0.7, topP: 0.95 }
            }),
            run: (model) => model.generateContent(promptKo),
            onModelSelected: (modelId) => { console.log(`[analyze-taste][${traceId}] KO model: ${modelId}`); }
        });

        const promptEn = buildTasteAnalysisPrompt(spiritsForAnalysis, true, []);
        const resultEnRaw = await runWithGeminiModelFallback({
            genAI,
            modelIds: getGeminiModelCandidates(),
            createModel: (client, modelId) => client.getGenerativeModel({
                model: modelId,
                systemInstruction: buildSystemInstruction(true),
                generationConfig: { responseMimeType: "application/json", temperature: 0.7, topP: 0.95 }
            }),
            run: (model) => model.generateContent(promptEn),
            onModelSelected: (modelId) => { console.log(`[analyze-taste][${traceId}] EN model: ${modelId}`); }
        });

        let analysisKo: any, analysisEn: any;
        try {
            analysisKo = parseAnalysisResult(resultKoRaw.response.text());
        } catch (e) {
            console.error('[Analyze Taste] KO Parse Error:', e);
            throw new Error('AI 분석 결과 형식이 올바르지 않습니다. (KO)');
        }
        try {
            analysisEn = parseAnalysisResult(resultEnRaw.response.text());
        } catch (e) {
            console.error('[Analyze Taste] EN Parse Error:', e);
            throw new Error('AI analysis result format is invalid. (EN)');
        }

        const getRecs = (analysis: any) => Array.isArray(analysis.recommendations)
            ? analysis.recommendations
            : (analysis.recommendation ? [analysis.recommendation] : []);

        const [enrichedRecsKo, enrichedRecsEn] = [
            await enrichRecs(getRecs(analysisKo)),
            await enrichRecs(getRecs(analysisEn)),
        ];

        const personaKo = analysisKo?.persona || { title: '취향 프로필', description: '최근 술장 활동 기반 프로필입니다.', keywords: ['#취향DNA'] };
        const personaEn = analysisEn?.persona || { title: 'Taste Profile', description: 'Profile generated from your recent cabinet activity.', keywords: ['#TasteDNA'] };
        const resolvedPersona = isEn ? personaEn : personaKo;

        const personaLocalized = { ko: personaKo, en: personaEn };
        const recommendationEntriesLocalized = { ko: enrichedRecsKo, en: enrichedRecsEn };
        const enrichedRecs = isEn ? enrichedRecsEn : enrichedRecsKo;

        const profile = {
            ...existingProfile,
            analyzedAt: new Date().toISOString(),
            stats: analysisKo.stats || existingProfile.stats || {
                sweet: 50, fruity: 50, floral: 50, spicy: 50, woody: 50, peaty: 50,
            },
            persona: resolvedPersona,
            personaLocalized,
            recommendationEntries: enrichedRecs,
            recommendationEntriesLocalized,
            localeLastAnalyzed: isEn ? 'en' : 'ko',
            usage: { date: today, count: currentCount + 1 }
        };

        // Save back to User.tasteProfile JSONB
        await dbAdminUpsertUser({
            id: userId,
            tasteProfile: profile
        });

        return NextResponse.json({
            success: true,
            profile,
            usage: { date: today, count: currentCount + 1, remaining: Math.max(0, 2 - currentCount) },
            traceId,
        });
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