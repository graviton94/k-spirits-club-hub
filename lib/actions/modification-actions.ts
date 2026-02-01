'use server';

import { modificationDb } from "@/lib/db/firestore-rest";
import { ModificationRequest } from "@/lib/db/schema";

export async function submitModificationRequest(data: {
    spiritId: string;
    spiritName: string;
    title: string;
    content: string;
    userId: string | null;
}) {
    // 1. 유효성 검사
    if (!data.spiritId || !data.title || !data.content) {
        throw new Error("필수 정보가 누락되었습니다.");
    }

    // 2. DB 저장 (Firestore 'modification_requests' 컬렉션)
    try {
        const newRequest: Omit<ModificationRequest, 'id'> = {
            spiritId: data.spiritId,
            spiritName: data.spiritName,
            userId: data.userId,
            title: data.title,
            content: data.content,
            status: 'pending',
            createdAt: new Date()
        };

        const requestId = await modificationDb.add(newRequest);

        return { success: true, id: requestId };
    } catch (error: any) {
        console.error("Modification request submission failed:", error);
        throw new Error(error.message || "요청 저장에 실패했습니다.");
    }
}
