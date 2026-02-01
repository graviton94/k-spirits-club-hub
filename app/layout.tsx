import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from './context/auth-context';
import { SpiritsCacheProvider } from './context/spirits-cache-context';
import OnboardingModal from './components/auth/onboarding-modal';
import { Header } from '@/components/layout/Header';
import { BottomNav } from "@/components/layout/BottomNav";
import StickyFooterAd from '@/components/ui/StickyFooterAd';

import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "K-Spirits Club | 대한민국 대표 주류 데이터베이스(DB) & 리뷰",
    template: "%s | K-Spirits Club",
  },
  description: "전 세계 100만 개 이상의 위스키, 증류주 정보를 탐색하고 저장하며 리뷰를 공유하세요. 나만의 주류 캐비닛을 만들어보세요.",
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
    title: "K-Spirits Club | 위스키, 전통주, 글로벌 주류 데이터베이스 & 리뷰",
    description: "대한민국 주류 데이터베이스: 위스키와 전통주의 모든 것. 전 세계 100만 개 이상의 증류주 정보를 탐색하고 리뷰를 공유하세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "K-Spirits Club",
  },
  twitter: {
    card: "summary_large_image",
    title: "K-Spirits Club | 위스키, 전통주, 글로벌 주류 데이터베이스 & 리뷰",
    description: "대한민국 주류 데이터베이스: 위스키와 전통주의 모든 것. 전 세계 100만 개 이상의 증류주 정보를 탐색하고 리뷰를 공유하세요.",
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#c17830",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <GoogleTagManager gtmId="GTM-NDF5RKBN" />
      <GoogleAnalytics gaId="G-0QF9WTQFF2" />
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "vag1ydm09c");
          `}
        </Script>
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5574169833640769"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <main className="min-h-screen pb-32">
          <AuthProvider>
            <SpiritsCacheProvider>
              <Header />
              <OnboardingModal />
              {children}
            </SpiritsCacheProvider>
          </AuthProvider>
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 border-t border-slate-800 py-6 pb-24">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <p className="text-slate-400 text-sm mb-2">
              © 2026 K-Spirits Club. All rights reserved.
            </p>
            <p className="text-slate-500 text-xs">
              Developed by{" "}
              <a
                href="mailto:ruahn49@gmail.com"
                className="text-amber-500 hover:text-amber-400 transition-colors"
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

        <BottomNav />
      </body>
    </html>
  );
}
