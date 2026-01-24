import { db as adminDb } from '../firebase-admin';
import { appId } from '../firebase';
import { Spirit, SpiritStatus, SpiritFilter, PaginationParams, PaginatedResponse } from './schema';

/**
 * [Server-Side Database Adapter]
 * Uses Firebase Admin SDK to bypass Security Rules for API Routes.
 * Path: /artifacts/{appId}/public/data/spirits
 */

const COLLECTION_PATH = `artifacts/${appId}/public/data/spirits`;

export const spiritsDb = {
  // Get All Spirits (Admin SDK)
  async getAll(status?: SpiritStatus | 'ALL'): Promise<Spirit[]> {
    let query: FirebaseFirestore.Query = adminDb.collection(COLLECTION_PATH);

    if (status && status !== 'ALL') {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Spirit));
  },

  // Get By ID
  async getById(id: string): Promise<Spirit | null> {
    const docRef = adminDb.doc(`${COLLECTION_PATH}/${id}`);
    const snapshot = await docRef.get();
    if (snapshot.exists) return { id: snapshot.id, ...snapshot.data() } as Spirit;
    return null;
  },

  // Upsert (Set with merge)
  async upsert(id: string, data: Partial<Spirit>) {
    const docRef = adminDb.doc(`${COLLECTION_PATH}/${id}`);
    const payload = { ...data, id, updatedAt: new Date().toISOString() };
    await docRef.set(payload, { merge: true });
  },

  // Bulk Update
  async bulkUpdate(ids: string[], updates: Partial<Spirit>) {
    const batch = adminDb.batch();
    ids.forEach(id => {
      const docRef = adminDb.doc(`${COLLECTION_PATH}/${id}`);
      batch.set(docRef, { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
    });
    await batch.commit();
  },

  // Delete
  async delete(ids: string[]) {
    const batch = adminDb.batch();
    ids.forEach(id => {
      const docRef = adminDb.doc(`${COLLECTION_PATH}/${id}`);
      batch.delete(docRef);
    });
    await batch.commit();
  }
};

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
