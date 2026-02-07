import { NextResponse } from 'next/server';
import { fetchNewsForCollection } from '@/lib/api/news';
import { newsDb } from '@/lib/db/firestore-rest';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        console.log('[Admin News] Fetching news from RSS...');
        const newsItems = await fetchNewsForCollection();

        if (!newsItems || newsItems.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'No news found from RSS sources.'
            });
        }

        console.log(`[Admin News] Processing ${newsItems.length} items with newsDb.upsert...`);

        const results = await Promise.allSettled(
            newsItems.map(async (item) => {
                // URL을 안전한 ID로 변환
                const docId = Buffer.from(item.link).toString('base64')
                    .replace(/\//g, '_')
                    .replace(/\+/g, '-')
                    .replace(/=/g, '');

                // newsDb.upsert를 사용하여 데이터 구조 통일
                await newsDb.upsert(docId, {
                    link: item.link,
                    source: item.source,
                    date: item.date, // NewsSection.tsx가 사용하는 필드
                    originalTitle: item.originalTitle,
                    originalSnippet: item.originalSnippet,
                    translations: {
                        en: item.translations.en,
                        ko: item.translations.ko
                    },
                    tags: {
                        en: item.tags.en,
                        ko: item.tags.ko
                    },
                    isVisible: true
                });
            })
        );

        const successCount = results.filter(r => r.status === 'fulfilled').length;
        const failCount = results.length - successCount;

        return NextResponse.json({
            success: true,
            count: successCount,
            message: `Successfully collected ${successCount} news items. (Failed: ${failCount})`
        });

    } catch (error: any) {
        console.error('News collection failed:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Unknown error occurred'
        }, { status: 500 });
    }
}
