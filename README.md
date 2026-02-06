# 🥃 K-Spirits Club

<div align="center">

![Status](https://img.shields.io/badge/Status-v1.0.0_Production_Global-green)
![Tech](https://img.shields.io/badge/Stack-Next.js_15_|_Cloudflare_|_Tailwind_4-black)
![AI](https://img.shields.io/badge/AI-Gemini_2.0_Flash_Sommelier-purple)
![Performance](https://img.shields.io/badge/Performance-CLS_0_|_LCP_Optimized-orange)

**대한민국 대표 주류 데이터베이스 & 커뮤니티 플랫폼 (Global Standard)**

[🌐 Live Demo](https://k-spirits.club) | [📖 Docs](./TECH_STACK.md) | [🚀 Getting Started](#-quick-start)

</div>

---

## 📋 Overview

**K-Spirits Club**은 전 세계 주류 정보를 집대성하고, 사용자에게 개인화된 "디지털 술장" 경험을 제공하는 풀스택 웹 애플리케이션입니다.

### **핵심 가치**
- 🌍 **Global Localization**: Next.js 15 Middleware 기반 다국어 라우팅 및 딕셔너리 주입
- 🤖 **AI Sommelier**: Gemini 2.0 Flash를 활용한 순차적 데이터 보강 (Audit -> Sensory -> Pairing)
- ⚡ **Zero Layout Shift**: Skeleton UI 및 최적화된 이미지 로딩으로 CLS 0 달성
- 📱 **Mobile First**: PWA 수준의 부드러운 모바일 UX 및 터치 인터랙션
- 🚀 **Edge Runtime**: Cloudflare Pages의 글로벌 엣지 네트워크에서 초고속 API 처리

---

## ✨ Key Features

### **1. 🔍 Smart Search**
- **100,000+ 주류 데이터베이스**를 실시간으로 검색
- **Fuse.js 기반 퍼지 검색**으로 오타에도 강한 검색 결과
- 카테고리, 서브카테고리, 도수, 국가별 상세 필터링

### **2. 📚 My Cabinet (나의 술장)**
- 보유한 술과 위시리스트를 한 곳에서 관리
- 개인 메모, 평점, 즐겨찾기 기능
- Firebase 실시간 동기화로 모든 기기에서 접근 가능

### **3. ⭐ Review System**
- 5점 만점 평가 및 상세 리뷰 작성
- 향(Nose), 맛(Palate), 피니시(Finish) 별도 평가
- 실시간 리뷰 피드 및 추천 기능

### **4. 🧬 AI Taste Analysis**
- AI가 분석하는 나만의 **미각 DNA**
- 6차원 레이더 차트로 취향 시각화 (우디, 피티, 플로럴, 프루티, 너티, 리치니스)
- 개인화된 추천 및 페르소나 생성
- **최신 활동 우선순위 분석** - 최근 7일 내 추가/리뷰한 술을 더 높게 반영
- **일일 3회 무료** 분석 제공

### **5. 🎭 MBTI Spirit Quiz (주류 성향 테스트)**
- **16가지 주류 성향 유형** - 나에게 맞는 술 스타일 진단
- **양자택일 질문** - 15개의 선택지를 통한 정확한 성향 분석
- **비주얼 결과 카드** - SNS 공유용 이미지 자동 생성 (html-to-image)
- **맞춤 추천** - 성향별 어울리는 주류 및 테이스팅 노트 제공
- **다국어 지원** - 한국어/영어 완벽 지원

### **6. 🏆 World Cup (주류 월드컵)**
- 토너먼트 방식으로 나의 최애 술 찾기
- 16강 / 32강 / 64강 라운드 선택
- 카테고리별, 서브카테고리별 게임 생성
- 결과 이미지 다운로드 및 SNS 공유
- **이미지 프리로딩** - 게임 시작 전 모든 이미지 사전 로드로 끊김 없는 플레이

### **7. 🍻 Perfect Pour (소맥 제조 게임)**
- 황금 비율 소맥을 만드는 미니 게임
- **2단계 따르기 시뮬레이션** - 소주 → 맥주 순차 주입
- **정밀 점수 시스템** - 총량(70-90ml)과 비율(소주 30% ±10%) 기반 채점
- 리더보드 및 점수 공유 기능

### **8. 🌍 Multi-Language Support**
- **완전 이중언어 인터페이스** - URL 기반 한국어/영어 자동 전환 (`/ko`, `/en`)
- **동적 메타데이터** - 언어별 SEO 최적화 및 소셜 공유 미리보기
- **AI 번역 콘텐츠** - 영문명, 설명, 페어링 가이드 자동 생성
- **컨텍스트 기반 UI** - `UI_TEXT` 딕셔너리로 모든 레이블 동적 처리

---

## 🏗️ Tech Stack

### **Frontend**
- **Next.js 15** (App Router, React 19)
- **TypeScript** (Strict Mode)
- **Tailwind CSS 4** (Utility-first styling)
- **Framer Motion** (Animations)
- **Recharts** (Data visualization)

### **Backend & Infrastructure**
- **Cloudflare Pages** (Hosting & Edge Runtime)
- **Firebase Firestore** (NoSQL Database)
- **Firebase Auth** (Google OAuth & Guest Mode)
- **Edge Functions** (Serverless API)

### **AI & Data**
- **Google Gemini 2.0 Flash** (AI Analysis & Data Enrichment)
- **Python 3** (Data Pipeline)
- **Fuse.js** (Client-side Fuzzy Search)
- **wsrv.nl** (Image Optimization Proxy)

**상세 기술 문서**: [TECH_STACK.md](./TECH_STACK.md)

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+
- Python 3.8+
- Firebase Project (Firestore + Auth)

### **Installation**
```bash
# Clone repository
git clone https://github.com/graviton94/k-spirits-club-hub.git
cd k-spirits-club-hub

# Install dependencies
npm install
pip install -r requirements-dev.txt

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase & Gemini API keys

# Start development server
npm run dev
```

사이트는 `http://localhost:3000`에서 실행됩니다.

**상세 개발 가이드**: [DEVELOPMENT.md](./DEVELOPMENT.md)

---

## 📊 Project Status

### **Current Phase: Production Stable (v1.0.0)**
✅ **Completed:**
- [x] Next.js 15 Migration & i18n Routing (`app/[lang]`)
- [x] Gemini 2.0 Flash Sequential Data Enrichment (Step-by-step)
- [x] Performance Optimization (CLS 0, Skeleton UI)
- [x] Global Search Indexing with Multi-language support
- [x] User Cabinet & Review System with Dual-path consistency
- [x] MBTI & World Cup Games with bilingual support

🚧 **In Progress:**
- [ ] Scale-up data collection (targeting 500K+ spirits)
- [ ] Image loading optimization
- [ ] Performance profiling & caching strategy

📅 **Upcoming:**
- [ ] Social features (follow, feed)
- [ ] Advanced filtering (price, availability)
- [ ] Recommendation algorithm refinement
- [ ] Native app (PWA → iOS/Android)
- [ ] E-commerce integration

---

## 📂 Project Structure

```
k-spirits-club-hub/
├── app/                    # Next.js 15 App Router
│   ├── [lang]/             # i18n Localized Routing (ko/en)
│   ├── api/                # Edge API Routes
│   ├── actions/            # Server Actions for DB Mutations
│   ├── context/            # React Context Providers
│   └── middleware.ts       # i18n Language Detection Middleware
│
├── components/             # React Components
│   ├── layout/             # Header, Footer, Nav
│   ├── ui/                 # Reusable UI components
│   ├── cabinet/            # Cabinet-specific components
│   └── admin/              # Admin-only components
│
├── lib/                    # Core libraries
│   ├── db/                 # Database layer (Firestore REST)
│   │   ├── firestore-rest.ts  # DB abstraction
│   │   └── schema.ts          # TypeScript types
│   ├── utils/              # Utility functions
│   │   ├── image-optimization.ts
│   │   ├── image-fallback.ts
│   │   └── aiPromptBuilder.ts
│   └── constants/          # App constants
│
├── scripts/                # Data Pipeline (Python)
│   ├── fetch_food_safety.py    # Collect from public API
│   ├── run_pipeline.py         # AI enrichment pipeline
│   └── publish-ready-data.ts   # Bulk publish to production
│
├── public/                 # Static assets
│   ├── icons/              # App icons
│   ├── og-*.png            # Open Graph images
│   └── mys-*.webp          # Category fallback images
│
└── data/                   # Data storage (gitignored)
    ├── raw_imported/       # Original data from API
    ├── temp_pipeline/      # Pipeline intermediate files
    └── processed_batches/  # Offline mode backups
```

**상세 구조 설명**: [TECH_STACK.md](./TECH_STACK.md#-directory-structure)

---

## 🔌 API Documentation

### **Key Endpoints**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/spirits` | GET | List published spirits |
| `/api/spirits/[id]` | GET | Spirit detail |
| `/api/spirits/search` | GET | Search index (100KB compressed) |
| `/api/cabinet` | GET, POST, DELETE | Manage user's cabinet |
| `/api/reviews` | GET, POST, PATCH, DELETE | Review CRUD |
| `/api/analyze-taste` | GET, POST | AI taste analysis |
| `/api/admin/spirits` | GET, PATCH | Admin dashboard |

**전체 API 문서**: [API_ENDPOINTS.md](./API_ENDPOINTS.md)

---

## 📊 Data Schema

### **Core Collections**
| Collection | Documents | Description |
|-----------|-----------|-------------|
| `spirits` | 100,000+ | Main spirit database |
| `search_index` | 1 | Compressed search index |
| `users/{uid}/cabinet` | Variable | User's cabinet items |
| `users/{uid}/reviews` | Variable | User's reviews |
| `reviews` | 50,000+ | Global review collection |
| `users/{uid}/taste_data` | 1 | AI analysis results |
| `worldcup_results` | 100,000+ | Game results |

**상세 스키마 문서**: [DATA_SCHEMA.md](./DATA_SCHEMA.md)

---

## 🔄 Data Pipeline

### **Pipeline Flow**
```
공공 API (식품안전나라)
    ↓
fetch_food_safety.py (수집)
    ↓
run_pipeline.py (AI 보강)
    ├─→ Category Classification
    ├─→ ABV Inference
    ├─→ Tasting Tags Extraction
    └─→ Image Search
    ↓
Firestore (status: ENRICHED)
    ↓
Admin Dashboard (검수)
    ↓
publish-ready-data.ts (발행)
    ↓
Production (isPublished: true)
```

### **Running the Pipeline**
```bash
# Fetch data from public API
npm run fetch

# Run AI enrichment pipeline
npm run pipe -- --source "data/raw_imported/spirits_whisky.json"

# Offline mode (no upload, save locally)
npm run pipe -- --source "data/spirits.json" --skip-upload

# Bulk publish approved spirits
npm run publish-ready-spirits
```

**상세 플로우**: [CODE_FLOW.md](./CODE_FLOW.md#7️⃣-data-pipeline-python--firestore)

---

## 🎨 Design Philosophy

### **Mobile-First**
- 모든 UI는 모바일 환경을 우선 고려
- 터치 제스처 최적화 (스와이프, 탭, 롱프레스)
- 반응형 디자인 (320px ~ 4K 지원)

### **Dark Mode Native**
- 기본 다크 모드 디자인
- 눈의 피로를 줄이는 색상 팔레트
- OLED 최적화 (#000000 배경)

### **Performance First**
- 검색 인덱스 캐싱 (클라이언트 메모리)
- 이미지 최적화 (WebP, 리사이징)
- ISR (Incremental Static Regeneration)
- Edge Computing (300ms 이하 응답)

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### **Development Workflow**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### **Coding Standards**
- TypeScript strict mode
- Tailwind CSS for styling
- Functional React components
- Meaningful commit messages (Conventional Commits)

**상세 가이드**: [DEVELOPMENT.md](./DEVELOPMENT.md#-contributing)

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **식품안전나라**: 신뢰성 있는 공공 데이터 제공
- **Google Gemini**: AI 데이터 보강 및 취향 분석
- **Cloudflare Pages**: 빠르고 안정적인 글로벌 호스팅
- **Firebase**: 강력한 백엔드 인프라
- **Open Source Community**: 훌륭한 라이브러리와 도구들

---

## 📞 Contact

- **Website**: [k-spirits.club](https://k-spirits.club)
- **GitHub Issues**: [Report bugs or request features](https://github.com/graviton94/k-spirits-club-hub/issues)
- **Email**: admin@k-spirits.club (문의 전용)

---

## 📚 Documentation

- [TECH_STACK.md](./TECH_STACK.md) - 기술 스택 및 아키텍처
- [DATA_SCHEMA.md](./DATA_SCHEMA.md) - 데이터베이스 스키마
- [API_ENDPOINTS.md](./API_ENDPOINTS.md) - API 문서
- [CODE_FLOW.md](./CODE_FLOW.md) - 코드 플로우 다이어그램
- [DEVELOPMENT.md](./DEVELOPMENT.md) - 개발 가이드

---

<div align="center">

**Made with ❤️ by the K-Spirits Club Team**

⭐ Star us on GitHub if you find this project useful!

</div>

---

**Last Updated**: 2026-02-07  
**Version**: 1.0.0 (Production Global)
