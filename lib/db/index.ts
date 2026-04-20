// lib/db/index.ts

import * as dc from './data-connect-client';
import { Spirit, SpiritFilter, PaginationParams, PaginatedResponse, SpiritSearchIndex } from './schema';

/**
 * [Server-Side Database Adapter] - Data Connect Edition
 * This file now serves as a compatibility layer for components still using the legacy 'db' object.
 * It delegates all calls to the new Data Connect relational backend.
 */

export const db = {
  /**
   * Legacy spirits fetcher. Now uses relational pagination.
   */
  async getSpirits(filter: SpiritFilter = {}, pagination: PaginationParams = { page: 1, pageSize: 20 }): Promise<PaginatedResponse<Spirit>> {
    // Determine limit and offset
    const limit = pagination.pageSize;
    const offset = (pagination.page - 1) * pagination.pageSize;

    // Use our new admin raw list query which supports listing and searching
    const data = await dc.dbAdminListRawSpirits({
      limit,
      offset,
      category: filter.category !== 'ALL' ? filter.category : undefined,
      isPublished: filter.isPublished,
      search: filter.searchTerm
    });

    // In Data Connect, we could ideally get the total count via aggregation, 
    // but for the UI to not break, we estimate total as before or use a large fixed number.
    // Optimization: If results < limit, we reached the end.
    const total = data.length < limit ? offset + data.length : 5000;

    return {
      data: data as unknown as Spirit[],
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(total / pagination.pageSize) || 1
    };
  },

  async getLatestFeatured(category: string, limit: number = 6): Promise<Spirit[]> {
    const spirits = await dc.dbListSpirits({ category });
    return spirits.slice(0, limit) as Spirit[];
  },

  async getSpirit(id: string): Promise<Spirit | null> {
    const spirit = await dc.dbGetSpirit(id);
    return spirit as unknown as Spirit | null;
  },

  async updateSpirit(id: string, updates: Partial<Spirit>): Promise<Spirit | null> {
    // Note: Most updates should now flow through Server Actions.
    // This is kept for compatibility with legacy Admin forms.
    await dc.dbUpsertSpirit({ id, ...updates });
    return await this.getSpirit(id);
  },

  async deleteSpirit(id: string): Promise<boolean> {
    await dc.dbDeleteSpirit(id);
    return true;
  },

  /**
   * Get minimized search index for all PUBLISHED spirits
   */
  async getPublishedSearchIndex(): Promise<SpiritSearchIndex[]> {
    const spirits = await dc.dbListSpiritsForSitemap();
    return spirits.map((s: any) => ({
      i: s.id,
      n: s.name || '이름 없음',
      en: s.nameEn || null,
      c: s.category || '기타',
      sc: s.subcategory || null,
      t: s.imageUrl || null,
      a: s.abv || 0,
      d: s.distillery || null,
      tn: s.tastingNote || null,
    }));
  },

  /**
   * High-performance Wiki recommendations using search index
   */
  async getTopInCategory(category: string, limit: number = 6): Promise<SpiritSearchIndex[]> {
    const spirits = await dc.dbListSpirits({ category });
    return spirits.slice(0, limit).map((s: any) => ({
      i: s.id,
      n: s.name || '이름 없음',
      en: s.nameEn || null,
      c: s.category || '기타',
      sc: s.subcategory || null,
      t: s.imageUrl || null,
      a: s.abv || 0,
      d: s.distillery || null,
      tn: s.tastingNote || null,
    }));
  }
};
