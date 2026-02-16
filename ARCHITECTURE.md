# Architecture

## Data Flow

### Search Flow (Hybrid Client-Side)
1. **Initial Load**: Server fetches full search index (100K+ spirits) from Firestore on first page load
2. **Context Cache**: Index stored in React Context to avoid repeated server calls
3. **Client Search**: Fuse.js performs instant fuzzy search on cached index (zero latency)
4. **Filtering**: Category, subcategory, and text filters applied client-side
5. **Result**: Instant search results without server round-trips

### Cabinet Management Flow
1. **User Action**: Add/remove spirit from owned/wishlist collection
2. **Server Action**: TypeScript server action validates request and user authentication
3. **Firestore REST**: Edge-compatible REST API call to update user's cabinet document
4. **Optimistic UI**: UI updates immediately, reverts on error
5. **Revalidation**: ISR cache invalidated for user's cabinet page

### AI Taste Analysis Flow
1. **Data Collection**: Fetch user's cabinet items and all reviews from Firestore
2. **Data Merge**: Combine recent cabinet additions with review data (last 30 items)
3. **Prompt Building**: `aiPromptBuilder.ts` constructs structured prompt with spirit metadata
4. **AI Request**: Sequential call to Gemini 2.0 Flash API (10 RPM rate limit)
5. **Profile Storage**: Generated taste profile saved to Firestore user document
6. **Result Display**: Radar chart visualization with 6 dimensions (Sweet, Smoky, Fruity, etc.)
7. **Rate Limiting**: Maximum 3 analyses per user per day

### Data Pipeline Flow (Python → TypeScript)
1. **Fetch** (`fetch_food_safety.py`): Scrape public food safety database for raw spirit data
2. **Storage**: Save raw data to `data/raw/` directory
3. **AI Enrichment** (`run_pipeline.py`): Gemini API classifies categories, generates descriptions
4. **Image Search**: Automated image fetching from search engines
5. **Batch Upload**: 10-item batches uploaded to Firestore to avoid timeouts
6. **Admin Review**: Admin dashboard shows pending spirits for approval
7. **Publish** (`publish-ready-data.ts`): Admin approves → moves from 'pending' to 'published' collection
8. **Index Update**: Search index regenerated and deployed

### Review Submission Flow
1. **Form Input**: User submits review with sensory ratings (Nose, Palate, Finish)
2. **API Route**: `/api/reviews/route.ts` validates input and authentication
3. **Firestore Write**: Review document created in `reviews` collection with timestamp
4. **LiveReviews**: New review appears in real-time feed via ISR revalidation (30s cache)

## Design Patterns

### Server Components Pattern
- **Usage**: All page components default to Server Components for SSG/SSR
- **Benefit**: Pre-render at build time, reduce JavaScript bundle, improve SEO
- **Example**: `app/[lang]/page.tsx` fetches featured spirits server-side

### Context API for Caching
- **Implementation**: `SearchContext.tsx` caches full search index in React Context
- **Why**: Avoid repeated 100KB+ index fetches, enable instant client-side search
- **Lifecycle**: Load once on mount, persist across page navigations

### Firestore REST API Pattern
- **Problem**: Firebase Admin SDK incompatible with Cloudflare Edge Workers
- **Solution**: Custom REST API abstraction in `lib/db/firestore-rest.ts`
- **Benefit**: Edge-compatible, sub-300ms response times from Cloudflare PoPs
- **Trade-off**: Manual query construction vs Admin SDK convenience

### Server Actions Pattern
- **Usage**: Cabinet operations (`lib/actions/cabinet.ts`)
- **Security**: Server-side validation of auth tokens and user permissions
- **Benefit**: Type-safe mutations without explicit API routes
- **Example**: `addToCabinet()`, `removeFromCabinet()` functions

### ISR (Incremental Static Regeneration)
- **Implementation**: `revalidate: 30` for live reviews, `revalidate: 3600` for spirit pages
- **Why**: Balance freshness with performance and build costs
- **Example**: Cabinet page caches for 30 seconds, then regenerates on next request

### Image Proxy Pattern
- **Implementation**: `lib/utils/imageOptimizer.ts` uses wsrv.nl proxy
- **Benefit**: On-the-fly WebP conversion, resizing, CDN caching
- **Format**: `https://wsrv.nl/?url={originalUrl}&w=400&output=webp`
- **Fallback**: Category default images if original fails

### Multi-Tier Fallback Pattern (World Cup Game)
- **Tier 1**: Optimized image via wsrv.nl proxy
- **Tier 2**: Original image URL from database
- **Tier 3**: Category default image
- **Preloading**: All images preloaded before game starts to avoid CLS

### Repository Pattern
- **Location**: `lib/db/firestore-rest.ts` acts as data access layer
- **Methods**: `getDocument()`, `queryCollection()`, `addDocument()`, `updateDocument()`
- **Abstraction**: Hide Firestore implementation details from application code

### Middleware Pattern (i18n)
- **File**: `middleware.ts`
- **Function**: Detect browser locale → redirect to `/ko/*` or `/en/*` route
- **Matcher**: Excludes `/api/*`, `/_next/*`, `/public/*` paths
- **Cookie**: Persist user's language preference

## Constraints

### TypeScript Strict Mode
- **Rule**: All code must compile with `strict: true` in tsconfig.json
- **Enforcement**: No `any` types without explicit justification
- **Benefit**: Catch runtime errors at compile time, improve maintainability

### No Raw SQL / Direct Database Access
- **Rule**: All Firestore access must go through `lib/db/firestore-rest.ts` abstraction
- **Reason**: Ensure edge compatibility, maintain consistent error handling
- **Exception**: Admin scripts can use Firebase Admin SDK (server environment)

### Edge Runtime Compatibility
- **Rule**: All API routes must work on Cloudflare Edge Workers
- **Restrictions**: No Node.js-specific APIs (fs, path, etc.) in edge routes
- **Validation**: Use `export const runtime = 'edge'` declaration

### Image Optimization Required
- **Rule**: Never render raw images larger than 400px without optimization
- **Implementation**: All images must pass through `imageOptimizer.ts` or wsrv.nl
- **Target**: WebP format, appropriate dimensions (200px, 400px, 800px)

### AI Rate Limiting
- **Gemini API**: 10 requests per minute (enforced by Google)
- **User Limit**: Maximum 3 taste analyses per user per day
- **Pipeline**: Sequential processing (not parallel) to respect rate limits

### Batch Processing Constraint
- **Rule**: Firestore writes limited to 10 documents per batch
- **Reason**: Avoid Cloudflare Worker timeout (30 seconds)
- **Implementation**: `scripts/batch-process-published.ts` splits into batches

### i18n Completeness
- **Rule**: Every UI string must exist in both `dictionaries/ko.json` and `en.json`
- **Validation**: Missing translation keys show fallback in brackets `[missing.key]`
- **Coverage**: 100% translation coverage required for production

### No Client-Side Secrets
- **Rule**: Firebase Admin credentials only in server environment variables
- **Public Config**: Only `apiKey`, `projectId`, `authDomain` exposed to client
- **Validation**: Never commit `.env` files, use `.env.example` template

### Performance Budget
- **CLS (Cumulative Layout Shift)**: Must be 0 (achieved via skeleton UI + image dimensions)
- **Search Response**: < 100ms for client-side Fuse.js queries
- **API Response**: < 300ms for edge API routes (Firestore REST)
- **Image Load**: < 1s for optimized images via CDN

### Accessibility
- **Rule**: All interactive elements must have ARIA labels
- **Keyboard**: Full keyboard navigation support required
- **Color**: Minimum 4.5:1 contrast ratio for text

### Component Scope
- **Rule**: Prefer small, single-purpose components over large multi-function components
- **Pattern**: Split client/server logic into separate files (e.g., `page.tsx` server, `client.tsx` client)
- **Example**: MBTI quiz split into `page.tsx` (server) and `mbti-client.tsx` (client interactions)

### Firestore Security Rules
- **Read**: Public read access for published spirits
- **Write**: Authenticated users only for cabinet and reviews
- **Admin**: Admin role required for publishing and approval operations
- **Validation**: All writes validated by security rules (schema, auth, rate limits)

### Error Handling
- **Rule**: All async operations must have try-catch blocks
- **User Feedback**: Errors shown via toast notifications or error boundaries
- **Logging**: Server errors logged to console (Cloudflare logs)
- **Fallback**: Graceful degradation when features unavailable (guest mode, image fallbacks)
