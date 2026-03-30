import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');
if (!GEMINI_API_KEY) {
    console.error('[Gemini News] 🔴 ERROR: GEMINI_API_KEY is missing!');
}

const TRUSTED_SOURCES = [
    'thespiritsbusiness.com', 'whiskyadvocate.com', 'decanter.com',
    'imbibemagazine.com', 'thedrinksbusiness.com', 'dfs.com',
    'lottedfs.com', 'shilladfs.com', 'thesool.com', 'wine21.com', 'biz.chosun.com'
];

export interface CollectedNewsItem {
    link: string;
    source: string;
    date: string;
    originalTitle: string;
    translations: {
        en: { title: string; snippet: string; content: string };
        ko: { title: string; snippet: string; content: string };
    };
    tags: { en: string[]; ko: string[] };
}

// Simple XML parser for Edge Runtime compatibility
function parseRSSFeed(xmlText: string): any[] {
    const items: any[] = [];

    // Extract all <item> elements using regex
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xmlText)) !== null) {
        const itemXml = match[1];

        // Extract fields from each item
        const titleMatch = /<title>([\s\S]*?)<\/title>/.exec(itemXml);
        const linkMatch = /<link>([\s\S]*?)<\/link>/.exec(itemXml);
        const descMatch = /<description>([\s\S]*?)<\/description>/.exec(itemXml);
        const pubDateMatch = /<pubDate>([\s\S]*?)<\/pubDate>/.exec(itemXml);
        const sourceMatch = /<source[^>]*>([\s\S]*?)<\/source>/.exec(itemXml);

        if (titleMatch && linkMatch) {
            items.push({
                title: decodeHTMLEntities(titleMatch[1].trim()),
                link: linkMatch[1].trim(),
                description: descMatch ? decodeHTMLEntities(descMatch[1].trim()) : '',
                pubDate: pubDateMatch ? pubDateMatch[1].trim() : '',
                source: sourceMatch ? decodeHTMLEntities(sourceMatch[1].trim()) : 'Curated News'
            });
        }
    }

    return items;
}

// Helper to decode HTML entities
function decodeHTMLEntities(text: string): string {
    return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/&hellip;/g, '...')
        .replace(/&ndash;/g, '-')
        .replace(/&mdash;/g, '—')
        .replace(/&rsquo;/g, "'")
        .replace(/&lsquo;/g, "'")
        .replace(/&rdquo;/g, '"')
        .replace(/&ldquo;/g, '"')
        .replace(/<[^>]+>/g, ''); // Remove HTML tags
}

export async function fetchNewsForCollection(existingLinks?: Set<string>): Promise<CollectedNewsItem[]> {
    console.log('[News Collection] 🚀 Starting news collection process...');

    try {
        // 1. 배치 쿼리 정의 - 핵심 키워드만 사용 (품질 위주)
        const englishQueries = [
            '(Whisky OR Whiskey) AND (new OR release OR award OR distillery)',
            'Spirits AND (industry OR craft OR limited edition)'
        ];

        const koreanQueries = [
            '(위스키 OR 전통주) AND (신제품 OR 출시 OR 수상)',
            '증류소 AND (업계 OR 한정판 OR 크래프트)'
        ];

        console.log('[News Collection] 📡 Fetching RSS from multiple queries...');
        console.log('[News Collection] 🔍 English queries:', englishQueries.length);
        console.log('[News Collection] 🔍 Korean queries:', koreanQueries.length);

        // 2. 모든 RSS URL 생성
        const allRssUrls = [
            // English queries (Global RSS)
            ...englishQueries.map(query => ({
                url: `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en&gl=US&ceid=US:en&num=10`,
                type: 'Global',
                query: query
            })),
            // Korean queries (Korean RSS)
            ...koreanQueries.map(query => ({
                url: `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko-KR&gl=KR&ceid=KR:ko&num=10`,
                type: 'Korean',
                query: query
            }))
        ];

        console.log('[News Collection] 🚀 Fetching', allRssUrls.length, 'RSS feeds in parallel...');

        // 3. 모든 RSS 병렬로 가져오기
        const rssResponses = await Promise.all(
            allRssUrls.map(async ({ url, type, query }) => {
                try {
                    const res = await fetch(url, { cache: 'no-store' });
                    if (!res.ok) {
                        console.error(`[News Collection] ❌ ${type} RSS failed for "${query}":`, res.status);
                        return { items: [], type, query };
                    }

                    const xmlText = await res.text();
                    const items = parseRSSFeed(xmlText);
                    const limitedItems = items.slice(0, 10);

                    console.log(`[News Collection] ✅ ${type} "${query}": ${limitedItems.length} items`);

                    return {
                        items: limitedItems,
                        type,
                        query
                    };
                } catch (error) {
                    console.error(`[News Collection] ❌ Error fetching ${type} "${query}":`, error);
                    return { items: [], type, query };
                }
            })
        );

        // 4. 모든 아이템 합치기
        const allRssItems = rssResponses.flatMap(res => res.items);
        console.log('[News Collection] 📦 Total raw items from all queries:', allRssItems.length);

        // 5. 링크 기준으로 중복 제거
        const uniqueItemsMap = new Map();
        allRssItems.forEach((item: any) => {
            if (item.link && !uniqueItemsMap.has(item.link)) {
                uniqueItemsMap.set(item.link, item);
            }
        });

        const items = Array.from(uniqueItemsMap.values());
        console.log('[News Collection] 🔗 After deduplication by link:', items.length, 'unique items');

        // 2. 1차 필터링 - 강화된 네거티브 키워드
        const NEGATIVE_KEYWORDS = [
            '음주운전', '사망', '실명', '논란', '사고', '범죄', '주가', '증권', 'VI 발동', '실적발표', '위생', '세금', '세무조사', '세무당국',
            '오늘의 운세', '인사', '부고', 'today-paper', '지면', '중독', '건강', 'judge', '판별', '판결',
            'DUI', 'accident', 'crime', 'death', 'stock price', 'obituary', 'fortune', 'quarterly results', 'misuse', 'disorder', 'health',
            '코스피', '코스닥', 'IPO', '공모', '매출', '영업이익', '순이익', 'earnings', 'revenue', 'profit', 'merger', 'acquisition',
            '채용', '인사이동', '임원', 'hiring', 'CEO', 'appointment', '파산', 'bankruptcy'
        ];

        const allItems = (Array.isArray(items) ? items : [items]).map((item: any) => {
            return {
                title: item.title,
                link: item.link,
                snippet: item.description ? (item.description.substring(0, 200) + '...') : '',
                source: item.source || 'Curated News',
                pubDate: item.pubDate,
            };
        });

        console.log('[News Collection] 🔢 Total items before filtering:', allItems.length);

        // Filter by date first (last 90 days = 3 months for recent focus)
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const recentItems = allItems.filter(item => {
            if (!item.pubDate) {
                console.log('[News Collection] ⚠️ No pubDate, keeping:', item.title);
                return true; // Keep if no date
            }

            const pubDate = new Date(item.pubDate);
            const isRecent = pubDate >= ninetyDaysAgo;

            if (!isRecent) {
                console.log('[News Collection] 📅 Too old (filtering out):', item.title, '- Published:', pubDate.toISOString().split('T')[0]);
            }

            return isRecent;
        });

        console.log('[News Collection] ✅ After date filter (last 90 days):', recentItems.length, 'items');

        // Then filter by NEGATIVE_KEYWORDS
        const filteredItems = recentItems.filter(item => {
            const fullText = (item.title + item.snippet).toLowerCase();
            const hasNegativeKeyword = NEGATIVE_KEYWORDS.some(kw => fullText.includes(kw.toLowerCase()));
            if (hasNegativeKeyword) {
                console.log('[News Collection] 🚫 Filtered out:', item.title);
            }
            return !hasNegativeKeyword;
        });

        console.log('[News Collection] ✅ After NEGATIVE_KEYWORDS filter:', filteredItems.length, 'items');

        // Filter out duplicates (already in database)
        const newItems = existingLinks
            ? filteredItems.filter(item => {
                const isDuplicate = existingLinks.has(item.link);
                if (isDuplicate) {
                    console.log('[News Collection] 🔄 Duplicate (skipping Gemini):', item.title);
                }
                return !isDuplicate;
            })
            : filteredItems;

        console.log('[News Collection] 📝 New items to process:', newItems.length, 'items');

        // Use all new items instead of limiting
        const rawItems = newItems;

        if (rawItems.length === 0) {
            console.warn('[News Collection] ⚠️ No items after filtering');
            return [];
        }

        console.log('[News Collection] 📝 Sample item:', rawItems[0]?.title);

        // 3. AI 분석 요청 (배치 처리)
        if (!GEMINI_API_KEY) {
            console.error('[News Collection] ❌ GEMINI_API_KEY is missing!');
            throw new Error('GEMINI_API_KEY is not configured');
        }

        // Add IDs to each item to prevent mismatching
        const itemsToProcess = rawItems.map((item, idx) => ({
            ...item,
            tempId: `news_${Date.now()}_${idx}`
        }));

        const BATCH_SIZE = 10;
        const batches = [];
        for (let i = 0; i < itemsToProcess.length; i += BATCH_SIZE) {
            batches.push(itemsToProcess.slice(i, i + BATCH_SIZE));
        }

        console.log('[News Collection] 🤖 Processing', itemsToProcess.length, 'items in', batches.length, 'batches...');

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: { responseMimeType: "application/json" }
        });

        // Store results in a map for indexed-lookup
        const processedMap = new Map<string, any>();

        for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
            const batch = batches[batchIdx];
            console.log(`[News Collection] 🤖 Batch ${batchIdx + 1}/${batches.length} (${batch.length} items)...`);

            const prompt = `
            You are a senior editor for a premium liquor magazine.
            Analyze these news items with STRICT criteria:
            1. Determine if each item is DIRECTLY and SPECIFICALLY about spirits/alcohol products or industry
            2. Generate TWO versions ONLY for highly relevant items (English and Korean)
            
            CRITICAL FILTERING RULES:
            Set "isAlcoholRelated" to TRUE ONLY if the news is SPECIFICALLY about:
            ✅ NEW PRODUCTS: Limited editions, new releases, special casks, collaborations
            ✅ AWARDS & COMPETITIONS: Industry awards, tasting competitions, quality recognition
            ✅ CRAFT & PRODUCTION: Distillery openings, production techniques, aging processes, barrels
            ✅ CULTURAL HERITAGE: Traditional spirits, cultural significance, heritage brands
            ✅ INDUSTRY EVENTS: Tastings, festivals, masterclasses, brand experiences
            
            Set "isAlcoholRelated" to FALSE if:
            ❌ General business news (earnings, mergers, stock performance, executive changes)
            ❌ Retail/distribution news unless about unique/limited products
            ❌ Promotional marketing campaigns or general brand advertising
            ❌ Celebrity endorsements or lifestyle features (unless directly about product launch)
            ❌ Health warnings, regulations, drunk driving, alcohol abuse
            ❌ Unrelated food/beverage or general hospitality news
            
            QUALITY THRESHOLD: Only include news that would genuinely interest a spirits enthusiast or industry professional.
            If in doubt, mark as FALSE. We want quality over quantity.
            
            CRITICAL: You MUST include the exact "tempId" for each item.

            Input Data: ${JSON.stringify(batch.map(b => ({
                tempId: b.tempId,
                title: b.title,
                snippet: b.snippet
            })))}

            Output Format: JSON Array ONLY.
            Structure: [
              {
                "tempId": "...",
                "isAlcoholRelated": true/false,
                "en": { "title": "...", "snippet": "...", "content": "..." },
                "ko": { "title": "...", "snippet": "...", "content": "..." },
                "tags_en": ["#Tag1", "#Tag2"],
                "tags_ko": ["#태그1", "#태그2"]
              }
            ]
            `;

            try {
                const result = await model.generateContent(prompt);
                const text = result.response.text();
                const cleanJson = text.replace(/```json|```/g, '').trim();
                const processedList = JSON.parse(cleanJson);

                processedList.forEach((proc: any) => {
                    if (proc.tempId) {
                        processedMap.set(proc.tempId, proc);
                    }
                });
                console.log(`[News Collection] ✅ Batch ${batchIdx + 1} processed: ${processedList.length}/${batch.length} items match`);
            } catch (error) {
                console.error(`[News Collection] ❌ Batch ${batchIdx + 1} failed:`, error);
            }
        }

        // Final assembly using the map 
        // Fallback to original text if AI analysis failed or was skipped
        const finalItems = itemsToProcess
            .map(item => {
                const proc = processedMap.get(item.tempId);
                
                // If AI analysis succeeded and it's not alcohol related, skip
                if (proc && proc.isAlcoholRelated === false) {
                    console.log('[News Collection] 🚫 AI filtered out non-alcohol news:', item.title);
                    return null;
                }

                // Normal Case: AI analysis succeeded
                if (proc) {
                    return {
                        link: item.link,
                        source: item.source,
                        date: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                        originalTitle: item.title,
                        translations: {
                            en: proc.en || { title: item.title, snippet: item.snippet, content: item.snippet },
                            ko: proc.ko || { title: item.title, snippet: item.snippet, content: item.snippet }
                        },
                        tags: {
                            en: proc.tags_en || ['#Spirits'],
                            ko: proc.tags_ko || ['#주류']
                        }
                    };
                }

                // Fallback Case: AI analysis failed (e.g. Region Lock)
                console.warn('[News Collection] ⚠️ Falling back to original text for:', item.title);
                return {
                    link: item.link,
                    source: item.source,
                    date: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                    originalTitle: item.title,
                    translations: {
                        en: { title: item.title, snippet: item.snippet, content: item.snippet },
                        ko: { title: item.title, snippet: item.snippet, content: item.snippet }
                    },
                    tags: {
                        en: ['#Spirits', '#News'],
                        ko: ['#주류', '#뉴스']
                    }
                };
            })
            .filter((item): item is any => item !== null);

        console.log('[News Collection] 🎉 Final assembly complete:', finalItems.length, 'items');
        return finalItems;

    } catch (error: any) {
        console.error('[News Collection] ❌ CRITICAL ERROR:', error);
        console.error('[News Collection] ❌ Error stack:', error.stack);
        // Re-throw to let the API route handle it
        throw error;
    }
}
