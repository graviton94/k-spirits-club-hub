'use client';

import { usePathname, useRouter } from "next/navigation";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
    const pathname = usePathname() || "";
    const router = useRouter();

    const segments = pathname.split('/');
    const currentLang = (segments[1] === 'en' || segments[1] === 'ko') ? segments[1] : 'ko';

    const toggleLanguage = () => {
        const newLang = currentLang === 'ko' ? 'en' : 'ko';

        // Set cookie for middleware to prioritize
        document.cookie = `NEXT_LOCALE=${newLang};path=/;max-age=31536000`;

        // Construct new pathname by replacing the first segment
        const newSegments = [...segments];
        newSegments[1] = newLang;
        const newPathname = newSegments.join('/') || `/${newLang}`;

        router.push(newPathname);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors text-[11px] font-black border border-border shadow-sm"
            title={currentLang === 'ko' ? 'Switch to English' : '한국어로 전환'}
        >
            <Languages className="w-3.5 h-3.5 text-amber-500" />
            <span className="uppercase tracking-tighter">
                {currentLang === 'ko' ? 'English' : '한국어'}
            </span>
        </button>
    );
}
