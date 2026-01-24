// Database Adapter: Hybrid (Firestore for Production / In-Memory JSON for Local)
import type { Spirit, UserCabinet, Review, SpiritFilter, PaginatedResponse, PaginationParams, SpiritStatus } from './schema';
import { firestore } from '../firebase-admin';

// -----------------------------------------------------------------------------
// [LOCAL MODE] In-Memory / File-based Logic
// -----------------------------------------------------------------------------
let allSpirits: Spirit[] = [];
let initialized = false;

function initializeData() {
  if (initialized) return;

  // 1. Sample data
  const sampleSpirits: Spirit[] = [
    {
      id: '1', name: 'Glenfiddich 12 Year Old', distillery: 'Glenfiddich', bottler: null, abv: 40, volume: 700,
      category: 'whisky', subcategory: '싱글 몰트', country: '스코틀랜드', region: '스페이사이드',
      imageUrl: '/images/sample-whisky.jpg', thumbnailUrl: '/images/sample-whisky-thumb.jpg',
      source: 'whiskybase', externalId: 'wb-1234', status: 'PUBLISHED', isPublished: true, isReviewed: true,
      reviewedBy: 'admin', reviewedAt: new Date('2024-01-01'), metadata: {}, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01'),
    }
  ];
  allSpirits = [...sampleSpirits];

  // 2. Load heavy ingested data from file (Node.js only)
  // Only load if NOT in Production Mode (to save memory)
  const isProd = !!process.env.FIREBASE_PROJECT_ID;
  if (typeof window === 'undefined' && !isProd) {
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'lib/db/ingested-data.json');

      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          console.log(`[DB:LOCAL] Loading ALL spirits (Total: ${parsed.length})...`);
          const transformed = parsed.map(s => ({
            ...s,
            status: s.status || 'RAW',
            metadata: s.metadata || {},
            reviewedAt: s.reviewedAt ? new Date(s.reviewedAt) : null,
            createdAt: new Date(s.createdAt),
            updatedAt: new Date(s.updatedAt)
          }));
          allSpirits = [...sampleSpirits, ...transformed];
        }
      }
    } catch (error) {
      console.warn('[DB:LOCAL] Failed to load ingested-data.json:', error);
    }
  }
  initialized = true;
}

// Global initialization for Local Mode
if (typeof window === 'undefined' && !process.env.FIREBASE_PROJECT_ID) {
  initializeData();
}

// -----------------------------------------------------------------------------
// [PRODUCTION MODE] Firestore Helpers
// -----------------------------------------------------------------------------
function mapDocToSpirit(doc: FirebaseFirestore.DocumentSnapshot): Spirit {
  const data = doc.data() as any;
  const toDate = (val: any) => val && val.toDate ? val.toDate() : (val ? new Date(val) : null);

  return {
    id: doc.id,
    name: data.name,
    distillery: data.distillery,
    bottler: data.bottler,
    abv: data.abv,
    volume: data.volume,
    category: data.category,
    subcategory: data.subcategory,
    country: data.country,
    region: data.region,
    imageUrl: data.imageUrl,
    thumbnailUrl: data.thumbnailUrl,
    source: data.source,
    externalId: data.externalId,
    status: data.status,
    isPublished: data.isPublished,
    isReviewed: data.isReviewed,
    reviewedBy: data.reviewedBy,
    reviewedAt: toDate(data.reviewedAt),
    metadata: data.metadata || {},
    createdAt: toDate(data.createdAt) || new Date(),
    updatedAt: toDate(data.updatedAt) || new Date(),
  };
}

// -----------------------------------------------------------------------------
// UNIFIED DB ADAPTER
// -----------------------------------------------------------------------------
export const db = {
  // Spirit operations
  async getSpirits(filter: SpiritFilter = {}, pagination: PaginationParams = { page: 1, pageSize: 20 }): Promise<PaginatedResponse<Spirit>> {
    // [PROD] Use Firestore
    if (process.env.FIREBASE_PROJECT_ID) {
      // console.log('[DB:FIRESTORE] Querying spirits...');
      let query: FirebaseFirestore.Query = firestore.collection('spirits');

      // Filters
      if (filter.status) query = query.where('status', '==', filter.status);
      if (filter.category) query = query.where('category', '==', filter.category);
      if (filter.subcategory) query = query.where('subcategory', '==', filter.subcategory);
      if (filter.country) query = query.where('country', '==', filter.country);
      if (filter.isPublished !== undefined) query = query.where('isPublished', '==', filter.isPublished);

      // Ordering (Required for pagination)
      // Note: Composite indexes may be required for multiple 'where' + 'orderBy'
      query = query.orderBy('updatedAt', 'desc');

      // Count Total (Expensive in Firestore, use count() aggregation if available or estimate)
      // For accurate count with filters, we need a separate count query
      const countQuery = query.count();
      const countSnapshot = await countQuery.get();
      const total = countSnapshot.data().count;

      // Pagination
      const offset = (pagination.page - 1) * pagination.pageSize;
      query = query.offset(offset).limit(pagination.pageSize);

      const snapshot = await query.get();
      const data = snapshot.docs.map(mapDocToSpirit);

      return {
        data,
        total,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages: Math.ceil(total / pagination.pageSize)
      };
    }

    // [LOCAL] Use Memory
    initializeData();
    let filtered = allSpirits;

    if (filter.status) filtered = filtered.filter(s => s.status === filter.status);
    if (filter.category) filtered = filtered.filter(s => s.category === filter.category);
    if (filter.subcategory) filtered = filtered.filter(s => s.subcategory === filter.subcategory);
    if (filter.country) filtered = filtered.filter(s => s.country === filter.country);

    const total = filtered.length;
    const start = (pagination.page - 1) * pagination.pageSize;
    const data = filtered.slice(start, start + pagination.pageSize);

    return {
      data,
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(total / pagination.pageSize),
    };
  },

  async getSpirit(id: string): Promise<Spirit | null> {
    if (process.env.FIREBASE_PROJECT_ID) {
      const doc = await firestore.collection('spirits').doc(id).get();
      return doc.exists ? mapDocToSpirit(doc) : null;
    }
    initializeData();
    return allSpirits.find(s => s.id === id) || null;
  },

  async updateSpirit(id: string, updates: Partial<Spirit>): Promise<Spirit | null> {
    if (process.env.FIREBASE_PROJECT_ID) {
      const updateData = { ...updates, updatedAt: new Date() };
      await firestore.collection('spirits').doc(id).update(updateData);
      // Fetch updated
      const doc = await firestore.collection('spirits').doc(id).get();
      return mapDocToSpirit(doc);
    }

    // [LOCAL]
    initializeData();
    const index = allSpirits.findIndex(s => s.id === id);
    if (index === -1) return null;

    const updatedSpirit = { ...allSpirits[index], ...updates, updatedAt: new Date() } as Spirit;
    allSpirits[index] = updatedSpirit;

    // Persist to local JSON
    if (typeof window === 'undefined') {
      try {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(process.cwd(), 'lib/db/ingested-data.json');
        fs.writeFileSync(filePath, JSON.stringify(allSpirits, null, 2), 'utf-8');
      } catch (error) { console.error('Failed to persist spirit update:', error); }
    }
    return updatedSpirit;
  },

  async deleteSpirit(id: string): Promise<boolean> {
    if (process.env.FIREBASE_PROJECT_ID) {
      await firestore.collection('spirits').doc(id).delete();
      return true;
    }

    initializeData();
    const index = allSpirits.findIndex(s => s.id === id);
    if (index === -1) return false;
    allSpirits.splice(index, 1);

    if (typeof window === 'undefined') {
      try {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(process.cwd(), 'lib/db/ingested-data.json');
        fs.writeFileSync(filePath, JSON.stringify(allSpirits, null, 2), 'utf-8');
      } catch (error) { }
    }
    return true;
  },

  // Stubbed other methods
  async getReviews(spiritId: string): Promise<Review[]> { return []; },
  async createReview(review: any): Promise<Review> { return {} as any; },
  async getCabinet(userId: string): Promise<UserCabinet[]> { return []; },
  async addToCabinet(userId: string, spiritId: string): Promise<UserCabinet> { return {} as any; },
  async removeFromCabinet(userId: string, spiritId: string): Promise<boolean> { return true; },
};
