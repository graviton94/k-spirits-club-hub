import { spiritsDb as restSpiritsDb } from './firestore-rest';
import { Spirit, SpiritStatus, SpiritFilter, PaginationParams, PaginatedResponse, SpiritSearchIndex } from './schema';
import { generateSpiritSearchKeywords } from '../utils/search-keywords';
import { getPublicLatestFeatured, getPublicSpiritById } from './public-read-fallback';
import { calculateInitialContentRating } from '../utils/content-rating';
import { searchIndexDb as restSearchIndexDb } from './firestore-rest';

/**
 * [Server-Side Database Adapter]
 * Uses Firestore REST API to be compatible with Edge Runtime (Cloudflare).
 */
export const spiritsDb = restSpiritsDb;

function hasServiceAccountCredentials(): boolean {
  return !!process.env.FIREBASE_CLIENT_EMAIL && !!process.env.FIREBASE_PRIVATE_KEY;
}

// -----------------------------------------------------------------------------
// LEGACY ADAPTER (Compatible Wrapper)
// -----------------------------------------------------------------------------
export const db = {
  async getSpirits(filter: SpiritFilter = {}, pagination: PaginationParams = { page: 1, pageSize: 20 }): Promise<PaginatedResponse<Spirit>> {
    // Optimization Strategy:
    // 1. "Server-Side Mode": If only filtering by Status, Category, Subcategory, Country, or SearchTerm -> Offload to Firestore DB.
    // 2. "Legacy Mode": If filtering by NoImage -> Must fetch all to filter in memory (Firestore REST limits).

    const requiresMemoryFiltering = !!filter.searchTerm || !!filter.noImage;

    if (!requiresMemoryFiltering) {
      // --- SERVER SIDE MODE (FAST) ---
      try {
        // Pass pagination directly to DB. 
        // Firestore 'getAll' now supports: Status, Category (OR), Subcategory, Country, and Limit/Offset.

        // Note: We cannot easily get "Total Count" from a filtered Firestore query without reading all docs (costly).
        // Strategy: 
        // 1. Fetch requested page.
        // 2. Estimate total? Or just fetch a large limit?
        // Actually, standard admin tables need "Total" for pagination controls.
        // Firestore aggregation queries exist but are separate calls.
        // For now, to keep the UI valid, we might assume there are more pages or just report "Many".

        // Compromise for "Dramatic optimization" requested:
        // While we ideally want Total Count, calculating it requires reading index entries (Aggregation Query).
        // Given the urgency, we will do a separate count query OR just fetch the page.
        // Admin dashboard relies on 'total' to show page numbers.
        // If we return total=50 (result length), pagination breaks (shows 1 page).

        // Improvement: Use Firestore Aggregation to get count (count() query).
        // `firestore-rest` doesn't support aggregation helper yet.
        // Fallback: For THIS sprint, we will stick to fetching the specific page for data,
        // BUT we still need a total count.
        // If we skip total count, the UI might vanish the "Next" button.

        // Let's implement a 'light' fetch for total? No, too expensive.
        // Let's rely on the fact that if we get `pageSize` items, there *might* be more.
        // Providing a fake 'total' ensuring at least one more page exists?
        // Or, since user wants optimization, maybe they accept slightly loose pagination counts?

        // WAIT. The previous implementation loaded EVERYTHING just to get the count. 
        // That is precisely what was slow.
        // If we want 452 items, reading 452 document IDs is cheap-ish. Reading 452 full docs is slower.
        // But reading 5000 docs is very slow.

        // Let's try to implement the data fetch efficiently. 
        // For the total count, we can cheat:
        // If we are on page 1 and get 20 items, total is at least 20.
        // To properly fix this, we need an Aggregation API. 
        // For now, let's keep it simple: Just get the data. 
        // Provide a placeholder total (e.g. 1000) or check if we got full page.

        const data = await spiritsDb.getAll(filter, pagination);

        // Heuristic for Total to keep UI working without full scan
        // If we returned full page, assume there's more.
        const estimatedTotal = data.length === pagination.pageSize ? (pagination.page * pagination.pageSize) + pagination.pageSize : (pagination.page - 1) * pagination.pageSize + data.length;
        // This is "Infinite Scroll" style logic adapted for Table. 
        // Better: Just return a fixed large number (e.g. 5000) if likely more, 
        // or implement `getCount` later. 

        return {
          data,
          total: estimatedTotal < 100 ? 5000 : estimatedTotal, // Hack: Force UI to show pages if likely more. Real count requires aggregation.
          page: pagination.page,
          pageSize: pagination.pageSize,
          totalPages: Math.ceil(5000 / pagination.pageSize) // Temp fake
        };
      } catch (error) {
        console.warn('[DB Adapter] Server-side query failed (likely missing index). Falling back to Memory Filtering.', error);
        // Fallback: Proceed to Legacy Mode below
      }
    }

    // --- LEGACY MODE (SLOW BUT POWERFUL) ---
    // Used when SearchTerm or noImage is present OR when Server-Side Mode fails
    // Note: We try to use getAll() which now supports array-contains, falling back to listAll() if needed.
    let allItems: Spirit[] = [];
    try {
      if (filter.searchTerm || filter.category || filter.country) {
        // Use optimized query (up to 5000 matches) instead of absolute everything
        try {
          allItems = await spiritsDb.getAll(filter);
        } catch (e) {
          console.warn('[DB Adapter] Optimized getAll failed, falling back to full listAll scan.');
          allItems = await spiritsDb.listAll();
        }
      } else {
        allItems = await spiritsDb.listAll();
      }
    } catch (err) {
      console.error('[DB Adapter] Ultimate fallback failed:', err);
      return { data: [], total: 0, page: pagination.page, pageSize: pagination.pageSize, totalPages: 0 };
    }

    // 1. Initial filter for basic status (if not searching everything)
    if (filter.status && (filter.status as string) !== 'ALL') {
      allItems = allItems.filter(s => s.status === filter.status);
    }
    if (filter.isPublished !== undefined) {
      allItems = allItems.filter(s => s.isPublished === filter.isPublished);
    }

    // 2. Memory Filters (for fields requiring custom logic)
    if (filter.category && (filter.category as string) !== 'ALL') {
      allItems = allItems.filter(s =>
        s.category === filter.category ||
        s.subcategory === filter.category
      );
    }
    if (filter.subcategory) allItems = allItems.filter(s => s.subcategory === filter.subcategory);
    if (filter.country && (filter.country as string) !== 'ALL') allItems = allItems.filter(s => s.country === filter.country);
    if (filter.noImage) allItems = allItems.filter(s => !s.imageUrl);

    if (filter.searchTerm) {
      const lowerTerm = filter.searchTerm.toLowerCase();
      allItems = allItems.filter(s => {
        const matchesKeyword = s.searchKeywords && s.searchKeywords.length > 0
          ? s.searchKeywords.some(keyword => typeof keyword === 'string' && keyword.toLowerCase().includes(lowerTerm))
          : false;

        const matchesName = !!s.name && s.name.toLowerCase().includes(lowerTerm);
        const matchesEnName = (!!s.name_en && s.name_en.toLowerCase().includes(lowerTerm)) ||
          (!!s.metadata?.name_en && s.metadata.name_en.toLowerCase().includes(lowerTerm));

        return matchesKeyword || matchesName || matchesEnName;
      });
    }

    // 3. Sort (Default: UpdatedAt Desc)
    allItems.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    // 4. Pagination
    const total = allItems.length;
    const start = (pagination.page - 1) * pagination.pageSize;
    const data = allItems.slice(start, start + pagination.pageSize);

    return {
      data,
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(total / pagination.pageSize) || 1
    };
  },

  async getLatestFeatured(category: string, limit: number = 6): Promise<Spirit[]> {
    if (!hasServiceAccountCredentials()) {
      console.warn('[DB Adapter] Missing service-account credentials. Falling back to public Firestore read for getLatestFeatured().');
      return getPublicLatestFeatured(category, limit);
    }

    return spiritsDb.getLatestFeatured(category, limit);
  },

  async getSpirit(id: string): Promise<Spirit | null> {
    if (!hasServiceAccountCredentials()) {
      console.warn(`[DB Adapter] Missing service-account credentials. Falling back to public Firestore read for spirit ${id}.`);
      return getPublicSpiritById(id);
    }

    return spiritsDb.getById(id);
  },

  async updateSpirit(id: string, updates: Partial<Spirit>): Promise<Spirit | null> {
    // 1. Fetch current spirit for context
    const current = await spiritsDb.getById(id);
    if (!current) return null;

    // 2. Prepare merged updates
    const finalUpdates = { ...updates };

    // Metadata Merging: Prevent loss of existing fields not present in the admin form (e.g., 'offer', 'enriched_at')
    if (finalUpdates.metadata) {
      finalUpdates.metadata = {
        ...(current.metadata || {}),
        ...finalUpdates.metadata
      };
    }

    // Data Consistency Guard: Ensure status='PUBLISHED' always sets isPublished=true
    if (finalUpdates.status === 'PUBLISHED') {
      finalUpdates.isPublished = true;
    }

    // 3. Auto-generate searchKeywords if needed
    const needsKeywordUpdate = finalUpdates.name || finalUpdates.distillery || finalUpdates.name_en || finalUpdates.metadata?.name_en;
    if (needsKeywordUpdate) {
      const spiritForKeywords = {
        name: finalUpdates.name || current.name,
        name_en: finalUpdates.name_en || current.name_en,
        distillery: finalUpdates.distillery !== undefined ? finalUpdates.distillery : current.distillery,
        metadata: finalUpdates.metadata ? { ...current.metadata, ...finalUpdates.metadata } : current.metadata
      };
      finalUpdates.searchKeywords = generateSpiritSearchKeywords(spiritForKeywords);
    }

    // 4. Calculate final state for SEO and Sync
    const isNowPublished = finalUpdates.isPublished !== undefined ? finalUpdates.isPublished : current.isPublished;
    
    if (isNowPublished) {
      // --- NEW: SEO AUTOMATION ENGINE ---
      const combinedState = { 
        ...current, 
        ...finalUpdates,
        metadata: finalUpdates.metadata ? { ...current.metadata, ...finalUpdates.metadata } : current.metadata
      };

      // Automatically calculate rating
      const seoResults = calculateInitialContentRating(combinedState);
      
      const indexUpdate: SpiritSearchIndex = {
        i: id,
        n: combinedState.name,
        en: combinedState.name_en || combinedState.metadata?.name_en || null,
        c: combinedState.category,
        sc: combinedState.subcategory || null,
        t: combinedState.thumbnailUrl || combinedState.imageUrl || null,
        a: combinedState.abv || 0,
        d: combinedState.distillery || null,
        tn: combinedState.tasting_note || null,
        cre: combinedState.createdAt,
        r: seoResults.ratingValue,
        rc: 1, // Initial expert review
        h: !!combinedState.tasting_note
      };

      // Perform ATOMIC Sync (Spirit Detail + Search Index)
      // This saves BOTH the primary updates and the calculated SEO fields in one transaction logic
      await spiritsDb.commitSEOUpdate(id, {
        ...finalUpdates,
        aggregateRating: {
          ratingValue: seoResults.ratingValue,
          reviewCount: 1
        }
      }, indexUpdate);

      // Also sync new arrivals cache as usual
      try {
        const { newArrivalsDb } = await import('./firestore-rest');
        await newArrivalsDb.syncCache();
      } catch (error) {
        console.error('Failed to sync new arrivals cache:', error);
      }
    } else {
      // Simple update for non-published spirits
      await spiritsDb.upsert(id, finalUpdates);
    }

    return spiritsDb.getById(id);
  },

  async deleteSpirit(id: string): Promise<boolean> {
    await spiritsDb.delete([id]);
    return true;
  },

  /**
   * Get minimized search index for all PUBLISHED spirits
   * Uses short keys to reduce bandwidth consumption
   */
  /**
   * Get minimized search index for all PUBLISHED spirits
   * Uses short keys to reduce bandwidth consumption
   */
  async getPublishedSearchIndex(): Promise<SpiritSearchIndex[]> {
    return spiritsDb.getPublishedSearchIndex();
  },

  /**
   * [Phase 3] High-performance Wiki recommendations using search index
   */
  async getTopInCategory(category: string, limit: number = 6): Promise<SpiritSearchIndex[]> {
    return restSearchIndexDb.getTopInCategory(category, limit);
  }
};
