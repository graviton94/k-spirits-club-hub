import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Outfit } from "next/font/google";
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google'; // ✅ 공식 라이브러리 추가
import "./globals.css";
import { AuthProvider } from './context/auth-context';
import { SpiritsCacheProvider } from './context/spirits-cache-context';
import OnboardingModal from '../components/auth/onboarding-modal';
import { i18n, type Locale } from '@/i18n-config';
import { Header } from '@/components/layout/Header';
import { BottomNav } from "@/components/layout/BottomNav";
import StickyFooterAd from '@/components/ui/StickyFooterAd';
import { getDictionary } from '@/lib/get-dictionary';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
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
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: ['/main.jpg'],
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
  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang}>
      <head>
        {/* Mixed Content 자동 업그레이드 (HTTP -> HTTPS) */}

        <meta name="naver-site-verification" content="a29e8ca32e7a6029fbe5abe2683f86fff1127a30" />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* 3. Microsoft Clarity (Next.js Script 컴포넌트 사용) */}
        <Script id="microsoft-clarity" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "vag1ydm09c");
          `}
        </Script>
      </head>

      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-background text-foreground`}>
        {/* ✅ 1 & 2. Google Analytics & Tag Manager (공식 라이브러리)
          - body 태그 내부에 위치시켜도 Next.js가 최적의 위치로 자동 렌더링합니다.
          - GA4와 GTM을 함께 사용하는 경우, 데이터 정합성을 위해 둘 다 명시하는 것이 좋습니다.
        */}
        <GoogleTagManager gtmId="GTM-NDF5RKBN" />
        <GoogleAnalytics gaId="G-0QF9WTQFF2" />

        {/* Google Adsense - 성능을 위해 지연 로드(lazyOnload) 적용 */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5574169833640769"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />

        <AuthProvider>
          <SpiritsCacheProvider>
            <Header lang={lang} dict={dictionary.nav} />
            <OnboardingModal />
            <main className="relative min-h-screen pb-20 md:pb-0">
              {children}
            </main>
            <BottomNav lang={lang} dict={dictionary.nav} />
          </SpiritsCacheProvider>
        </AuthProvider>

        {/* Footer */}
        <footer className="bg-slate-50 dark:bg-neutral-950 border-t border-slate-200 dark:border-white/5 py-8 pb-32">
          <div className="container max-w-4xl mx-auto px-4 text-center">

            {/* 19+ Warning Badge */}
            <div className="flex justify-center mb-6">
              <div className="border-2 border-red-600 rounded-full w-12 h-12 flex items-center justify-center">
                <span className="text-red-600 font-black text-lg">19+</span>
              </div>
            </div>

            {/* Legal Warnings */}
            <div className="space-y-3 mb-8">
              <p className="text-slate-600 dark:text-slate-500 text-[10px] leading-relaxed break-keep">
                <strong className="text-slate-800 dark:text-slate-400">경고:</strong> 지나친 음주는 뇌졸중, 기억력 손상이나 치매를 유발합니다. 임신 중 음주는 기형아 출생 위험을 높입니다.
              </p>
              <p className="text-slate-500 dark:text-slate-600 text-[10px] leading-relaxed italic">
                <strong className="text-slate-700 dark:text-slate-500">WARNING:</strong> Excessive drinking can cause stroke, memory loss, or dementia. Drinking during pregnancy increases the risk of birth defects.
              </p>
            </div>

            <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">
              © 2026 K-Spirits Club. All rights reserved.
            </p>
            <p className="text-slate-500 text-xs">
              Developed by{" "}
              <a
                href="mailto:ruahn49@gmail.com"
                className="text-amber-500 hover:text-amber-400 transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                ruahn49@gmail.com
              </a>
            </p>
          </div>
        </footer>

        {/* Sticky Footer Ad */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && process.env.NEXT_PUBLIC_ADSENSE_FOOTER_SLOT && (
          <StickyFooterAd
            client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
            slot={process.env.NEXT_PUBLIC_ADSENSE_FOOTER_SLOT}
          />
        )}
      </body>
    </html>
  );
}