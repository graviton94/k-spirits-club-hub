import { NextResponse } from 'next/server';
import { fetchNewsForCollection } from '@/lib/api/news';
import { dbListNewsArticles, dbUpsertNews } from '@/lib/db/data-connect-client';

export const runtime = 'nodejs';
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

        const body = await request.json();
        const existingLinksSet = new Set<string>(body.existingLinks || []);

        console.log('[Collect API] 📋 Received', existingLinksSet.size, 'existing news items from client check');

        // 3. RSS 데이터 가져오기 (중복 제외하고 Gemini 처리)
        const newsItems = await fetchNewsForCollection(existingLinksSet);

        console.log('[Collect API] 📊 파싱 완료:', newsItems.length, '건 (새로운 뉴스만)');

        if (!newsItems || newsItems.length === 0) {
            console.warn('[Collect API] ⚠️ 수집된 새로운 뉴스 없음');
            return NextResponse.json({ success: true, newsItems: [], message: '수집된 새로운 뉴스 없음' });
        }

        // Return parsed items to the client for secure Dataconnect DB insertion
        return NextResponse.json({ success: true, newsItems });

    } catch (error: any) {
        console.error('[Collect API] ❌ 에러:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Unknown error'
        }, { status: 500 });
    }
}
