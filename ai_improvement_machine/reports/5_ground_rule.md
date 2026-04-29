### 🥃 K-Spirits Club: Copilot 마스터 커스텀 인스트럭션 (5대 핵심 규칙)

**1. 데이터 통신은 반드시 Firebase Data Connect(GraphQL) 기반으로 설계할 것**
*   **배경:** 이 프로젝트의 핵심 데이터베이스는 10만 건 이상의 주류 데이터를 관리하는 Cloud SQL 기반의 PostgreSQL이며, 이를 Firebase Data Connect (SQL Connect)를 통해 제어합니다. 
*   **지침:** SQL 직접 쿼리를 작성하지 마십시오. 데이터 Fetch 및 Mutation은 반드시 GraphQL 스키마와 자동 생성된 SDK(예: `executeGraphql()`, `getDC()`)를 통해 타입 안전(Type-safe)하게 처리해야 합니다.

**2. 엣지 런타임(Edge Runtime) 및 Next.js 15 App Router 환경 엄수**
*   **배경:** 애플리케이션은 Cloudflare Workers (OpenNext) 환경에 배포되어 글로벌 엣지 네트워크에서 작동합니다.
*   **지침:** Node.js 전용 내장 API(예: `fs`, `path`) 사용을 지양하고, Edge 호환 API를 사용하십시오. 또한 Next.js 15의 Server Components와 Client Components(`"use client"`)를 명확히 분리하여 렌더링 성능을 최적화해야 합니다.

**3. 글로벌 표준 다국어(i18n) 라우팅 및 하드코딩 금지**
*   **배경:** URL 기반(한국어 `/ko`, 영어 `/en`) 다국어 라우팅과 완전 이중언어 인터페이스를 지원합니다.
*   **지침:** UI 텍스트 컴포넌트 내에 한국어나 영어를 하드코딩하지 마십시오. 반드시 `dictionaries/` 폴더의 JSON(예: `ko.json`, `en.json`) 데이터를 주입받아 동적으로 렌더링해야 합니다. 메타데이터 또한 `generateMetadata()` 노드를 통해 언어별 SEO가 최적화되도록 구성해야 합니다.

**4. Zero Layout Shift (CLS 0) 및 모바일/다크모드 우선 UX 구현**
*   **배경:** PWA 수준의 모바일 환경과 다크모드(OLED 최적화)를 기본으로 하며, CLS(Cumulative Layout Shift) 0을 목표로 합니다.
*   **지침:** 데이터를 불러오는 모든 비동기 UI에는 반드시 Skeleton UI(`loading.tsx` 등)를 적용하여 화면 흔들림을 방지하십시오. CSS는 Tailwind CSS 4를 사용하며, 반응형과 터치 제스처 최적화를 최우선으로 적용해야 합니다.

**5. Graphify 생태계(연결망) 유지 및 보안(Auth/Rules) 사전 검증**
*   **배경:** 현재 시스템은 수많은 노드가 얽혀 있는 구조(`BrowserManager`, `executeGraphql()`, `POST/GET` 등)이며, Firestore와 Data Connect의 이중 데이터 경로(Dual-path)를 가질 수 있습니다.
*   **지침:** 새로운 코드를 작성할 때 고립된(Isolated) 함수를 만들지 말고, 기존 유틸리티(예: `generateSafeId()`, `cleanTimestamps()`)를 재사용하십시오. 또한 사용자 술장 관리나 리뷰 작성 시, Firebase Auth 기반의 인증 상태와 보안 규칙(Security Rules)을 침해하지 않는지 반드시 확인한 후 로직을 작성해야 합니다.
