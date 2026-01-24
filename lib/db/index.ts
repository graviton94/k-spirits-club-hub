// Mock database for development
// In production, this would connect to Cloudflare D1 or Turso
import type { Spirit, UserCabinet, Review, SpiritFilter, PaginatedResponse, PaginationParams } from './schema';

// Sample data
const sampleSpirits: Spirit[] = [
  {
    id: '1',
    name: 'Glenfiddich 12 Year Old',
    distillery: 'Glenfiddich',
    bottler: null,
    abv: 40,
    volume: 700,
    category: 'whisky',
    subcategory: 'single malt',
    country: 'Scotland',
    region: 'Speyside',
    imageUrl: '/images/sample-whisky.jpg',
    thumbnailUrl: '/images/sample-whisky-thumb.jpg',
    source: 'whiskybase',
    externalId: 'wb-1234',
    isPublished: true,
    isReviewed: true,
    reviewedBy: 'admin',
    reviewedAt: new Date('2024-01-01'),
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
    country: 'South Korea',
    region: null,
    imageUrl: '/images/sample-soju.jpg',
    thumbnailUrl: '/images/sample-soju-thumb.jpg',
    source: 'food_safety_korea',
    externalId: 'fsk-5678',
    isPublished: true,
    isReviewed: true,
    reviewedBy: 'admin',
    reviewedAt: new Date('2024-01-02'),
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
    subcategory: 'single malt',
    country: 'Scotland',
    region: 'Speyside',
    imageUrl: '/images/sample-macallan.jpg',
    thumbnailUrl: '/images/sample-macallan-thumb.jpg',
    source: 'whiskybase',
    externalId: 'wb-9012',
    isPublished: false,
    isReviewed: false,
    reviewedBy: null,
    reviewedAt: null,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
];

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
    let filtered = sampleSpirits;

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

    if (filter.country) {
      filtered = filtered.filter(s => s.country === filter.country);
    }

    if (filter.isPublished !== undefined) {
      filtered = filtered.filter(s => s.isPublished === filter.isPublished);
    }

    if (filter.isReviewed !== undefined) {
      filtered = filtered.filter(s => s.isReviewed === filter.isReviewed);
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
    return sampleSpirits.find(s => s.id === id) || null;
  },

  async updateSpirit(id: string, updates: Partial<Spirit>): Promise<Spirit | null> {
    const index = sampleSpirits.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    sampleSpirits[index] = { ...sampleSpirits[index], ...updates, updatedAt: new Date() };
    return sampleSpirits[index];
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
