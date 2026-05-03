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
            className="group flex shrink-0 items-center gap-1 rounded-full border border-border/50 bg-secondary/50 px-2 py-1.5 transition-all hover:border-primary/20/30 hover:bg-secondary min-[380px]:gap-2 min-[380px]:px-3"
            aria-label={isEn ? 'Switch language to Korean' : 'Switch language to English'}
        >
            <Languages className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
            <span className="hidden text-xs font-black uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-foreground min-[380px]:inline">
                {isEn ? 'KOR' : 'ENG'}
            </span>
            <span className="text-xs min-[380px]:text-sm">
                {isEn ? 'KO' : 'EN'}
            </span>
        </motion.button>
    );
}
