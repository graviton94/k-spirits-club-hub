# Workers × Data Connect Root Fix Plan (Node-Data Connectivity)

- Date: 2026-04-24
- Scope: Production incidents reported on `kspiritsclub.com` after Workers/Data Connect migration
- Goal: Remove recurring runtime failures by fixing **node ↔ API ↔ Data Connect auth/context boundaries** and adding deterministic observability

---

## 0) Executive Summary

현재 장애는 개별 버그처럼 보이지만, 공통 원인은 하나로 수렴합니다.

> **공통 원인:** 서버/관리자 경로에서 `lib/db/data-connect-client.ts`(웹 클라이언트 SDK)를 사용하여, Data Connect `@auth`가 요구하는 인증 문맥이 누락됨.

이로 인해:
- user-scoped query/mutation (`auth.uid == vars.userId`)는 500
- admin-only mutation (`auth.uid == adminUid`)는 UI 상 동작해도 실제 DB 미반영
- AI API는 실패 시 generic fallback만 반환하여 근본 원인 추적이 어려움

---

## 1) Incident Matrix (Reported Errors → Root Domain)

### A. `/en/contents/worldcup`
- Symptom: Minified React error #130 (undefined component type)
- Root domain: UI module export/route composition integrity
- Priority: P1

### B. `/en/cabinet`
- Symptom: `GET /api/cabinet/list?uid=...` 500
- Root domain: user-scoped Data Connect auth context mismatch
- Priority: P0

### C. `/en/cabinet` Taste DNA
- Symptom 1: Recharts width/height -1 warning
- Symptom 2: `POST /api/analyze-taste` 500
- Root domain: (1) layout measurement (2) user-scoped Data Connect auth mismatch
- Priority: P0

### D. `/en/admin` 뉴스 수집
- Symptom: `POST /api/admin/news/collect` 500
- Root domain: Worker secret/runtime dependency + insertion path split
- Priority: P1

### E. `/en/admin` 제품 편집
- Symptom: Mixed Content warning (`http://...` image)
- Root domain: legacy data normalization gap
- Priority: P2

### F. `/en/admin` 저장/발행 미반영
- Symptom: Save/Publish 이후 Data Connect 업데이트 안 됨
- Root domain: browser-side admin mutation path (auth fragility)
- Priority: P0

### G. AI 소믈리에
- Symptom: "Our sommelier is taking a short break..."
- Root domain: upstream AI exception hidden by generic fallback
- Priority: P1

---

## 2) Node-Data Connectivity Graph (Current)

1. UI Node
   - `app/[lang]/contents/worldcup/**`
   - `components/cabinet/**`
   - `app/[lang]/admin/page.tsx`

2. API Node
   - `app/api/cabinet/list/route.ts`
   - `app/api/analyze-taste/route.ts`
   - `app/api/admin/news/collect/route.ts`
   - `app/api/ai/sommelier/route.ts`

3. Data Access Node
   - `lib/db/data-connect-client.ts` (웹 SDK 기반)
   - `lib/db/data-connect-admin.ts` (Admin SDK, server-only)

4. Policy Node (Data Connect)
   - `dataconnect/main/queries.gql`
   - `dataconnect/main/mutations.gql`
   - key rules:
     - `listUserCabinet`, `listUserReviews`: `auth.uid == vars.userId`
     - `upsertSpirit`, `upsertNews`, `deleteSpirit`: `auth.uid == adminUid`

5. Runtime Node
   - Cloudflare Workers secrets/vars
   - `GEMINI_API_KEY`, Firebase Admin credentials

---

## 3) Root-Cause Hypotheses (with code evidence)

## 3.1 User-scoped routes using client SDK in server runtime (P0)
- Affected:
  - `app/api/cabinet/list/route.ts`
  - `app/api/analyze-taste/route.ts`
- Why failing:
  - These routes call `dbListUserCabinet` / `dbListUserReviews` / `dbUpsertUser` via `data-connect-client.ts`.
  - 해당 GQL은 user-bound auth를 요구하나, server node runtime에서 auth context가 누락되어 500.

## 3.2 Admin mutations executed from browser path (P0)
- Affected:
  - `app/[lang]/admin/page.tsx` directly uses `dbUpsertSpirit`, `dbDeleteSpirit`, `dbUpsertNews`.
- Why failing:
  - admin-only mutation은 고정 UID auth를 요구.
  - 브라우저 경유 호출은 토큰 상태/세션 타이밍/권한 동기화에 취약.
  - 결과적으로 저장/발행이 간헐 또는 지속적으로 DB 반영 실패.

## 3.3 WorldCup route render contract breach (P1)
- Affected:
  - `app/[lang]/contents/worldcup/game/page.tsx`
- Why failing:
  - React #130은 대체로 "undefined component" 렌더 시 발생.
  - 페이지 모듈 export/compose contract 점검 필요 (특히 default page export + suspense wrapper 경로).

## 3.4 Admin news collect 500 is currently opaque (P1)
- Affected:
  - `app/api/admin/news/collect/route.ts`
  - `lib/api/news.ts`
- Likely causes:
  - `GEMINI_API_KEY` secret scope 누락/불일치
  - upstream fetch/AI parse failure
  - 이후 저장 단계가 browser-side `dbUpsertNews`로 분리되어 실패 지점이 이원화됨

## 3.5 Mixed Content (P2)
- Affected:
  - Admin image preview/edit flow
- Why:
  - 기존 DB row에 `http://` 이미지가 남아있고, 편집 화면 렌더 시 경고 발생.
  - `dbUpsertSpirit`는 신규 upsert 때만 https 교정.

## 3.6 Sommelier fallback hides actionable diagnostics (P1)
- Affected:
  - `app/api/ai/sommelier/route.ts`
- Why:
  - 현재는 실패 시 generic 문구로 수렴.
  - 운영 관점에서 key missing / quota / JSON parse / upstream 5xx를 구분 불가.

---

## 4) Remediation Plan (Phased)

## Phase 1 — Stop the bleeding (P0, 1 day)

1. Server/API data access boundary hardening
- Rule:
  - `PUBLIC` read query only: client SDK 허용
  - user-scoped/admin mutation: **Node route + Admin SDK only**
- Action:
  - `app/api/cabinet/list/route.ts` → `data-connect-admin.ts` 기반으로 전환
  - `app/api/analyze-taste/route.ts` → user data read/write를 Admin SDK 경유로 통일

2. Admin write path centralization
- Action:
  - `app/[lang]/admin/page.tsx`에서 직접 `dbUpsertSpirit/dbUpsertNews/dbDeleteSpirit` 호출 제거
  - 기존 `app/api/admin/spirits/*` 및 admin 전용 route에 단일 위임

3. Error response contract
- Action:
  - 주요 API 응답에 `code`, `traceId`, `source` 포함
  - Cloudflare Logs에서 traceId로 역추적 가능하게 표준화

## Phase 2 — Route/UI integrity fix (P1, 1 day)

1. WorldCup render contract fix
- Action:
  - `/worldcup/game` page module의 default export / suspense composition 명시
  - undefined component 렌더 경로 제거

2. Taste DNA chart stability
- Action:
  - `ResponsiveContainer` parent에 확정 높이/최소높이 강제
  - hidden tab 진입 직후 측정 실패 시 1회 reflow/resize trigger

3. Sommelier diagnostics split
- Action:
  - fallback을 단일 문구가 아닌 에러 코드 기반 (`AI_KEY_MISSING`, `AI_QUOTA`, `AI_PARSE`, `AI_UPSTREAM`)

## Phase 3 — Data hygiene + operations (P1/P2, 1~2 days)

1. Mixed content backfill
- Action:
  - Spirit image URL 전체 백필: `http://` → `https://`
  - invalid URL은 category fallback (`/mys-4.webp`)로 정규화

2. News collection path unification
- Action:
  - 수집 + 저장을 server route에서 원자적으로 처리
  - client는 orchestration 제거하고 결과만 수신

3. Worker secret audit
- Action:
  - `GEMINI_API_KEY`, Firebase Admin 키를 Preview/Production 모두 점검
  - secret 존재 여부 health-check endpoint 추가

---

## 5) Verification Matrix (Done Criteria)

## Functional
- `/en/contents/worldcup` 진입 및 게임 시작 시 React #130 미발생
- `/api/cabinet/list` 200 + 사용자 캐비닛 정상 렌더
- `/api/analyze-taste` 200 + profile/usage 업데이트
- `/api/admin/news/collect` 200 + 신규 뉴스 저장 반영
- admin save/publish 이후 즉시 `dbGetSpirit(id)`에 변경 반영
- 소믈리에 fallback 발생 시 원인 코드 확인 가능

## Policy/Auth
- user-scoped query/mutation은 server admin path 또는 verified user context로만 수행
- admin mutation은 nodejs runtime + `data-connect-admin.ts` 경유만 허용

## UX/Console
- Cabinet Taste DNA chart width/height warning 제거
- Admin mixed-content warning 제거

---

## 6) Implementation Guardrails

- Data access 단일 원칙 유지:
  - Public read: `lib/db/data-connect-client.ts`
  - Admin/User protected write/read in server routes: `lib/db/data-connect-admin.ts`
- `middleware.ts` i18n 계약 유지
- AI JSON contract (`lib/utils/aiPromptBuilder.ts`) 유지
- Data Connect schema 변경 시 SDK 재생성 절차 포함

---

## 7) Suggested Execution Order

1. P0: cabinet/analyze-taste/admin save-path 전환
2. P1: worldcup render contract + sommelier error taxonomy
3. P1: news collection server-side atomic save
4. P2: mixed-content data backfill + chart measurement hardening

---

## 8) Risks

- Admin path 전환 시 기존 클라이언트 호출 코드와 API 계약 불일치 가능
- user-scoped auth 정책이 엄격하여 임시 우회(예: PUBLIC 완화) 유혹이 큼
- AI API 응답 포맷 편차로 파싱 실패 재발 가능

Mitigation:
- 계약 우선(응답 스키마 고정), traceId 기반 점검, 단계별 배포
