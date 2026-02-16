// app/api/analyze-taste/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { cabinetDb, tasteProfileDb, reviewsDb } from '@/lib/db/firestore-rest';
import { buildTasteAnalysisPrompt } from '@/lib/utils/aiPromptBuilder';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Vercel/Edge 환경 설정
export const runtime = 'edge';

const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || '';

// KST 날짜 헬퍼
function getKSTDate() {
    return new Date().toLocaleString("en-CA", { timeZone: "Asia/Seoul" }).split(' ')[0];
}

// GET: Fetch existing profile & usage stats
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const [profile, usage] = await Promise.all([
            tasteProfileDb.get(userId),
            tasteProfileDb.getUsage(userId)
        ]);

        // Normalize usage for today
        const today = getKSTDate();
        let dailyCount = 0;

        if (usage && usage.date === today) {
            dailyCount = usage.count;
        }

        // Return wrapped response
        return NextResponse.json({
            profile: profile || null,
            usage: {
                date: today,
                count: dailyCount,
                remaining: Math.max(0, 3 - dailyCount)
            }
        });

    } catch (error) {
        console.error('[Get Taste Profile Error]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    console.log('[Analyze Taste] POST Request received');

    // 1. API 키 확인
    if (!API_KEY) {
        console.error('[Analyze Taste] API Key is missing (GEMINI_API_KEY)');
        return NextResponse.json({
            error: 'Server configuration error (API Key)',
            details: 'GEMINI_API_KEY environment variable is not defined.'
        }, { status: 500 });
    }

    try {
        // Correctly read userId from Body for POST requests
        const body = await req.json();
        const { userId } = body;

        if (!userId) {
            console.error('[Analyze Taste] User ID missing in request body');
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // 0. Check Usage Limit
        const today = getKSTDate();
        console.log(`[Analyze Taste] Checking usage for User: ${userId} on ${today}`);

        let usage;
        try {
            usage = await tasteProfileDb.getUsage(userId);
        } catch (usageError: any) {
            console.error('[Analyze Taste] Usage Check DB Error:', usageError);
            // Non-blocking for now, or we can decide to fail
        }

        let currentCount = 0;

        if (usage && usage.date === today) {
            currentCount = usage.count;
        }

        if (currentCount >= 3) {
            console.warn(`[Analyze Taste] User ${userId} reached limit: ${currentCount}/3`);
            return NextResponse.json({
                error: 'Daily limit reached',
                message: '오늘의 AI 분석 횟수(3회)를 모두 사용하셨어요. 내일 다시 시도해주세요!'
            }, { status: 429 });
        }

        console.log(`[Analyze Taste] Data fetching for User: ${userId}`);

        // 2. Fetch Data (DB 에러 1차 방어)
        let cabinetItems = [];
        let userReviews = [];

        try {
            [cabinetItems, userReviews] = await Promise.all([
                cabinetDb.getAll(userId),
                reviewsDb.getAllForUser(userId)
            ]);
            console.log(`[Analyze Taste] Fetched ${cabinetItems.length} cabinet items and ${userReviews.length} reviews`);
        } catch (dbError: any) {
            console.error('[Analyze Taste] DB Fetch Error:', dbError);
            return NextResponse.json({
                error: 'Failed to fetch user data',
                details: dbError.message
            }, { status: 500 });
        }

        // 3. Merge Data (데이터 병합)
        const spiritsForAnalysis = cabinetItems.map((item: any) => {
            const review = userReviews.find((r: any) => r.spiritId === item.spiritId || r.spiritName === item.name);

            // 활동 날짜 집계
            const reviewDate = review?.createdAt || review?.updatedAt || null;
            const addedDate = item.addedAt || null;
            const lastActivityAt = reviewDate || addedDate;

            return {
                ...item,
                addedAt: addedDate,
                lastActivityAt: lastActivityAt,
                userReview: review ? {
                    ratingOverall: review.rating,
                    ratingN: review.ratingN || 0,
                    ratingP: review.ratingP || 0,
                    ratingF: review.ratingF || 0,
                    tagsN: review.tagsN ? [review.tagsN] : [],
                    tagsP: review.tagsP ? [review.tagsP] : [],
                    tagsF: review.tagsF ? [review.tagsF] : [],
                    comment: review.notes,
                    createdAt: reviewDate
                } : null,
                isWishlist: false
            };
        });

        const lang = body.lang || 'ko';
        const isEn = lang === 'en';

        // Fetch existing profile to get previous recommendations
        let previousRecommendations: string[] = [];
        try {
            const existingProfile = await tasteProfileDb.get(userId);
            if (existingProfile?.previousRecommendations) {
                previousRecommendations = existingProfile.previousRecommendations;
            }
            console.log(`[Analyze Taste] Previous recommendations: ${previousRecommendations.length} items`);
        } catch (e) {
            console.warn('[Analyze Taste] Could not fetch previous recommendations:', e);
        }

        const promptData = buildTasteAnalysisPrompt(spiritsForAnalysis, isEn, previousRecommendations);
        console.log(`[Analyze Taste] Prompt generated (Length: ${promptData?.length})`);

        // 프롬프트가 너무 짧으면(분석할 술이 없으면) 에러 처리
        if (!promptData || promptData.length < 10) {
            console.error('[Analyze Taste] Prompt too short or empty');
            return NextResponse.json({
                error: 'Invalid data',
                message: 'AI에게 전달할 데이터가 부족합니다. 최소 1개 이상의 술을 술장에 넣어주세요!'
            }, { status: 400 });
        }

        // 4. Call AI
        console.log(`[Analyze Taste] Initializing Gemini Model: gemini-2.0-flash (Lang: ${lang})`);
        const genAI = new GoogleGenerativeAI(API_KEY);

        const systemInstruction = `
        You are a World-Class Spirits Analyst and Gastronomy Critic with an encyclopedic knowledge of global liquors—from obscure Japanese small-batch shochus and traditional Korean yakjus to hyper-aged Caribbean rums and esoteric European eaux-de-vie. 
        
        Analyze the user's spirit preferences based on the provided data with clinical precision and poetic insight.
        
        IMPORTANT: Your recommendation MUST be high-variance and diverse. Do NOT just recommend the most famous or obvious bottles. Seek out high-quality, distinctive spirits that align with the user's flavor DNA but might be outside their current experience or represent a sophisticated shift in their taste journey.
        
        LANGUAGE REQUIREMENT: 
        - Your response (description and recommendation reason) MUST be in ${isEn ? 'English' : 'professional, elegant Korean (polite tone)'}.
        - Description should strictly be 4-5 sentences long, providing deep analytical insight.

        REQUIRED FORMAT: Return ONLY valid JSON.
        
        Output Structure:
        {
            "stats": {
                "woody": 0-100,
                "peaty": 0-100,
                "floral": 0-100,
                "fruity": 0-100,
                "nutty": 0-100,
                "richness": 0-100
            },
            "persona": {
                "title": "A unique, creative title (e.g. 'The Esoteric Peat Hunter')",
                "description": "4-5 sentences of deep analytical insight into their taste profile, acknowledging any recent trends or shifts in their collection.",
                "keywords": ["#Tag1", "#Tag2", "#Tag3"]
            },
            "recommendation": {
                "name": "Full professional name of a recommended spirit (Global)",
                "matchRate": 80-99,
                "reason": "An authoritative explanation of why this specific bottle's molecular profile matches the user's detected preferences, especially considering their recent activity."
            }
        }
        `;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: systemInstruction,
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.7,
                topP: 0.8,
                topK: 40
            }
        });

        console.log('[Analyze Taste] Generating content with Gemini...');
        let result;
        try {
            result = await model.generateContent(promptData);
        } catch (aiError: any) {
            console.error('[Analyze Taste] Gemini API Critical Error:', aiError);
            console.error('[Analyze Taste] Error details:', JSON.stringify(aiError, null, 2));
            return NextResponse.json({
                error: 'AI Generation Failed',
                details: aiError.message || 'Unknown AI error',
                message: isEn
                    ? 'Failed to generate taste analysis. Please try again later.'
                    : 'AI 분석 생성에 실패했습니다. 나중에 다시 시도해주세요.'
            }, { status: 500 });
        }

        let responseText = '';
        try {
            responseText = result.response.text();
            console.log(`[Analyze Taste] AI Response received (Length: ${responseText.length})`);
        } catch (textError: any) {
            console.error('[Analyze Taste] Error extracting text from Gemini response:', textError);
            return NextResponse.json({
                error: 'AI Output Extraction Failed',
                details: textError.message,
                message: isEn
                    ? 'Failed to extract AI response. Please try again.'
                    : 'AI 응답 추출에 실패했습니다. 다시 시도해주세요.'
            }, { status: 500 });
        }

        // 5. Parse JSON
        let analysisResult;
        try {
            const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            analysisResult = JSON.parse(cleanJson);
            console.log('[Analyze Taste] JSON Parsing Successful');
            console.log('[Analyze Taste] Recommended:', analysisResult.recommendation?.name);
        } catch (parseError: any) {
            console.error('[Analyze Taste] JSON Parse Failed. Raw text sample:', responseText.substring(0, 200));
            console.error('[Analyze Taste] Parse error:', parseError.message);
            return NextResponse.json({
                error: 'AI output format error',
                details: parseError.message,
                message: isEn
                    ? 'Failed to parse AI analysis results. Please try again.'
                    : 'AI 분석 결과 파싱에 실패했습니다. 다시 시도해주세요.'
            }, { status: 500 });
        }

        // 6. Save & Response
        console.log('[Analyze Taste] Saving results to DB...');

        // Update previousRecommendations array
        // Add current recommendation and keep last 10 total
        const newRecommendation = analysisResult.recommendation?.name;
        let updatedPreviousRecommendations = [...previousRecommendations];
        if (newRecommendation) {
            updatedPreviousRecommendations.push(newRecommendation);
        }
        // Keep only the last 10 recommendations
        updatedPreviousRecommendations = updatedPreviousRecommendations.slice(-10);

        const profile = {
            userId,
            analyzedAt: new Date().toISOString(),
            ...analysisResult,
            previousRecommendations: updatedPreviousRecommendations
        };

        try {
            // Update Usage & Save Profile
            await Promise.all([
                tasteProfileDb.save(userId, profile),
                tasteProfileDb.setUsage(userId, today, currentCount + 1)
            ]);
            console.log('[Analyze Taste] Save Successful');
        } catch (saveError: any) {
            console.error('[Analyze Taste] DB Save Error:', saveError);
            // We can still return the profile even if save fails, but it's risky for UI consistency
            // For now, let's treat it as a 500
            return NextResponse.json({
                error: 'Failed to save analysis results',
                details: saveError.message
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            profile,
            usage: {
                date: today,
                count: currentCount + 1,
                remaining: Math.max(0, 3 - (currentCount + 1))
            }
        });

    } catch (error: any) {
        console.error('[Analyze Taste Critical Error]', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            details: error.message
        }, { status: 500 });
    }
}