// lib/auth/google-auth.ts
import * as jose from 'jose';

/**
 * Generates a Google OAuth2 Access Token using a Service Account.
 * Useful for calling Google REST APIs from Cloudflare Workers without 'firebase-admin'.
 */
export async function getGoogleAccessToken() {
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!clientEmail || !privateKey) {
        throw new Error('Service Account credentials (FIREBASE_CLIENT_EMAIL/PRIVATE_KEY) are missing');
    }

    const now = Math.floor(Date.now() / 1000);
    
    // Create JWT for Google Auth
    const jwt = await new jose.SignJWT({
        iss: clientEmail,
        sub: clientEmail,
        aud: 'https://oauth2.googleapis.com/token',
        exp: now + 3600,
        iat: now,
        scope: [
            'https://www.googleapis.com/auth/cloud-platform',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/firebase.database',
            'https://www.googleapis.com/auth/dataconnect.base'
        ].join(' ')
    })
    .setProtectedHeader({ alg: 'RS256' })
    .sign(await jose.importPKCS8(privateKey, 'RS256'));

    // Exchange JWT for Access Token
    const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwt,
        }),
    });

    const data = await res.json() as any;
    if (!res.ok) {
        throw new Error(`Failed to get Google access token: ${JSON.stringify(data)}`);
    }

    return data.access_token as string;
}
