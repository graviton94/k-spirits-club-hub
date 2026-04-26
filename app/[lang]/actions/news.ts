"use server";

import { fetchNewsForCollection } from '@/lib/api/news';
import { dbAdminUpsertNews } from '@/lib/db/data-connect-admin';
import { getEnv } from '@/lib/env';

function generateSafeId(url: string): string {
  return Buffer.from(url).toString('base64').replace(/\//g, '_').replace(/\+/g, '-').replace(/=/g, '');
}

export async function collectNewsAdminAction(existingLinks: string[] = []) {
  try {
    if (!getEnv('GEMINI_API_KEY')) {
      throw new Error('GEMINI_API_KEY가 설정되지 않았습니다.');
    }

    const existingLinksSet = new Set(existingLinks);
    const newsItems = await fetchNewsForCollection(existingLinksSet);

    if (!newsItems || newsItems.length === 0) {
      return { success: true, count: 0, message: '수집된 새로운 뉴스 없음' };
    }

    let count = 0;
    for (const item of newsItems) {
      const docId = generateSafeId(item.link);
      await dbAdminUpsertNews({
        id: docId,
        title: item.translations?.ko?.title || item.translations?.en?.title || item.originalTitle || '',
        content: item.translations?.ko?.content || item.translations?.ko?.snippet || item.translations?.en?.content || '',
        imageUrl: item.imageUrl || null,
        category: item.category || null,
        source: item.source,
        link: item.link,
        date: item.date,
        translations: item.translations || null,
        tags: item.tags || null,
      });
      count += 1;
    }

    return { success: true, count };
  } catch (error: any) {
    console.error('[Action] collectNewsAdminAction Error:', error);
    return { success: false, error: error.message || 'Unknown error', count: 0 };
  }
}
