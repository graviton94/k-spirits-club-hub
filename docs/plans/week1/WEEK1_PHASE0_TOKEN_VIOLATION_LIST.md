# Week 1 Phase 0 - Token Violation List

Date: 2026-05-03

## A. Violation Types

1. Hardcoded palette classes in product UI
- Pattern: `bg-amber-500`, `text-slate-400`, `border-zinc-200`, etc.
- Risk: weak theme parity and inconsistent semantic meaning.

2. Hex literals in TS/TSX logic and styles
- Pattern: `#f59e0b`, `#03C75A`, `#1a1a1a`
- Risk: bypasses token governance and visual drift over time.

3. Micro text overuse
- Pattern: `text-[8px]`, `text-[9px]`, `text-[10px]`
- Risk: mobile readability and accessibility degradation.

4. Mixed token/hardcoded composition in single component
- Pattern: same UI block contains `bg-primary` plus `text-slate-*`
- Risk: hard-to-predict dark/light behavior.

## B. Priority Violations (Top Targets)

### P0 (Week 2 immediate migration target)
- `app/[lang]/admin/page.tsx`
- `components/admin/AdminSpiritCard.tsx`
- `components/ui/ReviewSection.tsx`
- `app/[lang]/spirits/[id]/spirit-detail-client.tsx`

### P1 (Week 2-3 batch target)
- `components/contents/SpiritGuideLayout.tsx`
- `app/[lang]/contents/worldcup/game/page.tsx`
- `app/[lang]/contents/worldcup/result/[id]/page.tsx`
- `app/[lang]/contents/reviews/reviews-client.tsx`

### P2 (Controlled exception / later)
- `app/api/og/wiki/route.tsx`
- `app/api/og/spirit/route.tsx`
- `lib/constants/wiki/*.ts`

## C. Allowed Temporary Exceptions (Week 1)

1. OG image routes
- explicit palette allowed until OG token adapter is introduced.

2. Data-visualization stroke/fill values
- chart libs may keep literal values if token bridge is not yet defined.

3. External brand color pins
- e.g., partner/platform brand colors in isolated CTA areas only.

## D. Forbidden Patterns (effective now for new code)

- New `text-[8px]` or `text-[9px]` in interactive UI.
- New arbitrary hex literals in app/components runtime UI.
- New direct `bg-*/text-*/border-*` palette classes when semantic tokens exist.

## E. Tracking Fields

For each migrated file, log:
- `before_hardcoded_count`
- `after_hardcoded_count`
- `before_tiny_font_count`
- `after_tiny_font_count`
- `token_class_delta`
