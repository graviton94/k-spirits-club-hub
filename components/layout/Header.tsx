'use client';

import Link from "next/link";
import { useAuth } from "@/app/[lang]/context/auth-context";
import { User, LogIn } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Locale } from "@/i18n-config";
import { surfaces, interactive, chips } from "@/lib/design/patterns";

export function Header({ lang, dict }: { lang: Locale, dict: any }) {
    const { user, profile } = useAuth();

    const displayName = user
        ? (profile?.nickname || user.displayName?.split(' ')[0] || "Member")
        : "Guest";

    const profileImage = user && (profile?.profileImage || user.photoURL);

    return (
        <header className={`sticky top-0 z-40 w-full ${surfaces.glassNav} border-b border-border/10`}>
            <div className="mobile-safe-x container mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between gap-4">
                <Link href={`/${lang}`} prefetch={false} className="flex min-w-0 items-center gap-3 group">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-lg font-black text-white group-hover:scale-110 transition-transform shadow-2xl skew-x-[-12deg]">
                        <span className="skew-x-[12deg]">K</span>
                    </div>
                    <div className="flex flex-col -gap-1">
                         <span className="truncate text-foreground text-xl font-black tracking-tighter leading-none">
                            K-SPIRITS
                        </span>
                        <span className={`${chips.accentSm} !px-2 !py-0 !rounded-md !bg-transparent !border-0 leading-none`}>
                            Club Hub
                        </span>
                    </div>
                </Link>

                <div className="flex min-w-0 items-center gap-2 md:gap-4">
                    <div className="flex items-center gap-1">
                        <LanguageSwitcher />
                        <ThemeToggle />
                    </div>

                    {user ? (
                        <Link
                            href={`/${lang}/me`}
                            className={`flex min-w-0 items-center gap-3 rounded-2xl py-1.5 pl-3 pr-2 transition-all ${interactive.hoverSurface} border border-transparent ${interactive.hoverBorder} group`}
                        >
                            <div className="whitespace-nowrap text-right">
                                <p className="text-xs md:text-[11px] font-black text-foreground/30 uppercase tracking-widest hidden xs:block">
                                    Member
                                </p>
                                <p className="text-xs md:text-sm font-black text-foreground group-hover:text-primary transition-colors uppercase tracking-tighter max-w-[60px] md:max-w-none truncate">
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
                            className="btn-premium px-4 py-2 md:px-6 md:py-2.5 text-xs md:text-sm"
                        >
                            <LogIn className="h-3.5 w-3.5 md:h-4 w-4" />
                            <span>ACCESS</span>
                        </Link>
                    )}
                    
                    {/* Mobile Menu Icon or compact login for mobile */}

                </div>
            </div>
        </header>
    );
}
