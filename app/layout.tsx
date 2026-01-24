import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from './context/auth-context';
import OnboardingModal from './components/auth/onboarding-modal';
import { BottomNav } from "@/components/layout/BottomNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "K-Spirits Club - 대한민국 No.1 글로벌 주류 데이터베이스",
  description: "전 세계 100만 개 이상의 위스키, 증류주 정보를 탐색하고 저장하며 리뷰를 공유하세요. 나만의 주류 캐비닛을 만들어보세요.",
  keywords: ["위스키", "증류주", "술", "증류소", "리뷰", "대한민국", "K-Spirits", "술 정보", "주류 검색"],
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
        <main className="min-h-screen">
          <AuthProvider>
            <OnboardingModal />
            {children}
          </AuthProvider>
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
