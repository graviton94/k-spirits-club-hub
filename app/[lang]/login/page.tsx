import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/i18n-config";
import LoginClient from "@/components/auth/LoginClient";

export const runtime = 'edge';

interface LoginPageProps {
    params: Promise<{ lang: string }>;
}

import { Metadata } from 'next';

export async function generateMetadata({ params }: LoginPageProps): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang as Locale);
    return {
        title: dict.meta.login,
        description: dict.meta.description,
    };
}

export default async function LoginPage({ params }: LoginPageProps) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang as Locale);

    return <LoginClient lang={lang as Locale} dict={dictionary.login} />;
}
