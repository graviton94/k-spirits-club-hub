import { NextResponse } from 'next/server';
import { fetchNewsForCollection } from '@/lib/api/news';
import { dbAdminUpsertNews, dbAdminListNewsLinks } from '@/lib/db/data-connect-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const preferredRegion = 'iad1';

function generateSafeId(url: string): string {
    return btoa(url).replace(/\//g, '_').replace(/\+/g, '-').replace(/=/g, '');
}

import { getEnv } from '@/lib/env';

export async function POST(request: Request) {
    const traceId = crypto.randomUUID();
    try {
        const apiKey = getEnv('GEMINI_API_KEY');
        if (!apiKey) {
            console.error(`[Collect API][${traceId}] ❌ GEMINI_API_KEY is missing`);
            return NextResponse.json({
                success: false,
                error: 'GEMINI_API_KEY가 설정되지 않았습니다.',
                code: 'ADMIN_NEWS_GEMINI_KEY_MISSING',
                traceId,
                source: 'api/admin/news/collect'
            }, { status: 500 });
        }

        console.log('[Collect API] 🚀 수집 프로세스 시작 (SQL Backend)');

        // 2. DB에서 기존 뉴스 링크 가져오기 (서버측 원자적 처리)
        const existingLinks = await dbAdminListNewsLinks();
        const existingLinksSet = new Set<string>(existingLinks);

        console.log('[Collect API] 📋 Found', existingLinksSet.size, 'existing news items in DB');

        // 3. RSS 데이터 가져오기 (중복 제외하고 Gemini 처리)
        const newsItems = await fetchNewsForCollection(existingLinksSet);

        console.log('[Collect API] 📊 파싱 완료:', newsItems.length, '건 (새로운 뉴스만)');

        if (!newsItems || newsItems.length === 0) {
            console.warn('[Collect API] ⚠️ 수집된 새로운 뉴스 없음');
            return NextResponse.json({ success: true, insertedCount: 0, message: '수집된 새로운 뉴스 없음', traceId });
        }

        let insertedCount = 0;
        for (const item of newsItems) {
            const docId = generateSafeId(item.link);
            await dbAdminUpsertNews({
                id: docId,
                title: item.translations?.ko?.title || item.translations?.en?.title || item.originalTitle || '',
                content: item.translations?.ko?.content || item.translations?.ko?.snippet || item.translations?.en?.content || '',
                imageUrl: item.imageUrl || null,
                category: item.category || null,
                link: item.link,
                source: item.source,
                date: item.date,
                translations: { ko: item.translations.ko, en: item.translations.en },
                tags: { ko: item.tags.ko, en: item.tags.en }
            });
            insertedCount++;
        }

        return NextResponse.json({ success: true, insertedCount, traceId });

    } catch (error: any) {
        console.error('[Collect API] ❌ 에러:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Unknown error',
            code: 'ADMIN_NEWS_COLLECT_FAILED',
            traceId,
            source: 'api/admin/news/collect',
            debug: {
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            }
        }, { status: 500 });
    }
}
