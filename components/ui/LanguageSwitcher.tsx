'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';
import { Locale } from '@/i18n-config';

export function LanguageSwitcher() {
    const pathname = usePathname();
    const router = useRouter();

    const currentLang = pathname?.split('/')[1] as Locale;
    const isEn = currentLang === 'en';

    const toggleLanguage = () => {
        if (!pathname) return;

        const segments = pathname.split('/');
        segments[1] = isEn ? 'ko' : 'en';
        const newPath = segments.join('/');

        router.push(newPath);
    };

    return (
        <motion.button
            onClick={toggleLanguage}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50 hover:bg-secondary hover:border-amber-500/30 transition-all group"
        >
            <Languages className="w-4 h-4 text-muted-foreground group-hover:text-amber-500 transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">
                {isEn ? 'KOR' : 'ENG'}
            </span>
            <span className="text-sm">
                {isEn ? '🇰🇷' : '🇺🇸'}
            </span>
        </motion.button>
    );
}
