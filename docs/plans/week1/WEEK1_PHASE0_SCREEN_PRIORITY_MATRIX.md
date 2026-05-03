# Week 1 Phase 0 - Screen Priority Matrix

Date: 2026-05-03
Scoring model: `Impact (1-5) x Violation Density (1-5) x Mobile Sensitivity (1-5)`

## High Priority

1. Home / core discovery surfaces
- Main files: `app/[lang]/page.tsx`, `components/home/HomeClient.tsx`, `components/ui/SpiritCard.tsx`
- Reason: highest user exposure and CTA concentration.

2. Admin data curation surfaces
- Main files: `app/[lang]/admin/page.tsx`, `components/admin/AdminSpiritCard.tsx`
- Reason: largest tiny-font and hardcoded palette hotspot.

3. Spirit detail + reviews
- Main files: `app/[lang]/spirits/[id]/spirit-detail-client.tsx`, `components/ui/ReviewSection.tsx`
- Reason: dense chips/tags and repeated mixed token patterns.

4. WorldCup gameplay/result
- Main files: `app/[lang]/contents/worldcup/game/page.tsx`, `app/[lang]/contents/worldcup/result/[id]/page.tsx`
- Reason: mobile-first interaction with small typography pressure.

## Medium Priority

1. Content guides and hubs
- Main files: `components/contents/SpiritGuideLayout.tsx`, `app/[lang]/contents/page.tsx`

2. News and reviews list experiences
- Main files: `app/[lang]/contents/news/news-client.tsx`, `app/[lang]/contents/reviews/reviews-client.tsx`

3. Cabinet secondary views
- Main files: `components/cabinet/*` (excluding critical add/review modal paths)

## Low Priority

1. Legal and static information pages
- Main files: `app/[lang]/contents/privacy/page.tsx`, `app/[lang]/contents/terms/page.tsx`

2. OG generation routes
- Main files: `app/api/og/wiki/route.tsx`, `app/api/og/spirit/route.tsx`

3. Wiki constants color maps
- Main files: `lib/constants/wiki/*.ts`

## Week 1 Freeze Boundary (Do Not Touch Yet)

- OG routes and wiki constants remain unchanged in Week 1.
- Focus Week 1 implementation decisions on governance docs, not UI refactors.

## Week 2 Migration Order Recommendation

1. `app/[lang]/admin/page.tsx`
2. `components/admin/AdminSpiritCard.tsx`
3. `components/ui/ReviewSection.tsx`
4. `app/[lang]/spirits/[id]/spirit-detail-client.tsx`
5. `app/[lang]/contents/worldcup/game/page.tsx`
6. `app/[lang]/contents/worldcup/result/[id]/page.tsx`
