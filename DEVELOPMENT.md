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
본 프로젝트는 **Cloudflare Workers (OpenNext)** 환경에서 구동됩니다. 환경변수 관리는 아래의 원칙을 반드시 따릅니다.

1. **로컬 개발**: `.env.local` 파일에 모든 키를 저장합니다.
2. **배포 환경 (Cloudflare)**: 
   - 모든 환경변수는 Cloudflare 대시보드의 **Settings > Variables** 메뉴에서 **"Variable" (평문)** 타입으로 등록합니다.
   - **Secret** 타입은 프레임워크(OpenNext) 바인딩 이슈를 방지하기 위해 지양합니다.
3. **Wrangler 선언**: 새로운 환경변수를 추가할 경우, 반드시 [wrangler.jsonc](file:///c:/k-spirits-club-hub/wrangler.jsonc)의 `vars` 섹션에도 키 이름을 등록해야 합니다.

```env
# Essential Keys
FIREBASE_PROJECT_ID=k-spirits-club
GEMINI_API_KEY=your-gemini-api-key
... (기타 모든 변수 리스트)
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

## 🚢 Deployment (Cloudflare Workers)

### **Deployment Command**
OpenNext를 사용하여 Cloudflare Workers로 배포합니다.
```bash
# 1. Build and Deploy
npm run worker:deploy
```

### **Deployment Checklist**
- [ ] [wrangler.jsonc](file:///c:/k-spirits-club-hub/wrangler.jsonc)의 `vars` 섹션에 키가 모두 등록되어 있는가?
- [ ] Cloudflare 대시보드에 모든 값이 **Variable**로 입력되어 있는가?
- [ ] Firebase Data Connect 스키마가 배포되었는가?

---

**Last Updated**: 2026-04-21  
**Version**: 1.1.0 (PostgreSQL/Data Connect)
