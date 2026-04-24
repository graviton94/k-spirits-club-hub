import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const MANDATORY_SECRETS = [
    'GEMINI_API_KEY',
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

import { getEnv } from '@/lib/env';

export async function GET() {
    const results: Record<string, boolean> = {};
    const missing: string[] = [];

    [...MANDATORY_SECRETS, ...MANDATORY_VARS].forEach(key => {
        const val = getEnv(key);
        const exists = !!val && val.length > 0;
        results[key] = exists;
        if (!exists) missing.push(key);
    });

    const allOk = missing.length === 0;

    // Diagnose available keys for systemic troubleshooting
    const processEnvKeys = Object.keys(process.env).filter(k => !k.includes('KEY') && !k.includes('SECRET') && !k.includes('PRIVATE'));
    
    let ctxEnvKeys: string[] = [];
    try {
        const { getRequestContext } = require("@opennextjs/cloudflare");
        const ctx = getRequestContext();
        if (ctx?.env) ctxEnvKeys = Object.keys(ctx.env).filter(k => !k.includes('KEY') && !k.includes('SECRET') && !k.includes('PRIVATE'));
    } catch(e) {}

    return NextResponse.json({
        status: allOk ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        missing: missing.length > 0 ? missing : undefined,
        diagnostics: {
            processEnvKeyCount: Object.keys(process.env).length,
            processEnvPublicKeys: processEnvKeys,
            requestContextEnvKeys: ctxEnvKeys,
            runtime: 'nodejs (compat)'
        },
        environment: process.env.NODE_ENV
    }, {
        status: allOk ? 200 : 503
    });
}
