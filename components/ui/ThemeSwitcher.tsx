'use client';

import { useAuth } from '@/app/[lang]/context/auth-context';
import { motion } from 'framer-motion';

interface ThemeSwitcherProps {
    className?: string;
    showLabel?: boolean;
}

export function ThemeSwitcher({ className = "", showLabel = false }: ThemeSwitcherProps) {
    const { theme, setTheme } = useAuth();

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {showLabel && <label className="text-xs text-muted-foreground block mb-1">테마 설정</label>}
            <div className="flex bg-secondary/50 p-1 rounded-2xl border border-border w-fit min-w-[200px] relative">
                {/* Visual Indicator Background */}
                <motion.div
                    className={`absolute inset-1 rounded-xl shadow-sm z-0 ${theme === 'light' ? 'bg-[#FFF9C4]' : 'bg-[#262626]'
                        }`}
                    layoutId="activeTheme"
                    animate={{
                        x: theme === 'light' ? 0 : '100%',
                        left: theme === 'light' ? 4 : -4
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />

                <button
                    onClick={() => setTheme('light')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all relative z-10 ${theme === 'light' ? 'text-black' : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <span className="text-lg">☀️</span>
                    <span>Light</span>
                </button>

                <button
                    onClick={() => setTheme('dark')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all relative z-10 ${theme === 'dark' ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <span className="text-lg">🌙</span>
                    <span>Dark</span>
                </button>
            </div>
        </div>
    );
}
