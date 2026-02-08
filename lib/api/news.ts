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

export async function fetchNewsForCollection(): Promise<CollectedNewsItem[]> {
    console.log('[News Collection] 🚀 Starting news collection process...');

    try {
        // 1. 구글 뉴스 RSS Fetch
        const keywords = '(Whisky OR Liquor OR Spirits OR New Release OR Limited Edition OR 전통주 OR 위스키 OR 증류식 소주 OR 전통주연구소 OR 가양주연구소 OR 전통주갤러리 OR 증류소 OR 우리술)';
        const siteFilter = TRUSTED_SOURCES.map(site => `site:${site}`).join(' OR ');
        const finalQuery = `${keywords} AND (${siteFilter})`;
        const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(finalQuery)}&hl=ko-KR&gl=KR&ceid=KR:ko`;

        console.log('[News Collection] 📡 Fetching RSS from Google News...');
        const res = await fetch(rssUrl, { cache: 'no-store' });
        if (!res.ok) {
            console.error('[News Collection] ❌ RSS fetch failed:', res.status, res.statusText);
            throw new Error(`RSS Fetch Failed: ${res.status}`);
        }

        const xmlText = await res.text();
        console.log('[News Collection] 📄 XML fetched, length:', xmlText.length);
        console.log('[News Collection] 🔍 XML preview (first 500 chars):', xmlText.substring(0, 500));

        const jsonObj = parser.parse(xmlText);
        console.log('[News Collection] 🔍 Parsed JSON structure:', JSON.stringify(jsonObj, null, 2).substring(0, 1000));

        const items = jsonObj?.rss?.channel?.item || [];
        console.log('[News Collection] 📦 Raw items from RSS:', Array.isArray(items) ? items.length : 1);

        if (!items || (Array.isArray(items) && items.length === 0)) {
            console.warn('[News Collection] ⚠️ No items found in RSS. Checking alternative paths...');
            console.log('[News Collection] 🔍 jsonObj keys:', Object.keys(jsonObj || {}));
            console.log('[News Collection] 🔍 rss keys:', Object.keys(jsonObj?.rss || {}));
            console.log('[News Collection] 🔍 channel keys:', Object.keys(jsonObj?.rss?.channel || {}));
        }

        // 2. 1차 필터링
        const NEGATIVE_KEYWORDS = [
            '음주운전', '사망', '실명', '반신마비', '사고', '범죄', '주가', '증권', 'VI 발동', '실적발표',
            '오늘의 운세', '인사', '부고', 'today-paper', '지면',
            'DUI', 'accident', 'crime', 'stock price', 'obituary', 'fortune', 'quarterly results'
        ];

        const rawItems = (Array.isArray(items) ? items : [items]).map((item: any) => ({
            title: item.title,
            link: item.link,
            snippet: item.description?.replace(/<[^>]*>?/gm, '').substring(0, 200) + '...',
            source: typeof item.source === 'object' ? (item.source?.['#text'] || 'Curated News') : (item.source || 'Curated News'),
            pubDate: item.pubDate,
        })).filter(item => {
            const fullText = (item.title + item.snippet).toLowerCase();
            return !NEGATIVE_KEYWORDS.some(kw => fullText.includes(kw));
        }).slice(0, 5);

        console.log('[News Collection] ✅ After filtering:', rawItems.length, 'items');

        if (rawItems.length === 0) {
            console.warn('[News Collection] ⚠️ No items after filtering');
            return [];
        }

        console.log('[News Collection] 📝 Sample item:', rawItems[0]?.title);

        // 3. AI 분석 요청
        if (!GEMINI_API_KEY) {
            console.error('[News Collection] ❌ GEMINI_API_KEY is missing!');
            throw new Error('GEMINI_API_KEY is not configured');
        }

        console.log('[News Collection] 🤖 Requesting Gemini AI analysis...');
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
        You are a senior editor for a premium liquor magazine.
        Analyze these news items and generate TWO versions for each:
        1. "snippet": A short, catchy summary (max 2 sentences) for the home page.
        2. "content": A detailed "Mini-Article" (3-4 paragraphs). Explain context, market impact, and professional opinion.

        Input Data: ${JSON.stringify(rawItems)}

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

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log('[News Collection] 🤖 Gemini response received, length:', text.length);
        console.log('[News Collection] 🤖 First 200 chars:', text.substring(0, 200));

        const cleanJson = text.replace(/```json|```/g, '').trim();
        const processedList = JSON.parse(cleanJson);
        console.log('[News Collection] ✅ Parsed AI response, items:', processedList.length);

        const finalItems = rawItems.map((item, idx) => {
            const proc = processedList[idx] || {};
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
