import { PageContainer } from "@/components/layout/PageContainer";
import { SettingsView } from "@/components/settings/SettingsView";

/** 설정 페이지 — 프로필 / 독서 습관 / 알림 / 화면 설정 */
export default function SettingsPage() {
  return (
    <PageContainer
      title="설정"
      emoji="⚙️"
      description="프로필과 독서 습관, 알림을 자유롭게 바꿀 수 있어요."
    >
      <div className="max-w-2xl">
        <SettingsView />
      </div>
    </PageContainer>
  );
}
