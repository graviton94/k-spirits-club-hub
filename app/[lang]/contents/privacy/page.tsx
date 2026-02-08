import { Locale } from '@/i18n-config';
import Link from 'next/link';
import { ArrowLeft, Shield, Cookie, Database, UserCheck, Lock } from 'lucide-react';

export const metadata = {
    title: 'Privacy Policy',
};

export default async function PrivacyPage({ params }: { params: Promise<{ lang: Locale }> }) {
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
                        <div className="p-3 sm:p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black">
                            {isEn ? 'Privacy Policy' : '개인정보처리방침'}
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
                            {/* Section 1: Information Collection */}
                            <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                                    <h2 className="text-lg sm:text-xl font-black my-0">Personal Information We Collect</h2>
                                </div>
                                <p>K-Spirits Club collects only the minimum necessary personal information to provide services and improve user experience:</p>
                                <ul>
                                    <li><strong>Account Information</strong>: Email address, display name, and profile photo (limited to items provided via SNS login) when authenticating through Firebase Authentication.</li>
                                    <li><strong>Service Usage Records</strong>: User-created spirits reviews, ratings, tasting notes, and community activity data.</li>
                                    <li><strong>Automatically Collected Data</strong>: Log data for analyzing service visits and usage patterns (utilizing Google Analytics and Microsoft Clarity).</li>
                                </ul>
                            </section>

                            {/* Section 2: Cookies & Advertising - CRITICAL FOR ADSENSE */}
                            <section className="mb-12 bg-amber-500/5 border-2 border-amber-500/20 rounded-2xl p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <Cookie className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
                                    <h2 className="text-lg sm:text-xl font-black my-0 text-amber-600 dark:text-amber-400">Cookies and Advertising Notice</h2>
                                </div>
                                <p className="font-semibold">This website uses <strong>Google AdSense</strong> to deliver optimized advertisements to users, and cookies may be used as follows:</p>

                                <h3 className="text-sm sm:text-base font-black mt-6 mb-3">Advertising System</h3>
                                <p>Third-party advertising vendors, including Google, display personalized ads based on users' visits to this site and other websites.</p>

                                <h3 className="text-sm sm:text-base font-black mt-6 mb-3">Cookie Technology</h3>
                                <p>Cookies (including <strong>DART cookies</strong>) may be created in users' browsers for personalized ad delivery.</p>

                                <h3 className="text-sm sm:text-base font-black mt-6 mb-3">User Control</h3>
                                <p>Advertisements on this service are automatically provided by Google's system. Users can manage their personalized ad exposure through <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400 font-semibold">Google Ads Settings</a> to protect their interests.</p>
                            </section>

                            {/* Section 3: Purpose of Use */}
                            <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <Database className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                                    <h2 className="text-lg sm:text-xl font-black my-0">Purpose of Personal Information Use</h2>
                                </div>
                                <p>Collected information is used only for the following purposes:</p>
                                <ul>
                                    <li>Analyzing users' past preferences to provide optimized spirits recommendation reports.</li>
                                    <li>Improving data accuracy through AI algorithm enhancement.</li>
                                    <li>Delivering service-related announcements and responding to user inquiries.</li>
                                    <li>Blocking inappropriate content and maintaining a stable community environment.</li>
                                </ul>
                            </section>

                            {/* Section 4: Data Retention & Deletion */}
                            <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                                    <h2 className="text-lg sm:text-xl font-black my-0">Data Retention and Destruction</h2>
                                </div>
                                <p>Users' personal information is securely stored during service use and promptly destroyed upon account deletion request.</p>
                                <p className="mt-4">If you wish to delete your account and activity data, please contact our official inquiry address (<a href="mailto:ruahn49@gmail.com" className="text-amber-500 hover:text-amber-400 font-semibold">ruahn49@gmail.com</a>) and we will process it immediately.</p>
                            </section>

                            {/* Section 5: User Rights */}
                            <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                                <h2 className="text-lg sm:text-xl font-black mb-4">Protection of Data Subject Rights</h2>
                                <p>K-Spirits Club respects users' rights. Users can request to view, modify, or delete their information at any time. Users also have the right to refuse cookie collection through browser settings.</p>
                            </section>

                            {/* Section 6: Contact */}
                            <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                                <h2 className="text-lg sm:text-xl font-black mb-4">Contact Information</h2>
                                <p>If you have any questions or suggestions regarding this policy, please contact us:</p>
                                <p className="font-semibold mt-4">
                                    Email: <a href="mailto:ruahn49@gmail.com" className="text-amber-500 hover:text-amber-400">ruahn49@gmail.com</a>
                                </p>
                            </section>
                        </>
                    ) : (
                        <>
                            {/* Korean Version */}
                            {/* Section 1: 수집하는 개인정보 */}
                            <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                                    <h2 className="text-lg sm:text-xl font-black my-0">수집하는 개인정보 및 항목</h2>
                                </div>
                                <p>K-Spirits Club은 서비스 제공 및 사용자 경험 개선을 위해 최소한의 개인정보를 수집합니다.</p>
                                <ul>
                                    <li><strong>계정 정보</strong>: Firebase Authentication을 통한 본인 인증 시 이메일 주소, 표시 이름, 프로필 사진(SNS 로그인 시 제공되는 항목에 한함).</li>
                                    <li><strong>서비스 이용 기록</strong>: 사용자가 직접 작성한 주류 리뷰, 평점, 테이스팅 노트 및 커뮤니티 활동 데이터.</li>
                                    <li><strong>자동 수집 항목</strong>: 서비스 방문 및 이용 행태 분석을 위한 로그 데이터(Google Analytics, Microsoft Clarity 활용).</li>
                                </ul>
                            </section>

                            {/* Section 2: 쿠키 및 광고 - ADSENSE 필수 */}
                            <section className="mb-12 bg-amber-500/5 border-2 border-amber-500/20 rounded-2xl p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <Cookie className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
                                    <h2 className="text-lg sm:text-xl font-black my-0 text-amber-600 dark:text-amber-400">쿠키(Cookie) 및 광고 게재 안내</h2>
                                </div>
                                <p className="font-semibold">본 웹사이트는 사용자에게 최적화된 광고를 제공하기 위해 <strong>Google AdSense</strong>를 활용하며, 이에 따라 다음과 같이 쿠키가 사용될 수 있습니다.</p>

                                <h3 className="text-sm sm:text-base font-black mt-6 mb-3">광고 시스템</h3>
                                <p>Google을 포함한 제3자 광고 업체는 사용자의 본 사이트 및 타 웹사이트 방문 기록을 바탕으로 맞춤형 광고를 게재합니다.</p>

                                <h3 className="text-sm sm:text-base font-black mt-6 mb-3">쿠키 기술</h3>
                                <p>맞춤형 광고 게재를 위해 사용자의 브라우저에 쿠키(<strong>DART 쿠키</strong> 등)가 생성될 수 있습니다.</p>

                                <h3 className="text-sm sm:text-base font-black mt-6 mb-3">사용자 제어</h3>
                                <p>본 서비스의 광고는 Google의 시스템에 의해 자동화되어 제공됩니다. 사용자는 자신의 권익을 위해 <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400 font-semibold">Google 광고 설정</a> 등을 통해 개인화된 광고 노출 여부를 직접 관리할 수 있습니다.</p>
                            </section>

                            {/* Section 3: 이용 목적 */}
                            <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <Database className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                                    <h2 className="text-lg sm:text-xl font-black my-0">개인정보 이용 목적</h2>
                                </div>
                                <p>수집된 정보는 오직 다음의 목적으로만 사용됩니다.</p>
                                <ul>
                                    <li>사용자의 과거 선호도를 분석하여 최적화된 주류 추천 리포트 제공.</li>
                                    <li>AI 알고리즘 고도화를 통한 데이터 정확도 향상.</li>
                                    <li>서비스 관련 공지사항 전달 및 사용자 문의 응대.</li>
                                    <li>부적절한 콘텐츠 차단 및 안정적인 커뮤니티 환경 유지.</li>
                                </ul>
                            </section>

                            {/* Section 4: 보유 및 파기 */}
                            <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                                    <h2 className="text-lg sm:text-xl font-black my-0">데이터 보유 및 파기</h2>
                                </div>
                                <p>사용자의 개인정보는 서비스 이용 기간 동안 안전하게 보관되며, 계정 탈퇴 요청 시 지체 없이 파기합니다.</p>
                                <p className="mt-4">계정 및 활동 데이터 삭제를 원하실 경우 공식 문의처(<a href="mailto:ruahn49@gmail.com" className="text-amber-500 hover:text-amber-400 font-semibold">ruahn49@gmail.com</a>)로 요청 주시면 즉시 처리해 드립니다.</p>
                            </section>

                            {/* Section 5: 정보주체 권리 */}
                            <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                                <h2 className="text-lg sm:text-xl font-black mb-4">정보주체의 권리 보호</h2>
                                <p>K-Spirits Club은 사용자의 권리를 존중하며, 사용자는 언제든 본인의 정보를 열람, 수정하거나 삭제를 요청할 수 있습니다. 또한 브라우저 설정을 통해 쿠키 수집을 거부할 권리가 있습니다.</p>
                            </section>

                            {/* Section 6: 문의처 */}
                            <section className="mb-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                                <h2 className="text-lg sm:text-xl font-black mb-4">문의처</h2>
                                <p>본 방침과 관련하여 궁금한 점이나 건의 사항이 있으시면 아래로 연락 주시기 바랍니다.</p>
                                <p className="font-semibold mt-4">
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
