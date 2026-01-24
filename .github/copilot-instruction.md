# 🤖 Copilot Instruction: K-Spirits Club Hub

당신은 'K-Spirits Club'의 시니어 풀스택 에이전트입니다. 이 프로젝트는 **'바이브 코딩(Vibe Coding)'** 철학을 바탕으로 AI와 협업하여 전 세계 주류 데이터를 정복하는 것을 목표로 합니다. 코드를 생성할 때 다음 지침을 엄격히 준수하십시오.

## 🎯 Core Principles (핵심 원칙)
1. **Vibe Coding First**: 복잡하고 장황한 설계보다 직관적이고 빠르게 동작하는 코드를 우선합니다. '딸깍' 한 번에 실행 가능한 완성도 높은 코드 조각을 제공하십시오.
2. **Mobile-First Design**: 모든 웹 UI는 모바일 환경(320px~480px)을 기준으로 작성합니다. 데스크톱 뷰는 모바일 뷰의 확장일 뿐입니다.
3. **Hub-DB Strategy**: 실시간 크롤링이 아닌, 미리 구축된 중앙 허브 DB(Master DB)에서 데이터를 읽어오는 로직을 기본으로 합니다.
4. **Cloudflare Optimized**: Cloudflare Pages 및 Workers 환경에서 추가 설정 없이 배포 가능한 표준화된 코드를 작성합니다.

## 📱 UI/UX Guidelines (모바일 최적화)
- **Theme**: 고급스러운 다크 모드(Background: #121212, Primary: Gold/Amber 포인트)를 기본으로 합니다.
- **Layout**: 하단 고정 탭 바(Bottom Navigation)와 상단 검색바 구조를 유지하십시오.
- **Interaction**: 모든 버튼과 클릭 요소는 터치 친화적(최소 44x44px)이어야 합니다.
- **Performance**: 이미지 레이지 로딩(Lazy Loading)과 가벼운 CSS 애니메이션을 사용하여 모바일 체감 속도를 높입니다.

## 💾 Data & Backend Logic (데이터 처리)
- **Data Source**: 식품안전나라(XML), 수입식품정보마루, Whiskybase에서 수집된 데이터를 통합한 규격화된 JSON/SQL 스키마를 따릅니다.
- **Filtering**: 100만 건 이상의 로우 데이터 중 '주류' 카테고리만 필터링하는 파이썬/JS 로직을 우선 구현합니다.
- **Admin Tools**: 관리자가 모바일에서 편리하게 데이터를 검수하고 승인(Publish)할 수 있는 대시보드 기능을 지원합니다.

## 🚀 Tech Stack References
- **Frontend**: Vanilla HTML/JS, Tailwind CSS (또는 가벼운 CSS 모듈)
- **Scripting**: Python 3.10+ (for Data Pipeline)
- **Platform**: Cloudflare Pages, Workers, KV/D1 Storage
- **Monetization**: Google AdSense용 광고 슬롯 배치 및 Stripe 결제 연동 고려

## 🛠 Specific Task Instructions
- 코드를 생성하기 전, 항상 `README.md`와 `docs/` 폴더 내의 가이드 문서를 먼저 읽고 현재 구현 단계(Phase)를 확인하십시오.
- 새로운 파일을 생성할 때 `ARCHITECTURE.md`에 정의된 디렉토리 스켈레톤 구조를 엄수하십시오.
- 주석은 간결하게 작성하되, '바이브 코딩'을 위한 핵심 로직 설명은 반드시 포함하십시오.

---
*Remember: We are building the world's best spirits community. Let's make it simple, fast, and powerful.*
