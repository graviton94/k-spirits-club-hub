# K-Spirits Club Hub

A mobile-first global spirits platform that centralizes liquor data from food safety authorities, import portals, and global communities.

## 🚀 Features

- **1M+ Spirits Database**: Aggregated from Food Safety Korea, Whiskybase, and other sources
- **Mobile-Optimized UI**: Bottom navigation for seamless mobile experience
- **User Cabinet**: Save and organize your favorite spirits
- **Review System**: Write detailed tasting notes with nose, palate, and finish
- **Admin Dashboard**: Data review (검수) and manual publishing workflow
- **PWA-Ready**: Offline access and app-like experience
- **Cloudflare Pages**: Optimized for edge deployment

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Ready for Cloudflare D1 / Turso
- **Deployment**: Cloudflare Pages

## 📦 Installation

```bash
npm install
```

## 🏃 Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Build

```bash
npm run build
```

The output will be generated in the `/out` directory for static export.

## 🌐 Deployment to Cloudflare Pages

1. Build the project:
```bash
npm run build
```

2. Deploy to Cloudflare Pages:
```bash
npm run pages:deploy
```

Or connect your GitHub repository to Cloudflare Pages with these settings:
- **Build command**: `npm run build`
- **Build output directory**: `out`
- **Framework preset**: Next.js (Static HTML Export)

## 📁 Project Structure

```
k-spirits-club-hub/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── cabinet/           # User's saved spirits
│   ├── explore/           # Browse spirits
│   ├── reviews/           # Reviews page
│   ├── spirits/[id]/      # Spirit detail pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── lib/                  # Utilities and logic
│   ├── db/              # Database schema and mock
│   └── utils/           # Data ingestion utilities
└── public/              # Static assets
```

## 🔑 Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
FOOD_SAFETY_KOREA_API_KEY=your_api_key
WHISKYBASE_API_KEY=your_api_key
```

## 📊 Data Ingestion

### Food Safety Korea

```typescript
import { FoodSafetyKoreaIngestion } from '@/lib/utils/foodSafetyKoreaIngestion';

const ingestion = new FoodSafetyKoreaIngestion(process.env.FOOD_SAFETY_KOREA_API_KEY);
const result = await ingestion.batchImport(1000, 100000);
```

### Whiskybase

```typescript
import { WhiskybaseIngestion } from '@/lib/utils/whiskybaseIngestion';

const ingestion = new WhiskybaseIngestion(process.env.WHISKYBASE_API_KEY);
const result = await ingestion.batchImport(500);
```

## 🎨 Mobile-First Design

The application is built with mobile users in mind:
- Bottom navigation for easy thumb access
- Responsive grid layouts
- Touch-optimized UI elements
- PWA support for app-like experience

## 🔐 Admin Dashboard

Access `/admin` to:
- Review unverified spirits data
- Publish or reject submissions
- View statistics and data sources
- Manage bulk operations

## 🚧 Roadmap

- [ ] User authentication (NextAuth.js)
- [ ] Cloudflare D1 database integration
- [ ] Real-time data sync
- [ ] Advanced search and filters
- [ ] AdSense integration
- [ ] Native mobile app (React Native)
- [ ] Social features (following, sharing)
- [ ] B2B sponsorship features

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.
