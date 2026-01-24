import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const spirit = await db.getSpirit(id);

        if (!spirit) {
            return NextResponse.json(
                { error: 'Spirit not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(spirit);
    } catch (error) {
        console.error('Error fetching spirit:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
