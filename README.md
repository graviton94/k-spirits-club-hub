# 🥃 K-Spirits Club

<div align="center">

![Status](https://img.shields.io/badge/Status-Beta_v0.9-blue)
![Tech](https://img.shields.io/badge/Stack-Next.js_|_Cloudflare_|_Python-black)
![AI](https://img.shields.io/badge/AI-Gemini_2.0_Flash-purple)
![License](https://img.shields.io/badge/License-MIT-green)

**대한민국 대표 주류 데이터베이스 & 커뮤니티 플랫폼**

[🌐 Live Demo](https://k-spirits.club) | [📖 Docs](./TECH_STACK.md) | [🚀 Getting Started](#-quick-start)

</div>

---

## 📋 Overview

**K-Spirits Club**은 전 세계 주류 정보를 집대성하고, 사용자에게 개인화된 "디지털 술장" 경험을 제공하는 풀스택 웹 애플리케이션입니다.

### **핵심 가치**
- 🇰🇷 **공공 데이터 기반**: 식품안전나라의 신뢰성 있는 데이터를 기반으로 구축
- 🤖 **AI 데이터 보강**: Google Gemini 2.0 Flash를 활용한 자동 카테고리 분류 및 테이스팅 노트 생성
- 📱 **모바일 퍼스트**: 모든 UI는 모바일 환경에 최적화된 반응형 디자인
- ⚡ **Edge Computing**: Cloudflare Pages의 글로벌 CDN으로 빠른 응답 속도 보장

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
- **일일 3회 무료** 분석 제공

### **5. 🏆 World Cup (주류 월드컵)**
- 토너먼트 방식으로 나의 최애 술 찾기
- 16강 / 32강 / 64강 라운드 선택
- 카테고리별, 서브카테고리별 게임 생성
- 결과 이미지 다운로드 및 SNS 공유

### **6. 🍻 Perfect Pour (소맥 제조 게임)**
- 황금 비율 소맥을 만드는 미니 게임
- 실시간 물리 엔진 기반 부어따르기 시뮬레이션
- 리더보드 및 점수 공유 기능

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

### **Current Phase: Data Population (v0.9 Beta)**
✅ **Completed:**
- [x] Core infrastructure (Cloudflare Pages, Firebase)
- [x] User authentication (Google Login, Guest Mode)
- [x] Smart search with fuzzy matching
- [x] Cabinet management system
- [x] Review system with dual-path architecture
- [x] AI Taste Analysis with Gemini 2.0 Flash
- [x] World Cup game with image preloading
- [x] Perfect Pour mini-game
- [x] Data pipeline with AI enrichment
- [x] Admin dashboard for data management
- [x] Mobile-first responsive design

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
├── app/                    # Next.js App Router
│   ├── api/                # Edge API Routes
│   ├── actions/            # Server Actions
│   ├── context/            # React Contexts (Auth, Cache)
│   ├── contents/           # Special features (World Cup, AI Taste)
│   ├── cabinet/            # My Cabinet page
│   ├── explore/            # Browse & Search
│   ├── spirits/[id]/       # Spirit detail pages
│   └── admin/              # Admin dashboard
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
