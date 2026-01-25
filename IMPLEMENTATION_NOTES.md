# Data Consistency & Search Index Implementation

This document describes the implementation of data consistency guards and lightweight search index generation.

## 1. Data Consistency Guard

### What it does
Ensures that `status: 'PUBLISHED'` and `isPublished: true` are always synchronized.

### Implementation
- **Location**: `lib/db/index.ts` - `updateSpirit()` method
- **Logic**: When `status` is set to `'PUBLISHED'`, `isPublished` is automatically set to `true`
- **Coverage**: Applies to all spirit updates via:
  - `PATCH /api/admin/spirits/[id]`
  - `PATCH /api/admin/spirits/bulk-patch`

### Testing
```typescript
// Example: Update a spirit to PUBLISHED status
const response = await fetch('/api/admin/spirits/SPIRIT_ID', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'PUBLISHED' })
});
// The spirit will now have both status='PUBLISHED' AND isPublished=true
```

## 2. Search Index Generator

### What it does
Generates a minimized JSON index of all PUBLISHED spirits for client-side search, using short keys to reduce bandwidth.

### Implementation
- **Database Layer**: `lib/db/firestore-rest.ts` - `getPublishedSearchIndex()`
- **Adapter Layer**: `lib/db/index.ts` - `getPublishedSearchIndex()`
- **Server Action**: `app/actions/spirits.ts` - `getSpiritsSearchIndex()`

### Minimized Schema
```typescript
{
  i: string,           // id
  n: string,           // name
  en: string | null,   // name_en (English name from metadata)
  c: string,           // category
  t: string | null     // thumbnailUrl
}
```

### Frontend Usage
```typescript
import { getSpiritsSearchIndex } from '@/app/actions/spirits';

// Fetch the search index
const searchIndex = await getSpiritsSearchIndex();

// Use for client-side search
const results = searchIndex.filter(spirit => 
  spirit.n.toLowerCase().includes(searchTerm) ||
  spirit.en?.toLowerCase().includes(searchTerm)
);
```

### Size Reduction Estimate
The minimized index includes only 5 fields vs ~20+ fields in a full Spirit object:
- **Original size**: ~100% (full Spirit object with metadata, searchKeywords, etc.)
- **Minimized size**: ~15-25% (only id, name, name_en, category, thumbnailUrl)
- **Estimated reduction**: **75-85% bandwidth savings**

Additional savings from short key names:
- `id` → `i` (saves 1 byte per record)
- `name` → `n` (saves 3 bytes per record)
- `metadata.name_en` → `en` (saves ~15 bytes per record)
- `category` → `c` (saves 7 bytes per record)
- `thumbnailUrl` → `t` (saves 11 bytes per record)

For 1000 spirits, this saves approximately 37KB in JSON key names alone, plus the much larger savings from excluding unused fields.

## 3. Migration/Audit Tool

### What it does
Finds and fixes any existing spirits where `status='PUBLISHED'` but `isPublished=false`.

### Implementation
- **Location**: `app/api/admin/spirits/fix-published-sync/route.ts`
- **Method**: POST (can be run multiple times safely)

### Usage
```bash
# Run the migration
curl -X POST http://localhost:3000/api/admin/spirits/fix-published-sync

# Response example:
{
  "success": true,
  "message": "Fixed 5 out of 5 inconsistent spirits.",
  "totalChecked": 150,
  "fixedCount": 5,
  "failedCount": 0,
  "fixedSpirits": [
    { "id": "abc123", "name": "Macallan 12" },
    ...
  ],
  "failedFixes": []
}
```

## Testing Instructions

### 1. Test Data Consistency Guard
```javascript
// Create or update a spirit with PUBLISHED status
const spirit = await fetch('/api/admin/spirits/test-id', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    name: 'Test Spirit',
    status: 'PUBLISHED' 
  })
});

// Verify both fields are set
const result = await spirit.json();
console.assert(result.status === 'PUBLISHED');
console.assert(result.isPublished === true);
```

### 2. Test Search Index Generator
```javascript
import { getSpiritsSearchIndex } from '@/app/actions/spirits';

const index = await getSpiritsSearchIndex();
console.log('Index size:', index.length);
console.log('Sample entry:', index[0]);
// Should show: { i: '...', n: '...', en: '...', c: '...', t: '...' }
```

### 3. Test Migration Tool
```bash
# From terminal
curl -X POST http://localhost:3000/api/admin/spirits/fix-published-sync
```

## Files Modified

1. **lib/db/index.ts**
   - Added data consistency guard in `updateSpirit()`
   - Added `getPublishedSearchIndex()` method

2. **lib/db/firestore-rest.ts**
   - Added `getPublishedSearchIndex()` method for Firestore queries

3. **app/actions/spirits.ts**
   - Added `getSpiritsSearchIndex()` server action

4. **app/api/admin/spirits/fix-published-sync/route.ts** (NEW)
   - Created migration endpoint for fixing existing data

## Security Considerations

- The migration endpoint is under `/api/admin/` path (admin-only access assumed)
- Search index only returns PUBLISHED spirits (no draft/unpublished data leakage)
- All database operations use existing authentication/authorization patterns
