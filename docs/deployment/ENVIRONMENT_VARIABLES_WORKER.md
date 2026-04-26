# Environment Variables Deployment Guide (Cloudflare Workers) - 🔄 Full Duplication Policy

본 프로젝트의 환경변수 운영은 **"모든 변수를 Build 탭과 Settings 탭 양쪽에 동일하게 등록"**하는 것을 원칙으로 합니다. 

이것은 Cloudflare Workers와 OpenNext(Next.js) 간의 환경변수 참조 시점이 비동기적으로 발생하는 문제를 해결하고, 개발자의 혼선을 방지하기 위한 **최종 지침**입니다.

---

## 🚀 필수 조치: "양쪽 탭 모두 등록" (Mirroring)

Cloudflare 대시보드에서 아래 두 메뉴에 **동일한 변수 리스트**를 모두 입력하십시오.

1.  **Build > Variables & Secrets** (빌드 타임용)
2.  **Settings > Variables > Variables & Secrets** (런타임용)

---

## 📋 등록 대상 전체 리스트 (26개)
기능 누락을 방지하기 위해 아래 변수들을 **양쪽 모두에** 토씨 하나 틀리지 않고 복사해 넣으십시오.

| 분류 | 변수명 (Key) | 타입 |
|:---|:---|:---:|
| **AI** | `GEMINI_API_KEY` | **Variable** |
| **Firebase** | `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` | **Variable** |
| **Firebase SDK**| `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`, `NEXT_PUBLIC_APP_ID`, `NEXT_PUBLIC_FIREBASE_CONFIG` | **Variable** |
| **운영/보안** | `ADMIN_PASSWORD`, `CRON_SECRET` | **Variable** |
| **광고/분석** | `NEXT_PUBLIC_ADSENSE_CLIENT`, `NEXT_PUBLIC_ADSENSE_FOOTER_SLOT`, `NEXT_PUBLIC_ADSENSE_INFEED_SLOT`, `NEXT_PUBLIC_CLARITY_PROJECT_ID` | **Variable** |
| **데이터/기타** | `FOOD_SAFETY_KOREA_API_KEY`, `FOOD_SAFETY_SERVICE_ID`, `TARGET_ALCOHOL_TYPES`, `GOOGLE_NEWS_API_KEY`, `GOOGLE_NEWS_CX_ID`, `NEXT_PUBLIC_BASE_URL`, `CF_GATEWAY_URL` | **Variable** |

---

## 🔧 운영 수칙 (Final Rules)

1. **타입 통일**: 모든 변수는 **Variable (Plaintext)**로 등록합니다.
2. **동기화**: 대시보드에서 한쪽 탭을 수정하면 반드시 반대쪽 탭도 똑같이 수정하십시오.
3. **재배포**: 수정을 마친 후에는 반드시 `npm run worker:deploy`를 실행해야 반영됩니다.

---
**최종 정책 확정일**: 2026-04-24  
**사유**: 빌드타임(Client)과 런타임(Server)의 환경변수 누락 없는 완벽한 바인딩 보장

## Example
Type
Name
Value

Secret
ADMIN_PASSWORD
Value encrypted


Secret
CF_GATEWAY_URL
Value encrypted


Secret
CRON_SECRET
Value encrypted


Secret
ENV_BINDING_TEST
Value encrypted


Secret
FIREBASE_CLIENT_EMAIL
Value encrypted


Secret
FIREBASE_PRIVATE_KEY
Value encrypted


Secret
FIREBASE_PROJECT_ID
Value encrypted


Secret
FOOD_SAFETY_API_KEY
Value encrypted


Secret
FOOD_SAFETY_KOREA_API_KEY
Value encrypted


Secret
FOOD_SAFETY_SERVICE_ID
Value encrypted


Secret
GEMINI_API_KEY
Value encrypted


Secret
GOOGLE_NEWS_API_KEY
Value encrypted


Secret
GOOGLE_NEWS_CX_ID
Value encrypted


Secret
NEXT_PUBLIC_ADSENSE_CLIENT
Value encrypted


Secret
NEXT_PUBLIC_ADSENSE_FOOTER_SLOT
Value encrypted


Secret
NEXT_PUBLIC_ADSENSE_INFEED_SLOT
Value encrypted


Secret
NEXT_PUBLIC_APP_ID
Value encrypted


Secret
NEXT_PUBLIC_FIREBASE_API_KEY
Value encrypted


Secret
NEXT_PUBLIC_FIREBASE_APP_ID
Value encrypted


Secret
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
Value encrypted


Secret
NEXT_PUBLIC_FIREBASE_CONFIG
Value encrypted


Secret
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Value encrypted


Secret
NEXT_PUBLIC_FIREBASE_PROJECT_ID
Value encrypted


Secret
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
Value encrypted


Secret
TARGET_ALCOHOL_TYPES
Value encrypted