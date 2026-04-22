'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function WorldCupBackButton({ className }: { className?: string }) {
    const router = useRouter();
    return (
        <button
            onClick={() => router.back()}
            className={className || "p-2.5 bg-card/50 backdrop-blur-md rounded-2xl border border-border hover:bg-muted transition-all"}
        >
            <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
    );
}
