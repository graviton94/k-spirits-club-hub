# Environment Variables (Cloudflare Worker / OpenNext)

이 문서는 **k-spirits-club-hub** 배포 시 필요한 환경변수 목록입니다.
값은 넣지 않고, 입력해야 할 **필드 정의(키/형식/용도)**만 정리했습니다.

## 1) 필수 (앱 실행 + Firebase/Data Connect)

| Key | Required | Scope | Format | Purpose |
|---|---|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Preview + Production | string | Firebase Web SDK 초기화 |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | Preview + Production | domain string | Firebase Auth 도메인 |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Preview + Production | string | Firebase Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes | Preview + Production | string | Firebase Storage 버킷 |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes | Preview + Production | numeric string | Firebase Messaging Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | Preview + Production | string | Firebase App ID |
| `NEXT_PUBLIC_APP_ID` | Yes | Preview + Production | string | 앱 식별자 (`lib/firebase.ts`) |

## 2) 필수 (서버/관리자 기능)

| Key | Required | Scope | Format | Purpose |
|---|---|---|---|---|
| `FIREBASE_PROJECT_ID` | Yes | Preview + Production | string | Firebase Admin SDK 초기화 |
| `FIREBASE_CLIENT_EMAIL` | Yes | Preview + Production | email string (no quotes) | Firebase Admin 서비스 계정 이메일 |
| `FIREBASE_PRIVATE_KEY` | Yes | Preview + Production | private key string (`\\n` 허용) | Firebase Admin 서비스 계정 키 |
| `GEMINI_API_KEY` | Yes (AI 기능 사용 시) | Preview + Production | string | 소믈리에/뉴스/번역 AI 호출 |

> 주의
> - `FIREBASE_CLIENT_EMAIL`은 큰따옴표 없이 입력.
> - `FIREBASE_PRIVATE_KEY`는 멀티라인 또는 `\\n` 이스케이프 문자열 모두 가능.

## 3) 권장 (SEO/광고/운영 품질)

| Key | Required | Scope | Format | Purpose |
|---|---|---|---|---|
| `NEXT_PUBLIC_BASE_URL` | Recommended | Preview + Production | URL | canonical/OG/SEO 기준 URL |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Optional | Preview + Production | string | AdSense client ID |
| `NEXT_PUBLIC_ADSENSE_CONTENT_SLOT` | Recommended (광고 사용 시) | Preview + Production | string | 콘텐츠 슬롯 |
| `NEXT_PUBLIC_ADSENSE_INFEED_SLOT` | Optional | Preview + Production | string | 인피드 슬롯 |
| `NEXT_PUBLIC_ADSENSE_FOOTER_SLOT` | Optional | Preview + Production | string | 푸터 슬롯 |
| `NEXT_PUBLIC_SHOW_ADS` | Optional | Preview + Production | `true`/`false` | 광고 on/off 플래그 |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Optional | Preview + Production | string | Microsoft Clarity |

## 4) 선택 (Cloudflare AI Gateway 경유 시)

| Key | Required | Scope | Format | Purpose |
|---|---|---|---|---|
| `CF_GATEWAY_URL` | Optional | Preview + Production | URL | Cloudflare AI Gateway endpoint |
| `CF_AIG_TOKEN` | Optional | Preview + Production | string | Gateway 인증 토큰 |

## 5) 배치/스크립트 전용 (서버 런타임 필수 아님)

| Key | Required | Scope | Format | Purpose |
|---|---|---|---|---|
| `FOOD_SAFETY_KOREA_API_KEY` | Optional | 필요 환경만 | string | 식품안전 API 수집 |
| `FOOD_SAFETY_SERVICE_ID` | Optional | 필요 환경만 | string | 식품안전 서비스 ID (python script) |
| `FOOD_SAFETY_API_KEY` | Recommended alias | 필요 환경만 | string | `lib/services/collection.ts` 호환 키 |
| `GOOGLE_GEMINI_API_KEY` | Optional alias | 필요 환경만 | string | `app/api/analyze-taste` fallback 키 |
| `NEXT_PUBLIC_API_URL` | Optional | 필요 환경만 | URL | 일부 스크립트 실행시 base URL |
| `BASE_URL` | Optional | 필요 환경만 | URL | SEO 검증 스크립트용 |

## 6) 현재 코드에서 미사용(보관용)
아래 키들은 현재 앱 코드 기준 직접 참조가 확인되지 않았습니다. 필요하면 유지, 아니면 정리 권장.

- `ADMIN_PASSWORD`
- `CRON_SECRET`
- `GOOGLE_NEWS_API_KEY`
- `GOOGLE_NEWS_CX_ID`
- `NEXT_PUBLIC_FIREBASE_CONFIG`
- `TARGET_ALCOHOL_TYPES`

## 7) Cloudflare 입력 체크리스트

1. 동일 키를 **Preview / Production 모두** 등록
2. 비밀값은 plaintext 대신 secret 입력
3. `FIREBASE_CLIENT_EMAIL` 따옴표 제거
4. `FIREBASE_PRIVATE_KEY` 저장 후 `/api/debug` 또는 관리자 API로 초기화 확인
5. 광고 사용 시 `NEXT_PUBLIC_ADSENSE_CONTENT_SLOT` 누락 금지

## 8) Secret/Plaintext 이모지 가이드

- 🔒 = **Secret (Encrypted)** 로 등록
- 🌐 = **Plaintext** 로 등록

### 🔒 Secret (Encrypted)

- `GEMINI_API_KEY`
- `CF_AIG_TOKEN`
- `FIREBASE_PRIVATE_KEY`
- `FOOD_SAFETY_KOREA_API_KEY` (사용 시)
- `FOOD_SAFETY_API_KEY` (사용 시)
- `GOOGLE_NEWS_API_KEY` (사용 시)
- `GOOGLE_NEWS_CX_ID` (사용 시)
- `ADMIN_PASSWORD` (사용 시)
- `CRON_SECRET` (사용 시)

### 🌐 Plaintext

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_APP_ID`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `NEXT_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_ADSENSE_CLIENT`
- `NEXT_PUBLIC_ADSENSE_INFEED_SLOT`
- `NEXT_PUBLIC_ADSENSE_FOOTER_SLOT`
- `NEXT_PUBLIC_CLARITY_PROJECT_ID`
- `CF_GATEWAY_URL`
- `FOOD_SAFETY_SERVICE_ID`
- `TARGET_ALCOHOL_TYPES`
- `NEXT_PUBLIC_FIREBASE_CONFIG`

---

## 최소 필수 세트 (요약)

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_APP_ID`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_BASE_URL` (권장)
- `NEXT_PUBLIC_ADSENSE_CONTENT_SLOT` (광고 사용 시 권장)

---

## 9) 반영 완료 메모 (2026-04-23)

아래 항목은 실제 배포 환경에 반영 완료된 상태로 기록.

- ✅ `FOOD_SAFETY_API_KEY` → 🔒 Secret 등록 완료
- ✅ `NEXT_PUBLIC_CLARITY_PROJECT_ID` → 🌐 Plaintext 등록 완료
- ✅ `NEXT_PUBLIC_BASE_URL` → 🌐 Plaintext 등록 완료

운영 규칙:

- `FOOD_SAFETY_KOREA_API_KEY`와 `FOOD_SAFETY_API_KEY`는 동일 값으로 유지 가능
- Clarity는 스크립트 전체가 아니라 **프로젝트 ID만**(`NEXT_PUBLIC_CLARITY_PROJECT_ID`) 저장
