# Data Connect Master Map & API Dictionary (v2.0)
*Source of truth: `dataconnect/schema/schema.gql`, `dataconnect/main/queries.gql`, `dataconnect/main/mutations.gql`*
*Last updated: 2026-04-30*

> **CRITICAL**: This document reflects the live PostgreSQL schema managed by Firebase Data Connect.
> All DB reads/writes MUST go through `lib/db/data-connect-client.ts`. Never use raw SQL or Firestore SDK.

---

## 🏗️ 1. Tables (PostgreSQL via Firebase Data Connect)

### [User] `@table`
*Auth: upsert requires `auth.uid == vars.id`*

| Field | Type | Constraints / Default |
| :--- | :--- | :--- |
| `id` | `String!` | PK (Firebase Auth UID) |
| `email` | `String` | |
| `nickname` | `String` | `varchar(100)` |
| `profileImage` | `String` | |
| `role` | `String` | `varchar(20)`, default `"USER"` (`ADMIN` \| `USER` \| `EXPERT`) |
| `themePreference` | `String` | `varchar(10)`, default `"light"` |
| `isFirstLogin` | `Boolean` | default `true` |
| `reviewsWritten` | `Int` | default `0` — denormalized counter |
| `heartsReceived` | `Int` | default `0` — denormalized counter |
| `tasteProfile` | `Any` | JSON blob |
| `createdAt` | `Timestamp` | default `request.time` |

---

### [Spirit] `@table`
*Auth: upsert/delete requires `auth.uid == 'fiO8qf1PjLZAPBNcJmvy1cpqrY52'` (admin)*

| Field | Type | Constraints / Default |
| :--- | :--- | :--- |
| `id` | `String!` | PK |
| `name` | `String!` | |
| `nameEn` | `String` | |
| `category` | `String!` | |
| `categoryEn` | `String` | |
| `mainCategory` | `String` | |
| `subcategory` | `String` | |
| `distillery` | `String` | |
| `bottler` | `String` | |
| `abv` | `Float` | |
| `volume` | `Int` | |
| `country` | `String` | |
| `region` | `String` | |
| `imageUrl` | `String!` | |
| `thumbnailUrl` | `String` | |
| `descriptionKo` | `String` | |
| `descriptionEn` | `String` | |
| `pairingGuideKo` | `String` | |
| `pairingGuideEn` | `String` | |
| `noseTags` | `[String!]` | |
| `palateTags` | `[String!]` | |
| `finishTags` | `[String!]` | |
| `tastingNote` | `String` | |
| `status` | `String` | `varchar(50)` |
| `importer` | `String` | `varchar(200)` |
| `rawCategory` | `String` | `varchar(200)` |
| `isPublished` | `Boolean` | default `false` |
| `isReviewed` | `Boolean` | default `false` |
| `reviewedBy` | `String` | |
| `reviewedAt` | `Timestamp` | |
| `rating` | `Float` | default `0.0` — denormalized aggregate |
| `reviewCount` | `Int` | default `0` — denormalized aggregate |
| `metadata` | `Any` | JSON blob |
| `createdAt` | `Timestamp!` | default `request.time` |
| `updatedAt` | `Timestamp!` | default `request.time` |

---

### [NewArrival] `@table`
*Auth: upsert requires admin UID*

| Field | Type | Constraints / Default |
| :--- | :--- | :--- |
| `id` | `String!` | PK |
| `spirit` | `Spirit!` | FK → Spirit (spiritId) |
| `displayOrder` | `Int` | default `0` |
| `tags` | `[String!]` | |
| `createdAt` | `Timestamp` | default `request.time` |

---

### [SpiritReview] `@table`
*Auth: upsert requires `auth.uid == vars.userId`; admin delete requires admin UID*

| Field | Type | Constraints / Default |
| :--- | :--- | :--- |
| `id` | `UUID!` | PK, default `uuidV4()` |
| `spirit` | `Spirit!` | FK → Spirit (spiritId) |
| `user` | `User!` | FK → User (userId) |
| `rating` | `Int!` | |
| `title` | `String` | |
| `content` | `String!` | |
| `nose` | `String` | Tag string |
| `palate` | `String` | Tag string |
| `finish` | `String` | Tag string |
| `likes` | `Int` | default `0` |
| `isPublished` | `Boolean` | default `true` |
| `imageUrls` | `[String!]` | |
| `createdAt` | `Timestamp!` | default `request.time` |
| `updatedAt` | `Timestamp!` | default `request.time` |

---

### [ReviewLike] `@table(key: ["user", "review"])`
*Composite PK — one like per (user, review) pair*
*Auth: upsert/delete requires `auth.uid == vars.userId`*

| Field | Type | Constraints / Default |
| :--- | :--- | :--- |
| `user` | `User!` | FK → User (userId) — part of composite PK |
| `review` | `SpiritReview!` | FK → SpiritReview (reviewId) — part of composite PK |
| `createdAt` | `Timestamp` | default `request.time` |

---

### [ReviewComment] `@table`
*Auth: upsert requires `auth.uid == vars.userId`; delete requires `auth != null`*

| Field | Type | Constraints / Default |
| :--- | :--- | :--- |
| `id` | `UUID!` | PK, default `uuidV4()` |
| `review` | `SpiritReview!` | FK → SpiritReview (reviewId) |
| `user` | `User!` | FK → User (userId) |
| `content` | `String` | `varchar(500)` |
| `createdAt` | `Timestamp` | default `request.time` |
| `updatedAt` | `Timestamp` | default `request.time` |

---

### [NewsArticle] `@table`
*Auth: upsert/delete requires admin UID*

| Field | Type | Constraints / Default |
| :--- | :--- | :--- |
| `id` | `String!` | PK |
| `title` | `String!` | |
| `content` | `String!` | |
| `imageUrl` | `String` | |
| `category` | `String` | |
| `source` | `String` | |
| `link` | `String` | |
| `date` | `String` | `@index` |
| `translations` | `Any` | JSON blob |
| `tags` | `Any` | JSON blob |
| `createdAt` | `Timestamp` | default `request.time`, `@index` |
| `updatedAt` | `Timestamp` | default `request.time` |

---

### [UserCabinet] `@table(key: ["user", "spirit"])`
*Composite PK — one entry per (user, spirit) pair*
*Auth: upsert/delete requires `auth.uid == vars.userId`*

| Field | Type | Constraints / Default |
| :--- | :--- | :--- |
| `user` | `User!` | FK → User (userId) — part of composite PK |
| `spirit` | `Spirit!` | FK → Spirit (spiritId) — part of composite PK |
| `addedAt` | `Timestamp` | default `request.time` |
| `notes` | `String` | |
| `rating` | `Int` | |
| `isFavorite` | `Boolean` | default `false` |
| `isWishlist` | `Boolean` | default `false` |

---

### [ModificationRequest] `@table`
*Auth: upsert requires `auth != null`*

| Field | Type | Constraints / Default |
| :--- | :--- | :--- |
| `id` | `String!` | PK |
| `spiritId` | `String!` | |
| `spiritName` | `String` | |
| `userId` | `String` | |
| `title` | `String!` | |
| `content` | `String!` | |
| `status` | `String` | default `"pending"` |
| `createdAt` | `Timestamp` | default `request.time` |

---

### [WorldCupResult] `@table`
*Auth: upsert requires `auth != null`; queries are PUBLIC*

| Field | Type | Constraints / Default |
| :--- | :--- | :--- |
| `id` | `UUID!` | PK, default `uuidV4()` |
| `winner` | `Spirit!` | FK → Spirit (winnerId) |
| `category` | `String!` | |
| `subcategory` | `String` | |
| `initialRound` | `Int` | |
| `timestamp` | `Timestamp` | default `request.time` |

---

### [AiDiscoveryLog] `@table`
*Auth: upsert is PUBLIC (anonymous logging)*

| Field | Type | Constraints / Default |
| :--- | :--- | :--- |
| `id` | `String!` | PK |
| `userId` | `String` | nullable (anonymous sessions) |
| `analysis` | `String` | |
| `recommendations` | `Any` | JSON: `[{name, inDb, ...}]` |
| `messageHistory` | `Any` | JSON: `[{role, content}]` |
| `createdAt` | `Timestamp` | default `request.time` |

---

## 🔑 2. Relationship Map

```
User ──< SpiritReview >── Spirit
User ──< ReviewLike >── SpiritReview
User ──< ReviewComment >── SpiritReview
User ──< UserCabinet >── Spirit
Spirit ──< NewArrival
Spirit ──< WorldCupResult (winner)
```

---

## 📡 3. GQL Operations Catalog

### Queries (`dataconnect/main/queries.gql`)

| Operation | Auth | Description |
| :--- | :--- | :--- |
| `listSpirits` | PUBLIC | Filter by category / subcategory / country |
| `searchSpiritsPublic` | PUBLIC | Full-text search with pagination |
| `listAllCategories` | PUBLIC | Distinct category list |
| `listAllSubcategories` | PUBLIC | Distinct subcategory list by category |
| `listTrendingSpirits` | PUBLIC | Ordered by reviewCount DESC, rating DESC |
| `listNewArrivals` | PUBLIC | Ordered by createdAt DESC |
| `getSpirit` | PUBLIC | Full detail + nested reviews |
| `adminListRawSpirits` | **ADMIN** | Paginated list with all filter combos |
| `getUserProfile` | PUBLIC | Single user profile |
| `listNewsArticles` | PUBLIC | Paginated news |
| `getNewsArticle` | PUBLIC | Single article |
| `auditAllUsers` | **ADMIN** | Full user list |
| `auditAllNews` | **ADMIN** | Full news list |
| `auditAllSpirits` | **ADMIN** | Full spirits list (id only) |
| `auditAllReviews` | **ADMIN** | Full reviews list |
| `listSpiritReviews` | PUBLIC | Published reviews with author & spirit info |
| `getSpiritReviewsCount` | `auth != null` | Count of all reviews |
| `findReview` | PUBLIC | Check if user reviewed a spirit |
| `getReviewDetail` | PUBLIC | Full review with comments + userLike |
| `listReviewComments` | PUBLIC | Comments on a review |
| `listSpiritsForSitemap` | PUBLIC | SEO-optimized bulk fetch (limit 5000) |
| `getWorldCupResult` | PUBLIC | Single result with full winner spirit data |
| `listSpiritsForWorldCup` | PUBLIC | Spirits filtered by category/subcategory |
| `listAllSpiritsForWorldCup` | PUBLIC | All published spirits (limit 500) |

### Mutations (`dataconnect/main/mutations.gql`)

| Operation | Auth | Description |
| :--- | :--- | :--- |
| `upsertUser` | `auth.uid == vars.id` | Create/update own profile |
| `upsertSpirit` | **ADMIN** | Create/update spirit record |
| `deleteSpirit` | **ADMIN** | Hard delete spirit |
| `upsertNewArrival` | **ADMIN** | Create/update home curation entry |
| `upsertReview` | `auth.uid == vars.userId` | Create/update own review |
| `updateReviewLikesCount` | `auth != null` | Update denormalized likes count |
| `deleteReview` | **ADMIN** | Hard delete review |
| `upsertReviewLike` | `auth.uid == vars.userId` | Like a review |
| `deleteReviewLike` | `auth.uid == vars.userId` | Unlike a review |
| `upsertReviewComment` | `auth.uid == vars.userId` | Create/update own comment |
| `deleteReviewComment` | `auth != null` | Delete comment |
| `upsertNews` | **ADMIN** | Create/update news article |
| `deleteNews` | **ADMIN** | Hard delete news article |
| `upsertCabinet` | `auth.uid == vars.userId` | Add/update cabinet entry |
| `deleteCabinet` | `auth.uid == vars.userId` | Remove cabinet entry |
| `upsertModificationRequest` | `auth != null` | Submit data correction request |
| `upsertWorldCupResult` | `auth != null` | Save game result |
| `upsertAiDiscoveryLog` | PUBLIC | Log AI sommelier session |

> **ADMIN** = `auth != null && auth.uid == 'fiO8qf1PjLZAPBNcJmvy1cpqrY52'`

---

## 🛠️ 4. Rules of Engagement

1. **Naming**: Strictly **camelCase** for all Data Connect fields. No snake_case aliases.
2. **Access layer**: Always use `lib/db/data-connect-client.ts` — never call GQL endpoints directly from components.
3. **Composite PKs**: `UserCabinet` and `ReviewLike` use composite keys. Pass both FK values to `_delete` / `_upsert` operations.
4. **Where clause**: Wrap mixed conditions in `_and`/`_or` — never mix raw field filters with logical operators at the same level.
5. **`Any` fields**: `tasteProfile`, `metadata`, `recommendations`, `messageHistory`, `translations`, `tags` are stored as JSON. Always parse/stringify at the client boundary.
6. **Admin UID**: `fiO8qf1PjLZAPBNcJmvy1cpqrY52` — hardcoded in `@auth` directives. Do not change without coordinated schema redeploy.
7. **SDK regeneration**: After any `.gql` schema or operation change, run `npx -y firebase-tools@latest deploy --only dataconnect -f` then `npx firebase dataconnect:sdk:generate`.