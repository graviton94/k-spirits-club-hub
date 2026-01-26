# Emergency Data Visibility Recovery Guide

## Overview
This document describes the fixes applied to resolve the "zero data" issue where both admin and user views were showing no spirits.

## Root Cause Analysis

### Problem
The application was experiencing a complete data blackout:
- **Admin Dashboard**: Showing 0 spirits
- **User View (Explore/Search)**: Showing 0 spirits
- **Cache Context**: Loading but returning empty arrays

### Root Causes Identified

1. **Filter Mismatch**
   - Public cache was filtering by `status: 'PUBLISHED'` 
   - Many spirits in DB have `status: 'READY_FOR_CONFIRM'` or other values
   - Only spirits with exact `status='PUBLISHED'` were returned

2. **Missing isPublished Flag**
   - Database spirits had `isPublished: false` even when ready to publish
   - Public queries relied on `status` field instead of `isPublished` flag

3. **Data Consistency**
   - Inconsistency between `status` and `isPublished` fields
   - No automated sync mechanism

## Fixes Applied

### 1. Database Query Layer (`lib/db/firestore-rest.ts`)
```typescript
// BEFORE: Used status='PUBLISHED' filter
const publishedSpirits = await this.getAll({ 
    status: 'PUBLISHED' as SpiritStatus
});

// AFTER: Use isPublished flag (more reliable)
const publishedSpirits = await this.getAll({ 
    isPublished: true
});
```

**Benefits:**
- Works regardless of exact `status` value
- More reliable for public data visibility
- Aligns with intended data model

### 2. Cache Context (`app/context/spirits-cache-context.tsx`)
```typescript
// BEFORE: Filtered by status
getSpiritsAction(
  { status: 'PUBLISHED' },
  { page: 1, pageSize: 15000 }
)

// AFTER: Filter by isPublished flag
getSpiritsAction(
  { isPublished: true },
  { page: 1, pageSize: 15000 }
)
```

**Benefits:**
- Public users see all published content
- Cache loads successfully even with mixed status values
- Added SYSTEM_REPORT diagnostic logs

### 3. Admin API (`app/api/admin/spirits/route.ts`)
```typescript
// BEFORE: Applied status filter by default
if (status && status !== 'ALL') filter.status = status;

// AFTER: Only filter when explicitly requested
if (status && status !== 'ALL') {
    filter.status = status as SpiritStatus;
}
// Admin sees ALL spirits by default (no isPublished filter)
```

**Benefits:**
- Admin can see all spirits regardless of publication status
- Better zero-result diagnostics
- Clearer logging

### 4. Enhanced Logging
Added comprehensive diagnostic logs at multiple layers:

```
[Firestore] Query returned 450 spirits
[SYSTEM_CHECK] Total Docs: 450 | Published: 120 | Unpublished: 330
[SpiritsCacheContext] ✅ Fetched from API: 120 spirits
[SYSTEM_REPORT] User Visible (Published): 120
```

## New Diagnostic Tools

### 1. Database Diagnostic Endpoint
**URL:** `GET /api/admin/spirits/diagnose`

**Purpose:** Analyze current database state and identify issues

**Response Example:**
```json
{
  "success": true,
  "totalSpirits": 450,
  "statusBreakdown": {
    "RAW": 100,
    "ENRICHED": 150,
    "READY_FOR_CONFIRM": 180,
    "PUBLISHED": 20
  },
  "publishedBreakdown": {
    "isPublishedTrue": 120,
    "isPublishedFalse": 330,
    "isPublishedUndefined": 0
  },
  "crossAnalysis": {
    "publishedAndTrue": 20,
    "publishedButFalse": 0,
    "notPublishedButTrue": 100,
    "otherAndTrue": 0,
    "otherAndFalse": 330
  },
  "recommendations": [
    "ℹ️ Found 100 spirits with isPublished=true but status!='PUBLISHED'",
    "INFO: This is acceptable - these spirits will be visible to users."
  ]
}
```

**How to Use:**
```bash
# Via curl
curl -X GET https://your-domain.com/api/admin/spirits/diagnose

# Via browser
# Navigate to: https://your-domain.com/api/admin/spirits/diagnose
```

**What to Look For:**
- `totalSpirits`: Should be > 0 (if 0, database is empty)
- `publishedBreakdown.isPublishedTrue`: Should be > 0 for users to see data
- `recommendations`: Follow the suggested actions

### 2. Bulk Publish Endpoint
**URL:** `POST /api/admin/spirits/bulk-publish`

**Purpose:** Emergency bulk publishing of spirits

**Options:**

#### Option A: Publish ALL Spirits (Emergency)
```bash
curl -X POST https://your-domain.com/api/admin/spirits/bulk-publish \
  -H "Content-Type: application/json" \
  -d '{"publishAll": true}'
```

#### Option B: Publish by Status
```bash
curl -X POST https://your-domain.com/api/admin/spirits/bulk-publish \
  -H "Content-Type: application/json" \
  -d '{"publishByStatus": "READY_FOR_CONFIRM"}'
```

#### Option C: Publish Specific IDs
```bash
curl -X POST https://your-domain.com/api/admin/spirits/bulk-publish \
  -H "Content-Type: application/json" \
  -d '{"spiritIds": ["id1", "id2", "id3"]}'
```

**Response:**
```json
{
  "success": true,
  "message": "Published 180 out of 180 spirits",
  "publishedCount": 180,
  "failedCount": 0,
  "publishedIds": ["id1", "id2", ...],
  "failures": []
}
```

### 3. Existing Sync Endpoint
**URL:** `POST /api/admin/spirits/fix-published-sync`

**Purpose:** Fix inconsistencies where `status='PUBLISHED'` but `isPublished=false`

**When to Use:** After running diagnostic if it shows `publishedButFalse > 0`

## Recovery Steps

### Step 1: Check Database State
```bash
curl -X GET https://your-domain.com/api/admin/spirits/diagnose
```

**Look for:**
1. `totalSpirits` - Should be > 0
2. `publishedBreakdown.isPublishedTrue` - Should be > 0 for public visibility

### Step 2: Interpret Results

#### Scenario A: Empty Database
```json
{
  "totalSpirits": 0,
  "message": "⚠️ DATABASE IS EMPTY"
}
```

**Solution:** Import data using scripts in `/scripts` directory

#### Scenario B: No Published Spirits
```json
{
  "publishedBreakdown": {
    "isPublishedTrue": 0,
    "isPublishedFalse": 450
  },
  "recommendations": [
    "🚨 CRITICAL: No spirits with isPublished=true found!"
  ]
}
```

**Solution:** Bulk publish spirits
```bash
# Option 1: Publish all READY_FOR_CONFIRM spirits
curl -X POST https://your-domain.com/api/admin/spirits/bulk-publish \
  -H "Content-Type: application/json" \
  -d '{"publishByStatus": "READY_FOR_CONFIRM"}'

# Option 2: Emergency - publish ALL
curl -X POST https://your-domain.com/api/admin/spirits/bulk-publish \
  -H "Content-Type: application/json" \
  -d '{"publishAll": true}'
```

#### Scenario C: Inconsistent Status
```json
{
  "crossAnalysis": {
    "publishedButFalse": 50
  },
  "recommendations": [
    "⚠️ Found 50 spirits with status='PUBLISHED' but isPublished=false"
  ]
}
```

**Solution:** Run sync endpoint
```bash
curl -X POST https://your-domain.com/api/admin/spirits/fix-published-sync
```

### Step 3: Verify Fix

1. **Check Browser Console** (F12 Developer Tools)
   ```
   [SYSTEM_REPORT] Total Docs Fetched: 180
   [SYSTEM_REPORT] Search Index Length: 180
   [SYSTEM_REPORT] User Visible (Published): 180
   ```

2. **Refresh Explore Page**
   - Clear cache: Click "Clear Cache & Refresh" button
   - Check if spirits appear

3. **Check Admin Dashboard**
   - Navigate to `/admin`
   - Should see ALL spirits (not just published)

## System Diagnostic Logs

### Browser Console (Public View)
Look for these logs when visiting `/explore`:

```
[SpiritsCacheContext] 📡 Fetching data from Firestore...
[Firestore] Query returned 180 spirits
[SYSTEM_CHECK] Total Docs: 180 | Published: 180 | Unpublished: 0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[SYSTEM_REPORT] Data Visibility Summary
[SYSTEM_REPORT] Total Docs Fetched: 180
[SYSTEM_REPORT] Search Index Length: 180
[SYSTEM_REPORT] User Visible (Published): 180
[SYSTEM_REPORT] Sample Spirit: Glenfiddich 12 (Status: READY_FOR_CONFIRM, Published: true)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Server Console (Admin API)
Look for these logs when admin fetches data:

```
[API /api/admin/spirits] Fetching with filter: {}
[Firestore] Query returned 450 spirits
[SYSTEM_CHECK] Total Docs: 450 | Published: 180 | Unpublished: 270
[API /api/admin/spirits] Returned 50 spirits (Total: 450, Page: 1/9)
```

## Testing Checklist

- [ ] **Database Diagnostic**
  - [ ] Run `/api/admin/spirits/diagnose`
  - [ ] Verify `totalSpirits > 0`
  - [ ] Verify `isPublishedTrue > 0`

- [ ] **Admin Dashboard**
  - [ ] Navigate to `/admin`
  - [ ] Should see spirits regardless of status
  - [ ] Check console for `[API /api/admin/spirits]` logs
  - [ ] Verify spirit count matches database

- [ ] **Public Explore Page**
  - [ ] Navigate to `/explore`
  - [ ] Click "Clear Cache & Refresh"
  - [ ] Check browser console for `[SYSTEM_REPORT]`
  - [ ] Verify spirits appear
  - [ ] Verify count matches published count

- [ ] **Search Functionality**
  - [ ] Test search on `/explore`
  - [ ] Verify results appear
  - [ ] Check Fuse.js is working

- [ ] **Category Filters**
  - [ ] Test category selection
  - [ ] Verify filtered results
  - [ ] Check sub-category filters

## Troubleshooting

### Issue: Still seeing 0 spirits after fix

**Check:**
1. Run diagnostic: `GET /api/admin/spirits/diagnose`
2. Look at `isPublishedTrue` count
3. If 0, run bulk publish
4. Clear browser cache and localStorage
5. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: Admin dashboard shows 0 spirits

**Check:**
1. Run diagnostic to verify database has data
2. Check server console for errors
3. Check Firestore service account permissions
4. Verify `FIREBASE_PROJECT_ID` environment variable

### Issue: Public page shows 0 but admin shows data

**Check:**
1. Run diagnostic to check `isPublishedTrue` count
2. If 0, spirits need to be published
3. Run bulk publish for desired spirits
4. Clear browser localStorage
5. Click "Clear Cache & Refresh" button

### Issue: Some spirits missing from public view

**Check:**
1. Verify those spirits have `isPublished: true`
2. Check browser console for filter logs
3. Verify search index includes those spirits
4. Check category/subcategory values are correct

## Security Considerations

### Firestore Rules
Current rules allow public read access:

```
match /spirits/{spiritId} {
  allow read: if true;
  allow write: if isAdmin();
}
```

This is correct for public visibility. Do NOT restrict read access.

### Admin Endpoints
The diagnostic and bulk publish endpoints should be protected by admin authentication in production.

**TODO:** Add admin auth middleware to:
- `/api/admin/spirits/diagnose`
- `/api/admin/spirits/bulk-publish`
- `/api/admin/spirits/fix-published-sync`

## Performance Considerations

### Query Limits
- Firestore REST API has a 5000 document limit per query
- For databases with >5000 spirits, implement pagination
- Current implementation fetches up to 5000 in one query

### Cache Strategy
- LocalStorage caches search index for 24 hours
- Force refresh available via UI button
- Cache uses minimized data structure to reduce size

### Indexing
If you see "Missing Index" errors in console:
1. Click the link in the error message
2. Create the composite index in Firebase Console
3. Wait 2-5 minutes for index to build
4. Retry the query

## Summary

**Critical Changes:**
1. ✅ Changed public queries to use `isPublished: true` filter
2. ✅ Admin queries now fetch ALL data by default
3. ✅ Added comprehensive diagnostic logging
4. ✅ Created diagnostic and bulk publish endpoints

**Expected Behavior:**
- **Admin**: Sees ALL spirits (published and unpublished)
- **Public**: Sees only spirits with `isPublished: true`
- **Console**: Shows detailed SYSTEM_REPORT with counts

**Next Steps:**
1. Run diagnostic endpoint
2. Bulk publish spirits if needed
3. Verify in browser console
4. Test all views (admin, explore, search)
5. Add admin authentication to new endpoints
