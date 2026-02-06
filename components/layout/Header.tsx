'use client';

import Link from "next/link";
import { useAuth } from "@/app/context/auth-context";
import { User, LogIn } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { usePathname } from "next/navigation";

export function Header() {
    const { user, profile } = useAuth();
    const pathname = usePathname() || "";
    const segments = pathname.split('/');
    const lang = (segments[1] === 'en' || segments[1] || 'ko') === 'en' ? 'en' : 'ko';

    // Display Name logic: Nickname -> DisplayName -> "Guest"
    const displayName = user
        ? (profile?.nickname || user.displayName?.split(' ')[0] || "Member")
        : "Guest";

    const profileImage = user && (profile?.profileImage || user.photoURL);

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border bg-card/90 backdrop-blur-xl">
            <div className="container flex flex-nowrap h-16 items-center justify-between px-4 max-w-4xl mx-auto gap-2 md:gap-4">
                <Link href={`/${lang}`} prefetch={false} className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
                    <span className="text-2xl">🥃</span>
                    <span className="text-xl font-black bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                        K-SPIRITS
                    </span>
                </Link>

                <div className="flex flex-nowrap items-center gap-2 md:gap-3 flex-shrink-0">
                    <LanguageSwitcher />
                    <ThemeToggle />

                    {user ? (
                        <Link href={`/${lang}/me`} className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 py-1 rounded-full hover:bg-secondary transition-colors flex-shrink-0">
                            <div className="text-right hidden sm:block whitespace-nowrap">
                                <p className="text-xs text-muted-foreground">{lang === 'en' ? 'Welcome back,' : '안녕하세요,'}</p>
                                <p className="text-sm font-bold leading-none text-primary">{displayName}{lang === 'ko' ? '님' : ''}</p>
                            </div>
                            <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-primary/50 shadow-sm flex items-center justify-center bg-secondary flex-shrink-0">
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt={displayName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-5 h-5 text-primary" />
                                )}
                            </div>
                        </Link>
                    ) : (
                        <Link
                            href={`/${lang}/login`}
                            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-linear-to-r from-amber-500 to-orange-600 text-white text-sm font-bold hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-primary/20 flex-shrink-0 whitespace-nowrap"
                        >
                            <LogIn className="w-4 h-4" />
                            <span>{lang === 'en' ? 'Login' : '로그인'}</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
