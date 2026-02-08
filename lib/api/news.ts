import { XMLParser } from 'fast-xml-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');
if (!GEMINI_API_KEY) {
    console.error('[Gemini News] 🔴 ERROR: GEMINI_API_KEY is missing!');
}
const parser = new XMLParser({ ignoreAttributes: false });

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

export async function fetchNewsForCollection(existingLinks?: Set<string>): Promise<CollectedNewsItem[]> {
    console.log('[News Collection] 🚀 Starting news collection process...');

    try {
        // 1. 배치 쿼리 정의 (6개 쿼리로 분할하여 더 많은 결과 수집)
        const englishQueries = [
            'Whisky OR Whiskey OR "Single Malt" OR Scotch',
            'Spirits OR Liquor OR Distillery OR Brewery',
            'Bourbon Whisky OR Rum OR Gin OR Vodka OR Tequila OR Cognac'
        ];

        const koreanQueries = [
            '위스키 OR 전통주 OR 증류식소주 OR 막걸리',
            '증류소 OR 양조장 OR 우리술 OR 가양주',
            '(위스키 OR 전통주 OR 소주 OR 증류주) AND (신제품 OR 한정판)'
        ];

        console.log('[News Collection] 📡 Fetching RSS from multiple queries...');
        console.log('[News Collection] 🔍 English queries:', englishQueries.length);
        console.log('[News Collection] 🔍 Korean queries:', koreanQueries.length);

        // 2. 모든 RSS URL 생성
        const allRssUrls = [
            // English queries (Global RSS)
            ...englishQueries.map(query => ({
                url: `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en&gl=US&ceid=US:en&num=20`,
                type: 'Global',
                query: query
            })),
            // Korean queries (Korean RSS)
            ...koreanQueries.map(query => ({
                url: `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko-KR&gl=KR&ceid=KR:ko&num=20`,
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
                    const jsonObj = parser.parse(xmlText);
                    const rawItems = jsonObj?.rss?.channel?.item || [];
                    const itemsArray = Array.isArray(rawItems) ? rawItems : (rawItems ? [rawItems] : []);

                    // Manually slice to 20 items as Google News RSS often ignores the &num parameter
                    const items = itemsArray.slice(0, 20);
                    const count = items.length;

                    console.log(`[News Collection] ✅ ${type} "${query}": ${count} items`);

                    return {
                        items,
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

        // 2. 1차 필터링
        const NEGATIVE_KEYWORDS = [
            '음주운전', '사망', '실명', '논란', '사고', '범죄', '주가', '증권', 'VI 발동', '실적발표', '위생', '세금', '세무조사', '세무당국',
            '오늘의 운세', '인사', '부고', 'today-paper', '지면', '중독', '건강', 'judge', '판별', '판결',
            'DUI', 'accident', 'crime', 'death', 'stock price', 'obituary', 'fortune', 'quarterly results', 'misuse', 'disorder', 'health'
        ];

        // Helper to clean HTML and decode entities
        const cleanText = (text: any): string => {
            if (!text) return '';
            const str = typeof text === 'object' ? (text['#text'] || '') : String(text);
            return str
                .replace(/<[^>]*>?/gm, ' ') // Remove HTML tags
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&#39;/g, "'")
                .replace(/&apos;/g, "'")
                .replace(/&hellip;/g, '...')
                .replace(/&ndash;/g, '-')
                .replace(/&mdash;/g, '-')
                .replace(/&rsquo;/g, "'")
                .replace(/&lsquo;/g, "'")
                .replace(/&rdquo;/g, '"')
                .replace(/&ldquo;/g, '"')
                .replace(/\s+/g, ' ') // Collapse whitespace
                .trim();
        };

        const allItems = (Array.isArray(items) ? items : [items]).map((item: any) => {
            const cleanedTitle = cleanText(item.title);
            const cleanedSnippet = cleanText(item.description);

            return {
                title: cleanedTitle,
                link: item.link,
                snippet: cleanedSnippet ? (cleanedSnippet.substring(0, 200) + '...') : '',
                source: typeof item.source === 'object' ? (item.source?.['#text'] || 'Curated News') : (item.source || 'Curated News'),
                pubDate: item.pubDate,
            };
        });

        console.log('[News Collection] 🔢 Total items before filtering:', allItems.length);

        // Filter by date first (last 365 days = 1 year)
        const oneYearAgo = new Date();
        oneYearAgo.setDate(oneYearAgo.getDate() - 365);

        const recentItems = allItems.filter(item => {
            if (!item.pubDate) {
                console.log('[News Collection] ⚠️ No pubDate, keeping:', item.title);
                return true; // Keep if no date
            }

            const pubDate = new Date(item.pubDate);
            const isRecent = pubDate >= oneYearAgo;

            if (!isRecent) {
                console.log('[News Collection] 📅 Too old (filtering out):', item.title, '- Published:', pubDate.toISOString().split('T')[0]);
            }

            return isRecent;
        });

        console.log('[News Collection] ✅ After date filter (last 1 year):', recentItems.length, 'items');

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
            Analyze these news items and generate TWO versions for each (English and Korean).
            CRITICAL: You MUST include the exact "tempId" for each item in your response to maintain data integrity.

            Input Data: ${JSON.stringify(batch.map(b => ({
                tempId: b.tempId,
                title: b.title,
                snippet: b.snippet
            })))}

            Output Format: JSON Array ONLY.
            Structure: [
              {
                "tempId": "...",
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

        // Final assembly using the map to ensure NO MISMATCHES
        const finalItems = itemsToProcess
            .filter(item => processedMap.has(item.tempId)) // Only keep items successfully processed by Gemini
            .map(item => {
                const proc = processedMap.get(item.tempId)!;
                return {
                    link: item.link,
                    source: item.source,
                    date: new Date(item.pubDate).toISOString(),
                    originalTitle: item.title,
                    translations: {
                        en: proc.en,
                        ko: proc.ko
                    },
                    tags: {
                        en: proc.tags_en || [],
                        ko: proc.tags_ko || []
                    }
                };
            });

        console.log('[News Collection] 🎉 Final assembly complete:', finalItems.length, 'items');
        return finalItems;

    } catch (error: any) {
        console.error('[News Collection] ❌ CRITICAL ERROR:', error);
        console.error('[News Collection] ❌ Error stack:', error.stack);
        // Re-throw to let the API route handle it
        throw error;
    }
}
