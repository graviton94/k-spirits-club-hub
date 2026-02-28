'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface BackButtonProps {
    href?: string;
    fallbackUrl?: string;
    label?: string;
    className?: string;
}

export default function BackButton({
    href,
    fallbackUrl,
    label = '뒤로가기',
    className = "mb-6 flex w-fit items-center gap-2 text-muted-foreground hover:text-foreground transition-all group"
}: BackButtonProps) {
    const router = useRouter();
    const targetUrl = href || fallbackUrl;

    if (targetUrl) {
        return (
            <Link href={targetUrl} className={className}>
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-bold">{label}</span>
            </Link>
        );
    }

    return (
        <button onClick={() => router.back()} className={className}>
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold">{label}</span>
        </button>
    );
}
