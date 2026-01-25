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
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-full shadow-2xl z-50 animate-fade-in-up">
      <div className="flex justify-evenly items-center h-16 px-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 group hover:bg-gray-100 dark:hover:bg-white/10 w-16 h-16 ${(item.href === "/" ? pathname === "/" : isActive(item.href))
              ? "text-amber-500"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
          >
            <span className={`text-2xl mb-0.5 transition-transform duration-300 group-hover:-translate-y-1 ${(item.href === "/" ? pathname === "/" : isActive(item.href)) ? "scale-110" : "scale-100"}`}>{item.icon}</span>
            <span className={`text-[10px] font-medium absolute bottom-1.5 opacity-0 transition-all duration-300 ${(item.href === "/" ? pathname === "/" : isActive(item.href)) ? "opacity-100 translate-y-0" : "translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"}`}>{item.label}</span>

            {/* Active Indicator Dot */}
            {(item.href === "/" ? pathname === "/" : isActive(item.href)) && (
              <span className="absolute top-2 right-3 w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
