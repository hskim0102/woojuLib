"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BOTTOM_NAV_ITEMS } from "@/config/navigation";
import { cn } from "@/lib/utils";

/**
 * 모바일 하단 네비게이션 (lg 미만에서만 표시)
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-stone-200 bg-white/90 backdrop-blur dark:border-stone-700 dark:bg-stone-800/90 lg:hidden">
      <ul className="mx-auto flex max-w-md items-center justify-around">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex min-h-[60px] flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-200",
                )}
              >
                <Icon size={22} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
