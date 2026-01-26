import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from './context/auth-context';
import { SpiritsCacheProvider } from './context/spirits-cache-context';
import OnboardingModal from './components/auth/onboarding-modal';
import { Header } from '@/components/layout/Header';
import { BottomNav } from "@/components/layout/BottomNav";
import StickyFooterAd from '@/components/ui/StickyFooterAd';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "K-Spirits Club - 대한민국 No.1 글로벌 주류 데이터베이스",
  description: "전 세계 100만 개 이상의 위스키, 증류주 정보를 탐색하고 저장하며 리뷰를 공유하세요. 나만의 주류 캐비닛을 만들어보세요.",
  verification: {
    google: "EztyFtmuOluuqxjs6wbD0Xx1DPSJwO3FXcY8Nz3CQ_o",
  },
  keywords: ["위스키", "증류주", "술", "증류소", "리뷰", "대한민국", "K-Spirits", "술 정보", "주류 검색", "전통주", "Whisky", "soju"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "K-Spirits Club",
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
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
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
