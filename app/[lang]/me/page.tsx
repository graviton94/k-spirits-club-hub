import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/i18n-config";
import ProfileClient from "@/components/profile/ProfileClient";

export const runtime = 'edge';

interface MyPageProps {
    params: Promise<{ lang: string }>;
}

import { Metadata } from 'next';

export async function generateMetadata({ params }: MyPageProps): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang as Locale);
    return {
        title: dict.meta.profile,
        description: dict.meta.description,
    };
}

export default async function MyPage({ params }: MyPageProps) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang as Locale);

    return <ProfileClient lang={lang as Locale} dict={dictionary.profile} />;
}
