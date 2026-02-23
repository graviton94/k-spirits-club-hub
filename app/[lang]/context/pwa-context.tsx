'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PwaContextType {
    isInstallable: boolean;
    isInstalled: boolean;
    promptInstall: () => Promise<void>;
    deferredPrompt: any | null;
    hasInteractedEnough: boolean; // 사용자가 앱에 충분히 머물렀는가?
    dismissPrompt: () => void;
}

const PwaContext = createContext<PwaContextType>({
    isInstallable: false,
    isInstalled: false,
    promptInstall: async () => { },
    deferredPrompt: null,
    hasInteractedEnough: false,
    dismissPrompt: () => { },
});

export const usePwa = () => useContext(PwaContext);

export function PwaProvider({ children }: { children: React.ReactNode }) {
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    // Trigger Logic States
    const [hasInteractedEnough, setHasInteractedEnough] = useState(false);
    const [pageViews, setPageViews] = useState(0);
    const pathname = usePathname();

    useEffect(() => {
        // 1. Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
            setIsInstalled(true);
            return;
        }

        // 2. Listen for the install prompt from Chromium browsers
        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Listen for successful installation
        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setIsInstallable(false);
            setDeferredPrompt(null);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    // 3. Track User Engagement (Page views triggering the prompt)
    useEffect(() => {
        if (isInstalled) return;

        setPageViews(prev => {
            const newCount = prev + 1;
            // Trigger prompt if user visits more than 3 pages, indicating high interest
            if (newCount >= 3 && !hasInteractedEnough) {

                // Check if user previously dismissed
                const dismissed = localStorage.getItem('kspirits_pwa_dismissed');
                const dismissDate = dismissed ? parseInt(dismissed) : 0;
                const now = new Date().getTime();

                // If dismissed within the last 7 days, don't show it again yet
                if (now - dismissDate > 7 * 24 * 60 * 60 * 1000) {
                    // Small delay so it doesn't pop up instantly on navigating
                    setTimeout(() => setHasInteractedEnough(true), 2500);
                }
            }
            return newCount;
        });
    }, [pathname]);

    const promptInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setIsInstallable(false);
        }
        setDeferredPrompt(null);
    };

    const dismissPrompt = () => {
        setHasInteractedEnough(false);
        // Record dismiss timestamp
        localStorage.setItem('kspirits_pwa_dismissed', new Date().getTime().toString());
    };

    return (
        <PwaContext.Provider value={{
            isInstallable,
            isInstalled,
            promptInstall,
            deferredPrompt,
            hasInteractedEnough,
            dismissPrompt
        }}>
            {children}
        </PwaContext.Provider>
    );
}
