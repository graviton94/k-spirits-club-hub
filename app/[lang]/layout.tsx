import type { Metadata, Viewport } from "next";
import Script from "next/script";
import Link from "next/link";
import { Inter, Outfit } from "next/font/google";
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google'; // ✅ 공식 라이브러리 추가
import { notFound } from "next/navigation";
import "./globals.css";
import { AuthProvider } from './context/auth-context';
import { SpiritsCacheProvider } from './context/spirits-cache-context';
import OnboardingModal from '../components/auth/onboarding-modal';
import { i18n, type Locale } from '@/i18n-config';
import { Header } from '@/components/layout/Header';
import { BottomNav } from "@/components/layout/BottomNav";
import GoogleAd from '@/components/ui/GoogleAd';
import { getDictionary } from '@/lib/get-dictionary';
import { PwaProvider } from './context/pwa-context';
import { PwaInstallPrompt } from '@/components/ui/PwaInstallPrompt';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import ChatSommelier from "@/components/ui/ChatSommelier";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

// Explicitly allow dynamic params for locale routing
export const dynamicParams = true;
export const runtime = 'nodejs';

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  const dict = await getDictionary(lang);
  const isEn = lang === 'en';

  return {
    metadataBase: new URL('https://kspiritsclub.com'),
    title: {
      default: dict.meta.title,
      template: "%s | K-Spirits Club",
    },
    description: dict.meta.description,
    verification: {
      google: "EztyFtmuOluuqxjs6wbD0Xx1DPSJwO3FXcY8Nz3CQ_o",
    },
    keywords: [
      "위스키", "증류주", "술", "증류소", "리뷰", "대한민국", "K-Spirits", "술 정보",
      "주류 검색", "전통주", "Whisky", "soju", "위스키 검색", "주류 DB", "주류 데이터베이스",
      "한국 술 정보", "전통주 정보", "전통주 테이스팅 노트", "위스키 리뷰",
      "Whisky Database", "Korean Spirits", "Korean Traditional Liquor"
    ],
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "K-Spirits Club",
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      type: "website",
      locale: isEn ? "en_US" : "ko_KR",
      siteName: "K-Spirits Club",
      images: [{ url: '/main.jpg' }],
    },
    alternates: {
      canonical: `https://kspiritsclub.com/${lang}`,
      languages: {
        'ko': 'https://kspiritsclub.com/ko',
        'en': 'https://kspiritsclub.com/en',
      },
    },
    icons: {
      icon: [
        { url: '/icon.png', sizes: '32x32', type: 'image/png' },
        { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      ],
      shortcut: '/icon.png',
      apple: [
        { url: '/icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#c17830",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  // Validate that the locale is supported
  if (!i18n.locales.includes(lang as any)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang}>
      <head>
        {/* Mixed Content 자동 업그레이드 (HTTP -> HTTPS) */}

        <meta name="naver-site-verification" content="a29e8ca32e7a6029fbe5abe2683f86fff1127a30" />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* 3. Microsoft Clarity (env enabled only) */}
        {clarityProjectId && (
          <Script id="microsoft-clarity" strategy="lazyOnload">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityProjectId}");
            `}
          </Script>
        )}
      </head>

      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-background text-foreground overflow-x-hidden`}>
        {/* ✅ 1 & 2. Google Analytics & Tag Manager (공식 라이브러리)
          - body 태그 내부에 위치시켜도 Next.js가 최적의 위치로 자동 렌더링합니다.
          - GA4와 GTM을 함께 사용하는 경우, 데이터 정합성을 위해 둘 다 명시하는 것이 좋습니다.
        */}
        <GoogleTagManager gtmId="GTM-NDF5RKBN" />
        <GoogleAnalytics gaId="G-0QF9WTQFF2" />

        {/* Google Adsense 
            주의: 개별 <GoogleAd /> 컴포넌트 단위에서 adsbygoogle.js를 직접 로드하고 있습니다.
            여기서 전역으로 client 파라미터와 함께 로드하면 Auto Ads(전면광고/앵커광고)가 원치 않게 사이트 전체를 덮을 수 있어 비활성화합니다.
        */}

        <AuthProvider>
          <SpiritsCacheProvider>
            <PwaProvider>
              <Header lang={lang} dict={dictionary.nav} />
              <ScrollToTop />
              <PwaInstallPrompt />
              <OnboardingModal dict={dictionary.onboarding} />
              <main className="relative min-h-screen overflow-x-hidden pb-20 md:pb-0">
                {children}
              </main>
              <BottomNav lang={lang} dict={dictionary.nav} />
              <ChatSommelier lang={lang} />
            </PwaProvider>
          </SpiritsCacheProvider>
        </AuthProvider>

        {/* Static Footer Ad Banner (Replaces Sticky Footer Ad) */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && process.env.NEXT_PUBLIC_ADSENSE_FOOTER_SLOT && (
          <div className="w-full bg-secondary/60 dark:bg-secondary/40 border-t border-border py-6 flex justify-center">
            <div className="container max-w-4xl mx-auto px-4 overflow-hidden">
              <GoogleAd
                client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
                slot={process.env.NEXT_PUBLIC_ADSENSE_FOOTER_SLOT}
                format="horizontal"
                responsive={true}
                className="mx-auto rounded-xl"
                style={{ display: 'block', width: '100%', minHeight: '90px' }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-secondary/70 dark:bg-secondary/50 border-t border-border py-12 pb-32">
          <div className="container max-w-6xl mx-auto px-4">
            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

              {/* Column 1: About */}
              <div>
                <h3 className="font-black text-sm mb-4 text-foreground">K-Spirits Club</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {lang === 'en'
                    ? 'Your trusted source for premium spirits information.'
                    : '신뢰할 수 있는 프리미엄 주류 정보 플랫폼'}
                </p>
              </div>

              {/* Column 2: Links */}
              <div>
                <h3 className="font-black text-sm mb-4 text-foreground">
                  {lang === 'en' ? 'Information' : '정보'}
                </h3>
                <ul className="space-y-2 text-xs">
                  <li>
                    <Link href={`/${lang}/contents/about`} className="text-muted-foreground hover:text-primary transition">
                      {lang === 'en' ? 'About Us' : '소개'}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${lang}/contents/privacy`} className="text-muted-foreground hover:text-primary transition">
                      {lang === 'en' ? 'Privacy Policy' : '개인정보처리방침'}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${lang}/contents/terms`} className="text-muted-foreground hover:text-primary transition">
                      {lang === 'en' ? 'Terms of Service' : '이용약관'}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${lang}/contents/contact`} className="text-muted-foreground hover:text-primary transition">
                      {lang === 'en' ? 'Contact' : '문의하기'}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Contact */}
              <div>
                <h3 className="font-black text-sm mb-4 text-foreground">
                  {lang === 'en' ? 'Contact' : '연락처'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  <a href="mailto:ruahn49@gmail.com" className="text-primary hover:text-accent transition">
                    ruahn49@gmail.com
                  </a>
                </p>
              </div>
            </div>

            {/* 19+ Warning &  Copyright */}
            <div className="border-t border-border pt-8 text-center">
              {/* 19+ Warning Badge */}
              <div className="flex justify-center mb-6">
                <div className="border-2 border-red-600 rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-red-600 font-black text-lg">19+</span>
                </div>
              </div>

              {/* Legal Warnings */}
              <div className="space-y-3 mb-8">
                <p className="text-muted-foreground text-[10px] leading-relaxed break-keep">
                  <strong className="text-foreground">경고:</strong> 지나친 음주는 뇌졸중, 기억력 손상이나 치매를 유발합니다. 임신 중 음주는 기형아 출생 위험을 높입니다.
                </p>
                <p className="text-muted-foreground/80 text-[10px] leading-relaxed italic">
                  <strong className="text-foreground/90">WARNING:</strong> Excessive drinking can cause stroke, memory loss, or dementia. Drinking during pregnancy increases the risk of birth defects.
                </p>
              </div>

              <p className="text-muted-foreground text-sm mb-2">
                © 2026 K-Spirits Club. All rights reserved.
              </p>
              <p className="text-muted-foreground text-xs">
                Developed by{" "}
                <a
                  href="mailto:ruahn49@gmail.com"
                  className="text-primary hover:text-accent transition-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  ruahn49@gmail.com
                </a>
              </p>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
