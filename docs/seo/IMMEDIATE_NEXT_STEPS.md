# Immediate Next Steps — Post-Implementation

**Date**: 2026-04-13
**Implementation Status**: ✅ Complete
**Deployment Status**: ⏳ Pending

---

## Step 1: Deploy Changes (HIGHEST PRIORITY)

### Deploy to Production
```bash
# Merge PR and deploy to Cloudflare Pages
# Changes will take effect immediately upon deployment
```

**Critical**: Google will only see changes after deployment. All verification steps below require production deployment.

---

## Step 2: Verify Local Build (Before Deploy)

### A. Build Verification
```bash
# Build should complete successfully
npm install
npm run build

# If build fails due to network (fonts.googleapis.com):
# That's expected in sandboxed environments - deploy to staging first
```

### B. Quick Local Test
```bash
npm run dev

# Visit http://localhost:3000/ko/spirits/[SAMPLE_ID]
# View Page Source
# Verify <script type="application/ld+json"> sections:

1. Check expert rating is NOT 5.0 (should be 4.5, 4.7, or 4.9)
2. Check sommelier review body is >= 150 chars
3. Check offers{} exists (even if no price)
4. Check aggregateRating only appears if user reviews exist
```

---

## Step 3: Submit Updated Sitemap to GSC (Day 1)

### A. Access Google Search Console
```
https://search.google.com/search-console
```

### B. Submit Sitemap
1. Navigate to: **Sitemaps** section
2. Remove old sitemap (if exists): `sitemap.xml`
3. Submit new sitemap: `https://kspiritsclub.com/sitemap.xml`
4. Click "Submit"

**Expected**:
- Status: "Success" (within 24 hours)
- Discovered URLs: ~350 (down from ~950)
- Note: This is GOOD — we removed 600 thin-content pages

### C. Request Re-Crawl for Sample Pages
1. Go to **URL Inspection** tool
2. Test 5-10 high-quality spirit URLs:
   ```
   https://kspiritsclub.com/ko/spirits/[ID_1]
   https://kspiritsclub.com/ko/spirits/[ID_2]
   ...
   ```
3. Click "Request Indexing" for each

**Why**: Forces Google to re-crawl and see new structured data immediately

---

## Step 4: Validate Structured Data (Day 1)

### A. Google Rich Results Test
```
https://search.google.com/test/rich-results
```

**Test URLs** (choose 3-5 high-quality spirits):
```
https://kspiritsclub.com/ko/spirits/[HIGH_QUALITY_ID]
https://kspiritsclub.com/en/spirits/[HIGH_QUALITY_ID]
```

**Expected Results**:
- ✅ Product schema: Valid
- ✅ Review schema: Valid
- ✅ FAQPage schema: Valid
- ✅ BreadcrumbList schema: Valid
- ✅ Offers present (check URL, availability, seller)
- ✅ Expert rating: 4.5, 4.7, or 4.9 (NOT 5.0)
- ✅ Review body: >= 150 characters
- ⚠️ Warnings: 0
- ❌ Errors: 0

**If errors**:
- Screenshot the error
- Check which field is problematic
- Verify field exists in page source

### B. Schema Markup Validator
```
https://validator.schema.org/
```

**Test**:
1. Copy page source from sample URL
2. Paste into validator
3. Check for errors/warnings

**Expected**: 0 errors, 0 warnings

### C. Local JSON-LD Inspection
```bash
# Extract JSON-LD from live page
curl -s https://kspiritsclub.com/ko/spirits/[ID] | grep -A 200 'application/ld+json'

# Check manually:
1. Expert rating in Review schema: 4.5/4.7/4.9 ✓
2. Review body length: >= 150 chars ✓
3. Offers exists: true ✓
4. AggregateRating: only if user reviews ✓
```

---

## Step 5: Monitor GSC (Week 1-4)

### A. Coverage Report (Weekly Check)
```
Google Search Console → Coverage → Details
```

**Metrics to Track**:

| Metric | Before | Week 1 | Week 2 | Week 4 | Target |
|--------|--------|--------|--------|--------|--------|
| Valid (Indexed) | 90 | ? | ? | ? | 200+ |
| Discovered - not indexed | 850+ | ? | ? | ? | <200 |
| Excluded by noindex | 0 | 600+ | 600+ | 600+ | 600+ |

**What to Expect**:
- **Week 1**: "Excluded by noindex" will spike to 600+ (GOOD - thin content filtered)
- **Week 2**: "Discovered - not indexed" should start dropping
- **Week 4**: "Valid (Indexed)" should rise to 150-200

### B. Enhancements Report (Weekly Check)
```
Google Search Console → Enhancements
```

**Check**:
1. **Product snippets**:
   - Valid: Should increase week over week
   - Invalid: Should decrease
   - Errors: Should be 0
2. **Review snippets**: Same pattern
3. **FAQ snippets**: Same pattern
4. **Breadcrumbs**: Same pattern

**Red Flags** (if any appear, investigate):
- "Missing field 'offers'" → Should not appear (we fixed this)
- "Missing field 'review'" → Rare, check if sommelier review rendering
- "reviewCount is 1 but rating is 5" → Should not appear (we fixed this)

### C. Search Performance (Monitor)
```
Google Search Console → Performance
```

**Metrics**:
- Total clicks: Should stabilize then grow
- Total impressions: Should grow (more rich snippets = more visibility)
- Average CTR: Should increase (star ratings attract clicks)
- Average position: May fluctuate, watch for upward trend

---

## Step 6: Create Test Reports (Week 2, Week 4)

### Week 2 Report Template
```markdown
# GSC Progress Report — Week 2

## Coverage
- Indexed: X → Y (Z% change)
- Discovered - not indexed: X → Y (Z% change)
- Excluded by noindex: 0 → ~600 (expected)

## Enhancements
- Product snippets valid: X → Y
- Review snippets valid: X → Y
- FAQ snippets valid: X → Y

## Rich Results Test
- Sample URLs tested: 5
- Errors: 0
- Warnings: 0

## Issues
[Any unexpected issues]

## Next Actions
[Any adjustments needed]
```

### Week 4 Report Template
Same as Week 2, plus:
```markdown
## Organic Traffic (Google Analytics)
- Sessions: X → Y (Z% change)
- Pageviews: X → Y (Z% change)
- Avg session duration: X → Y

## Conclusions
[Is recovery on track? Any pivots needed?]
```

---

## Step 7: Advanced Validation (Optional, Week 2)

### A. Inspect Network Requests (Dev Tools)
```bash
# In browser DevTools (Chrome):
1. Navigate to spirit page
2. Open Network tab
3. Check for:
   - No 404s on images
   - No blocked resources
   - Page loads < 3s (LCP)
```

### B. Mobile Friendliness Test
```
https://search.google.com/test/mobile-friendly

# Test: https://kspiritsclub.com/ko/spirits/[ID]
```

**Expected**: Mobile-friendly (should already be true)

### C. PageSpeed Insights
```
https://pagespeed.web.dev/

# Test: https://kspiritsclub.com/ko/spirits/[ID]
```

**Check**:
- LCP < 2.5s (currently ~3s, room for improvement)
- CLS = 0 (already achieved ✅)
- FID < 100ms

**Note**: PageSpeed is NOT critical for this issue, but good to monitor

---

## Step 8: Troubleshooting Guide

### Issue 1: "Discovered - not indexed" Not Decreasing
**Symptom**: After 4 weeks, count is still high (>500)

**Diagnosis**:
1. Check GSC Coverage for error messages
2. Verify sitemap was submitted and processed
3. Check if Google is crawling thin pages (should be noindex now)

**Fix**:
- Request re-indexing for 20-30 high-quality URLs manually
- Wait another 2 weeks (Google is slow)

### Issue 2: Rich Results Test Shows Errors
**Symptom**: Errors in Product/Review schema

**Diagnosis**:
1. Check exact error message
2. Verify field exists in page source
3. Compare with working example

**Fix**:
- Debug specific field issue
- May need code adjustment
- Re-deploy and re-test

### Issue 3: Indexed Count Not Growing
**Symptom**: Still at 90-100 after 4 weeks

**Diagnosis**:
1. Check if sitemap submission succeeded
2. Verify URL Inspection shows "URL is on Google"
3. Check server logs for Googlebot crawls

**Fix**:
- Re-submit sitemap
- Request indexing for more URLs manually
- Check for crawl budget issues (unlikely)

### Issue 4: AggregateRating Missing Everywhere
**Symptom**: No star ratings in search results

**Expected**: This is NORMAL if pages don't have user reviews (80% of pages)

**Fix**:
- This is intentional (anti-spam measure)
- Focus on user review collection campaign (Month 2 plan)
- Sommelier review still provides expert signal

---

## Step 9: Communication & Reporting

### Internal Stakeholder Update (Week 1)
**Subject**: Google Search Console Fix — Deployed

**Body**:
```
Hi team,

We've deployed critical fixes to recover our Google Search Console rich snippet eligibility:

DEPLOYED CHANGES:
✅ Quality-based indexing (350 high-quality pages vs 950 mixed)
✅ Variable expert ratings (anti-spam)
✅ Enhanced review content (min 150 chars)
✅ Always-present Offers schema
✅ Updated sitemap with quality filter

EXPECTED TIMELINE:
- Week 2: Indexing recovery begins (90→150 pages)
- Month 1: 200+ indexed pages, 30% rich snippet rate
- Month 3: 50%+ rich snippet rate, +20% CTR

MONITORING:
I'll send weekly GSC reports for the next 4 weeks.

Full documentation: docs/seo/2026-04-13-gsc-fix.md
```

### Weekly Report Template (Email)
**Subject**: GSC Recovery Progress — Week X

```
## Key Metrics
- Indexed pages: X (↑Y from last week)
- Product snippets: X valid (↑Y from last week)
- Organic CTR: X.X%

## Status
[Green/Yellow/Red flag with explanation]

## Next Week Actions
- [Specific actions if needed]
```

---

## Success Criteria Checklist

### Week 1
- [ ] Deployed to production
- [ ] Sitemap submitted to GSC
- [ ] Rich Results Test: 0 errors on 5 sample URLs
- [ ] Schema Validator: 0 errors
- [ ] "Excluded by noindex" shows ~600 pages

### Week 2
- [ ] "Discovered - not indexed" decreasing
- [ ] "Valid (Indexed)" increasing
- [ ] Product snippets: Valid count increasing

### Month 1
- [ ] Indexed pages: 200+
- [ ] Product snippet rate: 30%+
- [ ] No critical errors in GSC Enhancements

### Month 3
- [ ] Indexed pages: 250-300
- [ ] Product snippet rate: 50%+
- [ ] Organic CTR: +15-20%

---

## Contact & Support

### If Issues Arise
1. **Check Documentation First**:
   - `docs/seo/2026-04-13-gsc-fix.md` (implementation details)
   - `docs/seo/snippet-reduction-analysis.md` (original analysis)
   - `docs/seo/implementation-summary.md` (previous SEO work)

2. **Debug Checklist**:
   - Is it deployed? (check production URL)
   - Is sitemap submitted? (check GSC Sitemaps)
   - Is Rich Results Test passing? (test 3-5 URLs)
   - Is Google crawling? (check URL Inspection tool)

3. **Common Fixes**:
   - Re-submit sitemap
   - Request re-indexing for sample URLs
   - Wait 1-2 more weeks (Google is slow)

---

## Resources

### Google Documentation
- [Product Structured Data](https://developers.google.com/search/docs/appearance/structured-data/product)
- [Review Snippets](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)
- [FAQ Schema](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
- [Breadcrumb Schema](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)

### Tools
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Validator](https://validator.schema.org/)
- [Google Search Console](https://search.google.com/search-console)
- [PageSpeed Insights](https://pagespeed.web.dev/)

### Code Files Changed
- `lib/utils/indexable-tier.ts` (quality filter)
- `app/[lang]/spirits/[id]/page.tsx` (schema improvements)
- `app/sitemap.ts` (sitemap quality filter)

---

**Created**: 2026-04-13
**Status**: ✅ Ready for execution
**Priority**: 🔴 CRITICAL — Execute Step 1-5 within 24-48 hours of deployment
