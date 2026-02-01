# 🔄 K-Spirits Club - Code Flow Documentation

## 📋 Overview
이 문서는 K-Spirits Club의 주요 기능별 코드 실행 흐름을 시각화하여 설명합니다.

---

## 1️⃣ App Initialization & Search Index Loading

### **Flow Diagram**
```
User visits site
    ↓
app/layout.tsx (Root Layout)
    ↓
AuthProvider initialization
    ├─→ Firebase Auth 초기화
    ├─→ onAuthStateChanged 리스너 등록
    └─→ Guest Mode 지원
    ↓
SpiritsCacheProvider initialization
    ├─→ GET /api/spirits/search
    ├─→ Fetch compressed search index (~100KB)
    ├─→ Store in React Context
    └─→ Initialize Fuse.js instance
    ↓
App Ready
```

### **Code References**
- **Auth Context**: `app/context/auth-context.tsx`
- **Search Cache**: `app/context/spirits-cache-context.tsx`
- **API**: `app/api/spirits/search/route.ts`

### **Key Functions**
```typescript
// app/context/spirits-cache-context.tsx
export function SpiritsCacheProvider({ children }: { children: ReactNode }) {
  const [searchIndex, setSearchIndex] = useState<SpiritSearchIndex[]>([]);
  const [fuse, setFuse] = useState<Fuse<SpiritSearchIndex> | null>(null);

  useEffect(() => {
    async function loadIndex() {
      const res = await fetch('/api/spirits/search');
      const { index } = await res.json();
      setSearchIndex(index);
      
      const fuseInstance = new Fuse(index, {
        keys: ['n', 'en', 'd', 'c'],
        threshold: 0.3
      });
      setFuse(fuseInstance);
    }
    loadIndex();
  }, []);

  return (
    <SpiritsCacheContext.Provider value={{ index: searchIndex, fuse }}>
      {children}
    </SpiritsCacheContext.Provider>
  );
}
```

---

## 2️⃣ Client-Side Search Flow

### **Flow Diagram**
```
User types in search box
    ↓
components/ui/ExploreList.tsx
    ↓
useSpiritCache() hook
    ├─→ Get Fuse.js instance from Context
    └─→ No server call needed!
    ↓
fuse.search(query)
    ↓
Filter results (category, subcategory)
    ↓
Display results instantly
```

### **Code References**
- **Search UI**: `components/ui/ExploreList.tsx`
- **Hook**: `lib/hooks/useSpiritsCache.ts` (if exists) or inline in component

### **Key Functions**
```typescript
// Inline search logic
const { fuse, index } = useSpiritCache();
const [query, setQuery] = useState('');
const [results, setResults] = useState<SpiritSearchIndex[]>([]);

useEffect(() => {
  if (!fuse || !query) {
    setResults(index);
    return;
  }
  
  const searchResults = fuse.search(query);
  setResults(searchResults.map(r => r.item));
}, [query, fuse, index]);
```

---

## 3️⃣ Cabinet (술장) Management Flow

### **Add to Cabinet**
```
User clicks "술장에 담기"
    ↓
components/ui/SpiritDetailModal.tsx
    ↓
handleAddToCabinet()
    ├─→ Check if user is logged in
    │   ├─→ No: Prompt login
    │   └─→ Yes: Continue
    ↓
POST /api/cabinet
    ├─→ Validate userId (from x-user-id header)
    ├─→ cabinetDb.upsert(userId, spiritId, data)
    │   ├─→ Path: users/{userId}/cabinet/{spiritId}
    │   └─→ PATCH request to Firestore REST API
    └─→ Return success
    ↓
Optimistic UI Update
    ├─→ Update local state immediately
    └─→ Show success toast
```

### **Load Cabinet**
```
User visits /cabinet
    ↓
app/cabinet/page.tsx
    ↓
useEffect: Load cabinet data
    ├─→ GET /api/cabinet
    │   └─→ cabinetDb.getAll(userId)
    ├─→ Parse and transform data
    └─→ Set state
    ↓
components/cabinet/MyCabinet.tsx
    ├─→ Display cabinet items
    ├─→ Filter by isWishlist
    └─→ Sort options
```

### **Code References**
- **Cabinet Page**: `app/cabinet/page.tsx`
- **Cabinet Component**: `components/cabinet/MyCabinet.tsx`
- **API**: `app/api/cabinet/route.ts`
- **DB Layer**: `lib/db/firestore-rest.ts` → `cabinetDb`

---

## 4️⃣ Review System Flow

### **Write Review**
```
User clicks "리뷰 쓰기"
    ↓
components/ui/ReviewModal.tsx
    ↓
Fill form (rating, title, content, tasting notes)
    ↓
handleSubmit()
    ↓
POST /api/reviews
    ├─→ Validate user authentication
    ├─→ Validate form data
    ├─→ Dual Path Write (Transaction)
    │   ├─→ users/{userId}/reviews/{reviewId}
    │   └─→ reviews/{reviewId}
    └─→ Return reviewId
    ↓
Redirect to review detail or refresh list
```

### **Load Reviews for a Spirit**
```
User opens Spirit Detail
    ↓
app/spirits/[id]/page.tsx
    ↓
Load spirit data + reviews
    ├─→ GET /api/spirits/[id]
    └─→ GET /api/reviews?spiritId={id}
    ↓
components/ui/LiveReviews.tsx
    ├─→ Display reviews
    ├─→ Like/Unlike functionality
    └─→ Pagination
```

### **Code References**
- **Review API**: `app/api/reviews/route.ts`
- **Review Component**: `components/ui/LiveReviews.tsx`
- **DB Layer**: `lib/db/firestore-rest.ts` → `reviewsDb`

---

## 5️⃣ AI Taste Analysis Flow

### **Flow Diagram**
```
User clicks "AI 취향 분석"
    ↓
app/cabinet/page.tsx (or dedicated button)
    ↓
Check usage limit
    ├─→ GET /api/analyze-taste?userId={uid}
    ├─→ Check usage.remaining > 0
    │   ├─→ No: Show "일일 한도 초과" error
    │   └─→ Yes: Continue
    ↓
POST /api/analyze-taste
    ├─→ Fetch user's cabinet
    │   └─→ cabinetDb.getAll(userId)
    ├─→ Fetch user's reviews
    │   └─→ reviewsDb.getAllForUser(userId)
    ├─→ Merge data (reviews join cabinet)
    ├─→ Build AI prompt
    │   └─→ lib/utils/aiPromptBuilder.ts
    ├─→ Call Gemini 2.0 Flash
    │   ├─→ Model: gemini-2.0-flash
    │   ├─→ Response format: JSON
    │   └─→ Parse result
    ├─→ Save profile
    │   └─→ users/{userId}/taste_data/profile
    ├─→ Increment usage count
    │   └─→ users/{userId}/taste_data/usage
    └─→ Return profile
    ↓
Redirect to /contents/taste/result/{userId}
    ↓
Display Taste DNA Report
    ├─→ Radar Chart (Recharts)
    ├─→ Persona (AI-generated)
    ├─→ Recommendation
    └─→ Share functionality
```

### **Code References**
- **AI API**: `app/api/analyze-taste/route.ts`
- **Result Page**: `app/contents/taste/result/[userId]/page.tsx`
- **Radar Chart**: `components/cabinet/TasteRadar.tsx`
- **Prompt Builder**: `lib/utils/aiPromptBuilder.ts`

### **Key Functions**
```typescript
// app/api/analyze-taste/route.ts
export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  
  // 1. Check usage
  const usage = await tasteProfileDb.getUsage(userId);
  if (usage.count >= 3) {
    return NextResponse.json({ error: 'Daily limit reached' }, { status: 429 });
  }
  
  // 2. Fetch data
  const [cabinet, reviews] = await Promise.all([
    cabinetDb.getAll(userId),
    reviewsDb.getAllForUser(userId)
  ]);
  
  // 3. Build prompt
  const prompt = buildTasteAnalysisPrompt(mergeData(cabinet, reviews));
  
  // 4. Call AI
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent([systemInstruction, prompt]);
  const profile = JSON.parse(result.response.text());
  
  // 5. Save & return
  await tasteProfileDb.save(userId, profile);
  await tasteProfileDb.setUsage(userId, today, usage.count + 1);
  
  return NextResponse.json({ success: true, profile });
}
```

---

## 6️⃣ World Cup Game Flow

### **Flow Diagram**
```
User visits /contents/worldcup
    ↓
Select category & subcategory & round
    ↓
Click "게임 시작"
    ↓
app/contents/worldcup/game/page.tsx
    ↓
useEffect: Fetch spirits
    ├─→ Query Firestore (client SDK)
    │   ├─→ Filter: isPublished = true
    │   ├─→ Filter: category (if selected)
    │   ├─→ Filter: subcategory IN [...] (if selected)
    │   ├─→ Limit: 300
    │   └─→ Shuffle
    ├─→ Select first N items (N = requestedRound)
    └─→ Preload all images
        ├─→ For each spirit:
        │   ├─→ Try optimized URL
        │   ├─→ Fallback to original URL
        │   └─→ Fallback to category image
        └─→ Store in spirit.preloadedImageUrl
    ↓
Game Loop
    ├─→ Display currentRoundItems[currentIndex] vs [currentIndex+1]
    ├─→ User clicks winner
    ├─→ Add winner to nextRoundItems
    ├─→ currentIndex += 2
    ├─→ If currentIndex >= currentRoundItems.length:
    │   ├─→ Round complete
    │   ├─→ Show transition animation
    │   ├─→ currentRoundItems = nextRoundItems
    │   ├─→ nextRoundItems = []
    │   └─→ currentIndex = 0
    └─→ Repeat until 1 item left
    ↓
Winner Screen
    ├─→ Show confetti 🎉
    ├─→ Display winner card
    ├─→ Save result to Firestore
    │   └─→ worldcup_results/{resultId}
    ├─→ Share functionality
    └─→ Download image (html-to-image)
```

### **Code References**
- **Menu**: `app/contents/worldcup/page.tsx`
- **Game**: `app/contents/worldcup/game/page.tsx`
- **Result**: `app/contents/worldcup/result/[id]/page.tsx`

---

## 7️⃣ Data Pipeline (Python → Firestore)

### **Flow Diagram**
```
npm run pipe
    ↓
scripts/run_pipeline.py
    ├─→ Load source JSON
    ├─→ For each batch (10 items):
    │   ├─→ Call Gemini AI for enrichment
    │   │   ├─→ Category classification
    │   │   ├─→ ABV inference
    │   │   ├─→ Tasting tags extraction
    │   │   └─→ English name translation
    │   ├─→ Search for official image
    │   │   └─→ Google Image Search (via Axios)
    │   ├─→ Upload to Firestore
    │   │   ├─→ POST /api/admin/spirits (or direct Firebase Admin)
    │   │   └─→ Set status: ENRICHED
    │   └─→ OR save to local (if --skip-upload)
    │       └─→ data/processed_batches/batch_*.json
    ↓
Admin Dashboard
    ├─→ Review enriched spirits
    ├─→ Approve (isPublished = true, status = PUBLISHED)
    └─→ Publish to production
```

### **Code References**
- **Pipeline**: `scripts/run_pipeline.py`
- **Publish Script**: `scripts/publish-ready-data.ts`
- **Admin Dashboard**: `app/admin/page.tsx`

---

## 8️⃣ Image Optimization Flow

### **Flow Diagram**
```
Component renders <Image src={url} />
    ↓
getOptimizedImageUrl(url, width)
    ├─→ Check if URL is empty
    │   └─→ Return fallback image
    ├─→ Encode URL
    ├─→ Build wsrv.nl proxy URL
    │   └─→ https://wsrv.nl/?url={encoded}&w={width}&q=85&output=webp&fit=inside
    └─→ Return optimized URL
    ↓
Browser loads image
    ├─→ On success: Display
    └─→ On error: Fallback to getCategoryFallbackImage()
```

### **Code References**
- **Optimization**: `lib/utils/image-optimization.ts`
- **Fallback**: `lib/utils/image-fallback.ts`

### **Key Functions**
```typescript
// lib/utils/image-optimization.ts
export function getOptimizedImageUrl(url: string, width: number = 400): string {
  if (!url || url === '') return '/mys-1.webp';
  
  const encodedUrl = encodeURIComponent(url);
  return `https://wsrv.nl/?url=${encodedUrl}&w=${width}&q=85&output=webp&fit=inside`;
}

// lib/utils/image-fallback.ts
export function getCategoryFallbackImage(category: string): string {
  const map: Record<string, string> = {
    '위스키': '/mys-1.webp',
    '소주': '/mys-2.webp',
    '맥주': '/mys-3.webp',
    // ...
  };
  return map[category] || '/mys-1.webp';
}
```

---

## 9️⃣ Server Actions (Cabinet & Reviews)

### **Flow Diagram**
```
Client Component
    ↓
Server Action (app/actions/cabinet.ts)
    ├─→ 'use server' directive
    ├─→ Get userId from session/cookie
    ├─→ Validate input
    ├─→ Call DB layer (firestore-rest.ts)
    └─→ Return result
    ↓
Client receives response
    ├─→ Update local state
    └─→ Revalidate if needed
```

### **Code References**
- **Cabinet Actions**: `app/actions/cabinet.ts`
- **Review Actions**: `app/actions/reviews.ts`

---

## 🔟 Metadata & SEO Flow

### **Static Metadata**
```
app/layout.tsx
    ├─→ Global metadata (title, description, OG tags)
    └─→ metadataBase for absolute URLs
```

### **Dynamic Metadata**
```
app/spirits/[id]/page.tsx
    ├─→ generateMetadata({ params })
    │   ├─→ Fetch spirit data
    │   ├─→ Build title, description
    │   ├─→ Add OG image URL
    │   └─→ Return metadata object
    └─→ Next.js injects into <head>
```

### **Code References**
- **Root Layout**: `app/layout.tsx`
- **Spirit Detail**: `app/spirits/[id]/page.tsx`
- **Taste Result**: `app/contents/taste/result/[userId]/page.tsx`
- **World Cup Result**: `app/contents/worldcup/result/[id]/page.tsx`

---

## 📊 Performance Optimization Strategies

### **1. Search Index Caching**
- Load once per session
- Store in React Context
- No server calls for search

### **2. Image Preloading (World Cup)**
- Bulk preload all images at game start
- 3-tier fallback (optimized → original → category default)
- Store in memory for instant display

### **3. ISR (Incremental Static Regeneration)**
- `/api/spirits/search`: 30s revalidation
- `/spirits/[id]`: 1h revalidation
- Balance between freshness and performance

### **4. Optimistic UI Updates**
- Cabinet add/remove: Update UI immediately
- Reviews: Show pending state
- Rollback on error

---

## 📚 Related Documentation

- [TECH_STACK.md](./TECH_STACK.md) - 기술 스택
- [DATA_SCHEMA.md](./DATA_SCHEMA.md) - 데이터 스키마
- [API_ENDPOINTS.md](./API_ENDPOINTS.md) - API 문서

---

**Last Updated**: 2026-02-01  
**Version**: 1.0.0
