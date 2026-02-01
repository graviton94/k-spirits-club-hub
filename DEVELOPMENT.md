# 🛠️ K-Spirits Club - Development Guide

## 📋 Overview
이 문서는 K-Spirits Club 프로젝트의 개발 환경 설정, 코딩 컨벤션, 디버깅 가이드를 제공합니다.

---

## 🚀 Getting Started

### **Prerequisites**
- **Node.js**: 18.x 이상
- **Python**: 3.8 이상
- **Git**: 최신 버전
- **Firebase Project**: Firestore 및 Auth 활성화

---

## 📦 Installation

### **1. Clone Repository**
```bash
git clone https://github.com/graviton94/k-spirits-club-hub.git
cd k-spirits-club-hub
```

### **2. Install Dependencies**
```bash
# Node.js dependencies
npm install

# Python dependencies (for data pipeline)
pip install -r requirements-dev.txt
```

### **3. Environment Variables**
루트 디렉토리에 `.env.local` 파일을 생성합니다:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key

# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

# Site Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Food Safety Korea API (Data Pipeline)
FOOD_SAFETY_KOREA_API_KEY=your-api-key

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### **4. Start Development Server**
```bash
npm run dev
```

사이트는 `http://localhost:3000`에서 실행됩니다.

---

## 🏗️ Project Structure

```
k-spirits-club-hub/
├── app/                    # Next.js App Router
│   ├── api/                # API Routes (Edge Runtime)
│   ├── actions/            # Server Actions
│   ├── context/            # React Contexts
│   ├── (pages)/            # Feature pages
│   └── layout.tsx          # Root layout
│
├── components/             # React Components
│   ├── layout/             # Layout components
│   ├── ui/                 # UI components
│   ├── cabinet/            # Cabinet-related
│   └── admin/              # Admin-only
│
├── lib/                    # Core libraries
│   ├── db/                 # Database layer
│   ├── utils/              # Utility functions
│   ├── constants/          # Constants
│   └── hooks/              # Custom hooks
│
├── scripts/                # Data pipeline scripts
├── public/                 # Static assets
└── data/                   # Data storage (gitignored)
```

---

## 🎨 Coding Conventions

### **TypeScript**
- **Strict Mode**: 모든 타입은 명시적으로 정의
- **Interface vs Type**: 데이터 모델은 `interface`, 유틸리티는 `type`
- **Naming**:
  - Components: PascalCase (`SpiritCard.tsx`)
  - Functions: camelCase (`getOptimizedImageUrl`)
  - Constants: UPPER_SNAKE_CASE (`MAX_UPLOAD_SIZE`)

```typescript
// ✅ Good
interface Spirit {
  id: string;
  name: string;
}

export function formatSpirit(spirit: Spirit): string {
  return `${spirit.name} (${spirit.id})`;
}

// ❌ Bad
const spirit: any = { ... };
function format(s) { ... }
```

### **React Components**
- **Functional Components**: 모든 컴포넌트는 함수형으로 작성
- **Props Interface**: 모든 props는 인터페이스로 정의
- **'use client' Directive**: 클라이언트 컴포넌트에만 추가

```typescript
'use client';

interface SpiritCardProps {
  spirit: Spirit;
  onClick?: () => void;
}

export function SpiritCard({ spirit, onClick }: SpiritCardProps) {
  return (
    <div onClick={onClick}>
      <h3>{spirit.name}</h3>
    </div>
  );
}
```

### **CSS & Styling**
- **Tailwind CSS**: 모든 스타일링은 Tailwind 유틸리티 클래스 사용
- **Custom Classes**: 반복되는 패턴만 `globals.css`에 추가
- **Dark Mode**: `dark:` prefix 사용

```tsx
// ✅ Good
<div className="bg-card border border-border rounded-2xl p-4 dark:bg-card-dark">

// ❌ Bad (inline styles)
<div style={{ backgroundColor: '#fff', padding: '16px' }}>
```

### **File Organization**
- **One Component Per File**: 하나의 파일에는 하나의 주요 컴포넌트만
- **Index Files**: 여러 컴포넌트를 export할 때만 `index.ts` 사용
- **Co-location**: 관련 파일들은 같은 디렉토리에 배치

```
components/cabinet/
├── MyCabinet.tsx           # Main component
├── CabinetSpiritCard.tsx   # Sub-component
├── SearchSpiritModal.tsx   # Related modal
└── TasteRadar.tsx          # Related visualization
```

---

## 🔧 Development Workflows

### **Adding a New Feature**
1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature-name
   ```

2. **Implement Feature**
   - Add components in `components/`
   - Add page in `app/`
   - Add API route in `app/api/` (if needed)

3. **Test Locally**
   ```bash
   npm run dev
   ```

4. **Commit & Push**
   ```bash
   git add .
   git commit -m "feat: Add new feature description"
   git push origin feature/new-feature-name
   ```

### **Adding a New API Endpoint**
1. **Create Route File**
   ```
   app/api/new-endpoint/route.ts
   ```

2. **Implement Handler**
   ```typescript
   import { NextRequest, NextResponse } from 'next/server';
   
   export const runtime = 'edge';
   
   export async function GET(req: NextRequest) {
     // Implementation
     return NextResponse.json({ data: [] });
   }
   ```

3. **Test with cURL**
   ```bash
   curl http://localhost:3000/api/new-endpoint
   ```

### **Modifying Data Schema**
1. **Update TypeScript Interface**
   ```typescript
   // lib/db/schema.ts
   export interface Spirit {
     // ... existing fields
     newField: string;  // Add new field
   }
   ```

2. **Update Firestore Converters**
   ```typescript
   // lib/db/firestore-rest.ts
   function parseFirestoreFields(fields: any): Spirit {
     return {
       // ... existing mappings
       newField: fields.newField?.stringValue || '',
     };
   }
   ```

3. **Migration Script** (if needed)
   ```bash
   npx tsx scripts/migrate-new-field.ts
   ```

---

## 🐛 Debugging

### **Client-Side Debugging**
- **React DevTools**: 컴포넌트 상태 및 props 검사
- **Console Logs**: `console.log`, `console.error` 사용
- **Network Tab**: API 호출 및 응답 확인

### **Server-Side Debugging**
- **Edge Runtime Logs**: Cloudflare Dashboard에서 실시간 로그 확인
- **Local Development**: `console.log`는 터미널에 출력

```typescript
// API Route Debugging
export async function GET(req: NextRequest) {
  console.log('[API] Request received:', req.url);
  
  try {
    const data = await fetchData();
    console.log('[API] Data fetched:', data.length);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('[API] Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

### **Firebase Debugging**
- **Firestore Console**: Firebase Console에서 직접 데이터 확인
- **Firestore Emulator**: 로컬 테스트 (선택 사항)
  ```bash
  firebase emulators:start --only firestore
  ```

### **Python Pipeline Debugging**
```bash
# Verbose mode
python scripts/run_pipeline.py --source data/spirits.json --verbose

# Skip upload (offline mode)
python scripts/run_pipeline.py --source data/spirits.json --skip-upload

# Single item test
python scripts/run_pipeline.py --source data/test_single.json --batch-size 1
```

---

## 🧪 Testing

### **Unit Testing** (Not yet implemented)
```bash
# Future: Jest + React Testing Library
npm run test
```

### **Manual Testing Checklist**
- [ ] Authentication (Google Login, Guest Mode)
- [ ] Search functionality
- [ ] Add/Remove from cabinet
- [ ] Write/Edit/Delete review
- [ ] AI Taste Analysis
- [ ] World Cup game flow
- [ ] Image loading & fallbacks
- [ ] Mobile responsiveness
- [ ] Dark mode

### **Performance Testing**
```bash
# Lighthouse CI
npm run lighthouse

# Bundle Analysis
npm run build
npx @next/bundle-analyzer
```

---

## 📊 Common Tasks

### **Regenerate Search Index**
```typescript
// app/api/spirits/search/route.ts
// Just call the API endpoint - it automatically regenerates
fetch('/api/spirits/search');
```

### **Bulk Publish Spirits**
```bash
npx tsx scripts/publish-ready-data.ts
```

### **Clear Local Data**
```bash
rm -rf data/processed_batches/*
rm -rf data/temp_pipeline/*
```

### **Reset Firebase Data** (Caution!)
```typescript
// Use Firebase Console or Admin SDK
// DO NOT use in production!
const spiritsRef = collection(db, 'spirits');
const batch = writeBatch(db);
const querySnapshot = await getDocs(spiritsRef);
querySnapshot.forEach(doc => batch.delete(doc.ref));
await batch.commit();
```

---

## 🚢 Deployment

### **Cloudflare Pages Deployment**
```bash
# 1. Build for production
npm run build

# 2. Build Cloudflare Pages adapter
npm run pages:build

# 3. Deploy
npx wrangler pages deploy .next/out
```

### **Environment Variables (Cloudflare)**
1. Cloudflare Dashboard → Pages → Settings → Environment Variables
2. Add all variables from `.env.local`
3. Redeploy

### **Deployment Checklist**
- [ ] All environment variables set
- [ ] Firebase indexes deployed (`firebase deploy --only firestore:indexes`)
- [ ] Search index generated
- [ ] Test critical paths (search, cabinet, AI analysis)
- [ ] Verify OG images for sharing

---

## 🔍 Troubleshooting

### **Issue: "Expected 1 arguments, but got 0" (TypeScript)**
**Solution**: Use `document.createElement('img')` instead of `new Image()`
```typescript
// ❌ Wrong
const img = new Image();

// ✅ Correct
const img = document.createElement('img') as HTMLImageElement;
```

### **Issue: Image not loading**
**Solution**: Use fallback images
```typescript
<Image
  src={imageUrl || getCategoryFallbackImage(category)}
  onError={(e) => {
    (e.target as HTMLImageElement).src = getCategoryFallbackImage(category);
  }}
/>
```

### **Issue: API 500 Error**
**Solution**: Check Cloudflare logs and environment variables
```bash
# View logs
npx wrangler pages deployment tail

# Verify env vars
npx wrangler pages deployment list
```

### **Issue: Search index not loading**
**Solution**: Regenerate index
```bash
# Call API manually
curl https://k-spirits.club/api/spirits/search
```

### **Issue: AI Analysis fails**
**Solution**: Check Gemini API quota and key
```bash
# Verify API key is set
echo $GEMINI_API_KEY

# Check usage quota in Google Cloud Console
```

---

## 📚 Resources

### **Documentation**
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)

### **Internal Docs**
- [TECH_STACK.md](./TECH_STACK.md)
- [DATA_SCHEMA.md](./DATA_SCHEMA.md)
- [API_ENDPOINTS.md](./API_ENDPOINTS.md)
- [CODE_FLOW.md](./CODE_FLOW.md)

---

## 🤝 Contributing

### **Code Review Guidelines**
- PR은 최소 1명의 승인 필요
- 모든 TypeScript 에러 해결
- 모바일 테스트 필수
- 커밋 메시지는 Conventional Commits 형식

### **Commit Message Format**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅
- `refactor`: 리팩토링
- `perf`: 성능 개선
- `test`: 테스트 추가
- `chore`: 빌드/도구 변경

**Example:**
```
feat(worldcup): Add image preloading for faster game start

- Implemented bulk image preloading at game initialization
- Added 3-tier fallback system (optimized → original → category default)
- Removed individual image preloader to avoid redundancy

Closes #123
```

---

**Last Updated**: 2026-02-01  
**Version**: 1.0.0
