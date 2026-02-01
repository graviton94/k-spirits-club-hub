# Phase 1: Search and Filter Improvements - Deployment Guide

This document explains how to deploy the search and filter improvements to production.

## Overview

The improvements include:
1. **Unified Filter Logic**: Both `status` and `isPublished` fields are consistently used in all queries
2. **Firestore Composite Indexes**: Required indexes for efficient multi-field queries
3. **Search Keywords Indexing**: N-gram based keyword arrays for better search performance

## Deployment Steps

### 1. Deploy Firestore Composite Indexes

The `firestore.indexes.json` file contains all required composite indexes for the application.

**Option A: Using Firebase CLI (Recommended)**

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not already done)
firebase init

# Deploy the indexes
firebase deploy --only firestore:indexes
```

**Option B: Manual Creation via Firebase Console**

If you get an error message when running queries, Firestore will provide a direct link to create the required index. You can:

1. Watch the server logs for index creation URLs
2. Click the provided URL to create the index automatically
3. Wait for index creation (usually 5-15 minutes)

The required indexes are:

1. **Status + Published + UpdatedAt**
   - Collection: `spirits`
   - Fields: `status (ASC)`, `isPublished (ASC)`, `updatedAt (DESC)`

2. **Status + Published + Category**
   - Collection: `spirits`
   - Fields: `status (ASC)`, `isPublished (ASC)`, `category (ASC)`

3. **Status + Published + Subcategory**
   - Collection: `spirits`
   - Fields: `status (ASC)`, `isPublished (ASC)`, `subcategory (ASC)`

4. **Status + Published + CreatedAt**
   - Collection: `spirits`
   - Fields: `status (ASC)`, `isPublished (ASC)`, `createdAt (DESC)`

### 2. Populate searchKeywords for Existing Data

The `searchKeywords` field is automatically populated for new spirits and when spirits are updated. However, existing spirits need to be migrated.

**Run the Migration Script:**

```bash
# Make sure you have the Firebase Admin SDK credentials
# The script expects service-account-key.json in the project root

node scripts/populate-search-keywords.js
```

**What the script does:**
- Reads all spirits from Firestore
- Generates n-gram keywords from name, English name, and distillery
- Updates each spirit with the `searchKeywords` array
- Processes in batches for efficiency

**Expected output:**
```
Starting searchKeywords population...
Found 1500 spirits to process
Progress: 100/1500
Progress: 200/1500
...
Committed batch of 500 updates
...
=== Migration Complete ===
Total spirits: 1500
Updated: 1500
Skipped: 0
Errors: 0
```

### 3. Deploy the Code Changes

Deploy the updated code to your hosting environment:

**For Cloudflare Pages:**
```bash
npm run pages:build
# Then deploy via Cloudflare dashboard or CLI
```

**For Vercel:**
```bash
vercel deploy --prod
```

**For other platforms:**
```bash
npm run build
# Then deploy according to your platform's instructions
```

### 4. Verification

After deployment, verify that:

1. **Filters work correctly:**
   - Visit the home page - "Today's Trending" should show published spirits
   - Visit the Explore page - filtered results should appear correctly
   - Try different category filters

2. **Search works efficiently:**
   - Search for partial names (e.g., "Glen" should find "Glenfiddich")
   - Search for English names
   - Search for distillery names

3. **No Firestore index errors:**
   - Check server logs for any index-related errors
   - If you see errors, follow the provided link to create missing indexes

## Technical Details

### Filter Logic Changes

**Before:**
- Inconsistent handling of `isPublished` filter
- Conditional logic that skipped filters in some cases

**After:**
- Both `status: 'PUBLISHED'` and `isPublished: true` are always applied together
- Consistent behavior across all user-facing queries

### Search Keywords Implementation

**How it works:**
- When a spirit is created or updated, `searchKeywords` array is auto-generated
- Keywords include n-grams (2-10 characters) from:
  - Korean name (name field)
  - English name (metadata.name_en)
  - Distillery name
- Search queries check if search term is contained in any keyword

**Example:**
```javascript
Spirit: {
  name: "발베니 12년",
  metadata: { name_en: "Balvenie 12 Year" },
  distillery: "Balvenie"
}

Generated searchKeywords: [
  "발베", "발베니", "bal", "balv", "balve", "balven", 
  "balvenie", "12", "year", "ba", "bal", "ve", "ven", ...
]
```

### Composite Indexes

Composite indexes are required when filtering on multiple fields. Firestore needs these to efficiently query across combinations of fields.

**Query example:**
```javascript
// This query requires a composite index on status + isPublished + updatedAt
{
  status: 'PUBLISHED',
  isPublished: true,
  // sorted by updatedAt DESC
}
```

## Rollback Plan

If issues occur after deployment:

1. **Rollback code changes:**
   - Revert to previous deployment
   - The old code will still work (just without the improvements)

2. **Indexes remain:**
   - Firestore indexes are additive and don't break existing queries
   - They can be deleted via Firebase Console if needed

3. **searchKeywords field:**
   - The new field doesn't break existing functionality
   - Can be safely ignored if not used

## Monitoring

After deployment, monitor:

1. **Query performance:**
   - Check Firestore usage in Firebase Console
   - Verify query response times are improved

2. **Search quality:**
   - Test various search scenarios
   - Collect user feedback on search results

3. **Error logs:**
   - Watch for any Firestore index errors
   - Monitor application error rates

## Support

If you encounter issues:

1. Check the server logs for detailed error messages
2. Verify all indexes are created and in "Ready" state in Firebase Console
3. Ensure the migration script completed successfully
4. Review the changes in this PR for implementation details

## Files Modified

- `lib/db/firestore-rest.ts` - Unified filter logic
- `lib/db/index.ts` - Added searchKeywords support and auto-generation
- `lib/db/schema.ts` - Added searchKeywords field to Spirit interface
- `lib/utils/search-keywords.ts` - N-gram keyword generation utilities
- `firestore.indexes.json` - Composite index definitions
- `scripts/populate-search-keywords.js` - Migration script for existing data
