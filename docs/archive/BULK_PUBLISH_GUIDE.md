# Bulk Publish Execution Guide

This guide documents the bulk publishing process for spirits with `status='READY_FOR_CONFIRM'`.

## Overview

We have created tools to bulk publish spirits so they become visible to guest users on the Explore page.

## Files Created

1. **scripts/publish-ready-data.js** - Direct Firebase Admin script
2. **scripts/publish-ready-data.ts** - API-based TypeScript script  
3. **API Endpoint**: `/api/admin/spirits/bulk-publish` - Already implemented

## Execution Methods

### Method 1: Via API Endpoint (Recommended for Production)

**Prerequisites:**
- Next.js dev server must be running
- Firebase credentials configured in environment

**Steps:**
```bash
# Terminal 1: Start the dev server
npm run dev

# Terminal 2: Run the bulk publish script
npm run publish-ready-spirits
```

**Alternative using curl:**
```bash
curl -X POST http://localhost:3000/api/admin/spirits/bulk-publish \
  -H "Content-Type: application/json" \
  -d '{
    "publishByStatus": "READY_FOR_CONFIRM",
    "updateStatus": true
  }'
```

### Method 2: Direct Firebase Admin (Recommended for CI/CD)

**Prerequisites:**
- Firebase Admin credentials in `.env.local`:
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY`

**Steps:**
```bash
node scripts/publish-ready-data.js
```

### Method 3: Production Deployment

The bulk-publish API endpoint is available in production at:
```
POST https://your-domain.com/api/admin/spirits/bulk-publish
```

**Note:** Ensure proper authentication/authorization is added before exposing in production.

## What the Script Does

1. **Queries** all spirits where `status = 'READY_FOR_CONFIRM'`
2. **Updates** each spirit:
   - Sets `isPublished = true`
   - Sets `status = 'PUBLISHED'`
   - Updates `updatedAt` timestamp
3. **Reports** success count and any failures
4. **Verifies** total published spirits in database

## Expected Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Starting Bulk Publish for READY_FOR_CONFIRM spirits
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Querying Firestore for READY_FOR_CONFIRM spirits...
✅ Found 247 spirits to publish

  📝 Queued: Spirit Name 1 (1/247)
  📝 Queued: Spirit Name 2 (2/247)
  ...

  💾 Committing batch of 247 updates...
  ✅ Batch committed successfully (247/247)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 Verification: Querying published spirits...

📊 FINAL REPORT:
  ✅ Successfully published: 247 spirits
  📈 Total published spirits in DB: 247
  🎯 Guest users can now see 247 spirits on Explore page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Verification Steps

### 1. Browser Console Check

After publishing, open the app as a guest user:

1. Open browser in **incognito/private mode** (to simulate guest user)
2. Navigate to `http://localhost:3000/explore` (or your production URL)
3. Open browser Developer Tools Console (F12)
4. Look for the log message:
   ```
   [FINAL_CHECK] Guest user now sees 247 spirits
   ```

### 2. Visual Verification

- Check that spirits appear in the Explore grid
- Verify category filters work correctly
- Test search functionality
- Confirm images load properly

### 3. Data Verification

Check the search index mapping in the console:
- Search index uses minimized keys: `n` (name), `i` (id), `t` (thumbnailUrl)
- Spirits render with correct titles and images
- All published spirits are indexed

## Troubleshooting

### No spirits found with READY_FOR_CONFIRM
```
⚠️  No spirits found with status READY_FOR_CONFIRM
```
**Solution:** Check database to see current spirit statuses. You may need to adjust the query or status value.

### Firebase credentials not configured
```
Error: FIREBASE_PROJECT_ID is not set in environment variables.
```
**Solution:** Create `.env.local` file with Firebase credentials:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### API endpoint not accessible
```
Error: API returned 404
```
**Solution:** 
1. Ensure dev server is running: `npm run dev`
2. Verify the endpoint exists: `app/api/admin/spirits/bulk-publish/route.ts`
3. Check for any build errors

### Guest users still can't see spirits

**Possible causes:**
1. Cache not cleared - Click "Clear Cache & Refresh" button on Explore page
2. LocalStorage outdated - Clear browser storage manually
3. Filter applied - Check that no restrictive filters are active
4. `isPublished` not synced - Run the fix-published-sync endpoint

## Code Changes Made

### 1. ExploreContent.tsx
Added console logging to track guest-visible spirits:
```typescript
// Final Check: Log guest-visible spirits count
useEffect(() => {
  if (!isCacheLoading && publishedSpirits.length > 0) {
    console.log(`[FINAL_CHECK] Guest user now sees ${publishedSpirits.length} spirits`);
  }
}, [publishedSpirits.length, isCacheLoading]);
```

### 2. Search Index Mapping
Verified correct usage of minimized keys:
- ✅ Using `item.i` to get spirit ID
- ✅ Mapping to full Spirit object via `getSpiritById(item.i)`
- ✅ Rendering with `spirit.name`, `spirit.imageUrl`, etc.

## Next Steps

After successful bulk publish:

1. ✅ Monitor the `[FINAL_CHECK]` console log
2. ✅ Test Explore page as guest user
3. ✅ Verify search functionality
4. ✅ Check all category filters
5. ✅ Test on mobile devices
6. 📝 Document final spirit count in the issue

## Security Notes

⚠️ **Important:** The bulk-publish endpoint should be protected with authentication in production:
- Add admin role verification
- Implement rate limiting
- Log all bulk operations
- Consider adding a confirmation step

## Related Files

- `/app/api/admin/spirits/bulk-publish/route.ts` - API endpoint
- `/components/ui/ExploreContent.tsx` - Frontend display
- `/app/context/spirits-cache-context.tsx` - Data caching
- `/lib/db/index.ts` - Database adapter
- `/lib/db/schema.ts` - Type definitions
