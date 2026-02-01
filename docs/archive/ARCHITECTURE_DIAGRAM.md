# Architecture Diagram: Data Consistency & Search Index

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Client Components)                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   ┌──────────────────────┐         ┌────────────────────────┐          │
│   │  Admin Spirit Panel  │         │  Client-Side Search    │          │
│   │  - Update Status     │         │  - Fast Filtering      │          │
│   │  - Bulk Operations   │         │  - No Server Calls     │          │
│   └──────────┬───────────┘         └────────────┬───────────┘          │
│              │                                    │                      │
└──────────────┼────────────────────────────────────┼──────────────────────┘
               │                                    │
               │ PATCH                              │ Server Action
               │                                    │
┌──────────────▼────────────────────────────────────▼──────────────────────┐
│                           API / SERVER ACTIONS                            │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌────────────────────────────────┐  ┌──────────────────────────────┐  │
│  │ /api/admin/spirits/[id]        │  │ getSpiritsSearchIndex()      │  │
│  │ /api/admin/spirits/bulk-patch  │  │ (Server Action)              │  │
│  │                                │  │                              │  │
│  │ ▶ Calls db.updateSpirit()     │  │ ▶ Calls db.getPublished...() │  │
│  └────────────┬───────────────────┘  └────────────┬─────────────────┘  │
│               │                                     │                    │
│               │              ┌──────────────────────┘                    │
│               │              │                                           │
│  ┌────────────▼──────────────▼────────────────────────────────────────┐ │
│  │                     lib/db/index.ts                                 │ │
│  │                   (Database Adapter)                                │ │
│  │                                                                     │ │
│  │  ┌────────────────────────────────────────────────────────────┐   │ │
│  │  │ updateSpirit(id, updates)                                  │   │ │
│  │  │ ┌────────────────────────────────────────────────────────┐ │   │ │
│  │  │ │ ✓ DATA CONSISTENCY GUARD                             │ │   │ │
│  │  │ │   if (updates.status === 'PUBLISHED')                │ │   │ │
│  │  │ │     updates.isPublished = true                       │ │   │ │
│  │  │ └────────────────────────────────────────────────────────┘ │   │ │
│  │  │ - Auto-generates search keywords                          │   │ │
│  │  │ - Updates updatedAt timestamp                             │   │ │
│  │  └────────────────────────────────────────────────────────────┘   │ │
│  │                                                                     │ │
│  │  ┌────────────────────────────────────────────────────────────┐   │ │
│  │  │ getPublishedSearchIndex()                                  │   │ │
│  │  │ - Fetches PUBLISHED spirits only                           │   │ │
│  │  │ - Returns minimized SpiritSearchIndex[] objects            │   │ │
│  │  └────────────────────────────────────────────────────────────┘   │ │
│  └──────────────────────────┬──────────────────────────────────────────┘ │
│                             │                                            │
└─────────────────────────────┼────────────────────────────────────────────┘
                              │
                              │ Uses Firestore REST API
                              │
┌─────────────────────────────▼────────────────────────────────────────────┐
│                    lib/db/firestore-rest.ts                               │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │ spiritsDb.upsert(id, updates)                                       │ │
│  │ - PATCH /spirits/{id}                                               │ │
│  │ - Updates specified fields                                          │ │
│  │ - Auto-adds updatedAt                                               │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │ spiritsDb.getPublishedSearchIndex()                                 │ │
│  │ - Query: status='PUBLISHED' AND isPublished=true                    │ │
│  │ - Maps to: { i, n, en, c, t } (minimized schema)                   │ │
│  │ - Returns: SpiritSearchIndex[]                                      │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
└───────────────────────────────┬───────────────────────────────────────────┘
                                │
                                │ REST API Calls
                                │
┌───────────────────────────────▼───────────────────────────────────────────┐
│                         FIRESTORE DATABASE                                │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   Collection: spirits                                                     │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ Document {                                                      │   │
│   │   id: "abc123",                                                 │   │
│   │   name: "Macallan 12",                                          │   │
│   │   status: "PUBLISHED",     ◄─┐                                  │   │
│   │   isPublished: true,         │ Always Synchronized!             │   │
│   │   metadata: {                │ (Enforced by consistency guard)  │   │
│   │     name_en: "Macallan 12" ◄─┘                                  │   │
│   │   },                                                            │   │
│   │   category: "whisky",                                           │   │
│   │   thumbnailUrl: "https://...",                                  │   │
│   │   ... (other fields)                                            │   │
│   │ }                                                               │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│   Composite Index: (status, isPublished)                                 │
│   ▶ Enables efficient querying for published spirits                     │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        MIGRATION TOOL (One-Time)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  POST /api/admin/spirits/fix-published-sync                             │
│                                                                          │
│  1. Fetch all spirits                                                   │
│  2. Find: status='PUBLISHED' BUT isPublished=false                      │
│  3. Fix: Call db.updateSpirit({ isPublished: true })                    │
│  4. Return: List of fixed spirits                                       │
│                                                                          │
│  ✓ Safe to run multiple times                                           │
│  ✓ Uses proper business logic (not direct DB access)                    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Examples

### 1. Admin Updates Spirit Status to PUBLISHED

```
Admin Panel
   │
   │ PATCH /api/admin/spirits/abc123
   │ { status: "PUBLISHED" }
   │
   ▼
API Route (route.ts)
   │
   │ db.updateSpirit(id, updates)
   │
   ▼
Database Adapter (lib/db/index.ts)
   │
   │ ✓ CONSISTENCY GUARD APPLIED
   │ if (updates.status === 'PUBLISHED')
   │   updates.isPublished = true
   │
   ▼
Firestore REST (lib/db/firestore-rest.ts)
   │
   │ PATCH to Firestore
   │
   ▼
Firestore Database
   │
   │ Document Updated:
   │ - status: "PUBLISHED"
   │ - isPublished: true ✓
   │ - updatedAt: <now>
```

### 2. Frontend Fetches Search Index

```
Client Component
   │
   │ await getSpiritsSearchIndex()
   │
   ▼
Server Action (app/actions/spirits.ts)
   │
   │ db.getPublishedSearchIndex()
   │
   ▼
Database Adapter (lib/db/index.ts)
   │
   │ spiritsDb.getPublishedSearchIndex()
   │
   ▼
Firestore REST (lib/db/firestore-rest.ts)
   │
   │ Query: status='PUBLISHED' AND isPublished=true
   │ Map to minimized schema
   │
   ▼
Firestore Database
   │
   │ Returns matching documents
   │
   ▼
Transform to Minimized Format
   │
   │ [{
   │   i: "abc123",
   │   n: "Macallan 12",
   │   en: "Macallan 12",
   │   c: "whisky",
   │   t: "https://..."
   │ }, ...]
   │
   ▼
Client Component
   │
   │ Fast client-side filtering
   │ No additional server calls needed!
```

## Type Safety Flow

```
lib/db/schema.ts
   │
   │ export interface SpiritSearchIndex {
   │   i: string;
   │   n: string;
   │   en: string | null;
   │   c: string;
   │   t: string | null;
   │ }
   │
   ├─────────────────────────┬──────────────────────────┐
   │                         │                          │
   ▼                         ▼                          ▼
lib/db/firestore-rest.ts   lib/db/index.ts    app/actions/spirits.ts
   │                         │                          │
   │ Uses SpiritSearchIndex  │ Uses SpiritSearchIndex   │ Returns SpiritSearchIndex
   │ as return type          │ as return type           │ to frontend
   │                         │                          │
   └─────────────────────────┴──────────────────────────┘
                             │
                             ▼
                    TypeScript ensures consistency
                    across entire codebase!
```
