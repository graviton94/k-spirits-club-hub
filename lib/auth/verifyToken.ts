// lib/auth/verifyToken.ts
// Single server-side token verification entry point.
// Never trust client-supplied userId/x-user-id headers.
// Always verify the Firebase ID token from `Authorization: Bearer <token>`.
// 
// This implementation uses 'jose' for lightweight, Edge-compatible verification.
// It bypasses 'firebase-admin' to avoid resolution issues in Cloudflare Workers.

import 'server-only';
import * as jose from 'jose';

const ADMIN_UID = 'fiO8qf1PjLZAPBNcJmvy1cpqrY52';
const FIREBASE_ISS_PREFIX = 'https://securetoken.google.com/';
const JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

export interface VerifiedToken {
    uid: string;
    isAdmin: boolean;
}

// Reuse the JWKS set to take advantage of caching
const JWKS = jose.createRemoteJWKSet(new URL(JWKS_URL));

/**
 * Extracts and verifies a Firebase ID token from the Authorization header.
 * Returns null if the header is missing or the token is invalid.
 */
export async function verifyRequestToken(
    authHeader: string | null
): Promise<VerifiedToken | null> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const idToken = authHeader.slice(7);

    try {
        const { getEnv } = await import('@/lib/env');
        const projectId = getEnv('FIREBASE_PROJECT_ID') || getEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
        
        if (!projectId) {
            console.error('[verifyRequestToken] FIREBASE_PROJECT_ID is missing from all sources');
            return null;
        }

        const { payload } = await jose.jwtVerify(idToken, JWKS, {
            issuer: FIREBASE_ISS_PREFIX + projectId,
            audience: projectId,
        });

        const uid = payload.sub;
        if (!uid) return null;

        return { 
            uid, 
            isAdmin: uid === ADMIN_UID 
        };
    } catch (error) {
        // If it's a known jose error, we can log it selectively
        // console.error('[verifyRequestToken] Verification failed:', error);
        return null;
    }
}
