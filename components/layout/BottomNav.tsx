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
    { href: "/admin", icon: "⚙️", label: "관리" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border md:hidden bottom-nav-safe z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              (item.href === "/" ? pathname === "/" : isActive(item.href))
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="text-2xl mb-1">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
