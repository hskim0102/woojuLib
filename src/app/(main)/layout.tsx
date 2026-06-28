import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";

/**
 * 메인 앱 셸 레이아웃
 * 헤더(상단) + 사이드바(데스크탑) + 하단 네비(모바일)로 콘텐츠를 감싼다.
 * 라우트 그룹 (main) 이므로 URL 에는 영향 없음.
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <Header />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar />
        {/* 모바일에서는 하단 네비 높이만큼 패딩 확보 */}
        <main className="min-w-0 flex-1 pb-24 lg:pb-0">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
