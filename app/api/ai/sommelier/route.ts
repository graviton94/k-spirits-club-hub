import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { spiritsDb } from '@/lib/db';
import metadataFn from '@/lib/constants/spirits-metadata.json';

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

        // --- RATE LIMITING ---
        // 20 requests/day per user (authenticated) or per IP (guest).
        // Covers 4 full 5-step sessions with room to spare.
        const DAILY_LIMIT = 20;
        const ip = req.headers.get('CF-Connecting-IP') ||
            req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            'unknown';
        const rateLimitKey = userId !== 'guest' ? `user_${userId}` : `ip_${ip}`;
        const { rateLimitDb } = await import('@/lib/db/firestore-rest');
        const rateCheck = await rateLimitDb.checkAndIncrement(rateLimitKey, DAILY_LIMIT);
        if (rateCheck.limited) {
            return NextResponse.json({
                error: 'rate_limit_exceeded',
                message: isEn
                    ? `You've reached today's chat limit (${DAILY_LIMIT} messages). Please try again tomorrow.`
                    : `오늘의 AI 채팅 한도(${DAILY_LIMIT}회)에 도달했습니다. 내일 다시 시도해 주세요.`
            }, { status: 429 });
        }

        let knowledgeBase = "";
        let searchIndex: any[] = [];
        
        // --- OPTIMIZATION: Only load deep DB index when preparing for recommendation (Step 5) ---
        // --- OPTIMIZATION: Load DB index earlier (Step 3+) to prevent "no context" bridge messages ---
        if (currentStep >= 3) {
            // Load Full Index for Matching
            searchIndex = await spiritsDb.getPublishedSearchIndex();
            
            // 0. Priority Matching based on User Input (to prevent missing DB items mentioned by user)
            const userKeywords = messages.map((m: any) => m.content).join(' ');
            const priorityMatches = searchIndex.filter(item => {
                const name = (item.n || '').toLowerCase();
                const nameEn = (item.m || '').toLowerCase(); // Actually manufacturer/distillery often in 'm'
                const keywords = userKeywords.toLowerCase();
                
                // Check if name or parts of name appear in user messages
                return keywords.includes(name) || (name.length > 2 && keywords.includes(name.split(' ')[0]));
            }).slice(0, 30);

            // 1. Prepare Balanced Search Index (Sample from each category for diverse knowledge)
            const categories = [...new Set(searchIndex.map(s => s.c))];
            const balancedIndex: any[] = [];
            
            // Add priority matches first
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
            // 2. Prepare Lightweight Category Summary (Step 1-4)
            const summary = {
                categories: ["소주", "위스키", "와인", "일반증류주", "탁주", "약주", "청주", "과실주", "브랜디", "리큐르"],
                focus: "지금은 질문을 통해 사용자의 선호 국가(프랑스, 한국 등), 제조 방식, 선호 향미를 파악하는 인터뷰 단계입니다."
            };
            knowledgeBase = `[주종 카테고리 개요]\n${JSON.stringify(summary)}`;
        }

        // 2. Build the Sommelier System Instruction
        const systemInstruction = `
너는 전 세계 주류에 능통하고, 주류 백과사전을 마스터한 전문 소믈리에 'K-소믈리에'야. 
사용자의 취향을 분석하여 인생 주류를 찾아주는 "5단계 소믈리에 인터뷰"를 진행하고 있어.

[최우선 규칙: DB 매칭 엄수]
- **추천 시 반드시 제공된 [주류 데이터]를 가장 먼저 확인하라.** 
- 추천 제품명(예: 탈리스커 10년)이 데이터에 있다면, **반드시 해당 제품의 id를 포함**하고 type을 'match'로 설정해.
- 데이터에 있는 제품임에도 id를 null로 주거나 external로 분류하는 것은 절대 금지다.

[현재 상황]
현재 진행 단계: 5단계 중 ${currentStep}단계
언어: ${isEn ? 'English' : 'Korean'}

[진행 로직 (핵심)]
- **인터뷰 (1~5단계)**: 사용자의 답변을 전문적으로 해석하고, 반드시 "다음 단계 질문"을 던져야 해. 
  * 권장 흐름: 1.주종 선호 -> 2.향미 취향 -> 3.상황/페어링 -> 4.도수/강도 -> 5.가격대
- **조기 완료 가능**: 사용자의 의도가 명확하다면 5단계를 다 채우지 않아도 즉시 nextStep: 6으로 넘어가서 추천을 시작해.
- **마지막 답변 시 (nextStep: 6)**: 최종 분석 결론(맛 DNA)과 추천 리스트를 제공해.
- **멘트 규칙**: "잠시만 기다려주세요", "분석을 시작합니다" 같은 무의미한 대기 요청은 절대 하지 마. 즉시 다음 질문을 하거나 결과를 내놓아라. 

[DB 매칭 특급 지침 (추천 단계용)]
제공된 [주류 데이터]는 계층화되어 있어. 이를 사용자의 의도와 적극적으로 매칭해:
- **핵심 데이터 활용**: 'category'뿐만 아니라 **'subcategory'**, **'country' (제조국)**, **'manufacturer' (제조장)** 필드를 분석하여 사용자의 취향과 가장 일치하는 제품을 찾아.
- 사용자가 특정 국가나 제조장을 선호한다면 이를 최우선 가중치로 두어 추천해.
- 태그 의미: 'r'(원재료), 'f'(향미) 등 사용자가 선호하는 텍스트와 최대로 일치하는 제품을 찾아.

[추천 전략]
1. **DB 내 정확한 매칭 (match)**: 제공된 데이터 중 조건과 제조국/제조장이 일치하는 제품. (반드시 제공된 리스트의 ID 사용)
2. **DB 내 유사 성격 매칭 (similar)**: 조건이 완벽하지 않아도 카테고리나 향미가 가장 성격이 비슷한 DB 제품.
3. **외부 지식 추천 (external)**: DB에 정말 적합한 것이 없을 때만 실존 제품 추천. (구글/네이버 링크 필수)

[작성 및 답변 규칙]
- 말투: 품격 있고 신뢰감 있는 마스터 소믈리에 톤.
- **유지 규칙**: 인터뷰 진행 중에는 절대 추천 결과를 미리 말하지 마. **마지막 문장은 정중하고 구체적인 질문으로 끝낼 것.**
- **추천 단계(nextStep === 6)**: 사용자의 맛 DNA 요약과 함께 추천 제품 1~3개를 상세 사유와 함께 제시해.

${knowledgeBase}

[응답 형식 (JSON 엄수)]
{
  "message": "사용자에게 보낼 메시지 (1~5단계는 마지막에 질문 필수, 6단계는 리스트 요약)",
  "analysis": "사용자의 맛 DNA 요약 (#키워드 형식)",
  "nextStep": 다음 단계 번호 (1-5, 완료 시 6),
  "recommendations": [ 
    { 
      "id": "spirit_id (외부 제품은 null)", 
      "name": "제품명",
      "type": "match" | "similar" | "external",
      "reason": "전문적인 추천 사유 (왜 이 제품이 사용자의 DNA에 맞는지 설명)",
      "googleSearchLink": "...",
      "naverSearchLink": "..."
    }
  ] (nextStep: 6일 때만 포함)
}
`;

        const generationConfig = {
            responseMimeType: "application/json",
            temperature: 0.7,
        };

        const firstUserIndex = messages.findIndex((m: any) => m.role === 'user');
        const conversationMessages = firstUserIndex !== -1
            ? messages.slice(firstUserIndex)
            : messages;

        const contents = conversationMessages.map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{
                text: m.role === 'user'
                    ? m.content
                    : JSON.stringify({ message: m.content })
            }]
        }));

        let result;
        try {
            // 🟢 [Plan A] 1차 시도: Cloudflare AI Gateway
            console.log('[Sommelier API] [Plan A] Attempting via Cloudflare AI Gateway...');
            const gatewayGenAI = new GoogleGenerativeAI("CF_MANAGED_KEY");
            const model = gatewayGenAI.getGenerativeModel({
                model: MODEL_ID,
                systemInstruction
            }, {
                baseUrl: process.env.CF_GATEWAY_URL,
                customHeaders: {
                    "cf-aig-authorization": `Bearer ${process.env.CF_AIG_TOKEN}`
                }
            });
            result = await model.generateContent({
                contents,
                generationConfig
            });
            console.log('[Sommelier API] [Plan A] Success via AI Gateway');

        } catch (gatewayError: any) {
            // ⚠️ Fallback
            console.warn("⚠️ [Fallback] AI Gateway 호출 실패, Direct API로 우회합니다.", gatewayError.message);

            // 🟠 [Plan B] 2차 시도: Direct Gemini API
            const directGenAI = new GoogleGenerativeAI(API_KEY);
            const fallbackModel = directGenAI.getGenerativeModel({
                model: MODEL_ID,
                systemInstruction
            });
            result = await fallbackModel.generateContent({
                contents,
                generationConfig
            });
            console.log('[Sommelier API] [Plan B] Success via Direct API');
        }

        const responseText = result.response.text();
        let parsed = JSON.parse(responseText);

        // --- HIDDEN TURN (AUTO-FOLLOWUP): Detect and eliminate bridge messages ---
        const waitKeywords = ["잠시만", "기다려", "찾아보", "분석을 위해", "분석을 시작", "결과를 준비", "조금만", "Please wait", "Analyzing", "Calculating", "Searching"];
        const isMsgWaitLike = waitKeywords.some(kw => parsed.message.includes(kw));

        if (isMsgWaitLike && parsed.nextStep < 6 && currentStep >= 2) {
            console.log('[Sommelier API] Bridge message detected. Performing an automatic hidden turn.');
            
            // Add the bridge message to contents as a model turn
            const hiddenTurnContents = [...contents, {
                role: 'model',
                parts: [{ text: responseText }]
            }, {
                role: 'user',
                parts: [{ text: isEn ? "Okay, proceed to recommendations now." : "좋습니다. 분석을 완료하고 즉시 추천 결과(Step 6)를 보여주세요." }]
            }];

            // Re-call AI with high determination
            const followUpModel = new GoogleGenerativeAI(API_KEY).getGenerativeModel({
                model: MODEL_ID,
                systemInstruction: systemInstruction + "\n\nCRITICAL: DO NOT SEND BRIDGE MESSAGES. PROVIDE THE FINAL CHOICE (Step 6) IMMEDIATELY."
            });

            const followUpResult = await followUpModel.generateContent({
                contents: hiddenTurnContents,
                generationConfig
            });
            
            parsed = JSON.parse(followUpResult.response.text());
            console.log('[Sommelier API] Hidden turn success. nextStep:', parsed.nextStep);
        }

        // 3. Parse and Enrich Recommendations

        // Guard: if the AI declared nextStep 6 (recommendation stage) but produced no
        // recommendations (e.g. because it was called before the DB index was loaded),
        // revert to step 5 so the client does not lock up with an empty result screen.
        if (parsed.nextStep === 6 && (!parsed.recommendations || parsed.recommendations.length === 0)) {
            parsed.nextStep = 5;
        }

        if (parsed.recommendations && parsed.recommendations.length > 0) {
            // Re-load index if not already loaded (Step 6 might reach here if currentStep was >= 5)
            if (searchIndex.length === 0) {
                searchIndex = await spiritsDb.getPublishedSearchIndex();
            }

            parsed.recommendations = parsed.recommendations.map((rec: any) => {
                let match = null;

                // 1. First try matching by ID if provided
                if (rec.id) {
                    match = searchIndex.find(s => s.i === rec.id);
                }

                // 2. Fallback: Fuzzy Name Matching (to recover missing IDs for products in our DB)
                if (!match && rec.name) {
                    const cleanRecName = rec.name.replace(/\s+/g, '').toLowerCase();
                    match = searchIndex.find(s => {
                        const dbNameKo = (s.n || '').replace(/\s+/g, '').toLowerCase();
                        const dbNameEn = (s.m || '').replace(/\s+/g, '').toLowerCase(); // Distillery/Brand often in 'm'
                        return dbNameKo.includes(cleanRecName) || cleanRecName.includes(dbNameKo) || (dbNameEn && dbNameEn.includes(cleanRecName));
                    });
                }

                if (match) {
                    return {
                        ...rec,
                        id: match.i, // Recover missing ID
                        name: match.n || rec.name,
                        thumbnailUrl: match.t,
                        imageUrl: match.t,
                        category: match.c,
                        subcategory: match.sc,
                        country: match.co,
                        manufacturer: match.m,
                        abv: match.a,
                        inDb: true,
                        type: 'match' // Force as match if found in DB
                    };
                }
                return { ...rec, inDb: false };
            });

            // 로깅: 상담 완료 시 기록
            if (parsed.nextStep === 6) {
                try {
                    const { sommelierDb } = await import('@/lib/db/firestore-rest');
                    await sommelierDb.logDiscovery(userId, {
                        analysis: parsed.analysis,
                        recommendations: parsed.recommendations,
                        messageHistory: messages.concat([{ role: 'model', content: parsed.message }])
                    });
                } catch (logErr) {
                    console.error("[Sommelier API] Log Error:", logErr);
                }
            }
        }

        return NextResponse.json(parsed);

    } catch (error: any) {
        console.error('[Sommelier API Error]', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
