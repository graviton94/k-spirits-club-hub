# 🔄 K-Spirits Club - Code Flow Documentation

## 📋 Overview
이 문서는 K-Spirits Club의 주요 기능별 코드 실행 흐름을 시각화하여 설명합니다. 모든 데이터 흐름은 Firebase Data Connect (PostgreSQL) 및 Edge Runtime에 최적화되어 있습니다.

---

## 1️⃣ App Initialization & Index Loading

### **Flow Diagram**
```
User visits site
    ↓
app/[lang]/layout.tsx (Root Layout)
    ↓
Middleware (middleware.ts)
    ├─→ Browser Language 감지 (ko/en)
    └─→ Redirect to /[lang]/
    ↓
getDictionary(lang)
    └─→ Load dictionaries/ko.json or en.json
    ↓
AuthProvider & CacheProvider initialization
    ↓
App Ready with Localized Content
```

---

## 2️⃣ Relational Data Management (Cabinet & Reviews)

### **Add to Cabinet**
```
User clicks "술장에 담기"
    ↓
components/ui/SpiritDetailModal.tsx
    ↓
POST /api/cabinet
    ├─→ Validate userId (Identity check)
    ├─→ Data Connect SDK: upsertUserCabinet(...)
    │   └─→ PostgreSQL 'UserCabinet' table update
    └─→ Return success
    ↓
Optimistic UI Update
```

### **Review Submission**
```
User submits review form
    ↓
POST /api/reviews
    ├─→ Validate form data & User Auth
    ├─→ Data Connect SDK: spiritReviews_insert(...)
    │   └─→ Single transaction write to PostgreSQL
    └─→ Return reviewId
```

---

## 3️⃣ AI Taste Analysis Flow

### **Detailed Process**
```
User clicks "AI 취향 분석"
    ↓
POST /api/analyze-taste
    ├─→ Fetch user's cabinet & reviews from PostgreSQL
    ├─→ Build AI prompt (weighted by recency)
    ├─→ Call Gemini 2.0 Flash (Response format: JSON)
    ├─→ Save Profile: Update 'users' table (tasteProfile column)
    ├─→ Update Usage: Increment count in 'tasteAnalysisUsage' table
    └─→ Return results
    ↓
Display Taste DNA Report (Radar Chart)
```

---

## 4️⃣ Data Pipeline (JSON → PostgreSQL via Data Connect)

> ⚠️ **SSOT Principle**: 모든 DB 쓰기는 반드시 `dbAdminUpsertSpirit()` (`lib/db/data-connect-admin.ts`) 를 통해서만 이루어진다. Firestore SDK 직접 호출, Raw SQL, 외부 Python 업로더는 **엄격히 금지**된다.

### **파이프라인 진입점**
```
scripts/pipeline/normalize-and-enrich.ts  (TypeScript CLI — 단일 오케스트레이터)
```

### **3단계 처리 흐름**
```
npx ts-node --project tsconfig.scripts.json \
  scripts/pipeline/normalize-and-enrich.ts \
  --source data/spirits_위스키.json \
  --stage all --batch-size 4 --limit 50
    ↓
[Stage 1: Audit]  scripts/pipeline/lib/auditor.ts
    ├─→ 필수 필드(id, name, category, imageUrl) 완성도 검사
    ├─→ isReviewed=true && status='ENRICHED' → SKIP (--force-reenrich 없으면)
    └─→ READY / SKIP 파티셔닝
    ↓
[Stage 2: Sensory]  scripts/pipeline/lib/sensory.ts
    ├─→ Gemini 2.0 Flash 호출 (noseTags, palateTags, finishTags, tastingNote)
    ├─→ mainCategory, subcategory, region, distillery, abv, descriptionKo 생성
    └─→ 순차(for...of) 처리 — 동시성 ≤ batch-size (Gemini 429 방지)
    ↓
[Stage 3: Pairing]  scripts/pipeline/lib/pairing.ts
    ├─→ Gemini 2.0 Flash 호출 (pairingGuideKo, pairingGuideEn, nameEn, descriptionEn)
    └─→ 순차 처리
    ↓
[Upsert]  dbAdminUpsertSpirit() ← lib/db/data-connect-admin.ts
    ├─→ Service Account OAuth2 토큰으로 Firebase Data Connect REST API 호출
    ├─→ PostgreSQL 'Spirit' 테이블 upsert (단일 트랜잭션)
    └─→ isPublished = false (Admin Dashboard에서 최종 승인 필요)
    ↓
Admin Dashboard
    ├─→ 보강된 술 검토 (isPublished = false)
    └─→ 최종 승인 & 발행 (isPublished = true)
```

### **핵심 CLI 플래그**

| 플래그 | 설명 | 예시 |
|---|---|---|
| `--source <file>` | 처리할 JSON 소스 파일 경로 (필수) | `data/spirits_위스키.json` |
| `--stage` | 실행 단계: `all` \| `normalize` \| `audit` \| `sensory` \| `pairing` | `--stage all` |
| `--batch-size` | 배치당 최대 처리 수 (기본: 4, Gemini 429 방지) | `--batch-size 4` |
| `--limit` | 총 처리 개수 제한 | `--limit 50` |
| `--dry-run` | DB 쓰기 없이 payload만 콘솔 출력 (검증용) | `--dry-run` |
| `--force-reenrich` | ENRICHED 상태 스킵 무시, 강제 재처리 | `--force-reenrich` |

### **예시 명령어**

```bash
# 1. 검증 실행 (DB 쓰기 없음 — 반드시 먼저 실행)
npx ts-node --project tsconfig.scripts.json \
  scripts/pipeline/normalize-and-enrich.ts \
  --source data/spirits_위스키.json --stage all --batch-size 4 --limit 10 --dry-run

# 2. 소량 실제 실행 (50개)
npx ts-node --project tsconfig.scripts.json \
  scripts/pipeline/normalize-and-enrich.ts \
  --source data/spirits_위스키.json --stage all --batch-size 4 --limit 50

# 3. 특정 단계만 재실행 (sensory 단계만)
npx ts-node --project tsconfig.scripts.json \
  scripts/pipeline/normalize-and-enrich.ts \
  --source data/spirits_위스키.json --stage sensory --limit 20

# 4. 강제 재보강 (이미 ENRICHED 상태인 항목 포함)
npx ts-node --project tsconfig.scripts.json \
  scripts/pipeline/normalize-and-enrich.ts \
  --source data/spirits_위스키.json --stage all --force-reenrich --limit 10 --dry-run
```

### **부분 실패 격리 (Partial Failure Isolation)**
```
각 spirit 처리는 독립적인 try/catch로 감쌈
    ↓
실패 시 → data/temp_pipeline/failed_batch_log_<timestamp>.json 기록
    └─→ { id, name, stage, error, timestamp }
    ↓
성공 항목은 계속 진행 (전체 파이프라인 중단 없음)
    ↓
배치 간 1500ms pause (Gemini API rate limit 대응)
```

### **환경 변수 (필수)**
```
FIREBASE_PROJECT_ID     # Firebase 프로젝트 ID
FIREBASE_CLIENT_EMAIL   # 서비스 계정 이메일
FIREBASE_PRIVATE_KEY    # 서비스 계정 Private Key (-----BEGIN PRIVATE KEY-----)
GEMINI_API_KEY          # Google AI Studio API Key
```

---

## 5️⃣ Image Optimization & Fallback

### **Flow Diagram**
```
Component renders <Image />
    ↓
getOptimizedImageUrl(url, width)
    └─→ Build wsrv.nl proxy URL (WebP conversion)
    ↓
Browser loads image
    └─→ On error: Fallback to getCategoryFallbackImage()
```

---

## 📚 Related Documentation

- [TECH_STACK.md](./TECH_STACK.md) - 기술 스택
- [DATA_SCHEMA.md](./DATA_SCHEMA.md) - 데이터 스키마
- [API_ENDPOINTS.md](./API_ENDPOINTS.md) - API 문서
- [DEVELOPMENT.md](./DEVELOPMENT.md) - 개발 가이드

---

**Last Updated**: 2026-04-30  
**Version**: 1.2.0 (Unified TS Pipeline — Legacy Python Scripts Removed)
