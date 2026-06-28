import { redirect } from "next/navigation";
import { getCurrentUserOrNull } from "@/lib/data";

export const dynamic = "force-dynamic";

/** 독서 기록 작성 플로우 인증 게이트 */
export default async function ReadingLogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUserOrNull();
  if (!user) redirect("/login");
  return <>{children}</>;
}
