# 🏗️ K-Spirits Club - Technology Stack & Architecture

## 📋 Overview
K-Spirits Club은 Next.js 15 기반의 풀스택 웹 애플리케이션으로, Cloudflare Pages에서 Edge Runtime으로 실행됩니다. Firebase를 백엔드로 사용하며, Python 기반의 데이터 파이프라인으로 주류 정보를 수집·가공·배포합니다.

---

## 🎯 Core Technology Stack

### **Frontend**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 15.1.4 | React 메타 프레임워크 (App Router) |
| **React** | 19.2.3 | UI 컴포넌트 라이브러리 |
| **TypeScript** | 5.9.3 | 타입 안정성 및 개발 생산성 |
| **Tailwind CSS** | 4.1.18 | 유틸리티 기반 스타일링 |
| **Framer Motion** | 12.29.0 | 애니메이션 및 인터랙션 |
| **Lucide React** | 0.563.0 | 아이콘 시스템 |
| **Recharts** | 3.7.0 | 데이터 시각화 (Taste DNA 차트) |
| **html-to-image** | 1.11.11 | 결과 이미지 생성 (MBTI, World Cup) |

### **Backend & Infrastructure**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Cloudflare Pages** | Latest | 글로벌 CDN 호스팅 |
| **Edge Runtime** | - | 서버리스 API 처리 |
| **Firebase Auth** | 12.8.0 | 사용자 인증 (Google OAuth) |
| **Firebase Firestore** | 12.8.0 | NoSQL 데이터베이스 |
| **Firebase Admin SDK** | 13.6.0 | 서버 사이드 Firebase 제어 |

### **AI & Data Processing**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Google Gemini 2.0 Flash** | Latest | AI 데이터 보강 및 취향 분석 |
| **Python** | 3.x | 데이터 파이프라인 스크립트 |
| **Axios** | 1.13.2 | HTTP 클라이언트 (이미지 검색) |
| **Cheerio** | 1.2.0 | HTML 파싱 (웹 스크레이핑) |

### **Developer Tools**
| Tool | Purpose |
|------|---------|
| **ESLint** | 코드 품질 검사 |
| **Sharp** | 이미지 최적화 |
| **vercel CLI** | 배포 테스트 |
| **@cloudflare/next-on-pages** | Cloudflare Pages 어댑터 |

---

## 🏛️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ React Pages  │  │  Lite Search │  │  Auth State  │      │
│  │ (App Router) │  │  (Fuse.js)   │  │  (Firebase)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│            CLOUDFLARE PAGES (Edge Network)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Static SSG  │  │  Edge APIs   │  │  ISR Cache   │      │
│  │   (Next.js)  │  │  (Serverless)│  │  (30s-1h)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ Firebase REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 FIREBASE (Google Cloud)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Firestore   │  │  Auth Users  │  │  Storage     │      │
│  │  (NoSQL DB)  │  │  (OAuth)     │  │  (Images)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ Upload
                              ▼
┌─────────────────────────────────────────────────────────────┐
│             DATA PIPELINE (Python Scripts)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  1. fetch_food_safety.py  (공공 API 수집)            │   │
│  │  2. run_pipeline.py       (AI 보강 + 배치 업로드)    │   │
│  │  3. publish-ready-data.ts (관리자 승인 후 발행)      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Directory Structure

```
k-spirits-club-hub/
├── app/                          # Next.js App Router
│   ├── [lang]/                   # 다국어 라우팅 (ko/en)
│   │   ├── (features)/           # 주요 기능 페이지
│   │   │   ├── admin/            # 관리자 대시보드
│   │   │   ├── cabinet/          # 나의 술장
│   │   │   ├── explore/          # 리스트 탐색
│   │   │   ├── spirits/[id]/     # 제품 상세
│   │   │   ├── me/               # 마이페이지
│   │   │   └── contents/         # 특별 콘텐츠
│   │   │       ├── worldcup/     # 주류 월드컵
│   │   │       ├── perfect-pour/ # 소맥 게임
│   │   │       ├── mbti/         # MBTI 주류 성향 테스트
│   │   │       └── taste/result/ # AI 취향 분석 결과
│   │   ├── layout.tsx            # 언어별 레이아웃
│   │   └── page.tsx              # 언어별 홈페이지
│   ├── api/                      # Edge API Routes
│   │   ├── spirits/              # 주류 데이터 CRUD
│   │   ├── reviews/              # 리뷰 시스템
│   │   ├── cabinet/              # 사용자 술장 관리
│   │   ├── analyze-taste/        # AI 취향 분석
│   │   └── users/                # 사용자 통계
│   ├── actions/                  # Server Actions
│   │   ├── cabinet.ts            # 술장 액션
│   │   └── reviews.ts            # 리뷰 액션
│   ├── context/                  # React Contexts
│   │   ├── auth-context.tsx      # 인증 상태 관리
│   │   └── spirits-cache-context.tsx # 검색 인덱스 캐싱
│   └── globals.css               # 글로벌 스타일
│
├── components/                   # React 컴포넌트
│   ├── layout/                   # 레이아웃 컴포넌트
│   │   ├── Header.tsx            # 상단 네비게이션
│   │   └── BottomNav.tsx         # 하단 네비게이션
│   ├── ui/                       # UI 컴포넌트
│   │   ├── ExploreCard.tsx       # 리스트 카드
│   │   ├── SpiritCard.tsx        # 제품 카드
│   │   ├── SpiritDetailModal.tsx # 상세 모달
│   │   ├── LiveReviews.tsx       # 실시간 리뷰
│   │   └── FilterPanel.tsx       # 필터 패널
│   ├── cabinet/                  # 술장 관련
│   │   ├── MyCabinet.tsx         # 술장 메인
│   │   ├── CabinetSpiritCard.tsx # 술장 카드
│   │   ├── SearchSpiritModal.tsx # 검색 모달
│   │   ├── TasteRadar.tsx        # 취향 레이더 차트
│   │   └── TastePublicReport.tsx # 취향 분석 리포트
│   ├── admin/                    # 관리자 전용
│   └── profile/                  # 프로필 관련
│
├── lib/                          # 핵심 라이브러리
│   ├── db/                       # 데이터베이스 레이어
│   │   ├── firestore-rest.ts     # Firestore REST API
│   │   ├── firebase.ts           # Client Firebase
│   │   └── schema.ts             # TypeScript 스키마
│   ├── utils/                    # 유틸리티 함수
│   │   ├── image-optimization.ts # 이미지 최적화 (wsrv.nl)
│   │   ├── image-fallback.ts     # 카테고리별 폴백 이미지
│   │   ├── spirit-adapters.ts    # 데이터 어댑터
│   │   ├── aiPromptBuilder.ts    # AI 프롬프트 생성
│   │   └── ui-text.ts           # 다국어 UI 텍스트
│   ├── constants/                # 상수 정의
│   │   ├── mbti-data.ts          # MBTI 질문 및 결과 데이터
│   │   └── categories.ts         # 카테고리 상수
│   └── hooks/                    # Custom React Hooks
│
├── scripts/                      # Python 데이터 파이프라인
│   ├── fetch_food_safety.py      # 공공 API 수집 스크립트
│   ├── run_pipeline.py           # AI 보강 파이프라인
│   ├── publish-ready-data.ts     # 일괄 발행 스크립트
│   └── migrate_to_firestore.js   # 데이터 마이그레이션
│
├── data/                         # 데이터 저장소
│   ├── raw_imported/             # 원본 데이터
│   ├── temp_pipeline/            # 파이프라인 임시 파일
│   └── processed_batches/        # 오프라인 모드 배치
│
├── public/                       # 정적 리소스
│   ├── icons/                    # 아이콘 이미지
│   ├── og-taste-dna.png          # OG 이미지
│   └── mys-[1-5].webp            # 카테고리 폴백 이미지
│
└── Documentation/                # 기술 문서
    ├── README.md                 # 프로젝트 소개
    ├── TECH_STACK.md            # 기술 스택 (이 문서)
    ├── DATA_SCHEMA.md           # 데이터 스키마
    ├── API_ENDPOINTS.md         # API 문서
    └── CODE_FLOW.md             # 코드 플로우
```

---

## 🔄 Data Flow Architecture

### **1. 데이터 수집 및 처리 (Python Pipeline)**
```
공공 API (식품안전나라)
    ↓
fetch_food_safety.py (데이터 수집)
    ↓
data/raw_imported/*.json (원본 저장)
    ↓
run_pipeline.py (AI 분석 + 이미지 검색)
    ↓ 
Firestore (spirits 컬렉션, isPublished: false)
    ↓
Admin Dashboard (검수 및 승인)
    ↓
publish-ready-data.ts (일괄 발행)
    ↓
Firestore (isPublished: true) + search_index
```

### **2. 사용자 요청 처리 (Next.js App)**
```
Client Request
    ↓
Cloudflare Edge (Caching)
    ↓
Next.js Server Component (SSR/SSG)
    ↓
Firebase REST API (Firestore)
    ↓
Response (HTML/JSON)
    ↓
Client Rendering (Framer Motion)
```

### **3. 검색 시스템 (Hybrid Approach)**
```
Full Data Load (1회, 앱 초기화)
    ↓
search_index (compressed JSON, 100KB)
    ↓
React Context (SpiritsCacheContext)
    ↓
Fuse.js (클라이언트 사이드 검색)
    ↓
Instant Results (no server call)
```

---

## 🚀 Performance Optimizations

### **Frontend**
- **Image Optimization**: `wsrv.nl` 프록시를 통한 on-the-fly WebP 변환 및 리사이징
- **Lazy Loading**: 모든 이미지에 `loading="lazy"` 속성 적용
- **Code Splitting**: Next.js 자동 코드 분할 (route-based)
- **React Server Components**: 서버에서 pre-render하여 초기 로딩 속도 향상
- **ISR (Incremental Static Regeneration)**: 30초~1시간 캐싱 전략

### **Backend**
- **Edge Runtime**: Cloudflare의 300+ 글로벌 데이터센터에서 실행
- **Firestore REST API**: Firebase Admin SDK 대신 REST API로 Edge 호환성 확보
- **Search Index Caching**: 검색 인덱스를 JSON으로 압축하여 100KB 이하로 유지
- **Batch Processing**: 대량 데이터 업로드 시 10개 단위 배치 처리

### **Data Pipeline**
- **Offline Mode**: API 할당량 초과 시 로컬 파일 시스템에 임시 저장
- **Resume Capability**: 중단된 배치부터 자동 재개
- **Smart Image Search**: 제품명 분석 후 공식 이미지 자동 수집
- **AI Rate Limiting**: Gemini API 호출 속도 제한 (10 RPM)
- **AI Temperature Optimization**: 취향 분석 시 0.7로 설정하여 다양성 확보

---

## 🔐 Security & Authentication

### **Firebase Authentication**
- **Google OAuth**: 원클릭 로그인
- **Guest Mode**: 비회원 탐색 허용
- **Role-Based Access**: `ADMIN`, `USER`, `GUEST` 역할 분리
- **Service Account**: 서버 사이드에서 Firebase Admin 권한 사용

### **API Security**
- **Edge Runtime**: 클라이언트에서 직접 API 키 노출 방지
- **CORS**: Cloudflare Pages 도메인만 허용
- **Rate Limiting**: AI 분석 API는 사용자당 일일 3회 제한
- **Data Validation**: TypeScript 스키마 검증 (`lib/db/schema.ts`)

### **Multi-Language Support**
- **Dynamic Routing**: URL 기반 언어 전환 (`/ko/*`, `/en/*`)
- **Metadata Generation**: `generateMetadata` 함수로 언어별 SEO 최적화
- **UI Text Dictionary**: `lib/utils/ui-text.ts`의 `UI_TEXT` 객체로 모든 레이블 관리
- **Middleware**: 브라우저 언어 감지 후 자동 리다이렉트

---

## 📊 Monitoring & Analytics

### **User Analytics**
- **Google Tag Manager**: GTM-NDF5RKBN
- **Google Analytics 4**: G-0QF9WTQFF2
- **Microsoft Clarity**: vag1ydm09c (히트맵 분석)

### **AdSense**
- **Publisher ID**: ca-pub-5574169833640769
- **Sticky Footer Ad**: 모바일 하단 고정 광고
- **Native Ads**: 콘텐츠 내 네이티브 광고 (예정)

### **Error Tracking**
- **Console Logging**: 서버/클라이언트 에러 로그
- **Firestore Logs**: 데이터 파이프라인 실행 로그
- **Cloudflare Analytics**: 엣지 레벨 성능 모니터링

---

## 🌐 Deployment Strategy

### **Production Environment**
- **Platform**: Cloudflare Pages
- **Domain**: `k-spirits.club`
- **SSL**: Cloudflare Universal SSL (자동)
- **CDN**: 전 세계 300+ PoP (Point of Presence)

### **Build Process**
```bash
# 1. Next.js 빌드
npm run build

# 2. Cloudflare Pages 어댑터 적용
npm run pages:build

# 3. Cloudflare Pages 배포
npx wrangler pages deploy .next/out
```

### **Environment Variables**
| Variable | Purpose | Location |
|----------|---------|----------|
| `FIREBASE_PROJECT_ID` | Firebase 프로젝트 ID | Cloudflare Pages |
| `GEMINI_API_KEY` | Google AI API 키 | Cloudflare Pages |
| `NEXT_PUBLIC_BASE_URL` | 사이트 기본 URL | `.env.local` |
| `FOOD_SAFETY_KOREA_API_KEY` | 공공 API 키 | `.env` (로컬) |

---

## 📚 Related Documentation

- [DATA_SCHEMA.md](./DATA_SCHEMA.md) - 데이터베이스 스키마 및 타입 정의
- [API_ENDPOINTS.md](./API_ENDPOINTS.md) - API 엔드포인트 상세 문서
- [CODE_FLOW.md](./CODE_FLOW.md) - 주요 기능별 코드 플로우
- [DEVELOPMENT.md](./DEVELOPMENT.md) - 개발 가이드 및 컨벤션

---

**Last Updated**: 2026-02-06  
**Version**: 1.0.0 (Production)
