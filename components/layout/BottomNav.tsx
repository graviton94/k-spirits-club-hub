'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  const navItems = [
    { href: "/explore", icon: "🔍", label: "탐색" },
    { href: "/cabinet", icon: "📚", label: "캐비닛" },
    { href: "/", icon: "🏠", label: "홈" },
    { href: "/reviews", icon: "✍️", label: "리뷰" },
    { href: "/me", icon: "👤", label: "내 정보" },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-card/90 backdrop-blur-xl border-2 border-border rounded-full shadow-2xl z-50 animate-fade-in-up">
      <div className="flex justify-evenly items-center h-16 px-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 group hover:bg-secondary w-16 h-16 ${(item.href === "/" ? pathname === "/" : isActive(item.href))
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <span className={`text-2xl mb-0.5 transition-transform duration-300 group-hover:-translate-y-1 ${(item.href === "/" ? pathname === "/" : isActive(item.href)) ? "scale-110" : "scale-100"}`}>{item.icon}</span>
            <span className={`text-[10px] font-medium absolute bottom-1.5 opacity-0 transition-all duration-300 ${(item.href === "/" ? pathname === "/" : isActive(item.href)) ? "opacity-100 translate-y-0" : "translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"}`}>{item.label}</span>

            {/* Active Indicator Dot */}
            {(item.href === "/" ? pathname === "/" : isActive(item.href)) && (
              <span className="absolute top-2 right-3 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)_/_0.8)]" />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
