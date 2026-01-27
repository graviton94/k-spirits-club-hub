// Database schema types for K-Spirits Club Hub

export type SpiritStatus = 'RAW' | 'ENRICHED' | 'READY_FOR_CONFIRM' | 'PUBLISHED' | 'ERROR';

/**
 * Minimized search index structure for bandwidth optimization.
 * Uses short keys to reduce JSON payload size.
 */
// Taste Analysis Types
export interface FlavorStats {
  woody: number;  // 우디함 (0-100)
  peaty: number;  // 피트/스모키 (0-100)
  floral: number; // 꽃향 (0-100)
  fruity: number; // 과일향 (0-100)
  nutty: number;  // 견과류/고소함 (0-100)
  richness: number; // 바디감 (0-100)
}

export interface UserTasteProfile {
  userId: string;
  analyzedAt: Date; // 분석 시점 (재분석 쿨타임 관리용)
  stats: FlavorStats;
  persona: {
    title: string;       // 예: "고독한 아일라의 사냥꾼"
    description: string; // AI 분석 텍스트
    keywords: string[];  // 예: ["#피트", "#CS", "#독병"]
  };
  recommendation: {
    spiritId: string;
    name: string;
    matchRate: number;   // 일치도 (예: 98)
    linkUrl?: string;    // 제휴/구매 링크
  } | null;
}

export interface SpiritSearchIndex {
  i: string;           // id
  n: string;           // name
  en: string | null;   // name_en (English name from metadata)
  c: string;           // category
  mc: string | null;   // mainCategory
  sc: string | null;   // subcategory
  t: string | null;    // thumbnailUrl
  a: number;           // abv (alcohol by volume)
  d: string | null;    // distillery
  cre: string | null;  // createdAt (for new/trending)
  m?: any;             // metadata (optional, minimized)
  s?: string;          // status (only for admin)
}

export interface Spirit {
  id: string;
  name: string;
  distillery: string | null;
  bottler: string | null;
  abv: number;
  volume: number | null;
  category: string; // whisky, vodka, gin, rum, etc. (Legal/Wide classification)
  mainCategory: string | null; // Structured grouping (e.g. whisky for bourbon) from metadata
  subcategory: string | null; // single malt, blended, etc.
  country: string | null;
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

  // Search optimization
  searchKeywords?: string[]; // N-gram keywords for efficient searching

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
  isActive?: boolean;
  likes?: number;
  likedBy?: string[];
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

export interface ModificationRequest {
  id: string;
  spiritId: string;       // 대상 술 ID
  spiritName: string;     // 대상 술 이름 (관리자 식별용)
  userId: string | null;  // 로그인 유저 ID (없으면 null/익명)

  // 유저 입력 데이터 (심플하게 2개만)
  title: string;          // 예: "도수가 잘못 표기되어 있어요"
  content: string;        // 예: "40%가 아니라 43%입니다. 공식 홈피 링크 첨부합니다..."

  // 상태 관리
  status: 'pending' | 'checked' | 'resolved'; // 대기중 | 확인중 | 처리완료
  createdAt: Date;
}
