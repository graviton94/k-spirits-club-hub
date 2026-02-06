import { XMLParser } from 'fast-xml-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');
const parser = new XMLParser({ ignoreAttributes: false });

// 🏆 우리가 엄선한 '고품질 뉴스 소스' 리스트
const TRUSTED_SOURCES = [
    // 🌍 Global Magazine
    'thespiritsbusiness.com',
    'whiskyadvocate.com',
    'decanter.com',
    'imbibemagazine.com',
    'thedrinksbusiness.com',

    // 🛍️ Global Retail & Duty Free
    'dfs.com',              // DFS 그룹
    'lottedfs.com',         // 롯데면세점
    'shilladfs.com',        // 신라면세점
    'thewhiskyexchange.com',
    'masterofmalt.com',

    // 🇰🇷 Korea News
    'thesool.com',          // 더술닷컴
    'wine21.com',
    'biz.chosun.com',       // 조선비즈
];

export interface NewsItem {
    title: string;
    link: string;
    snippet: string;
    thumbnail: string | null;
    source: string;
    date: string;
}

export async function getGlobalSpiritsNews(lang: string = 'en'): Promise<NewsItem[]> {
    // 1. 검색 쿼리 조합
    // 논리: (위스키 OR 주류 OR 신제품) AND (사이트A OR 사이트B OR ...)
    const keywords = '(Whisky OR  Liquor OR Spirits OR "New Release" OR "Limited Edition")';

    // site:domain.com OR site:domain2.com ... 형태로 변환
    const siteFilter = TRUSTED_SOURCES.map(site => `site:${site}`).join(' OR ');

    // 최종 검색어: 키워드 + 사이트 필터
    const finalQuery = `${keywords} AND (${siteFilter})`;

    // RSS URL 생성 (API Key 불필요)
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(finalQuery)}&hl=en-US&gl=US&ceid=US:en`;

    try {
        // 2. RSS Fetch
        const res = await fetch(rssUrl, { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error(`RSS Fetch Failed: ${res.status}`);

        const xmlText = await res.text();
        const jsonObj = parser.parse(xmlText);
        const items = jsonObj?.rss?.channel?.item || [];

        // 3. 데이터 정제 (최신 6개)
        const rawItems = (Array.isArray(items) ? items : [items]).slice(0, 6).map((item: any) => ({
            title: item.title,
            link: item.link,
            // RSS snippet 청소 (HTML 태그 제거)
            snippet: item.description?.replace(/<[^>]*>?/gm, '').substring(0, 120) + '...',
            source: item.source || 'Curated News',
            date: item.pubDate,
        }));

        if (rawItems.length === 0) return [];

        // 4. Gemini AI 번역 및 요약
        const targetLang = lang === 'ko' ? 'Korean' : 'English';
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `
      You are a professional editor for a liquor magazine.
      Translate and refine the following news items into natural ${targetLang}.
      
      Rules:
      1. Translate title and snippet.
      2. If snippet is boring, spice it up based on the title.
      3. Remove phrases like "Google News" or source names from the snippet.
      
      Input Data: ${JSON.stringify(rawItems)}
      
      Output Format: JSON Array only. [{ "title": "...", "snippet": "..." }]
    `;

        try {
            const result = await model.generateContent(prompt);
            const response = result.response.text();
            const cleanJson = response.replace(/```json|```/g, '').trim();
            const translatedData = JSON.parse(cleanJson);

            return rawItems.map((item: any, index: number) => ({
                ...item,
                title: translatedData[index]?.title || item.title,
                snippet: translatedData[index]?.snippet || item.snippet,
                thumbnail: null // RSS는 썸네일 없음 -> UI에서 아이콘 처리
            }));

        } catch (aiError) {
            console.error('Gemini Translation Failed:', aiError);
            return rawItems.map((item: any) => ({ ...item, thumbnail: null }));
        }

    } catch (error) {
        console.error('RSS Fetch Error:', error);
        return [];
    }
}

export interface CollectedNewsItem {
    link: string;
    source: string;
    date: string; // ISO string
    originalTitle: string;
    originalSnippet: string;
    translations: {
        en: { title: string; snippet: string };
        ko: { title: string; snippet: string };
    };
    tags: {
        en: string[];
        ko: string[];
    };
}

export async function fetchNewsForCollection(): Promise<CollectedNewsItem[]> {
    const keywords = '(Whisky OR  Liquor OR Spirits OR "New Release" OR "Limited Edition")';
    const siteFilter = TRUSTED_SOURCES.map(site => `site:${site}`).join(' OR ');
    const finalQuery = `${keywords} AND (${siteFilter})`;
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(finalQuery)}&hl=en-US&gl=US&ceid=US:en`;

    try {
        const res = await fetch(rssUrl, { cache: 'no-store' }); // Always fetch fresh
        if (!res.ok) throw new Error(`RSS Fetch Failed: ${res.status}`);

        const xmlText = await res.text();
        const jsonObj = parser.parse(xmlText);
        const items = jsonObj?.rss?.channel?.item || [];

        const rawItems = (Array.isArray(items) ? items : [items]).slice(0, 6).map((item: any) => ({
            title: item.title,
            link: item.link,
            snippet: item.description?.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...',
            source: item.source || 'Curated News',
            pubDate: item.pubDate,
        }));

        if (rawItems.length === 0) return [];

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `
      You are a professional editor for a global liquor magazine.
      
      Task:
      Check the following news items. For EACH item, provide:
      1. Improved English Title & Snippet (Concise, exciting)
      2. Professional Korean Title & Snippet (Natural translation)
      3. 3 Relevant Hashtags for each language (e.g., #Whisky #Macallan)
      
      Input Data: ${JSON.stringify(rawItems)}
      
      Output Format: JSON Array ONLY.
      Structure: [
        {
          "en": { "title": "...", "snippet": "..." },
          "ko": { "title": "...", "snippet": "..." },
          "tags_en": ["#Tag1", "#Tag2", "#Tag3"],
          "tags_ko": ["#태그1", "#태그2", "#태그3"]
        },
        ...
      ]
    `;

        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const cleanJson = response.replace(/```json|```/g, '').trim();
        const processedData = JSON.parse(cleanJson);

        return rawItems.map((item: any, index: number) => {
            const proc = processedData[index] || {};
            return {
                link: item.link,
                source: item.source,
                date: new Date(item.pubDate).toISOString(),
                originalTitle: item.title,
                originalSnippet: item.snippet,
                translations: {
                    en: proc.en || { title: item.title, snippet: item.snippet },
                    ko: proc.ko || { title: item.title, snippet: item.snippet }
                },
                tags: {
                    en: proc.tags_en || [],
                    ko: proc.tags_ko || []
                }
            };
        });

    } catch (error) {
        console.error('Collection Fetch Error:', error);
        return [];
    }
}
