# K-Spirits Club Hub - Project Guide
[Structural Knowledge Graph Active at graphify-out/]

## 1. Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Runtime**: Cloudflare Workers (OpenNext)
- **Database**: Firebase Data Connect (PostgreSQL / SQL-Native Mode)
- **AI**: Google Gemini-2.0-flash-exp (via `@google/generative-ai`)
- **Auth**: Firebase Auth + Google OAuth2 (Custom for Workers)

## 2. Infrastructure Best Practices (CRITICAL)
- **Environment Variables**:
    - **Cloudflare Secrets**: MUST be set via `wrangler secret put NAME`.
    - **Git-Sync Reset Bypass**: `wrangler.jsonc` should keep `vars: {}` empty to prevent Git push from wiping dashboard secrets.
    - **Access**: Always use `getEnv(key)` from `@/lib/env` which prioritizes Cloudflare context over `process.env`.
- **Subrequest Limits**:
    - Cloudflare Workers have a 50-subrequest limit per invocation.
    - **Google Auth**: Tokens MUST be cached in-memory (implemented in `lib/auth/google-auth.ts`) to avoid redundant requests during batch operations.

## 3. Database Operations (Data Connect)
- **Endpoint**: Use `firebasedataconnect.googleapis.com` (NOT `dataconnect.googleapis.com`).
- **Relational Integrity**: Always ensure mandatory fields (e.g., `category`, `imageUrl`) are included in `upsert` mutations as defined in `dataconnect/schema/schema.gql`.

## 4. Key Commands
- **Deploy**: `git push origin main` (Triggers Cloudflare Pages Build)
- **Local Dev**: `npm run dev`
- **Set Secrets (Local Script)**: `node scripts/vault/set_secrets.js`

## 5. Development Strategy
- **Design**: Premium Amber, Deep Brown, Beige, and Purple identity. Use semantic CSS tokens.
- **AI Architecture**: Unified `getEnv` access and 6D Flavor Vector logic for the Sommelier.
- **Core Abstractions (Graphify God Nodes)**:
    - `BrowserManager`: Primary logic orchestrator.
    - `getDC()`: Central Data Connect entry point.
    - `executeGraphql()`: Unified GQL communication layer.
- **Cross-Domain Insights**:
    - SEO (`generateMetadata`) is tightly coupled with World Cup results (`getResult`).
    - API logging (`POST`) depends on global KST date utility (`getKSTDate`).
