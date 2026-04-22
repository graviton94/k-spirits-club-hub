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
        <header className="sticky top-0 z-40 w-full glass-premium border-b border-border/10">
            <div className="mobile-safe-x container mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between gap-4">
                <Link href={`/${lang}`} prefetch={false} className="flex min-w-0 items-center gap-3 group">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-lg font-black text-white group-hover:scale-110 transition-transform shadow-2xl skew-x-[-12deg]">
                        <span className="skew-x-[12deg]">K</span>
                    </div>
                    <div className="flex flex-col -gap-1">
                         <span className="truncate text-foreground text-xl font-black tracking-tighter leading-none">
                            K-SPIRITS
                        </span>
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-none">
                            Club Hub
                        </span>
                    </div>
                </Link>

                <div className="flex min-w-0 items-center gap-2 md:gap-4">
                    <div className="hidden md:flex items-center gap-1 mr-4">
                        <LanguageSwitcher />
                        <ThemeToggle />
                    </div>

                    {user ? (
                        <Link
                            href={`/${lang}/me`}
                            className="flex min-w-0 items-center gap-3 rounded-2xl py-1.5 pl-3 pr-2 transition-all hover:bg-primary/10 border border-transparent hover:border-primary/20 group"
                        >
                            <div className="hidden whitespace-nowrap text-right sm:block">
                                <p className="text-[9px] font-black text-foreground/30 uppercase tracking-widest">
                                    Member
                                </p>
                                <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors uppercase tracking-tighter">
                                    {displayName}
                                </p>
                            </div>
                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-muted/50 border border-border/50 group-hover:border-primary/50 transition-all shadow-inner">
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt={displayName}
                                        className="h-full w-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all"
                                    />
                                ) : (
                                    <User className="h-5 w-5 text-foreground/40 group-hover:text-primary transition-colors" />
                                )}
                            </div>
                        </Link>
                    ) : (
                        <Link
                            href={`/${lang}/login`}
                            className="btn-premium px-6 py-2.5 text-sm md:flex hidden"
                        >
                            <LogIn className="h-4 w-4" />
                            <span>ACCESS HUB</span>
                        </Link>
                    )}
                    
                    {/* Mobile Menu Icon or compact login for mobile */}
                     {!user && (
                        <Link
                         href={`/${lang}/login`}
                         className="md:hidden flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white shadow-lg"
                        >
                             <LogIn className="h-5 w-5" />
                        </Link>
                     )}
                </div>
            </div>
        </header>
    );
}
