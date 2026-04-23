# Workers Operation Guide (Post-Migration)

이 문서는 K-Spirits Club Hub의 **Pages → Workers 이관 완료 이후** 운영 기준을 정의합니다.

## 1) 현재 운영 토폴로지

- Runtime: Cloudflare Workers + OpenNext
- Worker Name: `k-spirits-club-hub-worker`
- Main: `.open-next/worker.js`
- Route: `*.kspiritsclub.com/*` (zone route)
- Custom Domain: `kspiritsclub.com` (exact hostname)

## 2) 도메인/라우트 규칙 (필수)

- 와일드카드/경로 라우트(`*.domain.com/*`)는 **route pattern + zone_name** 방식만 사용
- `custom_domain: true`는 **정확 호스트**에만 사용 (와일드카드/경로 금지)
- DNS 레코드는 Proxied(주황 구름) 상태 유지

참조 규칙: [.agents/rules/strict_prohibited_actions.md](../../.agents/rules/strict_prohibited_actions.md)

## 3) 배포 명령 표준

- Build: `npm run worker:build`
- Deploy: `npm run worker:deploy`

주의:
- 로컬 Windows에서 OpenNext 번들러 이슈가 발생할 수 있으므로, 최종 기준은 Linux CI 결과를 우선합니다.
- `wrangler.jsonc` 수정 시 route/custom domain 제약을 먼저 확인합니다.

## 4) 환경변수 기준

Workers 환경변수의 소스 오브 트루스는 아래 문서입니다.

- [docs/deployment/ENVIRONMENT_VARIABLES_WORKER.md](./ENVIRONMENT_VARIABLES_WORKER.md)

핵심 운영 원칙:
- Preview/Production 동일 키셋 유지
- 민감값은 Secret으로 등록
- Firebase Admin 키(`FIREBASE_PRIVATE_KEY`) 저장 후 관리자 API 초기화 확인

## 5) 운영 체크리스트 (배포 전/후)

### 배포 전
- `wrangler.jsonc` route/custom domain 규칙 검증
- 필수 환경변수 누락 여부 확인
- 변경이 데이터 계층을 건드렸다면 Data Connect 규칙/SDK 상태 확인

### 배포 후
- `/ko`, `/en` 기본 진입 smoke test
- `/api/debug` 또는 관리자 API로 Firebase Admin 초기화 확인
- 주요 공개 페이지 SSR 응답 확인 (`/contents`, `/explore`, `/spirits/[id]`)

## 6) 금지 패턴 요약

- Workers route에 와일드카드 + `custom_domain: true` 동시 사용 금지
- Pages/Workers 배포 체인 혼용 금지 (운영 경로는 Workers 단일화)
- Data Connect Admin mutation route를 Edge runtime으로 강제하는 변경 금지
