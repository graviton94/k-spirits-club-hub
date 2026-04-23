# 🏗️ K-Spirits Club - Technology Stack & Architecture

## 📋 Overview
K-Spirits Club은 Next.js 15 기반의 풀스택 웹 애플리케이션으로, OpenNext를 통해 Cloudflare Workers에서 Edge Runtime으로 실행됩니다. Firebase Data Connect를 백엔드로 사용하며, Python 기반의 데이터 파이프라인으로 주류 정보를 수집·가공·배포합니다.

---

## 🎯 Core Technology Stack

### **Frontend**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 15.1.x | 메타 프레임워크 (App Router, i18n) |
| **React** | 19.x | UI 컴포넌트 라이브러리 (Server Actions) |
| **TypeScript** | 5.x | 타입 안정성 및 IntelliSense |
| **Tailwind CSS** | 4.x | 차세대 유틸리티 기반 스타일링 |
| **Negotiator** | 0.6.3 | 언어 감지 및 Content Negotiation |
| **Intl Matcher** | 0.5.x | i18n Locale 매칭 로직 |

### **Backend & Infrastructure**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Cloudflare Workers** | Latest | 글로벌 Edge Runtime 호스팅 |
| **@opennextjs/cloudflare** | 1.19.x | Next.js to Workers 번들/배포 어댑터 |
| **Edge Runtime** | - | 서버리스 API 처리 |
| **Firebase Auth** | 12.8.0 | 사용자 인증 (Google OAuth) |
| **Firebase Data Connect** | - | 관계형 SQL 데이터베이스 (PostgreSQL) |
| **GraphQL API** | Generated | 타입 안정성이 보장된 데이터 쿼리 레이어 |

### **AI & Data Processing**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Google GenAI** | Latest | Gemini 2.0 Flash API (v1 SDK) |
| **Python** | 3.10+ | 데이터 수립 및 자동 보강 파이프라인 (pipeline) |
| **Fuse.js** | 7.x | 클라이언트 사이드 퍼지 검색 (i18n 지원) |
| **Cheerio** | 1.x | HTML 파싱 및 웹 스크레이핑 |

### **Developer Tools**
| Tool | Purpose |
|------|---------|
| **Firebase CLI** | Data Connect 관리 및 스키마 배포 |
| **Graphify** | 코드베이스 지식 그래프 및 정적 분석 |
| **Sharp** | 이미지 최적화 |

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
                              │ HTTPS / WSS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│       CLOUDFLARE WORKERS (OpenNext Edge Network)             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Static SSG  │  │  Edge APIs   │  │  ISR Cache   │      │
│  │   (Next.js)  │  │  (Serverless)│  │  (30s-1h)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ GraphQL (Data Connect SDK)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│          FIREBASE DATA CONNECT (Google Cloud)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │  Auth Users  │  │  Storage     │      │
│  │ (Cloud SQL)  │  │  (OAuth)     │  │  (Images)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ Relational Sync
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
│   │   ├── data-connect-client.ts # Unified Data Connect Client
│   │   └── schema.ts             # TypeScript 스키마 및 타입
│   ├── utils/                    # 유틸리티 함수
│   │   ├── image-optimization.ts # 이미지 최적화 (wsrv.nl)
│   │   ├── image-fallback.ts     # 카테고리별 폴백 이미지
│   │   ├── spirit-page-resolver.ts # 페이지 접근 권한 관리
│   │   └── ui-text.ts           # 다국어 UI 텍스트
│   ├── services/                 # 외부 서비스 연동
│   │   └── gemini-translation.ts # Gemini AI 번역 및 보강
│   ├── constants/                # 상수 정의
│   └── hooks/                    # Custom React Hooks
│
├── dataconnect/                  # Firebase Data Connect 설정
│   ├── schema/                   # PostgreSQL 스키마 정의 (GQL)
│   └── main/                     # 쿼리 및 뮤테이션 정의
│
├── scripts/                      # 데이터 파이프라인 (pipeline)
│   ├── fetch_food_safety.py      # 공공 API 수집 스크립트
│   ├── run_pipeline.py           # AI 보강 파이프라인
│   └── publish-ready-data.ts     # 일괄 발행 및 동기화
│
├── docs/                         # 현대화된 기술 문서
│   ├── plans/                    # 아카이브 패치 플랜
│   ├── architecture/             # Graphify 및 시스템 구조
│   └── context/                  # AI 교육용 코드 번들
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

### **1. 데이터 수집 및 처리 (Relational Pipeline)**
```
공공 API (식품안전나라)
    ↓
fetch_food_safety.py (데이터 수집)
    ↓
data/raw_imported/*.json (원본 저장)
    ↓
run_pipeline.py (AI 분석 + 이미지 검색)
    ↓ 
Data Connect (spirits 테이블, isPublished: false)
    ↓
Admin Dashboard (검수 및 승인)
    ↓
publish-ready-data.ts (일괄 발행 & GQL Sync)
    ↓
PostgreSQL (isPublished: true)
```

### **2. 사용자 요청 처리 (Next.js App)**
```
Client Request
    ↓
Cloudflare Edge (Caching)
    ↓
Next.js Server Component (SSR/SSG)
    ↓
Data Connect SDK (GraphQL)
    ↓
PostgreSQL (Relational SQL)
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
- **Data Connect SDK**: GraphQL 기반의 점진적 타입 안정성 및 고속 쿼리 실행
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
- **Platform**: Cloudflare Workers (OpenNext)
- **Domain**: `k-spirits.club`
- **SSL**: Cloudflare Universal SSL (자동)
- **CDN**: 전 세계 300+ PoP (Point of Presence)

### **Build Process**
```bash
# 1. OpenNext 빌드 (내부적으로 Next.js build 포함)
npm run worker:build

# 2. Cloudflare Workers 배포
npm run worker:deploy
```

### **Environment Variables**
| Variable | Purpose | Location |
|----------|---------|----------|
| `FIREBASE_PROJECT_ID` | Firebase 프로젝트 ID | Cloudflare Workers Variables |
| `GEMINI_API_KEY` | Google AI API 키 | Cloudflare Workers Secrets |
| `NEXT_PUBLIC_BASE_URL` | 사이트 기본 URL | `.env.local` |
| `FOOD_SAFETY_KOREA_API_KEY` | 공공 API 키 | `.env` (로컬) |

전체 키 정의/스코프/Secret 분류는 [docs/deployment/ENVIRONMENT_VARIABLES_WORKER.md](./docs/deployment/ENVIRONMENT_VARIABLES_WORKER.md) 기준으로 관리합니다.

---

## 📚 Related Documentation

- [DATA_SCHEMA.md](./DATA_SCHEMA.md) - 데이터베이스 스키마 및 타입 정의
- [API_ENDPOINTS.md](./API_ENDPOINTS.md) - API 엔드포인트 상세 문서
- [CODE_FLOW.md](./CODE_FLOW.md) - 주요 기능별 코드 플로우
- [DEVELOPMENT.md](./DEVELOPMENT.md) - 개발 가이드 및 컨벤션

---

**Last Updated**: 2026-02-07  
**Version**: 1.0.0 (Production Global)
