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
            'Bourbon OR Rum OR Gin OR Vodka OR Tequila OR Cognac'
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
                url: `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en&gl=US&ceid=US:en&num=100`,
                type: 'Global',
                query: query
            })),
            // Korean queries (Korean RSS)
            ...koreanQueries.map(query => ({
                url: `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko-KR&gl=KR&ceid=KR:ko&num=100`,
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
                    const items = jsonObj?.rss?.channel?.item || [];
                    const count = Array.isArray(items) ? items.length : (items ? 1 : 0);

                    console.log(`[News Collection] ✅ ${type} "${query}": ${count} items`);

                    return {
                        items: Array.isArray(items) ? items : (items ? [items] : []),
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
            '음주운전', '사망', '실명', '반신마비', '사고', '범죄', '주가', '증권', 'VI 발동', '실적발표',
            '오늘의 운세', '인사', '부고', 'today-paper', '지면', '중독', '건강',
            'DUI', 'accident', 'crime', 'stock price', 'obituary', 'fortune', 'quarterly results', 'misuse', 'disorder', 'health'
        ];

        const allItems = (Array.isArray(items) ? items : [items]).map((item: any) => ({
            title: item.title,
            link: item.link,
            snippet: item.description?.replace(/<[^>]*>?/gm, '').substring(0, 200) + '...',
            source: typeof item.source === 'object' ? (item.source?.['#text'] || 'Curated News') : (item.source || 'Curated News'),
            pubDate: item.pubDate,
        }));

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

        // 3. AI 분석 요청 (배치 처리 - 50개씩)
        if (!GEMINI_API_KEY) {
            console.error('[News Collection] ❌ GEMINI_API_KEY is missing!');
            throw new Error('GEMINI_API_KEY is not configured');
        }

        const BATCH_SIZE = 10; // Reduced for stability and to avoid response length limits
        const batches = [];
        for (let i = 0; i < rawItems.length; i += BATCH_SIZE) {
            batches.push(rawItems.slice(i, i + BATCH_SIZE));
        }

        console.log('[News Collection] 🤖 Processing', rawItems.length, 'items in', batches.length, 'batches of', BATCH_SIZE);

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: { responseMimeType: "application/json" }
        });

        const allProcessedItems: any[] = [];
        const successfulRawItems: typeof rawItems = []; // Track which raw items were successfully processed

        for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
            const batch = batches[batchIdx];
            console.log(`[News Collection] 🤖 Processing batch ${batchIdx + 1}/${batches.length} (${batch.length} items)...`);

            const prompt = `
            You are a senior editor for a premium liquor magazine.
            Analyze these news items and generate TWO versions for each:
            1. "snippet": A short, catchy summary (max 2 sentences) for the home page.
            2. "content": A concise "Mini-Article" (2-3 paragraphs). Explain context, market impact, and professional opinion.

            Input Data: ${JSON.stringify(batch)}

            Output Format: JSON Array ONLY.
            Structure: [
              {
                "en": {
                    "title": "...",
                    "snippet": "Short summary...",
                    "content": "Full article..."
                },
                "ko": {
                    "title": "...",
                    "snippet": "짧은 요약...",
                    "content": "상세 해설 기사..."
                },
                "tags_en": ["#Tag1", "#Tag2"],
                "tags_ko": ["#태그1", "#태그2"]
              }
            ]
            `;

            try {
                const result = await model.generateContent(prompt);
                const text = result.response.text();
                console.log(`[News Collection] ✅ Batch ${batchIdx + 1} response received, length:`, text.length);

                const cleanJson = text.replace(/```json|```/g, '').trim();
                const processedList = JSON.parse(cleanJson);
                console.log(`[News Collection] ✅ Batch ${batchIdx + 1} parsed:`, processedList.length, 'items');

                // Only add to results if processing succeeded
                allProcessedItems.push(...processedList);
                successfulRawItems.push(...batch); // Track successful raw items
                console.log(`[News Collection] ✅ Batch ${batchIdx + 1} added to results`);
            } catch (error) {
                console.error(`[News Collection] ❌ Batch ${batchIdx + 1} failed:`, error);
                console.log(`[News Collection] ⚠️ Skipping ${batch.length} items from failed batch ${batchIdx + 1}`);
                // Continue with next batch instead of failing entirely
            }
        }

        console.log('[News Collection] ✅ All batches processed:', allProcessedItems.length, 'successful items');
        console.log('[News Collection] 📊 Success rate:', `${successfulRawItems.length}/${rawItems.length} (${((successfulRawItems.length / rawItems.length) * 100).toFixed(1)}%)`);

        // Only create finalItems for successfully processed items
        const finalItems = successfulRawItems.map((item, idx) => {
            const proc = allProcessedItems[idx] || {};
            return {
                link: item.link,
                source: item.source,
                date: new Date(item.pubDate).toISOString(),
                originalTitle: item.title,
                translations: {
                    en: proc.en || { title: item.title, snippet: item.snippet, content: item.snippet },
                    ko: proc.ko || { title: item.title, snippet: item.snippet, content: item.snippet }
                },
                tags: {
                    en: proc.tags_en || [],
                    ko: proc.tags_ko || []
                }
            };
        });

        console.log('[News Collection] 🎉 Successfully processed', finalItems.length, 'news items');
        return finalItems;

    } catch (error: any) {
        console.error('[News Collection] ❌ CRITICAL ERROR:', error);
        console.error('[News Collection] ❌ Error stack:', error.stack);
        // Re-throw to let the API route handle it
        throw error;
    }
}
