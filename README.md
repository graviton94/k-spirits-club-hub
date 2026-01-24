# 🥃 K-Spirits Club Hub

> **Korea's Premier Spirits Data Platform**
> 공공 데이터와 AI 기술을 결합하여 전 세계 주류 정보를 집대성하는 디지털 허브입니다.

![Status](https://img.shields.io/badge/Status-Beta_0.9-blue)
![Tech](https://img.shields.io/badge/Stack-Next.js_|_Cloudflare_|_Python-black)
![AI](https://img.shields.io/badge/AI-Gemini_2.0_Flash-purple)

**K-Spirits Club**은 파편화된 주류 정보를 통합하고, 사용자에게 개인화된 '디지털 술장' 경험을 제공합니다.
식품안전나라의 신뢰성 있는 데이터에 AI의 풍부한 설명을 더해, 가장 완벽한 주류 DB를 구축하고 있습니다.

---

## ✅ Current Status (MVP Completed)
현재 **핵심 인프라**와 **데이터 파이프라인** 구축이 완료되었습니다.

### 1. Robust Data Pipeline (`/scripts`)
안정적이고 확장 가능한 데이터 수집 시스템을 구축했습니다.
*   **Smart Batch Processing**: 대량의 데이터(1M+)를 10개 단위 배치로 처리하여 API 부하를 방지합니다.
*   **Offline Mode**: API 할당량 초과 시 로컬(`data/processed_batches/`)에 저장하고, 중단된 지점부터 자동 재개(Resume)합니다.
*   **AI Enrichment**: **Google Gemini 2.0 Flash**를 활용하여 카테고리 분류, 도수 추론, 테이스팅 노트 태깅(#과일향 #피트 등)을 자동화했습니다.
*   **Advanced Image Search**: 제품명을 분석하여 공식 병 이미지를 자동으로 수집합니다.

### 2. Admin & Operation (`/admin`)
*   **Real-time Dashboard**: 데이터 수집 현황을 실시간으로 모니터링하고 검수할 수 있습니다.
*   **Publish Workflow**: 관리자 승인을 거친 검증된 데이터만 서비스에 노출됩니다.

### 3. User Experience (`/app`)
*   **Guest Mode**: 번거로운 가입 없이 '비회원으로 둘러보기' 기능을 통해 접근성을 높였습니다.
*   **Mobile-First Design**: 모든 UI는 모바일 환경에 최적화된 다크 모드(Dark Mode)로 설계되었습니다.

---

## 🗺️ Roadmap: The Journey Ahead

### Phase 1: Foundation (Completed) ✅
*   [x] **Infrastructure**: Cloudflare Pages 배포 및 Firebase Auth/Firestore 연동.
*   [x] **Pipeline Architecture**: Python 기반 배치 오케스트레이션 스크립트 완성.
*   [x] **Admin System**: 데이터 검수 및 관리자 대시보드 구축.
*   [x] **Basic UI**: 로그인(Google/Guest), 메인 리스트, 상세 페이지.

### Phase 2: Data Population (Now) 🚧
*   [x] **Batch Stability**: 오프라인 모드, 로깅 시스템, 강건한 환경변수 처리(Robust .env) 적용.
*   [x] **Validation**: 소주, 위스키 카테고리 AI 파이프라인 검증 완료.
*   [ ] **Scale-up**: 전체 주종(맥주, 와인, 브랜디 등) 대규모 데이터 적재.
*   [ ] **Optimization**: 이미지 로딩 속도 최적화 및 캐싱 전략 수립.

### Phase 3: Community & Personalization (Next)
*   [ ] **My Cellar (나의 술장)**: 사용자가 보유하거나 마신 술을 기록하는 개인화 기능.
*   [ ] **Review System**: 별점 평가 및 유저 테이스팅 노트 공유.
*   [ ] **Smart Search**: 도수, 국가, 맛 태그 기반 상세 검색/필터링.

### Phase 4: Expansion & Monetization (Future)
*   [ ] **Global Payment**: 주류 구매 연동 및 프리미엄 구독 멤버십.
*   [ ] **AdSense**: 트래픽 기반 수익 모델 도입.
*   [ ] **Native App**: PWA를 넘어선 iOS/Android 네이티브 앱 패키징.

---

## �️ How to Run (Developers)

### 1. Setup
```bash
npm install
pip install -r requirements-dev.txt
```

### 2. Run Pipeline (Offline Mode Example)
할당량을 절약하며 로컬에 데이터를 쌓는 모드입니다.
```bash
python scripts/run_pipeline.py --source "data/spirits_소주.json" --skip-upload
```

### 3. Deploy
```bash
npm run build
npx wrangler pages deploy .next/out
```
