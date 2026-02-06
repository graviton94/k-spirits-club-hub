# 📊 K-Spirits Club - Data Schema Documentation

## 📋 Overview
K-Spirits Club의 데이터 스키마는 Firebase Firestore를 기반으로 설계되었으며, TypeScript 타입 시스템과 완벽하게 통합되어 있습니다. 모든 스키마 정의는 `lib/db/schema.ts`에서 관리됩니다.

---

## 🗄️ Firestore Collections

### **Collection Structure**
```
firestore/
├── spirits/                    # 주류 데이터 (메인 컬렉션)
├── search_index/               # 검색 인덱스 (압축된 데이터)
├── users/                      # 사용자 프로필
│   └── {userId}/
│       ├── cabinet/            # 사용자 술장
│       ├── reviews/            # 사용자 리뷰
│       └── taste_data/         # AI 취향 분석
│           ├── profile         # 취향 프로필
│           └── usage           # 일일 사용량
├── reviews/                    # 전체 리뷰 (통합 컬렉션)
├── worldcup_results/           # 월드컵 게임 결과
└── modification_requests/      # 수정 요청
```

---

## 📝 Core Data Types

### **1. Spirit (주류 데이터)**
```typescript
interface Spirit {
  // 기본 정보
  id: string;                   // 고유 ID (Firestore 문서 ID)
  name: string;                 // 제품명 (예: "발렌타인 17년")
  distillery: string | null;    // 증류소 (예: "Ballantine's")
  bottler: string | null;       // 보틀러 (독립 보틀러의 경우)
  
  // 물성 정보
  abv: number;                  // 도수 (Alcohol By Volume, 0-100)
  volume: number | null;        // 용량 (ml)
  
  // 분류 정보
  category: string;             // 법적 분류 (예: "위스키", "소주")
  mainCategory: string | null;  // 상위 카테고리 (예: "위스키" → "버번")
  subcategory: string | null;   // 하위 분류 (예: "싱글 몰트", "블렌디드")
  country: string | null;       // 원산지 국가
  region: string | null;        // 지역 (예: "아일라", "스페이사이드")
  
  // 이미지
  imageUrl: string | null;      // 원본 이미지 URL
  thumbnailUrl: string | null;  // 썸네일 URL (검색 인덱스용)
  
  // 데이터 출처 추적
  source: 'food_safety_korea' | 'imported_food_maru' | 'online' | 'manual' | 'other';
  externalId: string | null;    // 외부 시스템 ID
  
  // 발행 상태
  status: SpiritStatus;         // RAW | ENRICHED | READY_FOR_CONFIRM | PUBLISHED | ERROR
  isPublished: boolean;         // 사용자에게 노출 여부
  isReviewed: boolean;          // 관리자 검수 완료 여부
  reviewedBy: string | null;    // 검수자 UID
  reviewedAt: Date | null;      // 검수 시각
  
  // AI 보강 메타데이터
  metadata: {
    name_en?: string;           // 영문명
    raw_category?: string;      // 원본 카테고리명
    importer?: string;          // 수입사
    description?: string;       // AI 생성 설명 (한글)
    description_en?: string;    // AI 생성 설명 (영문)
    pairing_guide_en?: string;  // 페어링 가이드 (영문)
    pairing_guide_ko?: string;  // 페어링 가이드 (국문)
    nose_tags?: string[];       // 향 태그 (예: ["바닐라", "오크"])
    palate_tags?: string[];     // 맛 태그
    finish_tags?: string[];     // 피니시 태그
    tasting_note?: string;      // 통합 테이스팅 노트
    [key: string]: any;         // 확장 가능한 필드
  };
  
  // 검색 최적화
  searchKeywords?: string[];    // N-gram 키워드 배열
  
  // 타임스탬프
  createdAt: Date;
  updatedAt: Date;
}

// 상태 타입
type SpiritStatus = 
  | 'RAW'                 // 원본 데이터 수집 상태
  | 'ENRICHED'            // AI 보강 완료
  | 'READY_FOR_CONFIRM'   // 관리자 검수 대기
  | 'PUBLISHED'           // 발행 완료
  | 'ERROR'               // 오류 발생
  | 'IMAGE_FAILED';       // 이미지 수집 실패
```

**Example Document**:
```json
{
  "id": "spirit_123456",
  "name": "발렌타인 17년",
  "distillery": "Ballantine's",
  "bottler": null,
  "abv": 40,
  "volume": 700,
  "category": "위스키",
  "mainCategory": "스카치 위스키",
  "subcategory": "블렌디드",
  "country": "스코틀랜드",
  "region": null,
  "imageUrl": "https://example.com/ballantines-17.jpg",
  "thumbnailUrl": "https://example.com/ballantines-17-thumb.jpg",
  "source": "imported_food_maru",
  "externalId": "IMP-12345",
  "status": "PUBLISHED",
  "isPublished": true,
  "isReviewed": true,
  "reviewedBy": "admin_uid",
  "reviewedAt": "2026-01-15T10:00:00Z",
  "metadata": {
    "name_en": "Ballantine's 17 Years",
    "description": "깊고 복합적인 풍미를 자랑하는 프리미엄 블렌디드 위스키",
    "nose_tags": ["바닐라", "꿀", "오크"],
    "palate_tags": ["크리미", "초콜릿", "말린과일"],
    "finish_tags": ["스무스", "오크", "스파이시"]
  },
  "createdAt": "2026-01-10T08:00:00Z",
  "updatedAt": "2026-01-15T10:00:00Z"
}
```

---

### **2. SpiritSearchIndex (검색 인덱스)**
```typescript
interface SpiritSearchIndex {
  i: string;           // id (압축)
  n: string;           // name
  en: string | null;   // name_en (English name)
  c: string;           // category
  mc: string | null;   // mainCategory
  sc: string | null;   // subcategory
  t: string | null;    // thumbnailUrl
  a: number;           // abv
  d: string | null;    // distillery
  cre: string | null;  // createdAt (ISO string)
}
```

**Purpose**: 클라이언트 사이드 검색을 위한 압축된 인덱스. 전체 `spirits` 컬렉션을 100KB 이하의 JSON으로 압축하여 초기 로딩 시 1회만 다운로드합니다.

**Example**:
```json
{
  "i": "spirit_123456",
  "n": "발렌타인 17년",
  "en": "Ballantine's 17 Years",
  "c": "위스키",
  "mc": "스카치 위스키",
  "sc": "블렌디드",
  "t": "https://wsrv.nl/?url=...&w=160",
  "a": 40,
  "d": "Ballantine's",
  "cre": "2026-01-10T08:00:00Z"
}
```

---

### **3. UserCabinet (사용자 술장)**
```typescript
interface UserCabinet {
  id: string;              // 문서 ID (spiritId와 동일)
  userId: string;          // 사용자 UID
  spiritId: string;        // 참조하는 Spirit ID
  
  // 추가 정보 (빠른 조회를 위한 비정규화)
  name?: string;           // 제품명
  category?: string;       // 카테고리
  imageUrl?: string;       // 이미지 URL
  distillery?: string;     // 증류소
  
  // 상태
  isWishlist: boolean;     // 위시리스트 여부 (false = 보유, true = 위시)
  
  // 사용자 노트
  notes: string | null;    // 개인 메모
  rating: number | null;   // 개인 평점 (1-5)
  isFavorite: boolean;     // 즐겨찾기
  
  // 타임스탬프 (AI 취향 분석용)
  addedAt: Date;           // 추가 시각
  lastActivityAt?: Date;   // 마지막 활동 시각 (review createdAt || addedAt)
}
```

**Path**: `users/{userId}/cabinet/{spiritId}`

---

### **4. Review (리뷰)**
```typescript
interface Review {
  id: string;              // 고유 ID
  spiritId: string;        // 대상 Spirit ID
  userId: string;          // 작성자 UID
  userName: string;        // 작성자 닉네임 (비정규화)
  
  // 평점
  rating: number;          // 종합 평점 (1-5)
  
  // 리뷰 내용
  title: string;           // 제목
  content: string;         // 본문
  
  // 테이스팅 노트 (선택)
  nose: string | null;     // 향
  palate: string | null;   // 맛
  finish: string | null;   // 여운
  
  // 소셜
  likes?: number;          // 추천 수
  likedBy?: string[];      // 추천한 유저 UID 배열
  
  // 상태
  isActive?: boolean;      // 활성화 여부 (삭제 처리)
  isPublished: boolean;    // 발행 여부
  
  // 타임스탬프 (AI 취향 분석용)
  createdAt: Date;
  updatedAt: Date;
  
  // 사용자 리뷰에서 참조할 경우
  userReview?: {
    createdAt?: Date;      // 리뷰 작성 시간 (recency tracking)
  } | null;
}
```

**Dual Path**:
1. `users/{userId}/reviews/{reviewId}` - 사용자별 리뷰
2. `reviews/{reviewId}` - 전역 리뷰 (Spirit별 조회용)

---

### **5. UserTasteProfile (AI 취향 분석)**
```typescript
interface FlavorStats {
  woody: number;        // 우디함 (0-100)
  peaty: number;        // 피트/스모키 (0-100)
  floral: number;       // 꽃향 (0-100)
  fruity: number;       // 과일향 (0-100)
  nutty: number;        // 견과류/고소함 (0-100)
  richness: number;     // 바디감 (0-100)
}

interface UserTasteProfile {
  userId: string;
  analyzedAt: Date;     // 분석 시점
  
  stats: FlavorStats;   // 6차원 레이더 차트 데이터
  
  persona: {
    title: string;            // 페르소나 타이틀 (예: "아일라의 피트 헌터")
    description: string;      // AI 생성 설명
    keywords: string[];       // 키워드 태그 (예: ["#피트", "#CS", "#독병"])
  };
  
  recommendation: {
    spiritId: string;         // 추천 제품 ID
    name: string;             // 제품명
    matchRate: number;        // 일치도 (0-100)
    linkUrl?: string;         // 구매 링크 (선택)
  } | null;
}
```

**Path**: `users/{userId}/taste_data/profile`

**Usage Tracking**:
```typescript
// users/{userId}/taste_data/usage
interface TasteUsage {
  date: string;         // KST 날짜 (YYYY-MM-DD)
  count: number;        // 당일 분석 횟수
}
```

**Rate Limit**: 일일 3회 제한 (무료 사용자)

---

### **6. WorldCupResult (월드컵 게임 결과)**
```typescript
interface WorldCupResult {
  winner: {
    name: string;
    category: string;
    subcategory: string | null;
    distillery: string | null;
    imageUrl: string | null;
    thumbnailUrl: string | null;
    tags: string[];
  };
  category: string;       // 게임 카테고리 (예: "위스키")
  subcategory?: string;   // 세부 카테고리 (예: "싱글 몰트")
  initialRound: number;   // 초기 라운드 수 (16, 32, 64)
  timestamp: Date;        // 완료 시각
}
```

**Path**: `worldcup_results/{resultId}`

---

### **7. MbtiResult (MBTI 성향 테스트 결과)**
```typescript
interface MbtiResult {
  id: string;              // 고유 ID
  userId?: string;         // 사용자 UID (비회원 가능)
  
  // MBTI 타입
  type: string;            // 4글자 코드 (e.g., "ENFP", "ISTJ")
  
  // 결과 데이터
  result: {
    titleKo: string;       // 타입 제목 (한글)
    titleEn: string;       // 타입 제목 (영문)
    descriptionKo: string; // 설명 (한글)
    descriptionEn: string; // 설명 (영문)
    traits: string[];      // 특성 리스트
    recommendedSpirits: string[]; // 추천 주류
    icon: string;          // 이모티콘
  };
  
  // 답변 기록
  answers: string[];       // 15개 답변 배열 (e.g., ["E", "I", ...])
  
  // 타임스탬프
  completedAt: Date;       // 테스트 완료 시각
}
```

**Path**: `mbti_results/{resultId}` (optional storage)

> **Note**: MBTI 결과는 현재 Firestore에 저장하지 않고 클라이언트 사이드에서만 처리합니다. 추후 통계 분석을 위해 저장 기능을 추가할 수 있습니다.

---

### **8. ModificationRequest (수정 요청)**
```typescript
interface ModificationRequest {
  id: string;
  spiritId: string;       // 대상 Spirit ID
  spiritName: string;     // 제품명 (관리자 식별용)
  userId: string | null;  // 요청자 UID (익명 가능)
  
  // 요청 내용
  title: string;          // 제목 (예: "도수가 잘못 표기됨")
  content: string;        // 상세 설명
  
  // 상태
  status: 'pending' | 'checked' | 'resolved';
  createdAt: Date;
}
```

**Path**: `modification_requests/{requestId}`

---

## 🔄 Data Relationships

### **Spirit ↔ Review (1:N)**
```
spirits/{spiritId}
    ↓ (Referenced by)
reviews/{reviewId}.spiritId
users/{userId}/reviews/{reviewId}.spiritId
```

### **Spirit ↔ Cabinet (M:N)**
```
spirits/{spiritId}
    ↓ (Referenced by)
users/{userId}/cabinet/{spiritId}
```

### **User ↔ TasteProfile (1:1)**
```
users/{userId}
    ↓ (Has one)
users/{userId}/taste_data/profile
```

---

## 📐 Data Size & Performance

### **Collection Sizes (Estimated)**
| Collection | Documents | Avg Size | Total Size |
|-----------|-----------|----------|------------|
| `spirits` | 100,000+ | 5 KB | ~500 MB |
| `search_index` | 1 | 100 KB | 100 KB |
| `users` | 10,000+ | 1 KB | ~10 MB |
| `reviews` | 50,000+ | 2 KB | ~100 MB |
| `worldcup_results` | 100,000+ | 1 KB | ~100 MB |

### **Read Patterns**
| Pattern | Frequency | Strategy |
|---------|-----------|----------|
| **Search Index Load** | 1x per session | Cache in React Context |
| **Spirit Detail** | High | ISR (30s cache) |
| **Review List** | Medium | Server-side pagination |
| **Cabinet Sync** | Low | Client-side caching |

### **Write Patterns**
| Pattern | Frequency | Strategy |
|---------|-----------|----------|
| **Add to Cabinet** | Medium | Optimistic UI update |
| **Write Review** | Low | Server Action |
| **AI Analysis** | Low | Rate-limited API |

---

## 🔍 Indexing Strategy

### **Firestore Indexes** (`firestore.indexes.json`)
```json
{
  "indexes": [
    {
      "collectionGroup": "spirits",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "isPublished", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "reviews",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "spiritId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

### **Client-Side Search (Fuse.js)**
```typescript
// lib/context/spirits-cache-context.tsx
const fuseOptions = {
  keys: ['n', 'en', 'd', 'c'],  // name, name_en, distillery, category
  threshold: 0.3,               // 70% 유사도
  ignoreLocation: true,
  minMatchCharLength: 2
};
```

---

## 🛠️ Data Migration & Validation

### **Schema Validation**
모든 데이터는 `lib/db/schema.ts`의 TypeScript 타입으로 검증됩니다.

### **Migration Scripts**
- `scripts/migrate_to_firestore.js` - 로컬 JSON → Firestore 마이그레이션
- `scripts/publish-ready-data.ts` - 일괄 발행 스크립트

### **Data Recovery**
- `DATA_RECOVERY_GUIDE.md` - 데이터 복구 가이드
- `data/processed_batches/` - 오프라인 모드 백업

---

## 📚 Related Documentation

- [TECH_STACK.md](./TECH_STACK.md) - 기술 스택 및 아키텍처
- [API_ENDPOINTS.md](./API_ENDPOINTS.md) - API 엔드포인트
- [CODE_FLOW.md](./CODE_FLOW.md) - 코드 플로우

---

**Last Updated**: 2026-02-06  
**Schema Version**: 1.0.0
