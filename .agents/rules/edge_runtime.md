# Scoped Rule: Edge Runtime

Activation scope:
- `app/api/**/*.ts`
- `lib/**/*.ts`
- `middleware.ts`
- `open-next.config.ts`
- `next.config.js`

When active, enforce Cloudflare Workers compatibility:
1. Avoid Node-only modules in edge/shared runtime paths (`fs`, `path`, `net`, `tls`, child process APIs).
2. Prefer Web Platform APIs (`fetch`, `Request`, `Response`, `URL`, `TextEncoder`, `ReadableStream`).
3. Buffer constraints:
- Do not rely on implicit Node Buffer globals.
- Prefer `Uint8Array`, `TextEncoder`, `TextDecoder` for binary/text transforms.
- Use Buffer only when runtime support is explicit and verified.
4. Crypto constraints:
- Prefer Web Crypto (`globalThis.crypto`, `crypto.subtle`).
- Avoid Node `crypto` APIs that are not portable to Workers.
- Do not assume OpenSSL-specific behavior or Node-only key handling.
5. Admin mutation routes with strict auth should remain `runtime = 'nodejs'` where project rules require it.

Pre-merge checks:
- Validate route runtime declarations are intentional.
- Confirm no Node-only imports leak into edge bundles.
