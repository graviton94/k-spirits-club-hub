# Week 1 Phase 1 - Rulebook (Allowed Classes / Forbidden Patterns)

Date: 2026-05-03
Scope: app runtime UI and shared components

## Allowed

1. Semantic surface/text/border
- `bg-background`, `bg-card`, `bg-muted`
- `text-foreground`, `text-muted-foreground`
- `border-border`

2. Brand emphasis
- `bg-primary`, `text-primary`, `border-primary`
- `bg-accent`, `text-accent`, `border-accent`

3. Existing premium utilities
- `btn-premium`, `btn-premium-outline`
- `card-premium`, `glass-premium`, `capsule-premium`

4. Controlled opacity forms
- token-based alpha forms (`bg-primary/10`, `text-foreground/60`, etc.)

## Forbidden (for new code immediately)

1. Arbitrary small typography
- `text-[8px]`, `text-[9px]`

2. Direct hardcoded palette utilities for UI intent
- `text-slate-*`, `bg-gray-*`, `border-zinc-*`, etc.

3. Hex literals in runtime UI TSX/CSS
- any new `#RRGGBB`/`#RGB` in component logic and class strings

4. Mixed semantic + arbitrary palette in one semantic role block
- example: CTA using `bg-primary` but `text-slate-400`

## Review Checklist (PR gate)

1. No new forbidden patterns introduced.
2. New chips/badges use semantic variants only.
3. New buttons map to existing premium button utilities or semantic button variants.
4. Mobile text remains readable (no sub-10px interactive labels).

## Temporary Exceptions

1. `app/api/og/**` inline styles (until OG token adapter)
2. data visualization literals before viz token migration
3. third-party brand color requirements (isolated CTA only)

## Enforcement Plan

1. Week 1-2
- Manual PR checklist enforcement.

2. Week 2
- Add lint/grep CI guard for:
  - `text-[8px]`, `text-[9px]`
  - newly added hex literals in `app/components`

3. Week 3+
- Expand to automatic class policy checks for hardcoded palette classes.
