/**
 * Edge-compatible Service Account Authentication
 * Generates a signed JWT for Google APIs using the Web Crypto API.
 */

// Helper: Base64URL Encode
function base64UrlEncode(str: string): string {
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return base64UrlEncode(binary);
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
    const b64Lines = pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
    const binary = atob(b64Lines);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

export async function getServiceAccountToken() {
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!clientEmail || !privateKey) {
        throw new Error("Missing FIREBASE credentials");
    }

    const header = {
        alg: "RS256",
        typ: "JWT" // Google expects 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
        iss: clientEmail,
        sub: clientEmail,
        aud: "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit",
        iat: now,
        exp: now + 3600,
        uid: clientEmail, // For simple auth-like usage if needed, but mainly for claims
        claims: {
            role: "ADMIN" // We can try to assert claims if we are the issuer? 
            // Actually, for Firestore REST with Service Account, we use OAuth2 Access Token usually.
            // But signed JWT (ID Token style) also works for many Google APIs.
            // Let's stick to the OAuth2 Access Token flow:
            // 1. Sign JWT
            // 2. Exchange for Access Token
        }
    };

    // WAIT. For Firestore REST, we typically need an OAuth 2.0 Access Token.
    // To get that, we sign a JWT with scope "https://www.googleapis.com/auth/datastore"
    // and send it to "https://oauth2.googleapis.com/token".

    const scope = "https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/cloud-platform";

    const jwtPayload = {
        iss: clientEmail,
        scope: scope,
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(jwtPayload));
    const unsignedToken = `${encodedHeader}.${encodedPayload}`;

    // Import Key
    const keyBuffer = pemToArrayBuffer(privateKey);

    const cryptoKey = await crypto.subtle.importKey(
        "pkcs8",
        keyBuffer,
        {
            name: "RSASSA-PKCS1-v1_5",
            hash: "SHA-256"
        },
        false,
        ["sign"]
    );

    const signature = await crypto.subtle.sign(
        "RSASSA-PKCS1-v1_5",
        cryptoKey,
        new TextEncoder().encode(unsignedToken)
    );

    const signedJwt = `${unsignedToken}.${arrayBufferToBase64Url(signature)}`;

    // Exchange for Access Token
    const params = new URLSearchParams();
    params.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
    params.append('assertion', signedJwt);

    const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(`Token Exchange Failed: ${JSON.stringify(data)}`);
    }

    return data.access_token;
}
