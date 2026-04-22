'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library, Gamepad2, User } from "lucide-react";
import { motion } from "framer-motion";
import { Locale } from "@/i18n-config";
import { surfaces, interactive } from "@/lib/design/patterns";

export function BottomNav({ lang, dict }: { lang: Locale, dict: any }) {
  const pathname = usePathname() || "";
  const isEn = lang === 'en';

  const isActive = (path: string) => {
    // path examples: "/explore", "/"
    if (path === "/") {
      return pathname === `/${lang}` || pathname === `/${lang}/`;
    }
    return pathname.startsWith(`/${lang}${path}`);
  };

  const navItems = [
    { href: "/explore", icon: Search, label: dict.explore },
    { href: "/cabinet", icon: Library, label: dict.cabinet },
    { href: "/", icon: Home, label: dict.home },
    { href: "/contents", icon: Gamepad2, label: "Contents" }, // Dictionary doesn't have "contents", using hardcoded for now or keeping as is if user didn't specify
    { href: "/me", icon: User, label: dict.profile },
  ];

    return (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center px-6 z-50 pointer-events-none">
            <nav className={`w-full max-w-sm ${surfaces.glassNav} border-border/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto border`}>
                <div className="flex justify-between items-center h-20 px-4">
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={`nav-item-${item.href}`}
                                href={`/${lang}${item.href === "/" ? "" : item.href}`}
                                prefetch={false}
                                className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-[1.5rem] transition-all duration-500 group
                                        ${active ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/20 scale-110" : `text-foreground/40 hover:text-primary ${interactive.hoverSurface}`}`}
                            >
                                <item.icon
                                    className={`w-6 h-6 transition-all duration-500 ${active ? "scale-100" : "group-hover:scale-110"}`}
                                    strokeWidth={active ? 3 : 2}
                                />
                                <span className={`text-[11px] font-black uppercase tracking-tight absolute -bottom-8 opacity-0 transition-all duration-300 ${active ? "opacity-40 translate-y-0" : "group-hover:opacity-100 group-hover:-translate-y-1"}`}>
                                    {item.label}
                                </span>

                                {active && (
                                    <motion.div 
                                        layoutId="bottom-nav-active"
                                        className="absolute -bottom-1 w-1 h-1 rounded-full bg-white shadow-xl"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
