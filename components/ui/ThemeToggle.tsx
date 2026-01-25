'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark' | undefined>(undefined); // Initialize as undefined to prevent hydration mismatch
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
        const initial = stored || 'light';
        setTheme(initial);
        document.documentElement.classList.toggle('dark', initial === 'dark');
    }, []);

    const toggleTheme = () => {
        // Only toggle if theme is already set (i.e., not undefined)
        if (theme !== undefined) {
            const newTheme = theme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
        }
    };

    // Render nothing or a placeholder until theme is determined on the client
    if (!mounted || theme === undefined) {
        return <div className="w-9 h-9" />;
    }

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
        </button>
    );
}
