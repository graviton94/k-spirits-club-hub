# Spirit Detail Page — Indexing Regression Verification

This document describes the expected behaviour for each spirit page state and provides
manual and automated verification steps for the `/[lang]/spirits/[id]` route.

---

## State Model

The route uses a shared `resolveSpiritPageState(id)` helper (see
`lib/utils/spirit-page-resolver.ts`) that classifies every request into one of four states:

| State | Cause | HTTP Status | robots |
|---|---|---|---|
| `FOUND_INDEXABLE` | Spirit exists, meets Tier A quality threshold | 200 | index, follow (default) |
| `FOUND_THIN` | Spirit exists, below quality threshold | 200 | noindex, follow |
| `NOT_FOUND` | Spirit document does not exist in Firestore | 404 | — |
| `TRANSIENT_FAILURE` | Firestore / network error during fetch | 500 (5xx) | — |

---

## Verification Checklist

### 1. Valid, indexable spirit → `200` + meaningful SSR HTML

**Setup:** Use a spirit ID that has `name`, `abv`, `category`, `imageUrl`, and
`description ≥ 300 characters` (e.g., `mfds-202500664736`).

**Expected:**
- HTTP status `200`
- Initial HTML contains:
  - `<h1>` with spirit name
  - ABV percentage string (e.g., `40%`)
  - Category text
  - Origin/country text
  - At least one descriptive paragraph (`<p>`) longer than 50 characters
- `robots` meta tag is **absent** (or `index, follow`)
- `<script type="application/ld+json">` contains `"@type": "Product"` with `name`, `description`, and `category`
- Spirit appears in `/sitemap.xml`

**Manual check:**
```bash
curl -s -o /dev/null -w "%{http_code}" "https://kspiritsclub.com/ko/spirits/<ID>"
curl -s "https://kspiritsclub.com/ko/spirits/<ID>" | grep -o '<h1[^>]*>.*</h1>'
```

---

### 2. Thin spirit (Tier B) → `200` + `noindex, follow`

**Setup:** Use a spirit ID that has a name and category but no image or short description.

**Expected:**
- HTTP status `200`
- `<meta name="robots" content="noindex, follow">` present in `<head>`
- Page renders spirit content (not a loading skeleton)
- Spirit ID is **absent** from `/sitemap.xml`

---

### 3. Missing spirit ID → `404`

**Setup:** Request a spirit ID that does not exist in Firestore (e.g., `nonexistent-id-xyz`).

**Expected:**
- HTTP status `404`
- Response body does NOT contain `"Loading"` as the only meaningful text
- No `200` with empty/placeholder content

**Manual check:**
```bash
curl -s -o /dev/null -w "%{http_code}" "https://kspiritsclub.com/ko/spirits/nonexistent-id-xyz"
# Must return 404
```

---

### 4. Transient backend failure → `5xx` (not `200` loading shell)

**Setup:** Simulate a Firestore timeout or non-404 error by temporarily blocking the
Firestore endpoint (local dev only) or by inspecting error handling logic.

**Expected:**
- HTTP status is `500` or `503`
- Response body is the Next.js error boundary, NOT a `200` page with "Loading Spirit Data"
- The error is logged with `[SpiritResolver]` and `[SpiritPage]` prefix

**Verification in logs:**
```
[SpiritResolver] id=<ID> status=TRANSIENT_FAILURE fetchMs=<N>ms error=<message>
[SpiritPage] id=<ID> Transient failure — throwing to trigger 5xx. error=<message>
```

---

### 5. Sitemap excludes noindex spirits

**Expected:**
- `GET /sitemap.xml` does not contain URLs for Tier B (noindex) spirits
- Only Tier A spirits appear with both `/ko/spirits/<id>` and `/en/spirits/<id>` entries

**Manual check:**
```bash
curl -s "https://kspiritsclub.com/sitemap.xml" | grep "spirits/"
```

---

### 6. No loading-only SSR shell for Google

**Expected:**
- View source on any valid spirit URL shows the spirit name in the initial HTML `<h1>`
- The phrase "Loading Spirit Data" (or equivalent) does NOT appear as the primary body
  content in the server-rendered HTML

**Manual check:**
```bash
curl -s "https://kspiritsclub.com/ko/spirits/<VALID_ID>" | grep -i "loading spirit"
# Should return no output
```

---

## GSC Example URLs from Original Report

| URL | Expected State | Expected HTTP |
|---|---|---|
| `https://kspiritsclub.com/ko/spirits/mfds-202500684732` | `FOUND_THIN` or `FOUND_INDEXABLE` | 200 |
| `https://kspiritsclub.com/ko/spirits/mfds-202500672640` | `FOUND_INDEXABLE` (was 5xx) | 200 |
| `https://kspiritsclub.com/en/spirits/fsk-202300035952` | `FOUND_INDEXABLE` (was 5xx) | 200 |
| `https://kspiritsclub.com/ko/spirits/mfds-202500664736` | `FOUND_THIN` or `FOUND_INDEXABLE` | 200 |

For the former 5xx URLs, the fix ensures that transient Firestore errors no longer cause
silent 200 loading shells — they now either serve real content or return a proper 5xx.

---

## Key Implementation Changes

1. **`lib/utils/spirit-page-resolver.ts`** — new shared resolver using `React.cache()`:
   - Deduplicates the Firestore fetch between `generateMetadata` and `SpiritDetailPage`
   - Classifies fetch result into `FOUND_INDEXABLE | FOUND_THIN | NOT_FOUND | TRANSIENT_FAILURE`
   - Logs spirit ID, state, fetch latency, and error source

2. **`app/[lang]/spirits/[id]/page.tsx`** — updated to use the shared resolver:
   - `generateMetadata` uses `resolveSpiritPageState` — errors return fallback metadata (never throw)
   - `SpiritDetailPage` uses `resolveSpiritPageState` — `TRANSIENT_FAILURE` throws (returns 5xx, not 200 shell)
   - `getRelatedSpirits()` is now wrapped in try-catch — fails open, page renders without related spirits
   - `NOT_FOUND` state calls `notFound()` for a clean 404 response
