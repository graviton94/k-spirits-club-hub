// app/api/debug-env/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
    const vars = {
        PROJECT_ID: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Present' : '❌ Missing',
        CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ? '✅ Present' : '❌ Missing',
        PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? `✅ Present (Length: ${process.env.FIREBASE_PRIVATE_KEY.length})` : '❌ Missing',
        GEMINI_KEY: process.env.GEMINI_API_KEY ? '✅ Present' : '❌ Missing',
        NODE_ENV: process.env.NODE_ENV,
        BASE_URL: process.env.NEXT_PUBLIC_BASE_URL
    };

    return NextResponse.json(vars);
}
