import { NextResponse } from 'next/server';
import { fetchNewsForCollection } from '@/lib/api/news';
import { dbListNewsArticles, dbUpsertNews } from '@/lib/db/data-connect-client';

// export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const preferredRegion = 'iad1';

function generateSafeId(url: string): string {
    return btoa(url).replace(/\//g, '_').replace(/\+/g, '-').replace(/=/g, '');
}

export async function POST(request: Request) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error('[Collect API] ❌ GEMINI_API_KEY is missing');
            return NextResponse.json({ success: false, error: 'GEMINI_API_KEY가 설정되지 않았습니다.' }, { status: 500 });
        }

        console.log('[Collect API] 🚀 수집 프로세스 시작 (SQL Backend)');

        // 2. 기존 뉴스 링크 목록 가져오기 (중복 체크용 - 최근 100개)
        console.log('[Collect API] 📋 Fetching existing news links from SQL...');
        const existingNews = await dbListNewsArticles(100, 0);
        const existingLinks = new Set(existingNews.map((news: any) => news.link));
        console.log('[Collect API] 📋 Found', existingLinks.size, 'existing news items');

        // 3. RSS 데이터 가져오기 (중복 제외하고 Gemini 처리)
        const newsItems = await fetchNewsForCollection(existingLinks);

        console.log('[Collect API] 📊 수집 완료:', newsItems.length, '건 (새로운 뉴스만)');

        if (!newsItems || newsItems.length === 0) {
            console.warn('[Collect API] ⚠️ 수집된 새로운 뉴스 없음');
            return NextResponse.json({ success: true, count: 0, message: '수집된 새로운 뉴스 없음' });
        }

        // 4. Data Connect (PostgreSQL)를 이용해 저장
        let savedCount = 0;
        for (const item of newsItems) {
            const docId = generateSafeId(item.link);

            await dbUpsertNews({
                id: docId,
                title: item.translations.ko, // We use translated title as primary title
                content: item.translations.ko, // content is required in SQL schema
                link: item.link,
                source: item.source,
                date: item.date,
                translations: {
                    ko: item.translations.ko,
                    en: item.translations.en
                },
                tags: {
                    ko: item.tags.ko,
                    en: item.tags.en
                }
            });
            savedCount++;
        }

        console.log('[Collect API] ✅ SQL 저장 완료:', savedCount, '건');
        return NextResponse.json({ success: true, count: savedCount });

    } catch (error: any) {
        console.error('[Collect API] ❌ 에러:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Unknown error'
        }, { status: 500 });
    }
}
