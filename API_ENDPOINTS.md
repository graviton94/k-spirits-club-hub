# 🔌 K-Spirits Club - API Endpoints Documentation

## 📋 Overview
K-Spirits Club의 모든 API는 Edge Runtime에서 실행되며, Firebase Firestore REST API를 통해 데이터를 처리합니다.

---

## 🗂️ API Categories

### **1. Spirits (주류 데이터)**
### **2. Cabinet (사용자 술장)**
### **3. Reviews (리뷰 시스템)**
### **4. AI Analysis (AI 취향 분석)**
### **5. Admin (관리자 전용)**
### **6. Utility (유틸리티)**

---

## 1️⃣ Spirits API

### `GET /api/spirits`
발행된 주류 리스트를 조회합니다.

**Query Parameters:**
```typescript
{
  category?: string;      // 카테고리 필터 (예: "위스키")
  subcategory?: string;   // 서브카테고리 필터
  page?: number;          // 페이지 번호 (기본: 1)
  pageSize?: number;      // 페이지 크기 (기본: 20)
}
```

**Response:**
```typescript
{
  data: Spirit[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

**Example:**
```bash
GET /api/spirits?category=위스키&page=1&pageSize=20
```

---

### `GET /api/spirits/[id]`
특정 주류의 상세 정보를 조회합니다.

**Response:**
```typescript
{
  spirit: Spirit;
}
```

**Error Codes:**
- `404`: 존재하지 않는 ID
- `403`: 미발행 제품 (관리자 전용)

---

### `GET /api/spirits/search`
검색 인덱스를 반환합니다. (클라이언트 사이드 검색용)

**Response:**
```typescript
{
  index: SpiritSearchIndex[];
  timestamp: string;
}
```

**Cache:** 30초 ISR

---

## 2️⃣ Cabinet API

### `GET /api/cabinet`
사용자의 술장을 조회합니다.

**Headers:**
```
x-user-id: string (required)
```

**Response:**
```typescript
{
  cabinet: CabinetItem[];
}
```

---

### `POST /api/cabinet`
술장에 제품을 추가합니다.

**Headers:**
```
x-user-id: string (required)
```

**Body:**
```typescript
{
  spiritId: string;
  isWishlist: boolean;
  notes?: string;
  rating?: number;
}
```

**Response:**
```typescript
{
  success: true;
}
```

---

### `DELETE /api/cabinet/[spiritId]`
술장에서 제품을 제거합니다.

**Headers:**
```
x-user-id: string (required)
```

**Response:**
```typescript
{
  success: true;
}
```

---

## 3️⃣ Reviews API

### `GET /api/reviews`
특정 제품의 리뷰 목록을 조회합니다.

**Query Parameters:**
```typescript
{
  spiritId?: string;      // 제품별 필터
  userId?: string;        // 사용자별 필터
  page?: number;
  pageSize?: number;
}
```

**Response:**
```typescript
{
  reviews: Review[];
  total: number;
  page: number;
  pageSize: number;
}
```

---

### `POST /api/reviews`
새 리뷰를 작성합니다.

**Headers:**
```
x-user-id: string (required)
```

**Body:**
```typescript
{
  spiritId: string;
  spiritName: string;
  rating: number;         // 1-5
  title: string;
  content: string;
  nose?: string;
  palate?: string;
  finish?: string;
  tagsN?: string[];      // Nose tags (enhanced input system)
  tagsP?: string[];      // Palate tags (enhanced input system)
  tagsF?: string[];      // Finish tags (enhanced input system)
}
```

**Response:**
```typescript
{
  success: true;
  reviewId: string;
}
```

---

### `PATCH /api/reviews/[id]`
리뷰를 수정합니다.

**Headers:**
```
x-user-id: string (required)
```

**Body:**
```typescript
{
  title?: string;
  content?: string;
  rating?: number;
  // 기타 수정 가능 필드
}
```

**Authorization:** 본인 리뷰만 수정 가능

---

### `DELETE /api/reviews/[id]`
리뷰를 삭제합니다 (soft delete).

**Headers:**
```
x-user-id: string (required)
```

**Authorization:** 본인 리뷰만 삭제 가능

---

### `POST /api/reviews/[id]/like`
리뷰에 추천을 추가/취소합니다.

**Headers:**
```
x-user-id: string (required)
```

**Response:**
```typescript
{
  success: true;
  liked: boolean;       // true: 추천 추가, false: 추천 취소
  totalLikes: number;
}
```

---

## 4️⃣ AI Analysis API

### `GET /api/analyze-taste`
사용자의 취향 분석 결과와 사용량을 조회합니다.

**Query Parameters:**
```typescript
{
  userId: string;
}
```

**Response:**
```typescript
{
  profile: UserTasteProfile | null;
  usage: {
    date: string;       // YYYY-MM-DD (KST)
    count: number;      // 오늘 분석 횟수
    remaining: number;  // 남은 횟수 (3 - count)
  }
}
```

---

### `POST /api/analyze-taste`
AI 취향 분석을 실행합니다.

**Body:**
```typescript
{
  userId: string;
}
```

**Response:**
```typescript
{
  success: true;
  profile: UserTasteProfile;
  usage: {
    date: string;
    count: number;
    remaining: number;
  }
}
```

**Rate Limit:** 일일 3회 (사용자당)

**Error Codes:**
- `429`: 일일 한도 초과
- `400`: 분석할 데이터 부족 (최소 1개 이상의 술장 아이템 필요)
- `500`: AI 분석 실패

**Processing Time:** 약 5-15초

**AI Enhancements (2026-02)**:
- **Recency Weighting**: 최근 7일 내 추가/리뷰한 술을 더 높게 반영
- **Temperature 0.7**: 다양하고 독창적인 추천을 위한 생성 파라미터 상향
- **Dynamic Profile Detection**: 최근 활동이 기존 취향과 다를 경우 변화를 감지 및 반영

---

## 5️⃣ Admin API

### `GET /api/admin/spirits`
관리자 대시보드용 전체 주류 리스트를 조회합니다.

**Headers:**
```
x-user-id: string (required, admin role)
```

**Query Parameters:**
```typescript
{
  status?: SpiritStatus;
  category?: string;
  noImage?: boolean;      // 이미지 없는 제품만
  page?: number;
  pageSize?: number;
}
```

**Response:**
```typescript
{
  data: Spirit[];
  total: number;
  page: number;
  pageSize: number;
}
```

---

### `PATCH /api/admin/spirits/[id]`
주류 정보를 수정합니다.

**Headers:**
```
x-user-id: string (required, admin role)
```

**Body:**
```typescript
{
  name?: string;
  category?: string;
  abv?: number;
  status?: SpiritStatus;
  isPublished?: boolean;
  // 기타 수정 가능 필드
}
```

---

### `POST /api/admin/spirits/[id]/publish`
주류를 발행합니다.

**Headers:**
```
x-user-id: string (required, admin role)
```

**Response:**
```typescript
{
  success: true;
}
```

---

### `GET /api/admin/stats`
관리자 통계를 조회합니다.

**Response:**
```typescript
{
  totalSpirits: number;
  publishedSpirits: number;
  pendingReview: number;
  totalReviews: number;
  totalUsers: number;
}
```

---

## 6️⃣ Utility API

### `GET /api/users/stats`
사용자 통계를 조회합니다.

**Headers:**
```
x-user-id: string (required)
```

**Response:**
```typescript
{
  reviewCount: number;
  totalLikes: number;
  cabinetCount: number;
}
```

---

### `POST /api/modification-request`
제품 정보 수정 요청을 제출합니다.

**Body:**
```typescript
{
  spiritId: string;
  spiritName: string;
  userId: string | null;  // 익명 가능
  title: string;
  content: string;
}
```

**Response:**
```typescript
{
  success: true;
  requestId: string;
}
```

---

## 🔐 Authentication & Authorization

### **Headers**
모든 인증이 필요한 API는 다음 헤더를 요구합니다:
```
x-user-id: string
```

### **Role-Based Access**
- **GUEST**: 읽기 전용
- **USER**: CRUD (본인 데이터)
- **ADMIN**: 전체 데이터 관리

### **Firebase Auth Token**
클라이언트에서는 Firebase Auth Token을 사용하여 인증합니다:
```typescript
const token = await user.getIdToken();
const userId = user.uid;

fetch('/api/cabinet', {
  headers: {
    'x-user-id': userId
  }
});
```

---

## ⚡ Performance & Caching

### **ISR (Incremental Static Regeneration)**
| Endpoint | Revalidate | Strategy |
|----------|------------|----------|
| `/api/spirits/search` | 30s | Static with revalidation |
| `/api/spirits/[id]` | 1h | On-demand ISR |
| `/api/reviews` | 60s | Static with revalidation |

### **Edge Caching**
- Cloudflare Pages는 자동으로 정적 응답을 캐싱합니다
- `Cache-Control` 헤더를 통해 TTL 제어

---

## 🚨 Error Handling

### **Standard Error Response**
```typescript
{
  error: string;          // 에러 메시지
  details?: string;       // 상세 정보 (개발 모드)
  code?: string;          // 에러 코드
}
```

### **HTTP Status Codes**
- `200`: 성공
- `201`: 생성 성공
- `400`: 잘못된 요청
- `401`: 인증 필요
- `403`: 권한 없음
- `404`: 리소스 없음
- `429`: Rate Limit 초과
- `500`: 서버 에러

---

## 📊 Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/analyze-taste` | 3회 | 24시간 (KST) |
| `/api/reviews` (POST) | 10회 | 1시간 |
| 기타 모든 API | 무제한 | - |

---

## 🔄 Data Consistency

### **Dual Path Strategy (Reviews)**
리뷰는 2곳에 저장됩니다:
1. `users/{userId}/reviews/{reviewId}` - 사용자별 조회
2. `reviews/{reviewId}` - Spirit별 조회

트랜잭션으로 동기화를 보장합니다.

### **Eventual Consistency**
- 검색 인덱스는 30초마다 재생성
- 통계는 실시간이 아닌 캐시된 값 사용

---

## 🧪 Testing Examples

### **cURL**
```bash
# 검색 인덱스 조회
curl https://k-spirits.club/api/spirits/search

# 제품 상세 조회
curl https://k-spirits.club/api/spirits/spirit_123456

# 술장에 추가
curl -X POST https://k-spirits.club/api/cabinet \
  -H "x-user-id: user_abc123" \
  -H "Content-Type: application/json" \
  -d '{"spiritId":"spirit_123456","isWishlist":false}'

# AI 분석 실행
curl -X POST https://k-spirits.club/api/analyze-taste \
  -H "Content-Type: application/json" \
  -d '{"userId":"user_abc123"}'
```

### **JavaScript Fetch**
```javascript
// 검색 인덱스 로드
const response = await fetch('/api/spirits/search');
const { index } = await response.json();

// 술장 조회
const cabinet = await fetch('/api/cabinet', {
  headers: {
    'x-user-id': user.uid
  }
});

// 리뷰 작성
const review = await fetch('/api/reviews', {
  method: 'POST',
  headers: {
    'x-user-id': user.uid,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    spiritId: 'spirit_123456',
    spiritName: '발렌타인 17년',
    rating: 5,
    title: '훌륭한 위스키',
    content: '부드럽고 깊은 맛이 일품입니다.'
  })
});
```

---

## 📚 Related Documentation

- [DATA_SCHEMA.md](./DATA_SCHEMA.md) - 데이터 스키마
- [TECH_STACK.md](./TECH_STACK.md) - 기술 스택
- [CODE_FLOW.md](./CODE_FLOW.md) - 코드 플로우

---

**Last Updated**: 2026-02-06  
**API Version**: 1.0.0
