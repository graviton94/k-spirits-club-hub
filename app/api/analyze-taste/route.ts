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
    // 1. API 키 확인
    if (!API_KEY) {
        console.error('[Analyze Taste] API Key is missing');
        return NextResponse.json({ error: 'Server configuration error (API Key)' }, { status: 500 });
    }

    try {
        // Correctly read userId from Body for POST requests
        const body = await req.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // 0. Check Usage Limit
        const today = getKSTDate();
        const usage = await tasteProfileDb.getUsage(userId);
        let currentCount = 0;

        if (usage && usage.date === today) {
            currentCount = usage.count;
        }

        if (currentCount >= 3) {
            return NextResponse.json({
                error: 'Daily limit reached',
                message: '오늘의 AI 분석 횟수(3회)를 모두 사용하셨어요. 내일 다시 시도해주세요!'
            }, { status: 429 });
        }

        console.log(`[Analyze Taste] Starting analysis for User: ${userId} (Count: ${currentCount}/3)`);

        // 2. Fetch Data (DB 에러 1차 방어)
        let cabinetItems = [];
        let userReviews = [];

        try {
            [cabinetItems, userReviews] = await Promise.all([
                cabinetDb.getAll(userId),
                reviewsDb.getAllForUser(userId)
            ]);
        } catch (dbError) {
            console.error('[Analyze Taste] DB Fetch Error:', dbError);
            return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
        }

        // 3. Merge Data (데이터 병합)
        const spiritsForAnalysis = cabinetItems.map((item: any) => {
            const review = userReviews.find((r: any) => r.spiritId === item.spiritId || r.spiritName === item.name);
            return {
                ...item,
                userReview: review ? {
                    ratingOverall: review.rating,
                    ratingN: review.ratingN || 0,
                    ratingP: review.ratingP || 0,
                    ratingF: review.ratingF || 0,
                    tagsN: review.tagsN ? [review.tagsN] : [],
                    tagsP: review.tagsP ? [review.tagsP] : [],
                    tagsF: review.tagsF ? [review.tagsF] : [],
                    comment: review.notes
                } : null,
                isWishlist: false // 기본값
            };
        });

        const promptData = buildTasteAnalysisPrompt(spiritsForAnalysis);
        console.log(`[Analyze Taste] Prompt Length: ${promptData?.length}`);

        // 프롬프트가 너무 짧으면(분석할 술이 없으면) 에러 처리
        if (!promptData || promptData.length < 10) {
            console.error('[Analyze Taste] Prompt too short');
            return NextResponse.json({
                error: 'Invalid data',
                message: 'AI에게 전달할 데이터가 부족합니다.'
            }, { status: 400 });
        }

        // 4. Call AI
        const genAI = new GoogleGenerativeAI(API_KEY);

        const systemInstruction = `
        You are a professional sommelier AI. 
        Analyze the user's spirit preferences based on the provided data.
        
        IMPORTANT: Return ONLY valid JSON format. Do not include markdown code blocks like \`\`\`json.
        
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
                "title": "A creative short title (e.g. Sherry Bomb Lover)",
                "description": "2-3 sentences analyzing their taste profile in Korean (polite tone).",
                "keywords": ["#Tag1", "#Tag2", "#Tag3"]
            },
            "recommendation": {
                "name": "Name of a recommended spirit",
                "matchRate": 80-99,
                "reason": "Short reason why"
            }
        }
        `;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.3,
                topP: 0.8,
                topK: 40
            }
        });

        const result = await model.generateContent([
            systemInstruction,
            promptData
        ]);

        let responseText = result.response.text();
        console.log('[AI Analysis] Raw Response:', responseText);

        // 5. Parse JSON
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        let analysisResult;
        try {
            analysisResult = JSON.parse(responseText);
        } catch (e) {
            console.error('[AI Analysis] JSON Parse Failed. Raw text:', responseText);
            return NextResponse.json({ error: 'AI output format error' }, { status: 500 });
        }

        // 6. Save & Response
        const profile = {
            userId,
            analyzedAt: new Date().toISOString(),
            ...analysisResult
        };

        // Update Usage & Save Profile
        // Increment count and save
        await Promise.all([
            tasteProfileDb.save(userId, profile),
            tasteProfileDb.setUsage(userId, today, currentCount + 1)
        ]);

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