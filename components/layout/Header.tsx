'use client';

import Link from "next/link";
import { useAuth } from "@/app/[lang]/context/auth-context";
import { User, LogIn } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Locale } from "@/i18n-config";

export function Header({ lang, dict }: { lang: Locale, dict: any }) {
    const { user, profile } = useAuth();

    const displayName = user
        ? (profile?.nickname || user.displayName?.split(' ')[0] || "Member")
        : "Guest";

    const profileImage = user && (profile?.profileImage || user.photoURL);

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border bg-card/90 backdrop-blur-xl">
            <div className="mobile-safe-x container mx-auto flex h-16 max-w-4xl items-center justify-between gap-2 md:gap-4">
                <Link href={`/${lang}`} prefetch={false} className="flex min-w-0 items-center gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-r from-amber-500 to-orange-600 text-sm font-black text-white">
                        K
                    </span>
                    <span className="truncate bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-base font-black text-transparent min-[380px]:text-lg sm:text-xl">
                        K-SPIRITS
                    </span>
                </Link>

                <div className="flex min-w-0 items-center gap-1.5 min-[380px]:gap-2 md:gap-3">
                    <LanguageSwitcher />
                    <ThemeToggle />

                    {user ? (
                        <Link
                            href={`/${lang}/me`}
                            className="flex min-w-0 items-center gap-2 rounded-full py-1 pl-2 transition-colors hover:bg-secondary min-[380px]:gap-3 md:pl-4"
                        >
                            <div className="hidden whitespace-nowrap text-right sm:block">
                                <p className="text-xs text-muted-foreground">
                                    {dict.welcome || 'Welcome back,'}
                                </p>
                                <p className="text-sm font-bold leading-none text-primary">
                                    {displayName}
                                </p>
                            </div>
                            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary/50 bg-secondary shadow-sm">
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt={displayName}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <User className="h-5 w-5 text-primary" />
                                )}
                            </div>
                        </Link>
                    ) : (
                        <Link
                            href={`/${lang}/login`}
                            className="flex shrink-0 items-center gap-1.5 rounded-full bg-linear-to-r from-amber-500 to-orange-600 px-2.5 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:from-amber-600 hover:to-orange-700 min-[380px]:gap-2 min-[380px]:px-3 md:px-4"
                            aria-label="Login"
                        >
                            <LogIn className="h-4 w-4" />
                            <span className="hidden min-[380px]:inline">Login</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
