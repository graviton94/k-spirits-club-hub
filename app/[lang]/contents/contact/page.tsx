import { Locale } from '@/i18n-config';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, AlertTriangle } from 'lucide-react';

export const runtime = 'edge';

export const metadata = {
    title: 'Contact Us',
};

export default async function ContactPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const isEn = lang === 'en';

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
                <header className="mb-12 text-center px-4">
                    <div className="flex justify-center mb-6">
                        <div className="p-3 sm:p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                            <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
                        </div>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black mb-4">
                        {isEn ? 'Contact Us' : '문의하기'}
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                        {isEn
                            ? 'Have questions, suggestions, or found incorrect information? We\'d love to hear from you.'
                            : '궁금하신 점, 제안 사항 또는 잘못된 정보를 발견하셨나요? 언제든지 연락 주세요.'}
                    </p>
                </header>

                {/* Content */}
                <div className="max-w-2xl mx-auto space-y-8 px-4">
                    {/* Email Contact */}
                    <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
                            <h2 className="text-lg sm:text-xl font-black">{isEn ? 'Email Inquiries' : '이메일 문의'}</h2>
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground m-0">
                            {isEn
                                ? 'For general inquiries, partnership opportunities, or technical support, please contact us via email.'
                                : '일반 문의, 파트너십 기회 또는 기술 지원은 아래 이메일로 보내주세요.'}
                        </p>
                    </section>

                    {/* Report Incorrect Data */}
                    <section className="bg-rose-500/5 border-2 border-rose-500/20 rounded-2xl p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500" />
                            <h2 className="text-lg sm:text-xl font-black">{isEn ? 'Report Incorrect Information' : '잘못된 정보 제보'}</h2>
                        </div>
                        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
                            <p className="text-foreground/90 leading-relaxed mb-4">
                                {isEn
                                    ? 'Found a mistake in our spirits database? When reporting, please include:'
                                    : '주류 데이터베이스에서 오류를 발견하셨나요? 제보 시 다음 정보를 포함해주세요:'}
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-foreground/80 m-0 font-medium">
                                <li>{isEn ? 'Spirit name and ID (if available)' : '주류 이름 및 ID (가능한 경우)'}</li>
                                <li>{isEn ? 'Incorrect information (screenshot if possible)' : '잘못된 정보 (가능하면 스크린샷)'}</li>
                                <li>{isEn ? 'Correct information with source (e.g., official website)' : '올바른 정보 및 출처 (예: 공식 웹사이트)'}</li>
                            </ul>
                        </div>
                    </section>

                    {/* Report Inappropriate Content */}
                    <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                            <h2 className="text-lg sm:text-xl font-black">{isEn ? 'Report Inappropriate Content' : '부적절한 콘텐츠 신고'}</h2>
                        </div>
                        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
                            <p className="text-foreground/90 leading-relaxed mb-4">
                                {isEn
                                    ? 'If you encounter inappropriate reviews, comments, or spam, please report it with:'
                                    : '부적절한 리뷰, 댓글 또는 스팸을 발견하시면 다음 정보와 함께 신고해주세요:'}
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-foreground/80 m-0 font-medium">
                                <li>{isEn ? 'Link to the content' : '해당 콘텐츠 링크'}</li>
                                <li>{isEn ? 'Reason for reporting' : '신고 사유'}</li>
                                <li>{isEn ? 'Any additional context' : '추가 설명'}</li>
                            </ul>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 font-medium">
                        <h2 className="text-lg sm:text-xl font-black mb-6">{isEn ? 'Frequently Asked Questions' : '자주 묻는 질문'}</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-black text-base sm:text-lg mb-2">
                                    {isEn ? 'How often is the database updated?' : '데이터베이스는 얼마나 자주 업데이트되나요?'}
                                </h3>
                                <p className="text-foreground/80 text-sm leading-relaxed m-0">
                                    {isEn
                                        ? 'We update our database continuously as new information becomes available. User-reported corrections are typically processed within 3-5 business days.'
                                        : '새로운 정보가 제공되는 대로 지속적으로 데이터베이스를 업데이트합니다. 사용자가 제보한 수정 사항은 일반적으로 3-5 영업일 이내에 처리됩니다.'}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-black text-base sm:text-lg mb-2">
                                    {isEn ? 'Can I suggest new features?' : '새로운 기능을 제안할 수 있나요?'}
                                </h3>
                                <p className="text-foreground/80 text-sm leading-relaxed m-0">
                                    {isEn
                                        ? 'Absolutely! We welcome feature suggestions. Please email us with your ideas and we\'ll consider them for future updates.'
                                        : '물론입니다! 기능 제안을 환영합니다. 아이디어를 이메일로 보내주시면 향후 업데이트에서 고려하겠습니다.'}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-black text-base sm:text-lg mb-2">
                                    {isEn ? 'How do I delete my account?' : '계정을 삭제하려면 어떻게 하나요?'}
                                </h3>
                                <p className="text-foreground/80 text-sm leading-relaxed m-0">
                                    {isEn
                                        ? 'Please email us at ruahn49@gmail.com with your account deletion request. We\'ll process it within 48 hours and confirm via email.'
                                        : 'ruahn49@gmail.com으로 계정 삭제 요청을 보내주세요. 48시간 이내에 처리하고 이메일로 확인해드립니다.'}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Unified Contact Button */}
                    <div className="pt-8 text-center pb-12">
                        <a
                            href={isEn
                                ? "mailto:ruahn49@gmail.com?subject=K-Spirits Club Inquiry"
                                : "mailto:ruahn49@gmail.com?subject=K-Spirits Club 문의"}
                            className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-12 py-4 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl transition shadow-lg hover:shadow-xl text-lg group"
                        >
                            <Mail className="w-6 h-6 group-hover:scale-110 transition" />
                            {isEn ? 'Contact Us via Email' : '이메일로 문의하기'}
                        </a>
                        <p className="text-sm text-muted-foreground mt-4">
                            ruahn49@gmail.com
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
