import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const MANDATORY_SECRETS = [
    'GEMINI_API_KEY',
    'CF_AIG_TOKEN',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL'
];

const MANDATORY_VARS = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_APP_ID'
];

export async function GET() {
    const results: Record<string, boolean> = {};
    const missing: string[] = [];

    [...MANDATORY_SECRETS, ...MANDATORY_VARS].forEach(key => {
        const val = process.env[key];
        const exists = !!val && val.length > 0;
        results[key] = exists;
        if (!exists) missing.push(key);
    });

    const allOk = missing.length === 0;

    return NextResponse.json({
        status: allOk ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        missing: missing.length > 0 ? missing : undefined,
        environment: process.env.NODE_ENV,
        runtime: 'edge'
    }, {
        status: allOk ? 200 : 503
    });
}
