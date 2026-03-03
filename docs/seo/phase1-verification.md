# SEO Phase 1 Verification Checklist

## Overview
This document provides manual verification steps to confirm that canonical URLs and locale routing normalization have been properly implemented.

## Test Environment URLs
- **Local**: `http://localhost:3000`
- **Staging**: `https://k-spirits-club-hub.pages.dev` (if applicable)
- **Production**: `https://kspiritsclub.com`

## 1. Middleware Redirect Tests

### Test 1.1: Root path redirects to locale
```bash
# Expected: 308 redirect to /ko or /en (based on Accept-Language)
curl -I http://localhost:3000/

# Expected redirect location: http://localhost:3000/ko or /en
```

**Expected Result**:
- Status: `308 Permanent Redirect`
- Location header contains `/ko` or `/en`

### Test 1.2: Non-localized /explore redirects
```bash
# Expected: 308 redirect to /ko/explore or /en/explore
curl -I http://localhost:3000/explore

# Force Korean locale with cookie
curl -I -H "Cookie: NEXT_LOCALE=ko" http://localhost:3000/explore
```

**Expected Result**:
- Status: `308 Permanent Redirect`
- Location: `/ko/explore` or `/en/explore`

### Test 1.3: Non-localized spirit detail redirects
```bash
# Replace {id} with actual spirit ID from your database
curl -I http://localhost:3000/spirits/{id}
```

**Expected Result**:
- Status: `308 Permanent Redirect`
- Location: `/ko/spirits/{id}` or `/en/spirits/{id}`

### Test 1.4: Static assets are NOT redirected
```bash
# These should return 200 OK, NOT redirect
curl -I http://localhost:3000/favicon.ico
curl -I http://localhost:3000/robots.txt
curl -I http://localhost:3000/sitemap.xml
curl -I http://localhost:3000/manifest.json
```

**Expected Result**: Status `200 OK` (no redirect)

### Test 1.5: API routes are NOT redirected
```bash
curl -I http://localhost:3000/api/spirits
```

**Expected Result**: Status `200 OK` or appropriate API response (no redirect)

## 2. Canonical URL Tests

### Test 2.1: Home page canonical
```bash
# Fetch the home page HTML
curl http://localhost:3000/ko | grep -i "canonical"
curl http://localhost:3000/en | grep -i "canonical"
```

**Expected Output**:
```html
<link rel="canonical" href="https://kspiritsclub.com/ko"/>
<link rel="canonical" href="https://kspiritsclub.com/en"/>
```

### Test 2.2: Explore page canonical
```bash
curl http://localhost:3000/ko/explore | grep -i "canonical"
curl http://localhost:3000/en/explore | grep -i "canonical"
```

**Expected Output**:
```html
<link rel="canonical" href="https://kspiritsclub.com/ko/explore"/>
<link rel="canonical" href="https://kspiritsclub.com/en/explore"/>
```

### Test 2.3: Spirit detail canonical
```bash
# Replace {id} with actual spirit ID
curl http://localhost:3000/ko/spirits/{id} | grep -i "canonical"
curl http://localhost:3000/en/spirits/{id} | grep -i "canonical"
```

**Expected Output**:
```html
<link rel="canonical" href="https://kspiritsclub.com/ko/spirits/{id}"/>
<link rel="canonical" href="https://kspiritsclub.com/en/spirits/{id}"/>
```

### Test 2.4: Cabinet page canonical
```bash
curl http://localhost:3000/ko/cabinet | grep -i "canonical"
curl http://localhost:3000/en/cabinet | grep -i "canonical"
```

**Expected Output**:
```html
<link rel="canonical" href="https://kspiritsclub.com/ko/cabinet"/>
<link rel="canonical" href="https://kspiritsclub.com/en/cabinet"/>
```

## 3. Hreflang Alternates Tests

### Test 3.1: Home page hreflang
```bash
curl http://localhost:3000/ko | grep -i "hreflang"
```

**Expected Output**:
```html
<link rel="alternate" hreflang="ko" href="https://kspiritsclub.com/ko"/>
<link rel="alternate" hreflang="en" href="https://kspiritsclub.com/en"/>
```

### Test 3.2: Explore page hreflang
```bash
curl http://localhost:3000/ko/explore | grep -i "hreflang"
```

**Expected Output**:
```html
<link rel="alternate" hreflang="ko" href="https://kspiritsclub.com/ko/explore"/>
<link rel="alternate" hreflang="en" href="https://kspiritsclub.com/en/explore"/>
```

### Test 3.3: Spirit detail hreflang
```bash
# Replace {id} with actual spirit ID
curl http://localhost:3000/ko/spirits/{id} | grep -i "hreflang"
```

**Expected Output**:
```html
<link rel="alternate" hreflang="ko" href="https://kspiritsclub.com/ko/spirits/{id}"/>
<link rel="alternate" hreflang="en" href="https://kspiritsclub.com/en/spirits/{id}"/>
```

## 4. Internal Links Verification

### Test 4.1: Check for non-localized internal links
```bash
# Search for problematic href patterns in components
grep -r 'href="/spirits/' components/ --include="*.tsx" --include="*.ts"
grep -r 'href="/explore"' components/ --include="*.tsx" --include="*.ts"
grep -r 'href="/cabinet"' components/ --include="*.tsx" --include="*.ts"
```

**Expected Result**: No matches or all matches should have locale prefix like `/${lang}/spirits/`

### Test 4.2: Manual browser verification
1. Open `http://localhost:3000/ko` in browser
2. Open Developer Tools > Network tab
3. Click through navigation links (Explore, Cabinet, etc.)
4. Verify all navigation stays within `/ko/*` paths
5. Repeat for `/en`

## 5. Query String Handling

### Test 5.1: Query strings preserved in redirects
```bash
curl -I "http://localhost:3000/explore?category=whisky"
```

**Expected Result**:
- Status: `308 Permanent Redirect`
- Location: `/ko/explore?category=whisky` or `/en/explore?category=whisky`

### Test 5.2: Query strings NOT in canonical
```bash
curl "http://localhost:3000/ko/explore?category=whisky" | grep -i "canonical"
```

**Expected Output**:
```html
<link rel="canonical" href="https://kspiritsclub.com/ko/explore"/>
```
(Note: No query string in canonical URL)

## 6. Production Verification

After deployment to production (`https://kspiritsclub.com`):

### Test 6.1: Google Search Console
1. Navigate to Google Search Console
2. URL Inspection Tool > Enter `https://kspiritsclub.com/spirits/some-id`
3. Verify it shows redirect to localized version

### Test 6.2: Canonical tags in production
```bash
curl https://kspiritsclub.com/ko/explore | grep -i "canonical"
```

### Test 6.3: No duplicate URL indexing
1. In Google Search Console > Coverage report
2. Verify no duplicate URLs like:
   - `/explore` vs `/ko/explore`
   - `/spirits/123` vs `/ko/spirits/123`

## 7. Redirect Loop Prevention

### Test 7.1: Already-localized paths don't redirect
```bash
# Should return 200 OK, not redirect
curl -I http://localhost:3000/ko/explore
curl -I http://localhost:3000/en/spirits/{id}
```

**Expected Result**: Status `200 OK` (no redirect loop)

## Checklist Summary

- [ ] Root `/` redirects to `/{locale}` (308)
- [ ] `/explore` redirects to `/{locale}/explore` (308)
- [ ] `/spirits/{id}` redirects to `/{locale}/spirits/{id}` (308)
- [ ] Static assets (favicon, robots, sitemap) are not redirected
- [ ] API routes are not redirected
- [ ] All pages have canonical URL in HTML head
- [ ] Canonical URLs are absolute (include domain)
- [ ] Canonical URLs do not include query strings
- [ ] All pages have hreflang alternates (ko & en)
- [ ] Internal navigation links include locale prefix
- [ ] Query strings are preserved in redirects
- [ ] No redirect loops for already-localized paths

## Tools & Commands

### Automated verification script
```bash
# Run the automated verification script
node scripts/seo/phase1-check.mjs
```

### Quick test all redirects
```bash
# Test common paths
for path in "/" "/explore" "/cabinet"; do
  echo "Testing: $path"
  curl -I http://localhost:3000$path | grep -E "HTTP|Location"
  echo "---"
done
```

## Notes

- **Redirect Status Code**: We use `308 Permanent Redirect` to signal to search engines that these redirects are permanent and should be updated in their index.
- **metadataBase**: Set to `https://kspiritsclub.com` in root layout to ensure all relative URLs in metadata resolve correctly.
- **NEXT_PUBLIC_BASE_URL**: Environment variable used for canonical URL generation, with fallback to `https://kspiritsclub.com`.

## Follow-up Actions

After Phase 1 verification passes:
1. Submit updated sitemap to Google Search Console
2. Request re-crawl of key pages
3. Monitor duplicate URL issues in GSC Coverage report
4. Track canonical tag appearance in indexed pages (takes 1-2 weeks)

---

## Phase 1.5 Hotfix: Ko Locale 404 Fix

### Issue Summary
After Phase 1 deployment, `/ko` and all `/ko/*` routes returned 404 while `/en` worked correctly. This was caused by missing explicit locale routing configuration.

### Root Cause
The `[lang]` dynamic route did not have explicit `dynamicParams` configuration, which could cause Next.js/Cloudflare Pages to reject certain locales during static generation or runtime routing.

### Fix Applied
1. Added `export const dynamicParams = true` in `app/[lang]/layout.tsx` to explicitly allow both static and dynamic locale params
2. Added locale validation in `RootLayout` to reject invalid locales while accepting 'ko' and 'en'
3. Ensured `generateStaticParams()` returns both locales: `{lang: 'ko'}` and `{lang: 'en'}`

### Verification Steps

#### Test 1: Ko locale routes return 200
```bash
# Production verification
curl -I https://kspiritsclub.com/ko
curl -I https://kspiritsclub.com/ko/explore
```

**Expected Result**:
- `/ko`: Status `200 OK` (or `308 → /ko/ → 200`)
- `/ko/explore`: Status `200 OK`

#### Test 2: En locale still works
```bash
curl -I https://kspiritsclub.com/en
curl -I https://kspiritsclub.com/en/explore
```

**Expected Result**:
- Status `200 OK` for both routes

#### Test 3: Canonical links intact
```bash
curl https://kspiritsclub.com/ko | grep -i "canonical"
curl https://kspiritsclub.com/ko/explore | grep -i "canonical"
```

**Expected Output**:
```html
<link rel="canonical" href="https://kspiritsclub.com/ko"/>
<link rel="canonical" href="https://kspiritsclub.com/ko/explore"/>
```

#### Test 4: Google Search Console URL Inspection
1. Go to GSC > URL Inspection
2. Test URL: `https://kspiritsclub.com/ko`
3. Verify status is not 404
4. Verify canonical URL is `https://kspiritsclub.com/ko`

### P1.5 Checklist
- [ ] `/ko` returns 200 (not 404)
- [ ] `/ko/explore` returns 200 (not 404)
- [ ] `/en` still works (200)
- [ ] `/en/explore` still works (200)
- [ ] Canonical links for ko pages are correct
- [ ] No redirect loops introduced
- [ ] GSC URL inspection shows ko as indexable

### Deployment Notes
- Changes affect: `app/[lang]/layout.tsx` only
- Impact: Minimal - only adds explicit locale routing config
- Risk: Low - does not change existing routing logic
- Testing: Verify both locales work in production after deployment

