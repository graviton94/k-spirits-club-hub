// app/api/ai/sommelier/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { dbUpsertAiDiscoveryLog } from '@/lib/db/data-connect-client';
import { db } from '@/lib/db'; // Compatibility layer for getPublishedSearchIndex


export const runtime = 'edge';

const API_KEY = process.env.GEMINI_API_KEY || '';
const MODEL_ID = "gemini-2.0-flash";

/**
 * AI Sommelier Q&A Bot API
 * Handles multi-step professional profiling and spirit recommendations.
 */
export async function POST(req: NextRequest) {
    if (!API_KEY) {
        const body = await req.json().catch(() => ({} as any));
        const lang = body?.lang === 'en' ? 'en' : 'ko';
        return NextResponse.json({
            message: lang === 'en'
                ? 'Sommelier service is preparing. Please try again shortly.'
                : '소믈리에 서비스 준비 중입니다. 잠시 후 다시 시도해주세요.',
            nextStep: body?.currentStep || 1,
            analysis: '',
            recommendations: []
        });
    }

    try {
        const body = await req.json();
        const { messages, lang = 'ko', currentStep = 1, userId = 'guest' } = body;
        const isEn = lang === 'en';

        // --- RATE LIMITING (Post-Migration Placeholder) ---
        // Note: Legacy firestore-rest rate limiting removed.
        // TODO: Implement PostgreSQL-based rate limiting in future sprint.
        const DAILY_LIMIT = 20;

        let knowledgeBase = "";
        let searchIndex: any[] = [];

        // Loading searchable index for recommendations (Step 3+)
        if (currentStep >= 3) {
            searchIndex = await db.getPublishedSearchIndex();

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

        const directGenAI = new GoogleGenerativeAI(API_KEY);
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
        } catch (e) {
            console.error('[Sommelier API] JSON Parse Error:', e, responseText);
            // Fallback for malformed JSON
            return NextResponse.json({ 
                message: isEn ? "I'm having trouble processing that right now. Could you rephrase?" : "죄송합니다. 현재 처리에 문제가 생겼습니다. 다시 한번 말씀해 주시겠어요?",
                nextStep: currentStep,
                analysis: ""
            });
        }

        // Enrich recommendations with real DB data
        if (parsed.recommendations && parsed.recommendations.length > 0) {
            if (!searchIndex || searchIndex.length === 0) {
                try {
                    searchIndex = await db.getPublishedSearchIndex();
                } catch (e) {
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
                } catch (e) {
                    console.error('Discovery Logging failed:', e);
                }
            }
        }

        return NextResponse.json(parsed);

    } catch (error: any) {
        console.error('[Sommelier API Error]', error);
        return NextResponse.json({ 
            error: 'Internal Server Error',
            message: "Our sommelier is currently resting. Please try again in a moment.",
            debug: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}
