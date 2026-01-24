import { spiritsDb as restSpiritsDb } from './firestore-rest';
import { Spirit, SpiritStatus, SpiritFilter, PaginationParams, PaginatedResponse } from './schema';

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
    // 1. Fetch filtered items from Firestore (Memory Filtering for specialized fields)
    // Note: Admin SDK supports complex queries better, but we keep memory filter logic for consistency with previous behavior unless performance issues arise.
    // For 42k items, fetching ALL and filtering in memory is NOT scalable permanently, but for now we stick to "fetch all by Status" and filter rest.

    // Improvement: Use Firestore Query for basic fields if possible.
    let allItems = await spiritsDb.getAll(filter.status); // Pre-filter by status if present

    // 2. Memory Filter
    if (filter.category) allItems = allItems.filter(s => s.category === filter.category);
    if (filter.subcategory) allItems = allItems.filter(s => s.subcategory === filter.subcategory);
    if (filter.country) allItems = allItems.filter(s => s.country === filter.country);
    if (filter.isPublished !== undefined) allItems = allItems.filter(s => s.isPublished === filter.isPublished);
    if (filter.searchTerm) {
      const lowerTerm = filter.searchTerm.toLowerCase();
      allItems = allItems.filter(s =>
        s.name.toLowerCase().includes(lowerTerm) ||
        (s.metadata?.name_en && s.metadata.name_en.toLowerCase().includes(lowerTerm))
      );
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
    await spiritsDb.upsert(id, updates);
    return spiritsDb.getById(id);
  },

  async deleteSpirit(id: string): Promise<boolean> {
    await spiritsDb.delete([id]);
    return true;
  }
};
