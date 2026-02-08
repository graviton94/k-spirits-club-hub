import { Locale } from '@/i18n-config';
import Link from 'next/link';
import { ArrowLeft, FileText, AlertCircle, Scale, UserX } from 'lucide-react';

export const runtime = 'edge';

export const metadata = {
    title: 'Terms of Service',
};

export default async function TermsPage({ params }: { params: Promise<{ lang: Locale }> }) {
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
                <header className="mb-12 px-4">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 sm:p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
                            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black">
                            {isEn ? 'Terms of Service' : '이용약관'}
                        </h1>
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        {isEn ? 'Last updated: February 8, 2026' : '최종 업데이트: 2026년 2월 8일'}
                    </p>
                </header>

                {/* Content */}
                <article className="prose prose-sm sm:prose-base dark:prose-invert max-w-none px-4">
                    {isEn ? (
                        <>
                            {/* English Version */}
                            <section className="mb-12 bg-red-500/5 border-2 border-red-500/20 rounded-2xl p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                                    <h2 className="text-lg sm:text-xl font-black my-0 text-red-600 dark:text-red-400">Age Restriction</h2>
                                </div>
                                <p className="font-semibold">K-Spirits Club is strictly restricted to users aged <strong>19 years or older</strong> (or the legal drinking age in your jurisdiction).</p>
                                <p>By using this service, you confirm that you are of legal drinking age. We reserve the right to terminate accounts that violate this policy.</p>
                            </section>

                            <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                                    <h2 className="text-lg sm:text-xl font-black my-0">Acceptable Use</h2>
                                </div>
                                <p>You agree to use K-Spirits Club only for lawful purposes. You must not:</p>
                                <ul>
                                    <li>Post false, misleading, or defamatory content</li>
                                    <li>Violate intellectual property rights</li>
                                    <li>Attempt to hack, scrape, or abuse the platform</li>
                                    <li>Promote excessive or irresponsible drinking</li>
                                    <li>Harass or threaten other users</li>
                                </ul>
                            </section>

                            <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                                <h2 className="text-lg sm:text-xl font-black">User-Generated Content</h2>
                                <p>When you submit reviews, ratings, or comments:</p>
                                <ul>
                                    <li>You retain ownership of your content</li>
                                    <li>You grant K-Spirits Club a non-exclusive license to display, analyze, and use your content to improve the service</li>
                                    <li>You are responsible for the accuracy and legality of your content</li>
                                    <li>We reserve the right to remove content that violates these terms</li>
                                </ul>
                            </section>

                            <section className="mb-12 bg-amber-500/5 border-2 border-amber-500/20 rounded-2xl p-6 sm:p-8">
                                <h2 className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400">Data Accuracy Disclaimer</h2>
                                <p>K-Spirits Club aggregates data from public sources, manufacturers, and user submissions. While we strive for accuracy:</p>
                                <ul>
                                    <li>We do not guarantee 100% accuracy of all product information</li>
                                    <li>Spirits data may be outdated or incomplete</li>
                                    <li>Users should verify critical information (e.g., alcohol content, ingredients) with the manufacturer</li>
                                    <li>We are not liable for decisions made based on our data</li>
                                </ul>
                                <p className="font-semibold">If you find incorrect information, please <Link href={`/${lang}/contents/contact`} className="text-amber-500 hover:text-amber-400">report it</Link> so we can correct it.</p>
                            </section>

                            <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                                <h2 className="text-lg sm:text-xl font-black">Intellectual Property</h2>
                                <p>All content, trademarks, and data on K-Spirits Club (excluding user-generated content) are owned by or licensed to us. You may not reproduce, distribute, or create derivative works without permission.</p>
                            </section>

                            <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <UserX className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500" />
                                    <h2 className="text-lg sm:text-xl font-black my-0">Account Termination</h2>
                                </div>
                                <p>We reserve the right to suspend or terminate your account if you:</p>
                                <ul>
                                    <li>Violate these Terms of Service</li>
                                    <li>Engage in fraudulent or abusive behavior</li>
                                    <li>Are underage (below legal drinking age)</li>
                                </ul>
                            </section>

                            <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                                <h2 className="text-lg sm:text-xl font-black">Limitation of Liability</h2>
                                <p>K-Spirits Club is provided "as is" without warranties. We are not liable for:</p>
                                <ul>
                                    <li>Errors or omissions in spirits data</li>
                                    <li>Decisions made based on our recommendations</li>
                                    <li>Service interruptions or data loss</li>
                                    <li>Indirect, incidental, or consequential damages</li>
                                </ul>
                            </section>

                            <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                                <h2 className="text-lg sm:text-xl font-black">Changes to Terms</h2>
                                <p>We may update these Terms from time to time. Continued use of the service after changes constitutes acceptance of the new Terms.</p>
                            </section>

                            <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                                <h2 className="text-lg sm:text-xl font-black">Contact</h2>
                                <p>For questions about these Terms, contact:</p>
                                <p className="font-semibold">
                                    Email: <a href="mailto:ruahn49@gmail.com" className="text-amber-500 hover:text-amber-400">ruahn49@gmail.com</a>
                                </p>
                            </section>
                        </>
                    ) : (
                        <>
                            {/* Korean Version */}
                            <section className="mb-12 bg-red-500/5 border-2 border-red-500/20 rounded-2xl p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                                    <h2 className="text-lg sm:text-xl font-black my-0 text-red-600 dark:text-red-400">연령 제한</h2>
                                </div>
                                <p className="font-semibold">K-Spirits Club은 <strong>만 19세 이상</strong>(또는 귀하의 관할 지역의 법적 음주 가능 연령) 사용자만 이용할 수 있습니다.</p>
                                <p>본 서비스를 이용함으로써, 귀하는 법적 음주 가능 연령임을 확인합니다. 이 정책을 위반하는 계정은 삭제될 수 있습니다.</p>
                            </section>

                            <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                                    <h2 className="text-lg sm:text-xl font-black my-0">허용되는 사용</h2>
                                </div>
                                <p>K-Spirits Club은 합법적인 목적으로만 사용해야 합니다. 다음 행위는 금지됩니다:</p>
                                <ul>
                                    <li>허위, 오도, 명예 훼손 콘텐츠 게시</li>
                                    <li>지적재산권 침해</li>
                                    <li>플랫폼 해킹, 스크래핑 또는 악용 시도</li>
                                    <li>과도하거나 무책임한 음주 조장</li>
                                    <li>다른 사용자 괴롭힘 또는 위협</li>
                                </ul>
                            </section>

                            <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                                <h2 className="text-lg sm:text-xl font-black">사용자 생성 콘텐츠</h2>
                                <p>리뷰, 평점 또는 댓글을 제출할 때:</p>
                                <ul>
                                    <li>콘텐츠의 소유권은 사용자에게 있습니다</li>
                                    <li>K-Spirits Club에 콘텐츠를 표시, 분석 및 서비스 개선에 사용할 수 있는 비독점 라이선스를 부여합니다</li>
                                    <li>콘텐츠의 정확성과 합법성에 대한 책임은 사용자에게 있습니다</li>
                                    <li>본 약관을 위반하는 콘텐츠는 삭제될 수 있습니다</li>
                                </ul>
                            </section>

                            <section className="mb-12 bg-amber-500/5 border-2 border-amber-500/20 rounded-2xl p-6 sm:p-8">
                                <h2 className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400">데이터 정확성 면책</h2>
                                <p>K-Spirits Club은 공공 데이터, 제조사 정보, 사용자 제출 데이터를 수집합니다. 정확성을 위해 노력하지만:</p>
                                <ul>
                                    <li>모든 제품 정보가 100% 정확함을 보장하지 않습니다</li>
                                    <li>주류 데이터가 최신이 아니거나 불완전할 수 있습니다</li>
                                    <li>중요한 정보(알코올 도수, 성분 등)는 제조사에서 직접 확인하시기 바랍니다</li>
                                    <li>본 데이터를 기반으로 한 결정에 대해 책임지지 않습니다</li>
                                </ul>
                                <p className="font-semibold">잘못된 정보를 발견하면 <Link href={`/${lang}/contents/contact`} className="text-amber-500 hover:text-amber-400">제보</Link>해주시면 수정하겠습니다.</p>
                            </section>

                            <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                                <h2 className="text-lg sm:text-xl font-black">지적재산권</h2>
                                <p>K-Spirits Club의 모든 콘텐츠, 상표 및 데이터(사용자 생성 콘텐츠 제외)는 당사 소유이거나 라이선스를 보유하고 있습니다. 허가 없이 복제, 배포 또는 2차 저작물 생성을 할 수 없습니다.</p>
                            </section>

                            <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <UserX className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500" />
                                    <h2 className="text-lg sm:text-xl font-black my-0">계정 해지</h2>
                                </div>
                                <p>다음의 경우 계정을 정지 또는 해지할 수 있습니다:</p>
                                <ul>
                                    <li>본 이용약관 위반</li>
                                    <li>사기 또는 악용 행위</li>
                                    <li>미성년자(법적 음주 가능 연령 미만)</li>
                                </ul>
                            </section>

                            <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                                <h2 className="text-lg sm:text-xl font-black">책임의 제한</h2>
                                <p>K-Spirits Club은 "있는 그대로" 제공되며 보증하지 않습니다. 다음에 대해 책임지지 않습니다:</p>
                                <ul>
                                    <li>주류 데이터의 오류 또는 누락</li>
                                    <li>당사 추천을 기반으로 한 결정</li>
                                    <li>서비스 중단 또는 데이터 손실</li>
                                    <li>간접적, 부수적 또는 결과적 손해</li>
                                </ul>
                            </section>

                            <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                                <h2 className="text-lg sm:text-xl font-black">약관 변경</h2>
                                <p>본 약관은 수시로 업데이트될 수 있습니다. 변경 후 계속 서비스를 이용하면 새로운 약관에 동의한 것으로 간주됩니다.</p>
                            </section>

                            <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                                <h2 className="text-lg sm:text-xl font-black">문의하기</h2>
                                <p>본 약관에 관한 문의사항:</p>
                                <p className="font-semibold">
                                    이메일: <a href="mailto:ruahn49@gmail.com" className="text-amber-500 hover:text-amber-400">ruahn49@gmail.com</a>
                                </p>
                            </section>
                        </>
                    )}
                </article>
            </div>
        </div>
    );
}
