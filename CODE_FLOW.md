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

## 4️⃣ Data Pipeline (Worker → PostgreSQL)

### **Pipeline Execution**
```
npm run pipe
    ↓
scripts/run_pipeline.py
    ├─→ Load source JSON
    ├─→ For each batch:
    │   ├─→ Call Gemini AI for enrichment (nameEn, sensory, pairing)
    │   ├─→ Google Image Search for official asset
    │   └─→ Upload to PostgreSQL via Data Connect
    ↓
Admin Dashboard
    ├─→ Review enriched spirits (isPublished = false)
    └─→ Final Approval & Publish (isPublished = true)
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

**Last Updated**: 2026-04-21  
**Version**: 1.1.0 (Relational Infrastructure Optimized)
