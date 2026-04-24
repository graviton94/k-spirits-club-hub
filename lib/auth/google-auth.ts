// lib/auth/google-auth.ts
import * as jose from 'jose';
import { getEnv } from '@/lib/env';

/**
 * Enhanced Google OAuth2 Token Generator for Cloudflare Workers
 * Forcefully searches for environment variables in multiple locations.
 */
export async function getGoogleAccessToken() {
    const rawEmail = getEnv('FIREBASE_CLIENT_EMAIL');
    const rawKey = getEnv('FIREBASE_PRIVATE_KEY');

    if (!rawEmail || !rawKey) {
        throw new Error(`[Google Auth] Missing Credentials (EMAIL or KEY). Please check Cloudflare Secrets.`);
    }

    const clientEmail = rawEmail.replace(/['"]/g, '').trim();
    let privateKey = rawKey.replace(/['"]/g, '').trim();
    privateKey = privateKey.replace(/\\n/g, '\n');
    
    if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
        throw new Error('[Google Auth] Invalid Private Key format. Must contain BEGIN/END markers.');
    }

    const now = Math.floor(Date.now() / 1000);
    
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
            throw new Error(`Google OAuth Exchange Failed: ${JSON.stringify(data)}`);
        }

        return data.access_token as string;
    } catch (err: any) {
        throw new Error(`[Google Auth] Fatal: ${err.message}`);
    }
}
