# Week 1 Phase 1 - Color Mapping Table (old -> new)

Date: 2026-05-03
Purpose: deterministic replacement map for migration PRs

## 1) Core Utility Mapping

| Old Pattern | New Token Pattern | Notes |
|---|---|---|
| `bg-white`, `dark:bg-black` | `bg-background` | Theme-safe default surface |
| `text-black`, `text-white` | `text-foreground` / `text-primary-foreground` | Choose by surface contrast role |
| `border-gray-200`, `border-zinc-200`, `dark:border-zinc-800` | `border-border` | Unified border token |
| `bg-gray-50`, `dark:bg-slate-900` | `bg-muted` or `bg-card` | Depends on depth role |
| `text-gray-500`, `text-slate-400` | `text-muted-foreground` | Secondary text |

## 2) Status/Intent Mapping

| Old Pattern | New Token Pattern | Intent |
|---|---|---|
| `bg-green-100 text-green-700 border-green-200` | `bg-secondary text-secondary-foreground border-border` + state icon | success |
| `bg-red-100 text-red-700 border-red-200` | `bg-destructive/10 text-destructive border-destructive/20` | danger |
| `bg-amber-100 text-amber-700 border-amber-200` | `bg-primary/10 text-primary border-primary/20` | warning/highlight |
| `bg-blue-100 text-blue-700 border-blue-200` | `bg-accent/10 text-accent border-accent/20` | info |

## 3) Chip/Badge Mapping

| Old Pattern | New Pattern |
|---|---|
| `text-[10px] ... uppercase tracking-widest` | `text-xs` + standardized chip class (`capsule-premium` base) |
| hardcoded color chip arrays | semantic chip variants (`chip-primary`, `chip-muted`, `chip-danger`) |

## 4) Gradient Mapping

| Old Pattern | New Pattern |
|---|---|
| `linear-gradient(... #f97316)` | `bg-brand-gradient` utility |
| ad-hoc highlight gradients | `text-brand-gradient` or semantic surface utilities |

## 5) Exception Mapping (defer)

- OG route inline style colors:
  - keep as is in Week 1, migrate in dedicated OG token PR.
- Chart stroke/fill literals:
  - migrate after `--viz-*` token landing.

## 6) First Migration Batch Targets

1. `app/[lang]/admin/page.tsx`
2. `components/admin/AdminSpiritCard.tsx`
3. `components/ui/ReviewSection.tsx`
4. `app/[lang]/spirits/[id]/spirit-detail-client.tsx`
