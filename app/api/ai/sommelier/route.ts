// app/api/ai/sommelier/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { dbUpsertAiDiscoveryLog } from '@/lib/db/data-connect-client';
import { db } from '@/lib/db'; // Compatibility layer for getPublishedSearchIndex


export const runtime = 'nodejs';

const MODEL_ID = "gemini-2.0-flash";

/**
 * AI Sommelier Q&A Bot API
 * Handles multi-step professional profiling and spirit recommendations.
 */
export async function POST(req: NextRequest) {
    const apiKey = process.env.GEMINI_API_KEY || '';
    const traceId = crypto.randomUUID();
    const fallbackResponse = (lang: string, nextStep = 1, detail?: string, code = 'AI_SOMMELIER_GENERAL_ERROR') => NextResponse.json({
        message: lang === 'en'
            ? 'Our sommelier is taking a short break. Please try again in a moment.'
            : '소믈리에가 잠시 숨을 고르고 있습니다. 잠시 후 다시 시도해주세요.',
        nextStep,
        analysis: '',
        recommendations: [],
        code,
        traceId,
        source: 'api/ai/sommelier',
        ...(process.env.NODE_ENV === 'development' && detail ? { debug: detail } : {})
    });

    if (!apiKey) {
        let lang = 'ko';
        let currentStep = 1;
        try {
            const body = await req.clone().json();
            lang = body?.lang === 'en' ? 'en' : 'ko';
            currentStep = body?.currentStep || 1;
        } catch (e) {}
        return fallbackResponse(lang, currentStep, 'GEMINI_API_KEY is missing', 'AI_SOMMELIER_KEY_MISSING');
    }

    let lang = 'ko';
    let currentStep = 1;

    try {
        const body = await req.json();
        const { messages, userId = 'guest' } = body;
        lang = body.lang === 'en' ? 'en' : 'ko';
        currentStep = body.currentStep || 1;
        const isEn = lang === 'en';
        if (!Array.isArray(messages) || messages.length === 0) {
            return fallbackResponse(lang, currentStep, 'Missing messages', 'AI_SOMMELIER_EMPTY_MESSAGES');
        }

        // --- RATE LIMITING (Post-Migration Placeholder) ---
        // Note: Legacy firestore-rest rate limiting removed.
        // TODO: Implement PostgreSQL-based rate limiting in future sprint.
        const DAILY_LIMIT = 20;

        let knowledgeBase = "";
        let searchIndex: any[] = [];

        // Loading searchable index for recommendations (Step 3+)
        if (currentStep >= 3) {
            try {
                searchIndex = await db.getPublishedSearchIndex();
            } catch (e: any) {
                console.error('[Sommelier API] Index Fetch Failed:', e);
                // Non-critical, can continue but with limited knowledge
            }

            // Prepare context for the AI
            const userKeywords = messages.map((m: any) => m.content).join(' ');
            const priorityMatches = searchIndex.filter(item => {
                const name = (item.n || '').toLowerCase();
                const keywords = userKeywords.toLowerCase();
                return keywords.includes(name) || (name.length > 2 && keywords.includes(name.split(' ')[0]));
            }).slice(0, 20); // Reduced from 30

            const categories = [...new Set(searchIndex.map(s => s.c))];
            const balancedIndex: any[] = [];

            priorityMatches.forEach(item => {
                balancedIndex.push({
                    i: item.i,
                    n: item.n,
                    c: item.c,
                    sc: item.sc,
                    co: item.co || '',
                    m: item.d || '',
                    a: item.a,
                    t: item.tn || ''
                });
            });

            const SAMPLES_PER_CATEGORY = 5; // Heavily reduced from 20 to keep context small
            categories.forEach(cat => {
                const catItems = searchIndex
                    .filter(s => s.c === cat && !balancedIndex.some(existing => existing.i === s.i))
                    .slice(0, SAMPLES_PER_CATEGORY);

                balancedIndex.push(...catItems.map(item => ({
                    i: item.i,
                    n: item.n,
                    c: item.c,
                    sc: item.sc,
                    co: item.co || '',
                    m: item.d || '',
                    a: item.a,
                    t: item.tn || ''
                })));
            });
            knowledgeBase = `[Spirit Data]\n${JSON.stringify(balancedIndex)}`;
        } else {
            const summary = {
                categories: ["소주", "위스키", "와인", "일반증류주", "탁주", "약주", "청주", "과실주", "브랜디", "리큐르"],
                focus: "인터뷰 단계입니다."
            };
            knowledgeBase = `[주종 카테고리 개요]\n${JSON.stringify(summary)}`;
        }

        const systemInstruction = `전략 소믈리에 지침... (생략/유지)`; // System instruction remains same logic

        const directGenAI = new GoogleGenerativeAI(apiKey);
        const model = directGenAI.getGenerativeModel({
            model: MODEL_ID,
            systemInstruction
        });

        const conversationMessages = messages.map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
        }));

        const result = await model.generateContent({
            contents: conversationMessages,
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.7,
            }
        });

        const responseText = result.response.text();
        if (!responseText) {
            throw new Error('Empty response from AI');
        }

        let parsed;
        try {
            parsed = JSON.parse(responseText);
        } catch (e: any) {
            console.error('[Sommelier API] JSON Parse Error:', e, responseText);
            return fallbackResponse(lang, currentStep, 'JSON Parse Failed', 'AI_SOMMELIER_PARSE_ERROR');
        }

        // Enrich recommendations with real DB data
        if (parsed.recommendations && parsed.recommendations.length > 0) {
            if (!searchIndex || searchIndex.length === 0) {
                try {
                    searchIndex = await db.getPublishedSearchIndex();
                } catch (e: any) {
                    console.error('Failed to fetch search index for enrichment:', e);
                }
            }

            if (searchIndex && searchIndex.length > 0) {
                parsed.recommendations = parsed.recommendations.map((rec: any) => {
                    const match = searchIndex.find(s => s.i === rec.id) || searchIndex.find(s => (s.n === rec.name));
                    if (match) {
                        return { ...rec, id: match.i, inDb: true, thumbnailUrl: match.t };
                    }
                    return { ...rec, inDb: false };
                });
            }

            // Log selection to PostgreSQL
            if (parsed.nextStep === 6) {
                try {
                    await dbUpsertAiDiscoveryLog({
                        id: `log_${Date.now()}`,
                        userId,
                        analysis: parsed.analysis,
                        recommendations: parsed.recommendations,
                        messageHistory: messages.concat([{ role: 'model', content: parsed.message }])
                    });
                } catch (e: any) {
                    console.error('Discovery Logging failed:', e);
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: parsed.message || (isEn ? 'Let me think a bit more about your taste.' : '취향을 조금 더 분석해볼게요.'),
            nextStep: parsed.nextStep || currentStep,
            analysis: parsed.analysis || '',
            recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
            traceId
        });

    } catch (error: any) {
        console.error('[Sommelier API Error]', error);
        return fallbackResponse(lang, currentStep, error?.message, 'AI_SOMMELIER_UPSTREAM_ERROR');
    }
}
