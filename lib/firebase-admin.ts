// lib/firebase-admin.ts
// LITE VERSION - No firebase-admin import to keep bundle size within Cloudflare limits.
// We use REST APIs or Client SDKs instead.

export const db = null as any; // Firestore is no longer used, kept for type safety in legacy calls if any.
