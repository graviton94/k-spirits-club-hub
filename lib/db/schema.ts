// Database schema types for K-Spirits Club Hub

export interface Spirit {
  id: string;
  name: string;
  distillery: string;
  bottler: string | null;
  abv: number;
  volume: number | null;
  category: string; // whisky, vodka, gin, rum, etc.
  subcategory: string | null; // single malt, blended, etc.
  country: string;
  region: string | null;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  
  // Data source tracking
  source: 'food_safety_korea' | 'whiskybase' | 'manual' | 'other';
  externalId: string | null;
  
  // Data quality & publishing
  isPublished: boolean;
  isReviewed: boolean;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCabinet {
  id: string;
  userId: string;
  spiritId: string;
  addedAt: Date;
  notes: string | null;
  rating: number | null; // 1-5
  isFavorite: boolean;
}

export interface Review {
  id: string;
  spiritId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  title: string;
  content: string;
  nose: string | null;
  palate: string | null;
  finish: string | null;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
}

export interface DataImportLog {
  id: string;
  source: string;
  importedAt: Date;
  totalRecords: number;
  successCount: number;
  failureCount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  errorLog: string | null;
}

// Search and filter types
export interface SpiritFilter {
  category?: string;
  country?: string;
  minAbv?: number;
  maxAbv?: number;
  distillery?: string;
  searchTerm?: string;
  isPublished?: boolean;
  isReviewed?: boolean;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
