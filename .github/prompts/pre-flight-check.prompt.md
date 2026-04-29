# Pre-Flight Check (K-Spirits)

Run this checklist immediately before finalizing code output.

## A. Graph Impact
- Did I read `graphify-out/GRAPH_REPORT.md` for this task?
- Did I summarize blast radius (affected modules, dependencies, regression hotspots)?

## B. Data Layer Safety
- If DB was touched: did I use Data Connect only?
- Did I reference `lib/db/data-connect-client.ts` and relevant `.gql` files as the canonical API catalog?
- Did I avoid raw SQL and alternate DB libraries?
- If GraphQL changed: did I include SDK generation/deploy steps?

## C. Edge Runtime Safety
- Will this run in Cloudflare Workers without Node-only APIs?
- Did I avoid Node-only patterns (`fs`, `path`, `net`, unsupported Buffer assumptions)?
- If crypto was needed: did I prefer Web Crypto (`globalThis.crypto.subtle`) over Node `crypto` usage?

## D. i18n and UX
- Any hardcoded Korean/English user-facing text added?
- Are `/ko` and `/en` routes/dictionaries preserved?
- For async UI paths, did I prevent CLS with stable loading/skeleton behavior?

## E. Scope and Reliability
- Is the change minimal and directly requested?
- Did I avoid incidental refactors and unrelated formatting churn?
- Did I preserve existing security/auth patterns?

If any answer is no, revise before final output.
