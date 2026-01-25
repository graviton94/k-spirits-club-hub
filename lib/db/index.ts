import { spiritsDb as restSpiritsDb } from './firestore-rest';
import { Spirit, SpiritStatus, SpiritFilter, PaginationParams, PaginatedResponse } from './schema';
import { generateSpiritSearchKeywords } from '../utils/search-keywords';

/**
 * [Server-Side Database Adapter]
 * Uses Firestore REST API to be compatible with Edge Runtime (Cloudflare).
 */
export const spiritsDb = restSpiritsDb;

// -----------------------------------------------------------------------------
// LEGACY ADAPTER (Compatible Wrapper)
// -----------------------------------------------------------------------------
export const db = {
  async getSpirits(filter: SpiritFilter = {}, pagination: PaginationParams = { page: 1, pageSize: 20 }): Promise<PaginatedResponse<Spirit>> {
    // 1. Fetch filtered items from Firestore
    // DB-level filters: status, isPublished (applied in firestore-rest.ts)
    // Memory filters: category (OR logic), subcategory, country, searchTerm
    
    let allItems = await spiritsDb.getAll(filter); // Pre-filter by status and isPublished at DB level

    // 2. Memory Filters (for fields requiring custom logic)
    if (filter.category) {
      // Smart Filter: Match either category OR subcategory
      allItems = allItems.filter(s =>
        s.category === filter.category ||
        s.subcategory === filter.category
      );
    }
    if (filter.subcategory) allItems = allItems.filter(s => s.subcategory === filter.subcategory);
    if (filter.country) allItems = allItems.filter(s => s.country === filter.country);
    // Note: isPublished is already filtered at DB level, no need for memory filter
    if (filter.searchTerm) {
      const lowerTerm = filter.searchTerm.toLowerCase();
      allItems = allItems.filter(s => {
        // Try searchKeywords first (more efficient if populated)
        if (s.searchKeywords && s.searchKeywords.length > 0) {
          return s.searchKeywords.some(keyword => keyword.includes(lowerTerm));
        }
        // Fall back to traditional includes search
        return s.name.toLowerCase().includes(lowerTerm) ||
          (s.metadata?.name_en && s.metadata.name_en.toLowerCase().includes(lowerTerm));
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
      totalPages: Math.ceil(total / pagination.pageSize)
    };
  },

  async getSpirit(id: string): Promise<Spirit | null> {
    return spiritsDb.getById(id);
  },

  async updateSpirit(id: string, updates: Partial<Spirit>): Promise<Spirit | null> {
    // Auto-generate searchKeywords if name, distillery, or metadata.name_en is being updated
    const needsKeywordUpdate = updates.name || updates.distillery || updates.metadata?.name_en;
    
    if (needsKeywordUpdate) {
      // Fetch current spirit to get all fields for keyword generation
      const currentSpirit = await spiritsDb.getById(id);
      if (currentSpirit) {
        const spiritForKeywords = {
          name: updates.name || currentSpirit.name,
          distillery: updates.distillery !== undefined ? updates.distillery : currentSpirit.distillery,
          metadata: updates.metadata ? { ...currentSpirit.metadata, ...updates.metadata } : currentSpirit.metadata
        };
        updates.searchKeywords = generateSpiritSearchKeywords(spiritForKeywords);
      }
    }
    
    await spiritsDb.upsert(id, updates);
    return spiritsDb.getById(id);
  },

  async deleteSpirit(id: string): Promise<boolean> {
    await spiritsDb.delete([id]);
    return true;
  }
};
