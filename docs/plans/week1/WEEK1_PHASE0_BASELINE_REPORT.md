# Week 1 Phase 0 - Design Baseline Report

Date: 2026-05-03
Scope: `app/**/*.tsx`, `components/**/*.tsx` (baseline scan), plus hotspot references in `lib/**`
Method: PowerShell `Select-String` pattern count (no runtime rendering pass yet)

## 1) Baseline Metrics

- `text-[8|9|10]px` usage count: **233**
- Hex color literal (`#...`) usage count: **54**
- Hardcoded palette class usage (`bg/text/border-(amber|zinc|slate|gray|stone|neutral|red|blue|green|purple)-*`): **649**
- Semantic token class usage (`bg/text/border-(background|foreground|primary|secondary|accent)`): **983**

Interpretation:
- Semantic token adoption is already substantial.
- Hardcoded palette pressure is still high and coexists with token usage.
- Micro typography density (`8-10px`) remains widespread, especially in admin/content dense surfaces.

## 2) Top Hotspots (Quantified)

### Tiny font hotspots (`text-[8|9|10]px`)
1. `app/[lang]/admin/page.tsx` (39)
2. `components/contents/SpiritGuideLayout.tsx` (17)
3. `components/admin/AdminSpiritCard.tsx` (16)
4. `app/[lang]/contents/worldcup/game/page.tsx` (12)
5. `app/[lang]/contents/reviews/reviews-client.tsx` (9)
6. `app/[lang]/contents/worldcup/result/[id]/page.tsx` (9)

### Hex literal hotspots
1. `lib/constants/tag-colors.ts` (13)
2. `app/api/og/wiki/route.tsx` (10)
3. `app/[lang]/globals.css` (8)
4. `components/cabinet/MindMap.tsx` (6)
5. `app/[lang]/contents/perfect-pour/perfect-pour-client.tsx` (6)

### Hardcoded palette hotspots
1. `app/[lang]/admin/page.tsx` (59)
2. `lib/constants/wiki/oak-barrel.ts` (32)
3. `lib/constants/wiki/brandy-regions.ts` (22)
4. `app/[lang]/contents/privacy/page.tsx` (21)
5. `components/ui/ReviewSection.tsx` (21)
6. `app/[lang]/contents/terms/page.tsx` (19)
7. `app/[lang]/spirits/[id]/spirit-detail-client.tsx` (18)
8. `components/spirits/RelatedWikiSection.tsx` (18)
9. `components/admin/AdminSpiritCard.tsx` (18)

## 3) Asset Inventory Snapshot

- Token foundation exists in `app/[lang]/globals.css` and `tailwind.config.mjs`.
- Utility abstractions exist (`btn-premium`, `card-premium`, `capsule-premium`) but mixed with ad-hoc color classes.
- Dense information widgets are concentrated in Admin, Review, Spirit detail, WorldCup game/result, and guide layouts.

## 4) Baseline Freeze Decision

Week 1 freeze baseline for migration tracking:
- Color baseline metric: `hardcoded_palette=649`, `semantic_token=983`
- Typography baseline metric: `tiny_font_px=233`
- Hex literal baseline metric: `hex_color=54`

These are the reference values for Week 2 delta checks.

## 5) Immediate Risk Notes

- High regression risk if Admin and Review surfaces are changed without a shared chip/badge text scale.
- OG routes intentionally use explicit color literals; treat as controlled exception until Phase 3/4 alignment.
- Wiki constants are content-style heavy; migrate via mapping table, not file-by-file arbitrary edits.

## 6) Week 1 Exit Check (Phase 0 portion)

- [x] Baseline metrics quantified
- [x] Style hotspot inventory identified
- [x] Screen/component priority input prepared
- [ ] Mobile usability capture logs (manual flows) - pending hands-on QA pass
