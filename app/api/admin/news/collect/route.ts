
import { NextResponse } from 'next/server';
import { fetchNewsForCollection, CollectedNewsItem } from '@/lib/api/news';
import { newsDb } from '@/lib/db/firestore-rest';

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        // Basic authorization check (e.g. check for header 'x-admin-key' if needed)
        // For now, we allow trigger but you might want to protect this in production.

        console.log('[News Collection] Starting manual collection...');

        const newsItems = await fetchNewsForCollection();
        console.log(`[News Collection] Fetched ${newsItems.length} items from RSS+Gemini.`);

        if (newsItems.length === 0) {
            return NextResponse.json({ success: false, message: 'No news found.' }, { status: 404 });
        }

        const results = [];
        for (const item of newsItems) {
            // Generate ID from link (Base64URL encoded to be safe for Firestore ID)
            const id = Buffer.from(item.link).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

            await newsDb.upsert(id, item);
            results.push({ id, title: item.originalTitle });
        }

        console.log(`[News Collection] Successfully stored ${results.length} items.`);

        return NextResponse.json({
            success: true,
            count: results.length,
            items: results
        });

    } catch (error) {
        console.error('[News Collection] Error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
