# Thumbnail URL Synchronization

## Problem
When changing images in the admin dashboard, the `thumbnailUrl` field was not being updated to match the `imageUrl`, causing inconsistencies in the data.

## Solution

### 1. Fixed Admin Dashboard (✅ Complete)
Updated `app/admin/page.tsx` to automatically sync `thumbnailUrl` with `imageUrl` when saving edits:
```javascript
thumbnailUrl: editForm.imageUrl, // Sync thumbnailUrl with imageUrl
```

### 2. Fix Existing Data

#### Script: `scripts/sync-thumbnail-urls.js`

This script finds all confirmed spirits (where `isReviewed === true`) that have mismatched `imageUrl` and `thumbnailUrl`, and updates `thumbnailUrl` to match `imageUrl`.

#### How to Run

1. **Set up Firebase credentials** in `.env.local`:
   ```bash
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-client-email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

2. **Run the script**:
   ```bash
   node scripts/sync-thumbnail-urls.js
   ```

3. **The script will**:
   - Query all confirmed spirits (`isReviewed === true`)
   - Identify spirits where `imageUrl !== thumbnailUrl`
   - Display a sample of mismatched records
   - Update `thumbnailUrl` to match `imageUrl` in batches
   - Report the results

#### Expected Output
```
Starting thumbnailUrl synchronization...
Finding confirmed spirits where imageUrl != thumbnailUrl...

Found 100 confirmed spirits to check

Found 23 spirits with mismatched URLs

Sample of mismatched spirits (showing first 10):
================================================
1. Spirit Name (spirit-id-123)
   imageUrl:     https://example.com/image.jpg
   thumbnailUrl: https://example.com/old-thumbnail.jpg

...

Starting batch updates...

✅ Committed batch of 23 updates (23/23)

=== Synchronization Complete ===
Total confirmed spirits checked: 100
Mismatches found: 23
✅ Updated: 23
⏭️  Skipped: 0
❌ Errors: 0
```

## Safety Features

- **Batched Updates**: Uses Firebase batch operations (500 per batch) for efficiency
- **Confirmed Spirits Only**: Only updates spirits where `isReviewed === true`
- **Preview**: Shows sample of changes before updating
- **Error Handling**: Continues processing even if individual updates fail
- **Timestamps**: Updates `updatedAt` field automatically

## What Changed

**Before:**
- Admin edits only updated `imageUrl`
- `thumbnailUrl` remained unchanged
- Data became inconsistent over time

**After:**
- Admin edits update both `imageUrl` AND `thumbnailUrl`
- Existing mismatched data can be fixed with the migration script
- Future edits will maintain consistency
