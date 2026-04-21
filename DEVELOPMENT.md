# 🛠️ K-Spirits Club - Development Guide

## 📋 Overview
이 문서는 K-Spirits Club 프로젝트의 개발 환경 설정, 코딩 컨벤션, 디버깅 가이드를 제공합니다.

---

## 🚀 Getting Started

### **Prerequisites**
- **Node.js**: 18.x 이상
- **Python**: 3.10 이상
- **Git**: 최신 버전
- **Firebase Project**: Data Connect (PostgreSQL) 및 Auth 활성화

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
# Firebase Configuration (Data Connect)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_API_KEY=your-api-key

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

> **중요**: `.env` 파일은 반드시 `KEY=VALUE` 형식을 따라야 합니다. JavaScript 객체 타입이나 다른 코드 문법을 포함하면 파싱 에러가 발생합니다.

### **4. Start Development Server**
```bash
npm run dev
```

---

## 🏗️ Project Structure

```
k-spirits-club-hub/
├── app/                    # Next.js App Router
│   ├── api/                # API Routes (Edge Runtime)
│   ├── actions/            # Server Actions
│   ├── context/            # React Contexts
│   └── (pages)/            # Feature pages
│
├── components/             # React Components
│   ├── layout/             # Layout components
│   ├── ui/                 # UI components
│   ├── cabinet/            # Cabinet-related
│   └── admin/              # Admin-only
│
├── lib/                    # Core libraries
│   ├── db/                 # Database layer (Data Connect)
│   ├── utils/              # Utility functions
│   └── hooks/              # Custom hooks
│
├── dataconnect/            # Firebase Data Connect (SQL)
│   ├── schema/             # PostgreSQL Schema
│   └── main/               # Queries & Mutations
│
├── scripts/                # Data pipeline scripts
└── public/                 # Static assets
```

---

## 🔧 Development Workflows

### **Modifying Data Schema (Relational SQL)**
1. **Update GraphQL Schema** in `dataconnect/schema/schema.gql`.
2. **Generate SDK & Types**:
   ```bash
   npx firebase-tools dataconnect:sdk:generate
   ```
3. **Update Queries/Mutations** in `dataconnect/main/`.

### **Bulk Publish Spirits**
```bash
npx tsx scripts/publish-ready-data.ts
```

---

## 🚢 Deployment

### **Cloudflare Pages Deployment**
```bash
# 1. Build for production
npm run build
# 2. Deploy
npx wrangler pages deploy .next/out
```

### **Deployment Checklist**
- [ ] All environment variables set
- [ ] Firebase Data Connect schema deployed (`firebase deploy --only dataconnect`)
- [ ] Search index generated (`/api/spirits/search`)

---

**Last Updated**: 2026-04-21  
**Version**: 1.1.0 (PostgreSQL/Data Connect)
