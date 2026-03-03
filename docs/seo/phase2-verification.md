# SEO Phase 2 Verification Guide

## Overview

Phase 2 implements **Sitemap Optimization**, **Indexable Tiering**, and **Robots.txt Hygiene** to focus Google's crawl budget on high-quality content and prevent "Discovered - currently not indexed" issues.

---

## What Changed

### 1. Indexable Tier System

**New utility**: `lib/utils/indexable-tier.ts`

Spirits are classified into two tiers:

- **Tier A (Indexable)**: High-quality pages with:
  - `name` exists
  - `abv` exists
  - `category` exists
  - At least 1 image (imageUrl or thumbnailUrl)
  - Description (Korean OR English) ≥ 300 characters

- **Tier B (Non-indexable)**: Thin content pages
  - Missing one or more Tier A requirements
  - Marked with `<meta name="robots" content="noindex, follow">`
  - Excluded from sitemap

### 2. Enhanced Sitemap (`app/sitemap.ts`)

**Changes**:
- Only includes Tier A spirits
- Excludes private pages: `/cabinet`, `/me`, `/admin`
- Excludes query string variations
- Uses `getPublishedSpiritMetaWithQuality()` to fetch quality indicators
- Logs Tier A/B distribution for monitoring

**Before**: All published spirits included (~100% of spirits)
**After**: Only Tier A spirits included (estimated 60-80% of spirits)

### 3. Optimized Robots.txt (`app/robots.ts`)

**Changes**:
- Simplified allow/disallow rules
- Explicitly blocks:
  - `/admin/`, `/cabinet/`, `/me`
  - `/api/` (no indexing value)
  - `/*?*` (query string variations)
  - `/*/explore?*` (filtered search results)
- Blocks AI training bots (GPTBot, CCBot, anthropic-ai, Claude-Web)
- References sitemap explicitly

### 4. Spirit Detail Page Metadata

**File**: `app/[lang]/spirits/[id]/page.tsx`

**Changes**:
- Imports `getSpiritRobotsMeta()` from indexable-tier utility
- Applies `robots: { index: false, follow: true }` for Tier B spirits
- Tier A spirits get default indexing (no robots meta needed)

---

## Verification Checklist

### ✅ 1. Sitemap Generation

**Test locally**:
```bash
# Start development server
npm run dev

# Check sitemap endpoint
curl http://localhost:3000/sitemap.xml | head -50
```

**Expected**:
- Returns 200 OK
- Contains only canonical URLs with locale prefix (`/ko/*`, `/en/*`)
- Does NOT contain `/cabinet`, `/me`, `/admin`
- Console logs show Tier A/B distribution:
  ```
  [Sitemap] Tier A (indexable): 850, Tier B (excluded): 150
  ```

**Production verification**:
```bash
curl https://kspiritsclub.com/sitemap.xml | grep -E "cabinet|admin|me"
# Expected: No results (these pages should NOT be in sitemap)

curl https://kspiritsclub.com/sitemap.xml | grep -c "<url>"
# Expected: Count matches Tier A spirits × 2 (ko + en) + static pages
```

---

### ✅ 2. Robots.txt Output

**Test locally**:
```bash
curl http://localhost:3000/robots.txt
```

**Expected output**:
```
User-agent: *
Allow: /ko/
Allow: /en/
Allow: /images/
Allow: /icons/
Allow: /fonts/
Allow: /_next/image
Allow: /_next/static/
Disallow: /admin/
Disallow: /cabinet/
Disallow: /me
Disallow: /login
Disallow: /private/
Disallow: /api/
Disallow: /*?*
Disallow: /*/explore?*

User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

Sitemap: https://kspiritsclub.com/sitemap.xml
```

---

### ✅ 3. Tier B Spirit Has Noindex

**Find a Tier B spirit** (missing description or other requirements):

```bash
# Example: Spirit with short description
curl -s http://localhost:3000/ko/spirits/SPIRIT_ID | grep -i "robots"
```

**Expected**:
```html
<meta name="robots" content="noindex, follow"/>
```

**Verify Tier A spirit** (complete data):
```bash
curl -s http://localhost:3000/ko/spirits/TIER_A_SPIRIT_ID | grep -i "robots"
```

**Expected**: No robots meta tag (default indexing applies)

---

### ✅ 4. No Redirect Chains

**Test canonical URLs**:
```bash
# These should return 200 OK without redirects
curl -I http://localhost:3000/ko
curl -I http://localhost:3000/en/explore
curl -I http://localhost:3000/ko/spirits/SPIRIT_ID
```

**Expected**: All return `200 OK` (no 301/308 redirects)

---

### ✅ 5. Sitemap Contains Only Canonical URLs

**Script**: Create `scripts/verify-sitemap-canonical.sh`:

```bash
#!/bin/bash
# Verify all sitemap URLs are canonical (have locale prefix)

SITEMAP_URL="http://localhost:3000/sitemap.xml"

echo "Fetching sitemap..."
URLS=$(curl -s $SITEMAP_URL | grep -oP '(?<=<loc>)[^<]+')

echo "Checking for non-canonical URLs..."
NON_CANONICAL=$(echo "$URLS" | grep -v -E "/(ko|en)/")

if [ -z "$NON_CANONICAL" ]; then
  echo "✅ All URLs are canonical (contain locale prefix)"
else
  echo "❌ Found non-canonical URLs:"
  echo "$NON_CANONICAL"
  exit 1
fi

echo "Checking for private pages..."
PRIVATE=$(echo "$URLS" | grep -E "(cabinet|admin|/me)")

if [ -z "$PRIVATE" ]; then
  echo "✅ No private pages in sitemap"
else
  echo "❌ Found private pages in sitemap:"
  echo "$PRIVATE"
  exit 1
fi

echo "✅ Sitemap verification passed"
```

**Run**:
```bash
chmod +x scripts/verify-sitemap-canonical.sh
./scripts/verify-sitemap-canonical.sh
```

---

### ✅ 6. Tier Classification Logic

**Script**: Create `scripts/test-tier-logic.ts`:

```typescript
import { isIndexableSpirit } from '../lib/utils/indexable-tier';
import { Spirit } from '../lib/db/schema';

// Test Tier A (should be indexable)
const tierASpirit: Partial<Spirit> = {
  name: 'Macallan 12',
  abv: 40,
  category: 'whisky',
  imageUrl: 'https://example.com/image.jpg',
  metadata: {
    description_ko: 'A'.repeat(300), // 300 chars
  }
};

// Test Tier B cases
const tierBCases = [
  { name: 'No ABV', abv: null, category: 'whisky', imageUrl: 'x', metadata: { description_ko: 'A'.repeat(300) } },
  { name: 'No Image', abv: 40, category: 'whisky', imageUrl: null, thumbnailUrl: null, metadata: { description_ko: 'A'.repeat(300) } },
  { name: 'Short Desc', abv: 40, category: 'whisky', imageUrl: 'x', metadata: { description_ko: 'Short' } },
];

console.log('Tier A:', isIndexableSpirit(tierASpirit as Spirit)); // true
tierBCases.forEach((spirit, i) => {
  console.log(`Tier B case ${i + 1}:`, isIndexableSpirit(spirit as Spirit)); // false
});
```

**Run**:
```bash
npx tsx scripts/test-tier-logic.ts
```

**Expected**:
```
Tier A: true
Tier B case 1: false
Tier B case 2: false
Tier B case 3: false
```

---

## Post-Deployment Checks

### 1. Google Search Console

After deploying to production:

1. **Submit updated sitemap**:
   - Go to GSC → Sitemaps
   - Add `https://kspiritsclub.com/sitemap.xml`
   - Wait 2-3 days for reprocessing

2. **Monitor coverage**:
   - GSC → Coverage → Excluded tab
   - Check for "Discovered - currently not indexed" trend
   - **Expected**: Decrease over 2-4 weeks as Google refocuses on Tier A

3. **Verify noindex pages**:
   - GSC → Coverage → Excluded → "Excluded by 'noindex' tag"
   - **Expected**: Tier B spirits appear here (this is correct!)

### 2. Crawl Stats

- GSC → Settings → Crawl Stats
- **Expected**: Crawl requests per day stabilizes or decreases slightly
- **Reason**: Fewer URLs to crawl (Tier B excluded)

### 3. Log Monitoring

Check server logs for sitemap generation:

```bash
# Look for these log messages
grep "Sitemap" /var/log/app.log

# Expected:
[Sitemap] Fetched 1000 published spirit entries
[Sitemap] Tier A (indexable): 850, Tier B (excluded): 150
[Sitemap] Generated 1700 spirit routes (Tier A only)
[Sitemap] Total routes: 1730
```

---

## Troubleshooting

### Issue: Too many Tier B spirits

**Symptom**: `[Sitemap] Tier B (excluded): 900` (90% of spirits)

**Diagnosis**: Data quality issue - most spirits lack descriptions

**Solution**:
1. Run data enrichment pipeline to add descriptions
2. Lower Tier A threshold temporarily (e.g., 150 chars instead of 300)
3. Check `scripts/run_pipeline.py` for AI description generation

---

### Issue: Sitemap contains private pages

**Symptom**: `/cabinet` appears in sitemap

**Diagnosis**: Static page list not properly filtered

**Fix**: Check `app/sitemap.ts` → staticPages array should NOT include:
```typescript
// ❌ WRONG
{ path: '/cabinet', priority: 0.5, freq: 'daily' }

// ✅ CORRECT
// /cabinet is commented out or removed
```

---

### Issue: Tier A spirit shows noindex

**Symptom**: Spirit with full data has `<meta name="robots" content="noindex">`

**Diagnosis**: `getSpiritRobotsMeta()` logic error

**Fix**:
1. Check spirit data in Firestore
2. Verify description length (must be ≥ 300 in ko OR en)
3. Test with `isIndexableSpirit()` function directly

---

## Success Metrics

**Week 1-2 (Immediate)**:
- ✅ Sitemap contains only Tier A spirits
- ✅ robots.txt blocks private pages
- ✅ No errors in GSC sitemap report

**Week 2-4 (Short-term)**:
- 📈 Indexed pages increase (Tier A spirits get indexed faster)
- 📉 "Discovered - not indexed" count decreases
- 📊 Crawl efficiency improves (fewer wasted crawls)

**Month 2-3 (Long-term)**:
- 🎯 Tier A spirits achieve 80%+ indexing rate
- 🎯 Organic traffic increases to indexed Tier A pages
- 🎯 Average position improves for indexed spirits

---

## Next Steps (Phase 3)

After Phase 2 stabilizes (2-4 weeks):

1. **Title/Description Optimization**
   - A/B test title formats
   - Optimize meta descriptions for CTR

2. **Structured Data Enhancement**
   - Add `offers` schema with price ranges
   - Implement breadcrumb improvements

3. **Internal Linking**
   - Add "Related Spirits" sections
   - Build category hub pages

---

## Files Modified

- ✅ `lib/utils/indexable-tier.ts` (new)
- ✅ `lib/db/firestore-rest.ts` (added `getPublishedSpiritMetaWithQuality`)
- ✅ `app/sitemap.ts` (Tier A filtering)
- ✅ `app/robots.ts` (clarified rules)
- ✅ `app/[lang]/spirits/[id]/page.tsx` (noindex for Tier B)
- ✅ `docs/seo/phase2-verification.md` (this file)

---

## Quick Command Reference

```bash
# Local verification
npm run dev
curl http://localhost:3000/sitemap.xml | head -50
curl http://localhost:3000/robots.txt

# Production check
curl https://kspiritsclub.com/sitemap.xml | grep -c "<url>"
curl https://kspiritsclub.com/robots.txt

# Test tier logic
npx tsx scripts/test-tier-logic.ts

# Verify canonical URLs
./scripts/verify-sitemap-canonical.sh
```

---

**Phase 2 Complete** ✅

This phase sets the foundation for improved crawl efficiency and indexing quality. Monitor GSC for 2-4 weeks to see results.
