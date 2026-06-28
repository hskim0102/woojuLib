"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

/** 로그아웃 버튼 — 세션 쿠키 삭제 후 로그인 페이지로 이동 */
export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      aria-label="로그아웃"
      className="shrink-0 rounded-full p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-red-500 dark:hover:bg-stone-700"
    >
      <LogOut size={20} />
    </button>
  );
}
