// app/api/ai/sommelier/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
    dbAdminSearchSpiritsPublic
} from '@/lib/db/data-connect-admin';
import { runWithGeminiModelFallback, getGeminiModelCandidates } from '@/lib/services/gemini-model-fallback';


export const runtime = 'nodejs';

/**
 * AI Sommelier Q&A Bot API
 * Handles multi-step professional profiling and spirit recommendations.
 */
import { getEnv } from '@/lib/env';


export async function POST(req: NextRequest) {
    const apiKey = getEnv('GEMINI_API_KEY') || getEnv('GOOGLE_GEMINI_API_KEY');
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
        console.error(`[Sommelier API][${traceId}] ❌ GEMINI_API_KEY is missing in getEnv()`);
        return fallbackResponse(lang, currentStep, 'GEMINI_API_KEY is missing from all sources', 'AI_SOMMELIER_KEY_MISSING');
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
                const spirits = await dbAdminSearchSpiritsPublic({ limit: 200 });
                searchIndex = (spirits || []).map((s: any) => ({
                    i: s.id, n: s.name, en: s.nameEn, c: s.category,
                    sc: s.subcategory, a: s.abv, d: s.distillery, t: s.imageUrl
                }));
            } catch (e: any) {
                console.error('[Sommelier API] Index Fetch Failed:', e.message);
                searchIndex = [];
            }

            // Prepare context for the AI
            const userKeywords = messages.map((m: any) => m.content).join(' ').toLowerCase();
            
            // Smarter filtering: Priority matches + balancing categories
            const priorityMatches = (searchIndex || [])
                .filter(item => {
                    const name = (item.n || '').toLowerCase();
                    return name.length > 1 && (userKeywords.includes(name) || name.includes(userKeywords));
                })
                .slice(0, 15);

            const categories = [...new Set((searchIndex || []).map(s => s.c))];
            const balancedIndex: any[] = [];

            // Add priority matches first
            priorityMatches.forEach(item => {
                balancedIndex.push({
                    i: item.i, n: item.n, c: item.c, sc: item.sc, 
                    co: item.co || '', m: item.d || '', a: item.a, t: item.tn || ''
                });
            });

            // Sample from each category to give AI a broad scope
            const SAMPLES_PER_CATEGORY = 3;
            categories.forEach(cat => {
                if (!cat) return;
                const catItems = searchIndex
                    .filter(s => s.c === cat && !balancedIndex.some(existing => existing.i === s.i))
                    .slice(0, SAMPLES_PER_CATEGORY);

                balancedIndex.push(...catItems.map(item => ({
                    i: item.i, n: item.n, c: item.c, sc: item.sc,
                    co: item.co || '', m: item.d || '', a: item.a, t: item.tn || ''
                })));
            });

            // Final safety slice to keep JSON payload within reasonable limits
            knowledgeBase = `[Spirit Data Index Snippet]\n${JSON.stringify(balancedIndex.slice(0, 50))}`;
        } else {
            const summary = {
                categories: ["소주", "위스키", "와인", "일반증류주", "탁주", "약주", "청주", "과실주", "브랜디", "리큐르"],
                focus: "인터뷰 단계입니다."
            };
            knowledgeBase = `[주종 카테고리 개요]\n${JSON.stringify(summary)}`;
        }

        const systemInstruction = `
        당신은 세계 최고 수준의 AI 소믈리에이자 주류 큐레이터 'K-소믈리에'입니다.
        당신의 임무는 5단계의 전문적인 인터뷰 프로세스를 통해 사용자의 잠재적인 취향 DNA를 추출하고, 최적의 제품을 추천하는 것입니다.

        [운영 원칙]
        1. 전문성: 위스키, 와인, 전통주, 사케 등 모든 주종에 대한 깊은 지식을 바탕으로 설명합니다.
        2. 단계별 분석: 사용자가 성급하게 답변을 유도하더라도, 단계별로 깊이 있는 질문을 던져 정확한 데이터를 확보하십시오.
           - 1단계: 선호 주종 및 도수 취향 (Whisky, Wine, Soju, etc.)
           - 2단계: 향(Aroma) 선호도 (Fruity, Peaty, Floral, Woody, etc.)
           - 3단계: 맛(Palate) 및 질감(Body) 취향 (Sweet, Dry, Oily, Spicy, etc.)
           - 4단계: 기존에 좋았던/싫었던 제품 경험
           - 5단계: 현재의 기분 또는 음용 상황 (Solo, Party, Gift, etc.)
        3. 정교한 분석: 응답 시 'analysis' 필드에 현재까지 파악된 사용자의 취향을 전문 용어를 섞어 한 줄로 요약하십시오.
        4. 추천의 질: 6단계에 도달하면 제공된 [Spirit Data] 지식 베이스를 최우선으로 검색하여 id와 함께 추천하십시오. 지식 베이스에 없는 경우만 외부 추천을 진행합니다.

        [언어 및 톤앤매너]
        - 사용자의 언어(${isEn ? 'English' : 'Korean'})를 따르십시오.
        - 정중하고 격조 있는 말투를 유지하십시오. 한국어의 경우 존댓말을 사용합니다.
        - 핵심 키워드나 제품명은 **강조(Bold)** 처리하십시오.

        [응답 형식 - JSON]
        {
          "message": "사용자에게 보낼 메시지 (마지막 단계인 경우 종합 감정평 포함)",
          "nextStep": 다음 단계 번호 (1~6, 6은 최종 추천 단계),
          "analysis": "현재까지 분석된 취향 요약 (예: '고도수의 피트향을 선호하는 모험가형')",
          "recommendations": [
            {
              "id": "지식 베이스의 i 필드값 (없으면 null)",
              "name": "제품명",
              "reason": "소믈리에 관점에서의 상세 추천 사유",
              "matchRate": 0~100 사이의 숫자
            }
          ]
        }
        `;

        console.log(`[Sommelier API][${traceId}] Calling Gemini with step: ${currentStep}, knowledgeBase length: ${knowledgeBase.length}`);

        const conversationMessages = messages.map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
        }));

        const directGenAI = new GoogleGenerativeAI(apiKey);
        const result = await runWithGeminiModelFallback({
            genAI: directGenAI,
            modelIds: getGeminiModelCandidates(),
            createModel: (client, modelId) => client.getGenerativeModel({
                model: modelId,
                systemInstruction: systemInstruction.trim()
            }),
            run: (model) => model.generateContent({
                contents: conversationMessages,
                generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.7,
                }
            }),
            onModelSelected: (modelId) => {
                console.log(`[Sommelier API][${traceId}] Using Gemini model: ${modelId}`);
            }
        });

        const responseText = result.response.text();
        if (!responseText) {
            throw new Error('Empty response from AI');
        }

        let parsed;
        try {
            // Robust JSON extraction
            const cleanText = responseText.replace(/```json|```/g, '').trim();
            const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
            parsed = JSON.parse(jsonMatch ? jsonMatch[0] : cleanText);
        } catch (e: any) {
            console.error('[Sommelier API] JSON Parse Error:', e, responseText);
            return fallbackResponse(lang, currentStep, 'AI returned invalid JSON format', 'AI_SOMMELIER_PARSE_ERROR');
        }

        // Enrich recommendations with real DB data
        if (parsed.recommendations && Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0) {
            if (!searchIndex || searchIndex.length === 0) {
                try {
                    // Try Admin Data Connect search if Index is unavailable
                    if (parsed.recommendations[0]?.name) {
                        const recMatch = await dbAdminSearchSpiritsPublic({ search: parsed.recommendations[0].name, limit: 1 });
                        if (recMatch && recMatch.length > 0) {
                            searchIndex = recMatch.map((s: any) => ({
                                i: s.id, n: s.name, c: s.category, a: s.abv, t: s.imageUrl
                            }));
                        }
                    }
                } catch (e: any) {
                    console.error('Failed to fetch fallback search results:', e);
                }
            }

            if (searchIndex && searchIndex.length > 0) {
                parsed.recommendations = parsed.recommendations.map((rec: any) => {
                    // Standardize match object to use either minified (i/n/c) or full (id/name/category) keys
                    const m = searchIndex.find(s => (s.i || s.id) === rec.id) || 
                              searchIndex.find(s => (s.n || s.name) === rec.name) ||
                              searchIndex.find(s => (s.n || s.name)?.toLowerCase().includes(String(rec.name || '').toLowerCase()));
                    
                    if (m) {
                        return { 
                            ...rec, 
                            id: m.i || m.id, 
                            inDb: true, 
                            thumbnailUrl: m.t || m.thumbnailUrl || m.imageUrl,
                            name: m.n || m.name,
                            category: m.c || m.category,
                            abv: m.a || m.abv
                        };
                    }
                    return { ...rec, inDb: false };
                });
            }

            // TODO: Re-implement AI discovery logging using dbAdminUpsertAiDiscoveryLog
            // once an admin-level mutation for aiDiscoveryLog is added to data-connect-admin.ts.
            // Currently skipped as it's non-critical and the operation requires server-auth context.
            if (parsed.nextStep === 6) {
                // AI discovery logging intentionally skipped (non-critical)
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
        const errorStack = error instanceof Error ? error.stack : '';
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`[Sommelier API][${traceId}] ❌ CRITICAL:`, {
            message: errorMsg,
            stack: errorStack,
            name: error?.name,
            code: error?.code
        });
        return fallbackResponse(lang, currentStep, errorMsg, 'AI_SOMMELIER_UPSTREAM_ERROR');
    }
}
