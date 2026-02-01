'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library, Gamepad2, User } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname() || "";
  const segments = pathname.split('/');
  const lang = (segments[1] === 'en' || segments[1] === 'ko') ? segments[1] : 'ko';
  const isEn = lang === 'en';

  const isActive = (path: string) => {
    // path examples: "/explore", "/"
    if (path === "/") {
      return pathname === `/${lang}` || pathname === `/${lang}/`;
    }
    return pathname.startsWith(`/${lang}${path}`);
  };

  const navItems = [
    { href: "/explore", icon: Search, label: isEn ? "Explore" : "탐색" },
    { href: "/cabinet", icon: Library, label: isEn ? "Cabinet" : "캐비닛" },
    { href: "/", icon: Home, label: isEn ? "Home" : "홈" },
    { href: "/contents", icon: Gamepad2, label: isEn ? "Contents" : "컨텐츠" },
    { href: "/me", icon: User, label: isEn ? "My" : "내 정보" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] z-50 pointer-events-none">
      <nav className="w-full max-w-md bg-card/90 backdrop-blur-xl border-2 border-border rounded-full shadow-2xl pointer-events-auto animate-fade-in-up">
        <div className="flex justify-evenly items-center h-16 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={`/${lang}${item.href === "/" ? "" : item.href}`}
              className={`relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 group hover:bg-secondary w-16 h-16 ${isActive(item.href)
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <item.icon
                className={`w-6 h-6 mb-1 transition-all duration-300 ${isActive(item.href) ? "-translate-y-1" : "group-hover:-translate-y-1"}`}
                strokeWidth={isActive(item.href) ? 2.5 : 2}
              />
              <span className={`text-[10px] font-medium absolute bottom-1.5 opacity-0 transition-all duration-300 ${isActive(item.href) ? "opacity-100 translate-y-0" : "translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"}`}>{item.label}</span>

              {/* Active Indicator Dot */}
              {isActive(item.href) && (
                <span className="absolute top-2 right-3 w-1.5 h-1.5 rounded-full bg-primary shadow-lg shadow-primary/50" />
              )}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
