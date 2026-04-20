'use server';

import { dbUpsertModificationRequest } from "@/lib/db/data-connect-client";
import { v4 as uuidv4 } from 'uuid';

export async function submitModificationRequest(data: {
    spiritId: string;
    spiritName: string;
    title: string;
    content: string;
    userId: string | null;
}) {
    // 1. Validation
    if (!data.spiritId || !data.title || !data.content) {
        throw new Error("필수 정보가 누락되었습니다.");
    }

    // 2. DB Save (PostgreSQL via Data Connect)
    try {
        const id = uuidv4();
        await dbUpsertModificationRequest({
            id,
            spiritId: data.spiritId,
            spiritName: data.spiritName,
            userId: data.userId || 'anonymous',
            title: data.title,
            content: data.content,
            status: 'pending',
            createdAt: new Date().toISOString()
        });

        return { success: true, id };
    } catch (error: any) {
        console.error("Modification request submission failed:", error);
        throw new Error(error.message || "요청 저장에 실패했습니다.");
    }
}
