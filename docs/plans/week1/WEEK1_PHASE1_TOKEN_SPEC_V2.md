# Week 1 Phase 1 - Token Spec v2

Date: 2026-05-03
Status: Draft approved for migration start

## 1) Token Layers

### Layer A: Brand Tokens (identity)
- `--primary`
- `--accent`
- `--background`
- `--foreground`

Usage rule:
- direct brand emphasis, major CTA, hero accents only.

### Layer B: Semantic Tokens (UI intent)
- `background`, `foreground`
- `card`, `card-foreground`
- `muted`, `muted-foreground`
- `secondary`, `secondary-foreground`
- `border`, `input`, `ring`

Usage rule:
- default for component backgrounds/text/borders.

### Layer C: Data Visualization Tokens
- Proposed additions:
  - `--viz-1`, `--viz-2`, `--viz-3`, `--viz-4`, `--viz-5`
  - `--viz-positive`, `--viz-warning`, `--viz-negative`

Usage rule:
- charts/radar/mindmap/score chips only.

## 2) Typography Guardrails v2 (Week 1 policy)

- Minimum interactive/meta font size:
  - Mobile: 11px equivalent (`text-xs` preferred)
  - Desktop dense metadata: 10px only with explicit exception
- Disallowed for new code:
  - `text-[8px]`
  - `text-[9px]`

## 3) Radius / Elevation / Blur Scale

- Radius scale:
  - `r-sm`: rounded-lg
  - `r-md`: rounded-xl
  - `r-lg`: rounded-2xl
  - `r-xl`: rounded-3xl
  - `r-hero`: rounded-[2.5rem]

- Elevation scale:
  - `e-1`: subtle shadow
  - `e-2`: card shadow
  - `e-3`: focus CTA shadow
  - `e-4`: modal/overlay shadow

- Blur scale:
  - `b-1`: backdrop-blur-sm
  - `b-2`: backdrop-blur-md
  - `b-3`: backdrop-blur-xl
  - `b-4`: backdrop-blur-2xl

## 4) State Tokens (semantic intent)

- Success: use semantic mapping token group, avoid direct `green-*` utilities in product UI.
- Warning: semantic warning token mapping.
- Danger: semantic destructive mapping.
- Info: semantic info token mapping.

## 5) Migration Constraints

- No direct replacement by guesswork.
- Migrate by component role:
  - badge/chip
  - button
  - card shell
  - modal shell
- Preserve i18n behavior and layout stability (CLS-safe updates only).

## 6) Exit Definition for Phase 1

- New code: 0 hardcoded color additions.
- New code: 0 `text-[8px]/text-[9px]` additions.
- Existing hotspots: migration list and mapping table finalized (this week).
