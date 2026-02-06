import { Suspense } from 'react';
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/i18n-config";
import ProfileClient from "@/components/profile/ProfileClient";
import { Metadata } from 'next';

export const runtime = 'edge';

interface MyPageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: MyPageProps): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang as Locale);
    return {
        title: dict.meta.profile,
        description: dict.meta.description,
    };
}

// 로딩 중일 때 보여줄 스켈레톤 UI
function MeSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
            <div className="grid gap-6">
                <div className="h-64 bg-gray-100 rounded-xl"></div>
                <div className="h-64 bg-gray-100 rounded-xl"></div>
            </div>
        </div>
    );
}

export default async function MyPage({ params }: MyPageProps) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang as Locale);

    return (
        <Suspense fallback={<MeSkeleton />}>
            <ProfileClient lang={lang as Locale} dict={dictionary.profile} />
        </Suspense>
    );
}
