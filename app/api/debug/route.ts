import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    const envStatus = {
        PROJECT_ID: replaceWithStatus(process.env.FIREBASE_PROJECT_ID),
        CLIENT_EMAIL: replaceWithStatus(process.env.FIREBASE_CLIENT_EMAIL),
        PRIVATE_KEY_LEN: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.length : 0,
        PRIVATE_KEY_HAS_NEWLINE: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.includes('\n') : false,
        PRIVATE_KEY_HAS_ESCAPED_NEWLINE: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.includes('\\n') : false,
        NODE_ENV: process.env.NODE_ENV
    };

    return NextResponse.json(envStatus);
}

function replaceWithStatus(val: string | undefined) {
    if (!val) return 'MISSING';
    if (val.length < 5) return 'TOO_SHORT';
    return val.substring(0, 3) + '***' + val.substring(val.length - 3);
}
