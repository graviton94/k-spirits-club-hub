// Database schema types for K-Spirits Club Hub

export type SpiritStatus = 'RAW' | 'ENRICHED' | 'READY_FOR_CONFIRM' | 'PUBLISHED' | 'ERROR' | 'ERROR_REGION_LOCK' | 'ERROR_AI_FAILED' | 'IMAGE_FAILED';

/**
 * Minimized search index structure for bandwidth optimization.
 * Uses short keys to reduce JSON payload size.
 */
// Taste Analysis Types
export interface FlavorStats {
  sweet: number;    // 달콤함 (0-100)
  fruity: number;   // 과일향 (0-100)
  floral: number;   // 꽃향 (0-100)
  spicy: number;    // 스파이시 (0-100)
  woody: number;    // 우디함 (0-100)
  peaty: number;    // 피트/스모키 (0-100)
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
    spiritId?: string;   // Optional: AI 추천시에는 없을 수 있음
    name: string;
    matchRate: number;   // 일치도 (예: 98)
    reason?: string;     // 추천 사유 (AI 생성)
    linkUrl?: string;    // 제휴/구매 링크
  } | null;
  previousRecommendations?: string[]; // 이전 추천 이름 목록 (중복 방지용)
}

export interface SpiritSearchIndex {
  i: string;           // id
  n: string;           // name
  en: string | null;   // name_en (English name)
  c: string;           // category
  sc: string | null;   // subcategory
  t: string | null;    // thumbnailUrl
  a: number;           // abv
  d: string | null;    // distillery
  tn: string | null;   // tasting_note (Root)
  mc?: string | null;  // mainCategory (Optional in index)
  m?: any;             // metadata snippet
  cre?: string | number | Date; // createdAt
  r?: number;          // ratingValue (1.0 - 5.0)
  rc?: number;         // reviewCount
  h?: boolean;         // hasTastingNotes (for badge)
}

export interface Spirit {
  id: string;
  name: string;
  nameEn: string | null;
  distillery: string | null;
  bottler: string | null;
  abv: number;
  volume: number | null;
  category: string;
  categoryEn: string | null;
  mainCategory: string | null;
  subcategory: string | null;
  country: string | null;
  region: string | null;
  imageUrl: string;
  thumbnailUrl: string | null;
  descriptionKo: string | null;
  descriptionEn: string | null;
  pairingGuideKo: string | null;
  pairingGuideEn: string | null;
  noseTags: string[];
  palateTags: string[];
  finishTags: string[];
  tastingNote: string | null;

  // Data quality & publishing
  status: string | null;
  isPublished: boolean;
  isReviewed: boolean;
  reviewedBy: string | null;
  reviewedAt: Date | null;

  // Metadata
  metadata: any;

  createdAt: Date;
  updatedAt: Date;

  // Legacy compatibility / snippet fields
  rating?: number;
  reviewCount?: number;
}

export interface SpiritOffer {
  price: number;
  priceCurrency: string; // e.g. "KRW"
  url: string;           // Purchase link
  availability: 'InStock' | 'OutOfStock' | 'Discontinued';
  sellerName?: string;   // Optional seller name (e.g. "DailyShot", "Wine-Searcher")
  updatedAt: Date;
}

export interface SpiritMetadata {
  // New Location for heavy content
  description_ko?: string;
  pairing_guide_ko?: string;

  /** [Global] Localized Content */
  description_en?: string | null;
  pairing_guide_en?: string | null;

  enriched_at?: string;

  // Primary Offer for GSC Merchant Listings
  offer?: SpiritOffer;

  // Aggregate Rating for SEO Rich Snippets
  aggregateRating?: {
    ratingValue: number; // e.g., 4.7
    reviewCount: number;  // e.g., 12
    bestRating?: number;  // default 5
    worstRating?: number; // default 1
  };

  // Original/Raw metadata
  raw_category?: string;
  importer?: string;
  [key: string]: any;
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
  imageUrls?: string[]; // Up to 3 user-uploaded images
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
  noImage?: boolean;
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
