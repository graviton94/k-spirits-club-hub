# Strict Prohibited Actions & Error Prevention

This document lists strictly forbidden actions and coding patterns identified during development to prevent recurring errors and minimize "trial-and-error" cycles.

## 🚫 Strictly Forbidden (严禁)

### Firebase Data Connect
1.  **Do NOT mix raw fields and logical operators at the top level of a `where` clause.**
    - *Wrong*: `spirit(where: { isPublished: {eq: true}, _or: [...] })`
    - *Right*: `spirit(where: { _and: [ { isPublished: {eq: true} }, { _or: [...] } ] })`
2.  **Do NOT update TypeScript client code before regenerating the SDK.**
    -   **NEVER** use `npx firebase dataconnect:deploy` alone. It often fails due to environment sync issues.
    -   **ALWAYS** use the "Golden Chain" command: `npx -y firebase-tools@latest deploy --only dataconnect -f`.
-   **Navigation Standard**:
    -   **NEVER** hardcode `Link href="/path"` or `router.push('/path')` for buttons that function as "Back" or "Return".
    -   **ALWAYS** use `router.back()` to preserve user state and browser history.
-   **Image Standard**:
    -   **ALWAYS** use `getCategoryFallbackImage` for spirits when `imageUrl` is missing.
    -   **Standard Implementation**: The fallback must always return `/mys-4.webp` for a unified visual identity.

-   **Design Standard**:
    -   **NEVER** use hardcoded HEX colors (e.g., `#FFFFFF`) or specific Tailwind color classes (e.g., `text-amber-500`, `bg-zinc-900`) for UI components.
    -   **ALWAYS** use semantic theme tokens (`bg-background`, `text-foreground`, `bg-primary`, `bg-accent`, `bg-secondary`) to ensure perfect Light/Dark mode parity and premium aesthetic control.

## Environment & Dependency Management
-   **ALWAYS** use `@latest` with `firebase-tools` during deployment to avoid cached CLI bugs.
-   **NEVER** modify `dataconnect-generated` files manually; always regenerate via CLI.

### Admin API Route Runtime
- **NEVER** set `export const runtime = 'edge'` in API routes that call `dbUpsertSpirit`, `dbDeleteSpirit`, `dbUpsertNews`, or any mutation with `@auth(expr: "... auth.uid == 'fiO8qf1PjLZAPBNcJmvy1cpqrY52'")`.
  - **Correct Pattern**: Admin mutation routes MUST use `export const runtime = 'nodejs'` AND import from `lib/db/data-connect-admin.ts` (Admin SDK path), never from `lib/db/data-connect-client.ts`.

### Public GQL Query Exposure
- **NEVER** leave `adminListRawSpirits`, `auditAll*`, `listUserCabinet`, or `listUserReviews` queries at `@auth(level: PUBLIC)` in production.
  - **Correct Pattern**: admin queries → `@auth(expr: "auth != null && auth.uid == '...'")`, user-scoped queries → `@auth(expr: "auth != null && auth.uid == vars.userId")`.

### Concurrent Admin Enrichment
- **NEVER** use `Promise.all(items.map(async () => { await enrichSpiritWithAI(...) }))` for batch operations.
  - **Correct Pattern**: Use `for...of` sequential loop or limit concurrency to ≤4 to prevent Gemini 429 and Data Connect connection saturation.

### General Development
1.  **Do NOT use snake_case for UI components when the core `Spirit` interface is camelCase.**
    - Always map database fields (SQL) to the designated UI model fields.
2.  **Do NOT assume an Edge API route can access restricted mutations without Auth context.**
    - Background logging (e.g., Discovery Logs) in public routes should generally be `PUBLIC` or handled gracefully.
3.  **Do NOT leave unmatched trailing braces in TS/TSX files (especially at component tail).**
    - **Correct Pattern**: ensure every component ends with a single function/class closing brace and run build parsing checks before deploy.
4.  **Do NOT use `motion.*` / `<motion.*>` without importing `motion` from `framer-motion`.**
    - **Correct Pattern**: when using animated elements, explicitly add `import { motion } from "framer-motion";` in that file.
5.  **Do NOT render Lucide icons in JSX without importing the exact icon symbol.**
    - **Correct Pattern**: if `<ArrowRight />` is used, `ArrowRight` must be included in `from "lucide-react"` import list in the same file.
6.  **Do NOT assume AI API output schema is fixed to one shape.**
    - **Correct Pattern**: when consuming recommendation responses, support both single-object (`recommendation`) and array (`recommendations`) contracts to avoid runtime 500s.
7.  **Do NOT add navigation links to routes that are not implemented.**
    - **Correct Pattern**: before adding `href`, verify the target page exists in `app/[lang]` (e.g., list pages should route to existing `/explore` when `/spirits` list page is absent).
8.  **Do NOT force all section titles to uppercase + italic by default.**
    - **Correct Pattern**: split title roles with dedicated tokens (`sectionTitle`, `sectionTitleSoft`, `eyebrow`) and apply per-section hierarchy.
9.  **Do NOT use sub-12px text for core interactive or metadata labels on mobile-facing UI.**
    - **Correct Pattern**: keep minimum readable size at `text-xs` (or 11px for strictly secondary labels), and use tokenized chip sizes (`*Sm`, `*Md`) instead of hardcoded `text-[9px]`/`text-[10px]`.

## 💡 Lessons Learned
- **GQL Validation**: Cloud Data Connect is stricter than the local emulator in some cases. Standardize on `_and` wrapping.
- **Reference Errors**: Always double-check imports in API routes, especially when moving logic from Cloud Functions to Next.js Edge routes.
- **Chart Dimensions**: Recharts' `ResponsiveContainer` requires a parent with a fixed or reliable height (avoid `h-full` without a fixed-height grandparent).
