# Environment Variables (Cloudflare Worker / OpenNext) - 🌐 100% Variable Policy

본 프로젝트는 Cloudflare Workers 환경에서의 안정적인 바인딩을 위해 모든 환경변수를 **'Plaintext Variable(평문 변수)'**로 관리하는 것을 표준으로 합니다.

> [!IMPORTANT]
> **Secret(암호화) 사용 제한**: OpenNext 프레임워크와 Cloudflare Workers 사이의 바인딩 안정성을 위해, 모든 시크릿 키를 포함한 환경변수는 대시보드 내 **"Variable"** 탭에 등록해야 합니다.

## 📋 환경변수 등록 가이드 (100% Variable)

모든 변수는 Cloudflare 대시보드 -> Workers & Pages -> 해당 워커 선택 -> **Settings > Variables** 메뉴에서 **"Variable"** 타입으로 등록합니다.

| 분류 | 변수명 (Key) | 용도 및 설명 |
|:---:|:---|:---|
| **핵심 (AI)** | `GEMINI_API_KEY` | 소믈리에, 뉴스 수집, 텍스트 분석용 구글 AI 키 |
| **핵심 (DB)** | `FIREBASE_PROJECT_ID` | 파이어베이스 프로젝트 ID (관리용) |
| **핵심 (DB)** | `FIREBASE_CLIENT_EMAIL` | 파이어베이스 Admin 서비스 계정 이메일 |
| **핵심 (DB)** | `FIREBASE_PRIVATE_KEY` | 파이어베이스 Admin 프라이빗 키 |
| **Firebase SDK** | `NEXT_PUBLIC_FIREBASE_API_KEY` | 클라이언트 SDK API 키 |
| **Firebase SDK** | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | 클라이언트 SDK 인증 도메인 |
| **Firebase SDK** | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | 클라이언트 SDK 프로젝트 ID |
| **Firebase SDK** | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`| 클라이언트 SDK 스토리지 버킷 |
| **Firebase SDK** | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`| 클라이언트 SDK 메시징 ID |
| **Firebase SDK** | `NEXT_PUBLIC_FIREBASE_APP_ID` | 클라이언트 SDK 앱 ID |
| **Firebase SDK** | `NEXT_PUBLIC_APP_ID` | 앱 식별자 (내부 로직용) |
| **Firebase SDK** | `NEXT_PUBLIC_FIREBASE_CONFIG` | 전체 설정 JSON 문자열 (보조용) |
| **운영 (보안)** | `ADMIN_PASSWORD` | 관리자 페이지 진입용 비밀번호 |
| **운영 (보안)** | `CRON_SECRET` | 자동화 작업(Cron) 전용 인증 토큰 |
| **광고/분석** | `NEXT_PUBLIC_ADSENSE_CLIENT` | 구글 애드센스 클라이언트 ID |
| **광고/분석** | `NEXT_PUBLIC_ADSENSE_FOOTER_SLOT` | 푸터 광고 슬롯 ID |
| **광고/분석** | `NEXT_PUBLIC_ADSENSE_INFEED_SLOT` | 인피드 광고 슬롯 ID |
| **광고/분석** | `NEXT_PUBLIC_CLARITY_PROJECT_ID` | MS Clarity 분석 프로젝트 ID |
| **데이터 수집**| `FOOD_SAFETY_KOREA_API_KEY` | 식품안전나라 API 키 |
| **데이터 수집**| `FOOD_SAFETY_SERVICE_ID` | 식품안전나라 서비스 ID |
| **뉴스/검색** | `GOOGLE_NEWS_API_KEY` | 구글 커스텀 검색 API 키 (보조) |
| **뉴스/검색** | `GOOGLE_NEWS_CX_ID` | 구글 커스텀 검색 엔진 ID |
| **시스템** | `NEXT_PUBLIC_BASE_URL` | 배포 사이트 대표 URL |
| **시스템** | `TARGET_ALCOHOL_TYPES` | 수집 및 분류 대상 주종 리스트 |
| **네트워크** | `CF_GATEWAY_URL` | Cloudflare AI Gateway 주소 (Optional) |

## 🛠️ 필수 체크리스트

1. **Wrangler 연동**: 새로운 변수를 대시보드에 추가하면, 반드시 [wrangler.jsonc](file:///c:/k-spirits-club-hub/wrangler.jsonc)의 `vars` 섹션에도 동일한 이름을 등록해야 합니다. (선언되지 않은 변수는 무시될 수 있음)
2. **배포 주기**: 대시보드에서 변수 값을 수정하거나 추가한 경우, 반드시 `npm run worker:deploy` 명령어로 **재배포**를 진행해야 워커에 반영됩니다.
3. **값 형식**: 
   - `FIREBASE_CLIENT_EMAIL`: 따옴표 제외하고 입력
   - `FIREBASE_PRIVATE_KEY`: `\n` 문자가 포함된 전체 문자열 입력 (따옴표 제외)
   - `TARGET_ALCOHOL_TYPES`: 쉼표로 구분된 문자열 입력

---
**최종 업데이트**: 2026-04-24  
**정책 사유**: Cloudflare Workers & OpenNext 바인딩 안정성 확보 (Secret 실종 문제 해결)
