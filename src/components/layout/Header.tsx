import Link from "next/link";
import { Search, Bell, BookMarked } from "lucide-react";
import { MemberAvatar } from "@/components/ui/MemberAvatar";
import { LogoutButton } from "@/components/layout/LogoutButton";
import type { FamilyMember } from "@/types/dashboard";

interface HeaderProps {
  /** 현재 로그인 사용자 (인증 전: 부모 '샛별') */
  currentUser: FamilyMember;
}

/**
 * 전역 상단 헤더
 * 로고 · 검색 · 알림 · 프로필
 */
export function Header({ currentUser }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/80 backdrop-blur dark:border-stone-700 dark:bg-stone-800/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        {/* 로고 */}
        <Link
          href="/dashboard"
          className="flex shrink-0 items-center gap-2 font-display text-lg font-bold text-primary"
        >
          <BookMarked size={24} />
          <span className="hidden sm:inline">woojuLib</span>
        </Link>

        {/* 검색 바 */}
        <div className="relative mx-auto w-full max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            type="search"
            placeholder="책 검색..."
            className="w-full rounded-full border border-stone-200 bg-stone-50 py-2 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary-100 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-100"
          />
        </div>

        {/* 알림 */}
        <button
          aria-label="알림"
          className="relative shrink-0 rounded-full p-2 text-stone-500 transition-colors hover:bg-stone-100 dark:hover:bg-stone-700"
        >
          <Bell size={22} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-member-mom" />
        </button>

        {/* 프로필 */}
        <button
          aria-label="내 프로필"
          className="shrink-0 rounded-full transition-transform hover:scale-105"
        >
          <MemberAvatar member={currentUser} size="md" />
        </button>

        {/* 로그아웃 */}
        <LogoutButton />
      </div>
    </header>
  );
}
