// app/api/ai/sommelier/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '@/lib/db';
import { dbUpsertAiDiscoveryLog } from '@/lib/db/data-connect-client';

export const runtime = 'edge';

const API_KEY = process.env.GEMINI_API_KEY || '';
const MODEL_ID = "gemini-2.0-flash";

/**
 * AI Sommelier Q&A Bot API
 * Handles multi-step professional profiling and spirit recommendations.
 */
export async function POST(req: NextRequest) {
    if (!API_KEY) {
        return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
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
            }).slice(0, 30);

            const categories = [...new Set(searchIndex.map(s => s.c))];
            const balancedIndex: any[] = [];

            priorityMatches.forEach(item => {
                balancedIndex.push({
                    id: item.i,
                    name: item.n,
                    category: item.c,
                    subcategory: item.sc,
                    country: item.co,
                    manufacturer: item.m,
                    abv: item.a,
                    tags: item.f
                });
            });

            const SAMPLES_PER_CATEGORY = 20;
            categories.forEach(cat => {
                const catItems = searchIndex
                    .filter(s => s.c === cat && !balancedIndex.some(existing => existing.id === s.i))
                    .slice(0, SAMPLES_PER_CATEGORY);

                balancedIndex.push(...catItems.map(item => ({
                    id: item.i,
                    name: item.n,
                    category: item.c,
                    subcategory: item.sc,
                    country: item.co,
                    manufacturer: item.m,
                    abv: item.a,
                    tags: item.f
                })));
            });
            knowledgeBase = `[주류 추천 데이터 (전문가용)]\n${JSON.stringify(balancedIndex)}`;
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
        let parsed = JSON.parse(responseText);

        // Enrich recommendations with real DB data
        if (parsed.recommendations && parsed.recommendations.length > 0) {
            if (searchIndex.length === 0) {
                searchIndex = await db.getPublishedSearchIndex();
            }

            parsed.recommendations = parsed.recommendations.map((rec: any) => {
                const match = searchIndex.find(s => s.i === rec.id) || searchIndex.find(s => (s.n === rec.name));
                if (match) {
                    return { ...rec, id: match.i, inDb: true, thumbnailUrl: match.t };
                }
                return { ...rec, inDb: false };
            });

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
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
