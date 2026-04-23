// lib/auth/verifyToken.ts
// Single server-side token verification entry point.
// Never trust client-supplied userId/x-user-id headers.
// Always verify the Firebase ID token from `Authorization: Bearer <token>`.

import 'server-only';
import '@/lib/firebase-admin';
import admin from 'firebase-admin';

const ADMIN_UID = 'fiO8qf1PjLZAPBNcJmvy1cpqrY52';

export interface VerifiedToken {
    uid: string;
    isAdmin: boolean;
}

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
        const decoded = await admin.auth().verifyIdToken(idToken);
        return { uid: decoded.uid, isAdmin: decoded.uid === ADMIN_UID };
    } catch {
        return null;
    }
}
