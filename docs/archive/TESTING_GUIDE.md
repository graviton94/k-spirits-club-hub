# Phase 1 Implementation - Testing and Verification Guide

This document provides instructions for testing and verifying the Phase 1 improvements.

## Changes Implemented

### 1. Unified Filter Logic ✅

**Problem:** Inconsistent filtering between different pages
- Home page "Today's Trending" used `isPublished: true`
- Explore page used `status: 'PUBLISHED'`
- Firestore REST layer had conditional logic that skipped filters

**Solution:** 
- Updated `lib/db/firestore-rest.ts` to always apply both filters when specified
- Removed conditional logic that was causing inconsistencies
- All queries now consistently use `{ status: 'PUBLISHED', isPublished: true }`

**Code Changes:**
```typescript
// BEFORE (inconsistent):
if (filter.isPublished !== undefined && filter.status !== 'PUBLISHED') {
  // Only add isPublished filter if status is not PUBLISHED
}

// AFTER (consistent):
if (filter.isPublished !== undefined) {
  // Always add isPublished filter when specified
}
```

### 2. Firestore Composite Indexes ✅

**Problem:** Queries with multiple filters return 0 results without proper indexes

**Solution:** Created `firestore.indexes.json` with 4 composite indexes:
1. `status + isPublished + updatedAt` (for trending/recent queries)
2. `status + isPublished + category` (for category filtering)
3. `status + isPublished + subcategory` (for subcategory filtering)
4. `status + isPublished + createdAt` (for creation date sorting)

**Deployment Required:** 
```bash
firebase deploy --only firestore:indexes
```

### 3. Search Keywords Indexing ✅

**Problem:** Firestore doesn't support `contains` queries on text fields

**Solution:** 
- Added `searchKeywords: string[]` field to Spirit schema
- Auto-generates n-gram keywords from name, English name, and distillery
- Search queries check keywords array for matches
- Falls back to traditional includes() search if keywords not available

**Features:**
- Supports partial matching: "glen" matches "Glenfiddich"
- Multi-language support: Korean and English names
- Includes distillery names in search
- Auto-generated on spirit create/update

## Verification Steps

### Test 1: Verify Filter Logic Unification

**Method 1: Code Review**
```bash
# Check that both filters are always applied together
grep -A 10 "isPublished.*undefined" lib/db/firestore-rest.ts
```

**Expected:** Should NOT see conditional logic based on status

**Method 2: Runtime Verification**
1. Start the dev server: `npm run dev`
2. Open browser console
3. Visit home page and Explore page
4. Check console logs for query filters
5. Both should log: `{ isPublished: true, status: 'PUBLISHED' }`

### Test 2: Verify Composite Indexes Configuration

**Check the configuration file:**
```bash
cat firestore.indexes.json
```

**Expected:** Should see 4 composite indexes defined

**After deployment:**
1. Go to Firebase Console > Firestore > Indexes
2. Verify all 4 composite indexes are listed
3. Wait for indexes to be "Ready" (green status)
4. This may take 5-15 minutes depending on data size

### Test 3: Verify Search Keywords Generation

**Method 1: Test Script**
```bash
npx tsx scripts/test-search-keywords.ts
```

**Expected output:**
- Keywords generated for "Glenfiddich": glen, gle, glenfiddich, etc.
- Keywords for Korean/English names combined
- Partial matches work correctly

**Method 2: Check Auto-Generation**
1. Run the app and login as admin
2. Edit a spirit (change name, distillery, or English name)
3. Save the changes
4. Check Firestore directly - the spirit should have `searchKeywords` array populated

**Method 3: Run Migration Script**
```bash
# Populate keywords for all existing spirits
node scripts/populate-search-keywords.js
```

**Expected:**
- Script processes all spirits
- Each spirit gets `searchKeywords` array
- Console shows progress and completion summary

### Test 4: End-to-End Search Testing

**After migration and deployment:**

1. **Home Page Test:**
   - Visit home page
   - Verify "Today's Trending" shows spirits
   - Check console - no Firestore index errors

2. **Explore Page Test:**
   - Visit Explore page
   - Select a category (e.g., "위스키")
   - Verify spirits appear
   - Try different filters (subcategory, etc.)
   - Check console - no errors

3. **Search Test:**
   - Use search bar on Explore page
   - Search for partial names: "Glen", "Jameson", "발베"
   - Verify results appear
   - Search for distillery names
   - Verify English name search works

4. **Performance Test:**
   - Note initial search response time
   - Search should feel instant (client-side filtering)
   - Category filtering should be fast
   - No loading delays

## Common Issues and Solutions

### Issue 1: "Missing Index" Error

**Symptom:** Console shows Firestore index error with a link

**Solution:**
1. Copy the link from the error message
2. Open it in a browser (you'll be logged into Firebase Console)
3. Click "Create Index"
4. Wait for index to build
5. Refresh the page

### Issue 2: Search Returns No Results

**Possible Causes:**
1. Migration script not run yet
2. searchKeywords not populated for spirits
3. Search term too short (< 2 chars)

**Solutions:**
1. Run migration: `node scripts/populate-search-keywords.js`
2. Check Firestore - verify spirits have `searchKeywords` field
3. Try longer search terms

### Issue 3: Category Filters Return No Results

**Possible Causes:**
1. Composite indexes not deployed
2. Indexes still building
3. Data inconsistency (status vs isPublished mismatch)

**Solutions:**
1. Deploy indexes: `firebase deploy --only firestore:indexes`
2. Wait for indexes to complete building
3. Check data - ensure spirits have both fields set correctly

## Performance Metrics

**Before Changes:**
- Some queries might return 0 results due to missing indexes
- Search was slower (checking every field)
- Inconsistent filter behavior

**After Changes:**
- All queries use proper indexes (faster)
- Search uses pre-generated keywords (instant)
- Consistent filtering across all pages

## Rollback Procedure

If issues occur:

1. **Rollback Code:**
   ```bash
   git revert HEAD
   git push
   ```

2. **Indexes:** Leave them (they don't break anything)

3. **searchKeywords:** Field is optional, can be ignored

## Next Steps

After successful deployment:

1. Monitor error logs for any Firestore errors
2. Check Firebase usage metrics
3. Gather user feedback on search quality
4. Consider adding more specialized indexes if needed
5. Optional: Add full-text search service (Algolia/Elasticsearch) for advanced features

## Files Modified

- ✅ `lib/db/firestore-rest.ts` - Unified filter logic
- ✅ `lib/db/index.ts` - Auto-generate searchKeywords on update
- ✅ `lib/db/schema.ts` - Added searchKeywords field
- ✅ `lib/utils/search-keywords.ts` - N-gram generation utilities
- ✅ `firestore.indexes.json` - Composite index definitions
- ✅ `scripts/populate-search-keywords.js` - Migration script
- ✅ `scripts/test-search-keywords.ts` - Test script

## Additional Resources

- [Firestore Composite Indexes](https://firebase.google.com/docs/firestore/query-data/index-overview)
- [Firestore Query Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [N-gram Search Techniques](https://en.wikipedia.org/wiki/N-gram)
