import { Locale } from '@/i18n-config';
import Link from 'next/link';
import { ArrowLeft, Target, Database, Brain, Globe } from 'lucide-react';
import { ABOUT_CONTENT, ABOUT_SECTIONS } from '@/lib/constants/about-content';

export const metadata = {
    title: 'About Us',
};

export default async function AboutPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const isEn = lang === 'en';
    const content = ABOUT_CONTENT[lang];
    const sections = ABOUT_SECTIONS[lang];

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container max-w-4xl mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <Link
                        href={`/${lang}`}
                        className="inline-flex items-center gap-2 text-sm text-amber-500 hover:text-amber-400 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {isEn ? 'Home' : '홈으로'}
                    </Link>
                </nav>

                {/* Header */}
                <header className="mb-12 text-center">
                    <h1 className="text-2xl sm:text-4xl font-black mb-4 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent px-4">
                        {isEn ? 'About K-Spirits Club' : 'K-Spirits Club 소개'}
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
                        {isEn
                            ? 'Your trusted source for spirits information, powered by data and AI'
                            : '데이터와 AI로 만드는 신뢰할 수 있는 주류 정보 플랫폼'}
                    </p>
                </header>

                {/* Content */}
                <article className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
                    {/* Vision Section */}
                    <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                                <Target className="w-6 h-6 text-amber-500" />
                            </div>
                            <h2 className="text-lg sm:text-xl font-black my-0">{sections.vision}</h2>
                        </div>
                        <p className="text-sm sm:text-base leading-relaxed text-foreground/90 m-0">
                            {content.vision}
                        </p>
                    </section>

                    {/* Data Section */}
                    <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                <Database className="w-6 h-6 text-blue-500" />
                            </div>
                            <h2 className="text-lg sm:text-xl font-black my-0">{sections.data}</h2>
                        </div>
                        <p className="text-sm sm:text-base leading-relaxed text-foreground/90 m-0">
                            {content.data}
                        </p>
                    </section>

                    {/* AI Section */}
                    <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                <Brain className="w-6 h-6 text-purple-500" />
                            </div>
                            <h2 className="text-lg sm:text-xl font-black my-0">{sections.ai}</h2>
                        </div>
                        <p className="text-sm sm:text-base leading-relaxed text-foreground/90 m-0">
                            {content.ai}
                        </p>
                    </section>

                    {/* Global Section */}
                    <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                <Globe className="w-6 h-6 text-emerald-500" />
                            </div>
                            <h2 className="text-lg sm:text-xl font-black my-0">{sections.global}</h2>
                        </div>
                        <p className="text-sm sm:text-base leading-relaxed text-foreground/90 m-0">
                            {content.global}
                        </p>
                    </section>

                    {/* Footer Note */}
                    <div className="mt-16 p-6 bg-secondary/30 border border-border rounded-2xl text-center">
                        <p className="text-sm text-muted-foreground m-0">
                            {isEn
                                ? 'Have questions or suggestions? Feel free to '
                                : '궁금하신 점이나 제안이 있으신가요? '}
                            <Link href={`/${lang}/contents/contact`} className="text-amber-500 hover:text-amber-400 font-bold no-underline">
                                {isEn ? 'contact us' : '문의하기'}
                            </Link>
                        </p>
                    </div>
                </article>
            </div>
        </div>
    );
}
