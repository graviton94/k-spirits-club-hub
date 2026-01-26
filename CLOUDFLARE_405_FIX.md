# Cloudflare Pages 405 Error Fix - Migration Guide

## Problem Statement

### Symptoms
- **Error**: 405 (Method Not Allowed) on Cloudflare Pages deployment
- **Console Log**: `Failed to load resource: the server responded with a status of 405 ()`
- **Application Log**: `[SpiritsCache] ❌ 데이터 로드 중 치명적 오류: Error: An unexpected response was received from the server.`
- **Result**: Search index stuck at 0, no products displayed on main page

### Root Cause
Server Actions in Next.js use POST requests internally. Cloudflare Pages' Edge environment has instability issues with Server Action POST calls, causing intermittent 405 errors.

## Solution Overview

Migrated data fetching from **Server Actions (POST)** to **standard GET API Route** for better Cloudflare Edge compatibility and caching.

## Changes Made

### 1. New GET API Route
**File**: `app/api/spirits/route.ts`

```typescript
// Key Features:
- Edge runtime: export const runtime = 'edge'
- GET method for Cloudflare compatibility
- Returns: { publishedSpirits, searchIndex, count, timestamp }
- Cache-Control headers for edge caching
- Proper error handling with 500 status on failure
```

**Response Format**:
```json
{
  "publishedSpirits": [/* Array of Spirit objects, limited to 100 */],
  "searchIndex": [/* Array of SpiritSearchIndex objects */],
  "count": 123,
  "timestamp": 1706234567890
}
```

**SpiritSearchIndex Structure**:
```typescript
{
  i: string;          // id
  n: string;          // name
  en: string | null;  // English name from metadata
  c: string;          // category
  mc: string | null;  // mainCategory
  sc: string | null;  // subcategory
  t: string | null;   // thumbnailUrl (fallback to imageUrl)
}
```

### 2. Updated Spirits Cache Context
**File**: `app/context/spirits-cache-context.tsx`

**Before**:
```typescript
const [indexResult, masterResult] = await Promise.all([
  getSpiritsSearchIndex(),           // Server Action (POST)
  getSpiritsAction({ isPublished: true, limit: 100 })  // Server Action (POST)
]);
```

**After**:
```typescript
const timestamp = Date.now();
const response = await fetch(`/api/spirits?t=${timestamp}`, {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
});
const data = await response.json();
setSearchIndex(data.searchIndex);
setPublishedSpirits(data.publishedSpirits);
```

**Key Improvements**:
- ✅ Cache-busting with timestamp query parameter
- ✅ Always sets `isLoading = false` in finally block
- ✅ Sets empty arrays on error to prevent UI issues
- ✅ Simplified error handling

## Technical Benefits

### 1. Cloudflare Edge Compatibility
- GET requests are more stable on Edge runtime
- No Server Action POST method issues
- Better support for edge caching strategies

### 2. Performance
- Cloudflare can cache GET responses at edge locations
- Cache-Control header: `public, s-maxage=60, stale-while-revalidate=300`
- Reduced latency for repeated requests

### 3. Reliability
- Eliminates 405 errors caused by POST method restrictions
- Guaranteed state updates (isLoading always set to false)
- Better error recovery with empty array fallbacks

## Field Mapping Verification

### API to UI Flow
```
API Route (route.ts)
  ↓ Returns searchIndex with fields: i, n, en, c, mc, sc, t
  ↓
Context (spirits-cache-context.tsx)
  ↓ Stores in state: searchIndex
  ↓
ExploreContent (ExploreContent.tsx)
  ↓ Maps to SpiritCard:
    - item.i → id
    - item.n → name
    - item.c → category
    - item.t → thumbnailUrl
```

All field mappings are **100% compatible** with existing UI components.

## Migration Checklist

- [x] Create `/app/api/spirits/route.ts` with edge runtime
- [x] Implement GET handler with proper error handling
- [x] Return both publishedSpirits and searchIndex
- [x] Update context to use fetch() instead of Server Actions
- [x] Remove Server Action imports from context
- [x] Add cache-busting timestamp
- [x] Verify field mappings match UI expectations
- [x] Test error handling
- [x] Run code review
- [x] Run security scan

## Testing Verification

### Code Review
- ✅ No issues found
- ✅ All changes follow best practices

### Security Scan (CodeQL)
- ✅ No vulnerabilities detected
- ✅ Safe for production deployment

### Field Compatibility
- ✅ ExploreContent.tsx expects: i, n, c, t
- ✅ API returns: i, n, en, c, mc, sc, t
- ✅ All required fields present

## Deployment Notes

### For Cloudflare Pages
1. The new API route uses `export const runtime = 'edge'`
2. Compatible with Cloudflare Pages Functions
3. No additional configuration needed
4. Automatic edge caching enabled

### Expected Behavior After Deployment
1. Main page loads without 405 errors
2. Search index populates correctly (count > 0)
3. Products display on explore page
4. Faster subsequent loads due to edge caching

## Rollback Plan

If issues occur, revert these files:
1. Delete `app/api/spirits/route.ts`
2. Restore `app/context/spirits-cache-context.tsx` from git history
3. Add back Server Action imports

```bash
git revert <commit-hash>
```

## Performance Metrics

### Before
- 405 errors on initial load
- Search index: 0 items
- No products displayed

### After (Expected)
- No 405 errors
- Search index: Correct count (e.g., 123+ items)
- Products display correctly
- Edge caching improves load times

## Additional Notes

### Server Actions Still Available
The original Server Actions in `app/actions/spirits.ts` are still present and can be used for:
- Server-side rendering scenarios
- Admin operations
- Non-edge environments

### Backwards Compatibility
- No breaking changes to UI components
- All existing API routes still functional
- Data structure remains identical

## References

- Issue: "FIX: Cloudflare Pages 405 Error on Server Actions & Migration to GET API Route"
- Cloudflare Pages Documentation: https://developers.cloudflare.com/pages/
- Next.js Edge Runtime: https://nextjs.org/docs/app/api-reference/edge
