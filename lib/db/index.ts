// Database Adapter: Hybrid (D1 for Production / In-Memory JSON for Local)
import type { Spirit, UserCabinet, Review, SpiritFilter, PaginatedResponse, PaginationParams, SpiritStatus } from './schema';

// -----------------------------------------------------------------------------
// [LOCAL MODE] In-Memory / File-based Logic (Legacy)
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
  if (typeof window === 'undefined' && !process.env.DB) {
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
if (typeof window === 'undefined' && !process.env.DB) {
  initializeData();
}

// -----------------------------------------------------------------------------
// [PRODUCTION MODE] Cloudflare D1 Logic
// -----------------------------------------------------------------------------
// Type definition for D1 Binding (implicitly available in Workers environment)
declare global {
  var DB: any; // D1Database
}

function mapRowToSpirit(row: any): Spirit {
  return {
    id: row.id,
    name: row.name,
    distillery: row.distillery,
    bottler: row.bottler,
    abv: row.abv,
    volume: row.volume,
    category: row.category,
    subcategory: row.subcategory,
    country: row.country,
    region: row.region,
    imageUrl: row.image_url,
    thumbnailUrl: row.thumbnail_url,
    source: row.source as any,
    externalId: row.external_id,
    status: row.status as SpiritStatus,
    isPublished: Boolean(row.is_published),
    isReviewed: Boolean(row.is_reviewed),
    reviewedBy: row.reviewed_by,
    reviewedAt: row.reviewed_at ? new Date(row.reviewed_at) : null,
    metadata: row.metadata ? JSON.parse(row.metadata) : {},
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

// -----------------------------------------------------------------------------
// UNIFIED DB ADAPTER
// -----------------------------------------------------------------------------
export const db = {
  // Spirit operations
  async getSpirits(filter: SpiritFilter = {}, pagination: PaginationParams = { page: 1, pageSize: 20 }): Promise<PaginatedResponse<Spirit>> {
    // [PROD] Use D1 (Check if DB binding exists on process.env or global)
    // In some Next.js adapters, bindings are on process.env
    const dbBinding = (process.env as any).DB;

    if (dbBinding) {
      // console.log('[DB:D1] getSpirits query');
      let query = 'SELECT * FROM spirits WHERE 1=1';
      const params: any[] = [];

      if (filter.status) { query += ' AND status = ?'; params.push(filter.status); }
      if (filter.category) { query += ' AND category = ?'; params.push(filter.category); }
      if (filter.subcategory) { query += ' AND subcategory = ?'; params.push(filter.subcategory); }
      if (filter.country) { query += ' AND country = ?'; params.push(filter.country); }

      // Count total
      const countStmt = dbBinding.prepare(query.replace('SELECT *', 'SELECT count(*) as total'));
      // @ts-ignore
      const totalResult = await countStmt.bind(...params).first();
      const total = totalResult.total as number;

      // Fetch Data
      query += ' LIMIT ? OFFSET ?';
      const limit = pagination.pageSize;
      const offset = (pagination.page - 1) * pagination.pageSize;
      params.push(limit, offset);

      const stmt = dbBinding.prepare(query);
      // @ts-ignore
      const { results } = await stmt.bind(...params).all();

      return {
        data: results.map(mapRowToSpirit),
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
    const dbBinding = (process.env as any).DB;
    if (dbBinding) {
      const stmt = dbBinding.prepare('SELECT * FROM spirits WHERE id = ?');
      // @ts-ignore
      const result = await stmt.bind(id).first();
      return result ? mapRowToSpirit(result) : null;
    }

    initializeData();
    return allSpirits.find(s => s.id === id) || null;
  },

  async updateSpirit(id: string, updates: Partial<Spirit>): Promise<Spirit | null> {
    const dbBinding = (process.env as any).DB;
    if (dbBinding) {
      // Build dynamic update query
      const fields: string[] = [];
      const values: any[] = [];

      const toSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

      for (const [key, value] of Object.entries(updates)) {
        if (key === 'id') continue; // Skip ID

        let dbKey = toSnakeCase(key);
        let dbValue = value;

        if (key === 'metadata') {
          dbValue = JSON.stringify(value);
        } else if (value instanceof Date) {
          dbValue = value.toISOString();
        } else if (key === 'createdAt' || key === 'updatedAt' || key === 'reviewedAt') {
          // Already handled date logic above if value is Date object
        }

        // Special Mapping for specific keys if needed
        if (key === 'imageUrl') dbKey = 'image_url';
        if (key === 'thumbnailUrl') dbKey = 'thumbnail_url';
        if (key === 'externalId') dbKey = 'external_id';
        if (key === 'isPublished') { dbKey = 'is_published'; dbValue = value ? 1 : 0; }
        if (key === 'isReviewed') { dbKey = 'is_reviewed'; dbValue = value ? 1 : 0; }
        if (key === 'reviewedBy') dbKey = 'reviewed_by';
        if (key === 'reviewedAt') dbKey = 'reviewed_at';

        fields.push(`${dbKey} = ?`);
        values.push(dbValue);
      }

      // Always update 'updated_at'
      fields.push(`updated_at = ?`);
      values.push(new Date().toISOString());

      const query = `UPDATE spirits SET ${fields.join(', ')} WHERE id = ? RETURNING *`;
      values.push(id);

      const stmt = dbBinding.prepare(query);
      // @ts-ignore
      const result = await stmt.bind(...values).first();
      return result ? mapRowToSpirit(result) : null;
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
    const dbBinding = (process.env as any).DB;
    if (dbBinding) {
      const stmt = dbBinding.prepare('DELETE FROM spirits WHERE id = ?');
      // @ts-ignore
      const info = await stmt.bind(id).run();
      return info.success;
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
