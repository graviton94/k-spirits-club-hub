// Mock database for development
// In production, this would connect to Cloudflare D1 or Turso
import type { Spirit, UserCabinet, Review, SpiritFilter, PaginatedResponse, PaginationParams, SpiritStatus } from './schema';

let allSpirits: Spirit[] = [];
let initialized = false;

function initializeData() {
  if (initialized) return;

  // 1. Sample data definition
  const sampleSpirits: Spirit[] = [
    {
      id: '1',
      name: 'Glenfiddich 12 Year Old',
      distillery: 'Glenfiddich',
      bottler: null,
      abv: 40,
      volume: 700,
      category: 'whisky',
      subcategory: '싱글 몰트',
      country: '스코틀랜드',
      region: '스페이사이드',
      imageUrl: '/images/sample-whisky.jpg',
      thumbnailUrl: '/images/sample-whisky-thumb.jpg',
      source: 'whiskybase',
      externalId: 'wb-1234',
      status: 'PUBLISHED',
      isPublished: true,
      isReviewed: true,
      reviewedBy: 'admin',
      reviewedAt: new Date('2024-01-01'),
      metadata: {},
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Chamisul Fresh Soju',
      distillery: 'HiteJinro',
      bottler: null,
      abv: 16.9,
      volume: 360,
      category: 'soju',
      subcategory: null,
      country: '대한민국',
      region: null,
      imageUrl: '/images/sample-soju.jpg',
      thumbnailUrl: '/images/sample-soju-thumb.jpg',
      source: 'food_safety_korea',
      externalId: 'fsk-5678',
      status: 'PUBLISHED',
      isPublished: true,
      isReviewed: true,
      reviewedBy: 'admin',
      reviewedAt: new Date('2024-01-02'),
      metadata: {},
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
    {
      id: '3',
      name: 'Macallan 18 Year Old Sherry Oak',
      distillery: 'Macallan',
      bottler: null,
      abv: 43,
      volume: 700,
      category: 'whisky',
      subcategory: '싱글 몰트',
      country: '스코틀랜드',
      region: '스페이사이드',
      imageUrl: '/images/sample-macallan.jpg',
      thumbnailUrl: '/images/sample-macallan-thumb.jpg',
      source: 'whiskybase',
      externalId: 'wb-9012',
      status: 'RAW',
      isPublished: false,
      isReviewed: false,
      reviewedBy: null,
      reviewedAt: null,
      metadata: {},
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
    },
  ];

  allSpirits = [...sampleSpirits];

  // 2. Load heavy ingested data from file (Server-side only)
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'lib/db/ingested-data.json');

      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          console.log(`[DB] Loading ALL spirits (Total: ${parsed.length})...`);
          const limited = parsed; // No limit
          const transformed = limited.map(s => ({
            ...s,
            status: s.status || 'RAW',
            metadata: s.metadata || {},
            reviewedAt: s.reviewedAt ? new Date(s.reviewedAt) : null,
            createdAt: new Date(s.createdAt),
            updatedAt: new Date(s.updatedAt)
          }));
          allSpirits = [...sampleSpirits, ...transformed];
          console.log(`[DB] Successfully loaded ${transformed.length} spirits.`);
        }
      }
    } catch (error) {
      console.warn('[DB] Failed to load ingested-data.json (expected during build or if missing):', error);
    }
  }

  initialized = true;
}

// Global initialization
if (typeof window === 'undefined') {
  initializeData();
}

const sampleReviews: Review[] = [
  {
    id: '1',
    spiritId: '1',
    userId: 'user1',
    userName: '위스키러버',
    rating: 4,
    title: '입문용으로 좋습니다',
    content: '부드럽고 마시기 편한 싱글몰트입니다. 위스키 입문자에게 추천합니다.',
    nose: '사과, 배, 꿀향',
    palate: '부드럽고 달콤함',
    finish: '중간 정도의 피니시',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    isPublished: true,
  },
];

// Mock database operations
export const db = {
  // Spirit operations
  async getSpirits(filter: SpiritFilter = {}, pagination: PaginationParams = { page: 1, pageSize: 20 }): Promise<PaginatedResponse<Spirit>> {
    // Ensure we are initialized (though it should be called on module load)
    initializeData();
    let filtered = allSpirits;

    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(term) ||
        s.distillery.toLowerCase().includes(term)
      );
    }

    if (filter.category) {
      filtered = filtered.filter(s => s.category === filter.category);
    }

    if (filter.subcategory) {
      filtered = filtered.filter(s => s.subcategory === filter.subcategory);
    }

    if (filter.country) {
      filtered = filtered.filter(s => s.country === filter.country);
    }

    if (filter.isPublished !== undefined) {
      filtered = filtered.filter(s => s.isPublished === filter.isPublished);
    }

    if (filter.isReviewed !== undefined) {
      filtered = filtered.filter(s => s.isReviewed === filter.isReviewed);
    }

    if (filter.status) {
      filtered = filtered.filter(s => s.status === filter.status);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / pagination.pageSize);
    const start = (pagination.page - 1) * pagination.pageSize;
    const data = filtered.slice(start, start + pagination.pageSize);

    return {
      data,
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages,
    };
  },

  async getSpirit(id: string): Promise<Spirit | null> {
    initializeData();
    return allSpirits.find(s => s.id === id) || null;
  },

  async updateSpirit(id: string, updates: Partial<Spirit>): Promise<Spirit | null> {
    initializeData();
    const index = allSpirits.findIndex(s => s.id === id);
    if (index === -1) return null;

    const updatedSpirit = {
      ...allSpirits[index],
      ...updates,
      updatedAt: new Date()
    } as Spirit;

    allSpirits[index] = updatedSpirit;

    // Persist to JSON file if in Node.js environment (Server Components / API Routes)
    if (typeof window === 'undefined') {
      try {
        // Dynamic import to prevent client-side build errors
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(process.cwd(), 'lib/db/ingested-data.json');

        fs.writeFileSync(filePath, JSON.stringify(allSpirits, null, 2), 'utf-8');
      } catch (error) {
        console.error('Failed to persist spirit update:', error);
      }
    }

    return updatedSpirit;
  },

  async deleteSpirit(id: string): Promise<boolean> {
    initializeData();
    const index = allSpirits.findIndex(s => s.id === id);
    if (index === -1) return false;

    allSpirits.splice(index, 1);

    // Persist to JSON file
    if (typeof window === 'undefined') {
      try {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(process.cwd(), 'lib/db/ingested-data.json');

        fs.writeFileSync(filePath, JSON.stringify(allSpirits, null, 2), 'utf-8');
      } catch (error) {
        console.error('Failed to persist spirit deletion:', error);
      }
    }

    return true;
  },

  // Review operations
  async getReviews(spiritId: string): Promise<Review[]> {
    return sampleReviews.filter(r => r.spiritId === spiritId && r.isPublished);
  },

  async createReview(review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review> {
    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    sampleReviews.push(newReview);
    return newReview;
  },

  // Cabinet operations
  async getCabinet(userId: string): Promise<UserCabinet[]> {
    // Mock implementation
    return [];
  },

  async addToCabinet(userId: string, spiritId: string): Promise<UserCabinet> {
    // Mock implementation
    return {
      id: Date.now().toString(),
      userId,
      spiritId,
      addedAt: new Date(),
      notes: null,
      rating: null,
      isFavorite: false,
    };
  },

  async removeFromCabinet(userId: string, spiritId: string): Promise<boolean> {
    // Mock implementation
    return true;
  },
};
