// lib/auth/google-auth.ts
import * as jose from 'jose';
import { getEnv } from '@/lib/env';

/**
 * Enhanced Google OAuth2 Token Generator for Cloudflare Workers
 * Forcefully searches for environment variables in multiple locations.
 */
let cachedToken: { token: string, expiry: number } | null = null;

export async function getGoogleAccessToken() {
    // 1. Check Cache
    const now = Math.floor(Date.now() / 1000);
    if (cachedToken && cachedToken.expiry > now + 60) {
        return cachedToken.token;
    }

    const rawEmail = getEnv('FIREBASE_CLIENT_EMAIL');
    const rawKey = getEnv('FIREBASE_PRIVATE_KEY');

    if (!rawEmail || !rawKey) {
        throw new Error(`[Google Auth] Missing Credentials (EMAIL or KEY).`);
    }

    const clientEmail = rawEmail.replace(/['"]/g, '').trim();
    let privateKey = rawKey.replace(/['"]/g, '').trim();
    privateKey = privateKey.replace(/\\n/g, '\n');
    
    try {
        const jwt = await new jose.SignJWT({
            iss: clientEmail,
            sub: clientEmail,
            aud: 'https://oauth2.googleapis.com/token',
            exp: now + 3600,
            iat: now,
            scope: 'https://www.googleapis.com/auth/cloud-platform'
        })
        .setProtectedHeader({ alg: 'RS256' })
        .sign(await jose.importPKCS8(privateKey, 'RS256'));

        const res = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: jwt,
            }),
        });

        const data = await res.json() as any;
        if (!res.ok) {
            throw new Error(`OAuth Failed: ${JSON.stringify(data)}`);
        }

        // 2. Update Cache
        cachedToken = {
            token: data.access_token,
            expiry: now + (data.expires_in || 3600)
        };

        return data.access_token as string;
    } catch (err: any) {
        console.error('[Google Auth] Token Generation Failed:', err.message);
        throw new Error(`[Google Auth] Fatal: ${err.message}`);
    }
}
