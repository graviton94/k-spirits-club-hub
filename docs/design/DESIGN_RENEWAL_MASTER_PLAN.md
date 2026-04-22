# DESIGN RENEWAL MASTER PLAN (Amber / Orange / Beige / Dark Brown)

## Objective
- Keep premium brand palette (`amber/orange/beige/dark-brown`) while maximizing readability in both themes.
- Enforce:
  - Light theme = light surfaces + dark text
  - Dark theme = dark surfaces + bright text

## Phase 1 — Foundation Tokens (Completed)
- Global palette and utility alignment in [app/[lang]/globals.css](../../app/[lang]/globals.css)
- Accent shifted to orange-compatible tone.
- Added `--primary-rgb`, `--accent-rgb` for consistent glow/shadow compatibility.
- Improved `glass-premium` to token-based border/surface.

## Phase 2 — Home / Discovery UX (Completed)
- Hero search surface cleanup in [components/home/HomeClient.tsx](../../components/home/HomeClient.tsx)
- Removed AI marketing badge from hero.
- New Arrivals:
  - removed heavy card/image shadows
  - category label removed
  - bilingual product-name fallback fixed (`nameEn` -> `name_en` -> `name`)
  - list CTA route fixed to `/explore`
- Wiki section background normalized for readability.

## Phase 3 — Search Readability (Completed)
- Hero search and dropdown readability normalized in [components/ui/SearchBar.tsx](../../components/ui/SearchBar.tsx)
- Removed hardcoded dark-only text colors in hero mode.
- Added missing `Sparkles` import runtime safety.

## Phase 4 — Navigation / Runtime Stability (Completed)
- Desktop bottom quick nav visibility enabled in [components/layout/BottomNav.tsx](../../components/layout/BottomNav.tsx)
- Runtime icon-import crashes fixed:
  - [app/[lang]/contents/worldcup/worldcup-client.tsx](../../app/[lang]/contents/worldcup/worldcup-client.tsx)
  - [components/ui/ExploreContent.tsx](../../components/ui/ExploreContent.tsx)

## Phase 5 — API Resilience (Completed)
- Cabinet DNA endpoint hardening in [app/api/analyze-taste/route.ts](../../app/api/analyze-taste/route.ts)
  - handles missing Gemini key without 500
  - supports both `recommendation` and `recommendations` payload shapes
- Chat endpoint fallback in [app/api/ai/sommelier/route.ts](../../app/api/ai/sommelier/route.ts)
  - returns graceful message when model key is unavailable

## Phase 6 — Public Copy Cleanup (Completed)
- Removed public AI wording from key user-facing surfaces:
  - [components/cabinet/FlavorView.tsx](../../components/cabinet/FlavorView.tsx)
  - [components/cabinet/TasteRecommendationSection.tsx](../../components/cabinet/TasteRecommendationSection.tsx)
  - [components/cabinet/TastePublicReport.tsx](../../components/cabinet/TastePublicReport.tsx)
  - [components/ui/ChatSommelier.tsx](../../components/ui/ChatSommelier.tsx)
  - [components/home/NewsSection.tsx](../../components/home/NewsSection.tsx)
  - [components/cabinet/CabinetClient.tsx](../../components/cabinet/CabinetClient.tsx)

## Validation
- Production build (`npm run build`): passed.

## Next Optional Phase
- Extend same copy/theme normalization to admin-only screens for full repository consistency.
