import { NextResponse } from 'next/server';
import { fetchNewsForCollection } from '@/lib/api/news';
import { newsDb } from '@/lib/db/firestore-rest';
import { getServiceAccountToken } from '@/lib/auth/service-account';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

function generateSafeId(url: string): string {
    return btoa(url).replace(/\//g, '_').replace(/\+/g, '-').replace(/=/g, '');
}

export async function POST(request: Request) {
    try {
        // 1. 보안 체크
        if (!process.env.GEMINI_API_KEY) {
            console.error('[Collect API] ❌ GEMINI_API_KEY is missing');
            return NextResponse.json({ success: false, error: 'GEMINI_API_KEY가 설정되지 않았습니다.' }, { status: 500 });
        }

        console.log('[Collect API] 🚀 수집 프로세스 시작 (Edge Runtime)');

        // 2. 기존 뉴스 링크 목록 가져오기 (중복 체크용 - 최근 100개)
        console.log('[Collect API] 📋 Fetching existing news links...');
        const existingNews = await newsDb.getLatest(100);
        const existingLinks = new Set(existingNews.map((news: any) => news.link));
        console.log('[Collect API] 📋 Found', existingLinks.size, 'existing news items');

        // 3. RSS 데이터 가져오기 (중복 제외하고 Gemini 처리)
        const newsItems = await fetchNewsForCollection(existingLinks);

        console.log('[Collect API] 📊 수집 완료:', newsItems.length, '건 (새로운 뉴스만)');

        if (!newsItems || newsItems.length === 0) {
            console.warn('[Collect API] ⚠️ 수집된 새로운 뉴스 없음');
            return NextResponse.json({ success: true, count: 0, message: '수집된 새로운 뉴스 없음' });
        }

        // 4. Firestore REST API를 이용해 저장
        let savedCount = 0;
        for (const item of newsItems) {
            const docId = generateSafeId(item.link);

            // Upsert (이미 있으면 덮어쓰고 없으면 생성 - merge: true 효과)
            await newsDb.upsert(docId, {
                originalTitle: item.originalTitle,
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
                },
                createdAt: new Date().toISOString(),
                isVisible: true
            });
            savedCount++;
        }

        console.log('[Collect API] ✅ DB 저장 완료:', savedCount, '건');
        return NextResponse.json({ success: true, count: savedCount });

    } catch (error: any) {
        console.error('[Collect API] ❌ 에러:', error);
        console.error('[Collect API] ❌ 에러 스택:', error.stack);
        return NextResponse.json({
            success: false,
            error: error.message || 'Unknown error',
            details: error.stack
        }, { status: 500 });
    }
}
