// Database schema types for K-Spirits Club Hub

export type SpiritStatus = 'RAW' | 'ENRICHED' | 'READY_FOR_CONFIRM' | 'PUBLISHED' | 'ERROR';

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
  source: 'food_safety_korea' | 'imported_food_maru' | 'whiskybase' | 'manual' | 'other';
  externalId: string | null;

  // Data quality & publishing
  status: SpiritStatus;
  isPublished: boolean;
  isReviewed: boolean;
  reviewedBy: string | null;
  reviewedAt: Date | null;

  // Metadata (Enriched fields)
  metadata: {
    name_en?: string;
    raw_category?: string;
    importer?: string;
    description?: string;
    nose_tags?: string[];
    palate_tags?: string[];
    finish_tags?: string[];
    tasting_note?: string;
    [key: string]: any;
  };

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
  subcategory?: string;
  status?: SpiritStatus;
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
