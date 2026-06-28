import { PageContainer } from "@/components/layout/PageContainer";
import { SettingsView } from "@/components/settings/SettingsView";
import { PasswordChangeCard } from "@/components/settings/PasswordChangeCard";
import { getUserSettings } from "@/lib/data";

/** 설정 페이지 — 프로필 / 독서 습관 / 알림 / 화면 설정 / 비밀번호 */
export default async function SettingsPage() {
  const settings = await getUserSettings();
  return (
    <PageContainer
      title="설정"
      emoji="⚙️"
      description="프로필과 독서 습관, 알림을 자유롭게 바꿀 수 있어요."
    >
      <div className="flex max-w-2xl flex-col gap-6">
        <SettingsView initial={settings} />
        <PasswordChangeCard />
      </div>
    </PageContainer>
  );
}
