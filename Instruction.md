# 🛠️ Development Instructions: K-Spirits Club Hub

본 문서는 GitHub Copilot이 'K-Spirits Club Hub' 프로젝트의 코드를 생성할 때 준수해야 할 기술적 표준과 비즈니스 로직을 정의합니다.

## 1. 프로젝트 아키텍처 및 철학
- [cite_start]**Vibe Coding**: 엄밀한 설계보다 생성형 AI와 협업하여 빠르게 동작하는 프로토타입을 '딸깍' 구현하고 반복 수정하는 방식을 지향합니다. [cite: 8, 12, 52]
- **Mobile-First**: 모든 UI는 모바일 브라우저(320px~480px)를 기준으로 하며, 하단 탭 바(Bottom Navigation)와 상단 검색바 구조를 기본으로 합니다.
- **Hub-DB Strategy**: 실시간 크롤링 대신 1M+ 데이터(식품안전나라, 수입식품정보마루 등)를 허브 DB에 적재한 뒤, 관리자가 승인한 데이터만 서비스합니다.

## 2. 데이터 파이프라인 (Data Pipeline)
모든 데이터 수집 및 처리는 `scripts/` 내의 Python 스크립트를 통해 이루어지며, 다음 원칙을 따릅니다.

### A. 배치 처리 & 오케스트레이션 (Batch Orchestration)
- **Master Script**: `scripts/run_pipeline.py`가 모든 하위 스크립트를 제어합니다.
- **Batch Size**: API 안정성을 위해 데이터를 10~20개 단위(Batch)로 끊어서 처리합니다.
- **State Management**: 중간에 끊겨도 `pipeline_state.json`을 통해 중단된 지점부터 자동 재개(Resume)되어야 합니다.
- **Offline Capability**: API 할당량 문제 발생 시 `--skip-upload` 옵션으로 로컬(`data/processed_batches/`)에 결과물을 저장할 수 있어야 합니다.

### B. AI 데이터 보완 (Enrichment)
- **Gemini AI**: `enrich_with_gemini.py`를 사용하여 누락된 데이터(도수, 영문명)를 보완하고 해시태그를 생성합니다.
- **Prompt Engineering**: 제품명 기반으로 원재료를 유추하되, 홍보성 멘트는 배제하고 객관적인 태그를 생성하도록 지시합니다.
- **Robust Config**: `.env` 파일의 포맷팅 오류(JS 코드 혼입 등)에도 스크립트가 죽지 않도록 커스텀 파싱 로직을 포함합니다.

### C. 허브 DB 적재
- `migrate_to_firestore.js`를 통해 검증된 데이터(`batch_ready.json`)만 Firestore에 적재합니다.
- 적재된 데이터는 기본적으로 `status: 'ENRICHED'` 또는 `'READY_FOR_CONFIRM'` 상태를 가집니다.

## 3. UI/UX 기술 표준
- [cite_start]**디자인 테마**: 고급스러운 다크 모드(Dark Mode)를 적용합니다. [cite: 51, 65]
- [cite_start]**인터랙션**: 자바스크립트를 활용하여 버튼 클릭 시 로또 번호 추천 사이트처럼 동적이고 즉각적인 반응을 제공합니다. [cite: 106, 127]
- [cite_start]**수익화 공간**: 상단 혹은 하단에 구글 애드센스(AdSense) 광고 슬롯을 미리 확보하고, `ads.txt` 연동을 고려합니다. [cite: 78, 84]

## 4. 인프라 및 배포
- [cite_start]**플랫폼**: Cloudflare Pages를 통해 글로벌 배포를 수행합니다. [cite: 136, 139]
- [cite_start]**무제한 트래픽**: 클라우드플레어의 특징을 살려 전 세계 사용자가 접속해도 비용이 발생하지 않는 정적 배포 구조를 유지합니다. [cite: 137, 140]

## 5. 관리자(Admin) 권한
- `/src/admin` 경로는 관리자가 수집된 로우 데이터를 검수하고, '발행(Publish)' 버튼을 통해 메인 DB로 데이터를 이관하는 기능을 포함합니다.

---
*Copilot: 모든 코드 생성 시 위 지침과 README.md를 우선적으로 참조하십시오.*
