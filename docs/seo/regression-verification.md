# SEO Regression Verification Guide

## Overview

This document describes the **SEO regression verification suite** for K-Spirits Club. It provides a single runnable check that detects regressions across all previously fixed SEO areas.

---

## What Is Being Checked

| Section | Area | Description |
|---------|------|-------------|
| A | Public HTML quality | Status codes, loading-shell leakage, main content presence |
| B | Metadata | Title, description, canonical, hreflang, OG/Twitter tags, noindex |
| C | Sitemap / robots.txt | Required URLs present, private pages excluded, robots directives |
| D | Spirit routes | Indexable vs thin content, missing spirit 404, locale leakage |
| E | Archive pagination | SSR list items, page 2 canonical, filter variant noindex |
| F | Crawlable links | Deep section links, locale consistency, wiki category links |
| G | Private route safety | Code inspection of cabinet/me/admin/contact exclusions |

Section G runs without a live server by inspecting source files directly.
Sections A–F require a reachable server.

---

## Sample URL Matrix

| Path | Expected behavior |
|------|-------------------|
| `/ko` | 200, indexable, Korean title, canonical = `https://kspiritsclub.com/ko` |
| `/en` | 200, indexable, English title, canonical = `https://kspiritsclub.com/en` |
| `/en/spirits/mfds-202600027635` | 200, indexable, specific title, no noindex |
| `/ko/contents/mbti` | 200, indexable, Korean title |
| `/en/contents/worldcup` | 200, indexable, English title |
| `/en/contents/reviews` | 200, indexable, canonical without `?page=` |
| `/en/contents/reviews?page=2` | 200, canonical = `...?page=2` |
| `/en/contents/reviews?q=whisky` | 200, **noindex** (search variant) |
| `/en/contents/news` | 200, indexable, SSR list items |
| `/en/contents/wiki` | 200, has links to category pages |
| `/en/contents/contact` | 200, **noindex** (utility page) |
| `/ko/cabinet` | blocked in robots.txt |
| `/ko/me` | blocked in robots.txt |
| `/ko/admin` | blocked in robots.txt |

---

## How to Run

### Prerequisites

- Node.js 20+ (global `fetch` available without experimental flags since Node 21; Node 20 includes it as well-supported)
- `cheerio` installed (`npm install` from repo root)

### Local development

```bash
# Start the dev server first
npm run dev

# In another terminal:
node scripts/seo/regression-check.mjs http://localhost:3000
```

Or with the npm script:

```bash
npm run seo:check
```

### Staging / production

```bash
BASE_URL=https://kspiritsclub.com node scripts/seo/regression-check.mjs
# or
node scripts/seo/regression-check.mjs https://kspiritsclub.com
```

### Code-inspection only (no server needed)

If you only want to run the code-level safety checks (section G):

```bash
# The script auto-detects an unreachable localhost and runs code checks only
node scripts/seo/regression-check.mjs
```

### Custom fixtures

Use environment variables to target specific spirit IDs:

```bash
SEO_INDEXABLE_SPIRIT_ID=mfds-202600027635 \
SEO_THIN_SPIRIT_ID=some-thin-spirit-id \
SEO_MISSING_SPIRIT_ID=nonexistent-xyz \
SEO_WIKI_SLUG=korean-soju \
BASE_URL=https://kspiritsclub.com \
node scripts/seo/regression-check.mjs
```

---

## Output Format

Each check prints one of three levels:

| Symbol | Level | Meaning |
|--------|-------|---------|
| ✅ | `PASS` | Check passed |
| ⚠️ | `WARN` | Non-blocking issue to investigate |
| ❌ | `FAIL` | **BLOCKER** — must fix before deploying |

At the end, a summary is printed:

```
═══════════════════════════════════════════════════════════
SEO Regression Check — Results
═══════════════════════════════════════════════════════════

Section A: 12 PASS  0 WARN  0 FAIL
  ✅ [PASS] Korean homepage — status 200
  ✅ [PASS] Korean homepage — no loading-shell leakage
  ...

Total: 64 checks  |  60 PASS  |  3 WARN  |  1 FAIL (BLOCKER)

🚨 1 BLOCKER failure(s) detected. Fix before deploying.
```

**Exit code**: `0` = no blockers, `1` = one or more blockers.

---

## What Failures Mean

### Blocker failures (exit code 1)

| Failure | Root cause | Fix |
|---------|-----------|-----|
| Public page returns non-200 | SSR error, deployment issue | Check Next.js logs |
| Loading-shell leakage | `'use client'` boundary issue, SSR disabled | Move data fetch to server component |
| Main content too thin | Page returns shell only | Check SSR data fetching |
| Double brand suffix in title | `%s \| K-Spirits Club` template applied twice | Check layout metadata template |
| Canonical not absolute | Missing `metadataBase` or wrong utility function | Use `getCanonicalUrl()` from `lib/utils/seo-url.ts` |
| Unexpected noindex on public page | Metadata regression | Check `generateMetadata()` return value |
| Contact/utility page not noindex | Missing robots directive | Add `robots: { index: false, follow: true }` to page metadata |
| Sitemap includes private path | Regression in `app/sitemap.ts` | Remove private path from static pages array |
| Sitemap missing required public URL | Path removed from static pages | Re-add to `app/sitemap.ts` |
| robots.txt missing Disallow | Regression in `app/robots.ts` | Restore disallow rule |
| Indexable spirit is noindex | Tier classification regression | Check `isIndexableSpirit()` logic |
| Missing spirit returns indexable 200 | `notFound()` not called | Ensure spirit page calls `notFound()` on missing ID |
| Filter variant not noindex | `hasFilterParams()` check missing | Re-add filter noindex in `generateMetadata()` |
| seo-url.ts not imported | Refactor removed canonical/hreflang | Re-import `getCanonicalUrl`, `getHreflangAlternates` |

### Warnings (non-blocking)

| Warning | When to investigate |
|---------|-------------------|
| Description missing or too short | Generic fallback is used — improve for CTR |
| Hreflang incomplete | One locale missing alternate — affects multilingual SEO |
| Thin spirit check skipped | Set `SEO_THIN_SPIRIT_ID` env var to enable |
| Missing spirit returns 200+noindex | Acceptable but 404 is preferred — review intent |
| Reviews page 2 pagination check | Verify canonical policy matches intended behavior |
| Utility page (terms/privacy) lacks noindex | Low priority but worth fixing |

---

## Regression Coverage by Issue

This suite detects regressions from the following previously fixed issues:

| Issue | Area fixed | Covered by section |
|-------|-----------|-------------------|
| Issue 1 | Spirit detail indexing reliability | D, G |
| Issue 2 | Utility page noindex handling | B, G |
| Issue 3 | Self-canonical + hreflang (KO/EN) | B, G |
| Issue 4 | SSR content strengthening for contents pages | A, E |
| Issue 5 | Localized metadata cleanup | B, D |
| Issue 6 | Archive/pagination hygiene for reviews/news | E |

---

## CI Integration

Add to your CI pipeline (GitHub Actions example):

```yaml
- name: Run SEO regression checks
  run: npm run seo:check
  env:
    BASE_URL: https://kspiritsclub.com
    SEO_INDEXABLE_SPIRIT_ID: mfds-202600027635
```

Or gate it on staging deployment:

```yaml
- name: SEO regression check (staging)
  run: node scripts/seo/regression-check.mjs $STAGING_URL
```

The script exits with code `1` on any blocker, which will fail the CI step.

---

## Adding New Checks

1. Add a new `checkXxx()` async function following the pattern of existing sections.
2. Call it from `main()`.
3. Use `pass()`, `warn()`, or `fail()` with a section letter and descriptive label.
4. Document the new check in this file.

---

## Related Files

| File | Purpose |
|------|---------|
| `scripts/seo/regression-check.mjs` | This verification suite |
| `scripts/seo/phase1-check.mjs` | Phase 1: redirect and canonical checks |
| `scripts/seo/phase2-check.mjs` | Phase 2: sitemap and indexable tier checks |
| `scripts/seo/phase3-snippet-check.mjs` | Phase 3: metadata snippet checks |
| `lib/utils/seo-url.ts` | Canonical URL and hreflang utilities |
| `lib/utils/indexable-tier.ts` | Spirit indexable tier classification |
| `app/robots.ts` | robots.txt generation |
| `app/sitemap.ts` | XML sitemap generation |
| `docs/seo/phase1-verification.md` | Phase 1 manual verification steps |
| `docs/seo/phase2-verification.md` | Phase 2 verification guide |
