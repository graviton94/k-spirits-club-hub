# Phase 2-5 Global Design Migration Report

Date: 2026-05-03
Scope: global migration across app/components (excluding explicit special-case surfaces)

## 1. Objective

Unify design language globally by minimizing hardcoded UI styles and enforcing semantic token usage.

## 2. Before/After Metrics

Baseline (Week 1):
- tiny_font_px: 233
- hex_color: 54
- hardcoded_palette: 649
- semantic_token: 983

After Phase 2-5 migration:
- tiny_font_px: 0
- hex_color: 40
- hardcoded_palette: 0
- semantic_token: 1420

## 3. What Was Applied

1. Global codemod pass across app/components/lib runtime UI:
- `text-[8|9|10]px` -> semantic size class normalization
- neutral palette hardcoding (`gray/slate/zinc/neutral`) -> semantic tokens
- broad status/accent palette normalization (`red/blue/green/purple/amber`) -> semantic token axis

2. Manual hotspot normalization on core UI surfaces:
- theme controls (`ThemeToggle`, `ThemeSwitcher`)
- request modal surface (`ModificationRequestButton`)
- worldcup result card UI
- cabinet loading shell
- admin status/tag surfaces (`AdminSpiritCard`, `AdminStats`, `TagMultiSelect`)
- minor residuals in profile/micro-review/chat surfaces

## 4. Intentional Exceptions (Special Cases)

The remaining hex literals are kept as explicit exceptions:

1. OG rendering routes
- `app/api/og/wiki/route.tsx`
- `app/api/og/spirit/route.tsx`

2. Data visualization / game rendering colors
- `components/cabinet/MindMap.tsx`
- `components/cabinet/TasteRadar.tsx`
- `app/[lang]/contents/perfect-pour/perfect-pour-client.tsx`
- `app/[lang]/contents/worldcup/game/page.tsx`
- `app/[lang]/contents/mbti/mbti-client.tsx`

3. Theme metadata and token comments
- `app/[lang]/layout.tsx` (themeColor)
- `app/[lang]/globals.css` (token comments and brand gradient literal stop)

4. Partner brand pin
- `components/ui/ChatSommelier.tsx` (`#03C75A`)

## 5. Risk Notes

1. This migration was broad and class-based; visual QA is mandatory before full rollout.
2. Special-case surfaces (games/charts/OG) were preserved by design for behavior safety.
3. If any section appears over-flattened, tune using semantic utilities (`primary`, `accent`, `destructive`) rather than restoring hardcoded palette classes.

## 6. Recommended Review Flow (for Phase 6)

1. Home -> Explore -> Spirit Detail -> Review flow
2. Admin dashboard/list/card/edit modal flow
3. WorldCup + MBTI + Perfect Pour interaction flow
4. Mobile viewport pass (390px, 430px, 768px)
5. Dark/light toggle regression pass
