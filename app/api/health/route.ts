import { NextResponse } from 'next/server';
import { getEnv, getEnvDetail } from '@/lib/env';

// Mandatory variables for the system to function correctly
const MANDATORY_SECRETS = [
    'FIREBASE_PRIVATE_KEY',
    'GEMINI_API_KEY',
    'ADMIN_PASSWORD'
];

const MANDATORY_VARS = [
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'FIREBASE_PROJECT_ID'
];

export async function GET() {
    const missing: string[] = [];
    const sources: Record<string, string> = {};
    const keyPresence: Record<string, boolean> = {};

    [...MANDATORY_SECRETS, ...MANDATORY_VARS].forEach(key => {
        const detail = getEnvDetail(key);
        const exists = !!detail.value && detail.value.length > 0;
        
        keyPresence[key] = exists;
        sources[key] = exists ? detail.source : 'missing';
        
        if (!exists) missing.push(key);
    });

    const allOk = missing.length === 0;

    // Use a safer way to list all available keys for diagnostics
    const getAllKeys = (obj: any) => Object.keys(obj || {});
    
    let ctxEnvKeys: string[] = [];
    try {
        const { getRequestContext } = require("@opennextjs/cloudflare");
        const ctx = getRequestContext();
        if (ctx?.env) ctxEnvKeys = getAllKeys(ctx.env);
    } catch(e) {}

    return NextResponse.json({
        status: allOk ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        missing: missing.length > 0 ? missing : undefined,
        keyPresence,
        sources,
        diagnostics: {
            processEnvKeys: getAllKeys(process.env),
            requestContextEnvKeys: ctxEnvKeys,
            runtime: 'nodejs (compat)'
        },
        environment: process.env.NODE_ENV
    }, {
        status: allOk ? 200 : 503
    });
}
