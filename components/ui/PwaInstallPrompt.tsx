'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Star } from 'lucide-react';
import { usePwa } from '@/app/[lang]/context/pwa-context';
import { usePathname } from 'next/navigation';

export function PwaInstallPrompt() {
    const { isInstallable, hasInteractedEnough, promptInstall, dismissPrompt, isInstalled } = usePwa();
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();
    const isEn = pathname?.startsWith('/en');

    useEffect(() => {
        // Only show if installable (Chromium/Android) AND user engaged enough
        if (isInstallable && hasInteractedEnough && !isInstalled) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [isInstallable, hasInteractedEnough, isInstalled]);

    // Fallback check for iOS (Safari doesn't fire beforeinstallprompt)
    const [isIosPromptTracker, setIsIosPromptTracker] = useState(false);

    useEffect(() => {
        // iOS detection logic
        const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;

        // If it's iOS Safari, not already installed, and hasn't been dismissed recently
        // we can show a bespoke manual instruction prompt.
        if (isIos && !isStandalone && hasInteractedEnough && !isInstallable && !isInstalled) {
            const dismissed = localStorage.getItem('kspirits_ios_pwa_dismissed');
            const now = new Date().getTime();
            if (!dismissed || (now - parseInt(dismissed) > 7 * 24 * 60 * 60 * 1000)) {
                setIsIosPromptTracker(true);
            }
        } else {
            setIsIosPromptTracker(false);
        }
    }, [hasInteractedEnough, isInstallable, isInstalled]);

    // Prevent rendering anything if neither Android/Chrome prompt nor iOS prompt is needed
    if (!isVisible && !isIosPromptTracker) return null;

    const handleDismiss = () => {
        setIsVisible(false);
        setIsIosPromptTracker(false);
        dismissPrompt();
        if (isIosPromptTracker) {
            localStorage.setItem('kspirits_ios_pwa_dismissed', new Date().getTime().toString());
        }
    };

    const handleInstallClick = async () => {
        if (isVisible && isInstallable) {
            await promptInstall();
            setIsVisible(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 200, opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed bottom-20 md:bottom-24 left-4 right-4 md:left-auto md:right-8 md:w-96 z-100 p-4 rounded-3xl bg-background/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden"
            >
                {/* Subtle Glow Background */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

                <button
                    onClick={handleDismiss}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 transition-colors"
                >
                    <X className="w-5 h-5 text-muted-foreground" />
                </button>

                <div className="flex items-start gap-4">
                    <div className="shrink-0 w-14 h-14 rounded-2xl bg-linear-to-br from-amber-400 to-orange-600 p-0.5 shadow-lg shadow-amber-500/30">
                        <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center">
                            <span className="text-2xl">⚡</span>
                        </div>
                    </div>

                    <div className="flex-1 mt-1">
                        <h3 className="font-black tracking-tight text-foreground text-[15px] leading-tight mb-1">
                            {isEn ? "Install K-Spirits App" : "K-Spirits 앱 다운로드"}
                        </h3>
                        <p className="text-[12px] text-muted-foreground leading-snug pr-4">
                            {isVisible
                                ? (isEn ? "Get the full native experience on your home screen for faster loading." : "홈 화면에 앱을 추가하여 더 빠르고 쾌적한 네이티브 경험을 즐겨보세요!")
                                : (isEn ? "Tap the Share icon below, then select 'Add to Home Screen'." : "하단의 공유 아이콘(↑)을 누른 후 '홈 화면에 추가'를 선택하세요.")}
                        </p>

                        <div className="flex items-center gap-1 mt-2.5">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            <span className="text-[10px] text-muted-foreground ml-1 font-medium">5.0</span>
                        </div>
                    </div>
                </div>

                {isVisible && (
                    <button
                        onClick={handleInstallClick}
                        className="w-full mt-4 py-3.5 rounded-2xl bg-foreground text-background font-bold text-sm hover:scale-[0.98] transition-transform flex items-center justify-center gap-2 shadow-xl shadow-black/10 dark:shadow-white/5 active:scale-95"
                    >
                        <Download className="w-4 h-4" />
                        {isEn ? "Add to Home Screen" : "앱 설치하기 (무료)"}
                    </button>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
