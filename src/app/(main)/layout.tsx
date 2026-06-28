import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { getCurrentUserOrNull } from "@/lib/data";

/** DB 기반 실시간 데이터이므로 정적 프리렌더 대신 요청 시 렌더링 */
export const dynamic = "force-dynamic";

/**
 * 메인 앱 셸 레이아웃
 * 헤더(상단) + 사이드바(데스크탑) + 하단 네비(모바일)로 콘텐츠를 감싼다.
 * 미인증 사용자는 로그인 페이지로 보낸다.
 */
export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUserOrNull();
  if (!currentUser) redirect("/login");

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <Header currentUser={currentUser} />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar />
        {/* 모바일에서는 하단 네비 높이만큼 패딩 확보 */}
        <main className="min-w-0 flex-1 pb-24 lg:pb-0">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
