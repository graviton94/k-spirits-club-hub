import { GoogleGenerativeAI } from '@google/generative-ai';

const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_NEWS_API_KEY || process.env.GEMINI_API_KEY;
const CX_ID = process.env.GOOGLE_NEWS_CX_ID;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');


export interface NewsItem {
    title: string;
    link: string;
    snippet: string;
    thumbnail: string | null;
    source: string;
    date: string;
}

export async function getGlobalSpiritsNews(lang: string = 'en'): Promise<NewsItem[]> {
    // 1. 소스 검색 (글로벌 + 로컬 키워드 혼합)
    const query = 'Whisky Soju Spirits New Release Limited Edition';
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_SEARCH_API_KEY}&cx=${CX_ID}&q=${encodeURIComponent(query)}&sort=date&num=6`;

    try {
        const res = await fetch(searchUrl, { next: { revalidate: 3600 } });
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error('Google Search API Error Detail:', res.status, res.statusText, JSON.stringify(errorData));
            throw new Error(`Google Search API Failed: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        if (!data.items) {
            console.warn('Google Search API returned no items:', JSON.stringify(data));
            return [];
        }

        // 2. Raw Data 정제
        const rawItems = data.items.map((item: any) => ({
            title: item.title,
            link: item.link,
            snippet: item.snippet,
            thumbnail: item.pagemap?.cse_image?.[0]?.src || null,
            source: item.displayLink,
            date: item.pagemap?.metatags?.[0]?.['article:published_time'] || 'Recent',
        }));

        // 3. AI 번역 실행 (Gemini 2.0 Flash)
        const targetLang = lang === 'ko' ? 'Korean' : 'English';
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `
      You are a professional translator for a liquor magazine.
      Translate the following news titles and snippets into natural ${targetLang}.
      Keep the tone professional and exciting.
      Input Data: ${JSON.stringify(rawItems)}
      Output Format: Return ONLY a valid JSON array. Do not wrap in markdown.
      Structure: [{ "title": "...", "snippet": "..." }, ...] matching the input order.
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
            }));
        } catch (aiError) {
            console.error('Gemini Translation Failed, returning raw data:', aiError);
            return rawItems;
        }
    } catch (error) {
        console.error('News Fetch Error:', error);
        return [];
    }
}
