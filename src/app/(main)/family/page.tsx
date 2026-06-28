import { BookCheck, Clock, Star, UserPlus } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MemberAvatar } from "@/components/ui/MemberAvatar";
import { getFamilyMemberStats, type MemberStat } from "@/lib/data";

/** 가족 페이지 — 구성원 목록 및 개인별 독서 통계 */
export default async function FamilyPage() {
  const stats = await getFamilyMemberStats();
  const totalBooks = stats.reduce((s, m) => s + m.booksRead, 0);

  return (
    <PageContainer
      title="우리 가족"
      emoji="👨‍👩‍👧‍👦"
      description={`이번 달 가족이 함께 ${totalBooks}권을 읽었어요.`}
      action={
        <Button variant="secondary" className="hidden sm:flex">
          <UserPlus size={18} />가족 초대
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {stats.map((stat) => (
          <MemberStatCard key={stat.member.id} stat={stat} />
        ))}
      </div>
    </PageContainer>
  );
}

function MemberStatCard({ stat }: { stat: MemberStat }) {
  return (
    <Card className="hover:shadow-md">
      <div className="mb-4 flex items-center gap-3">
        <MemberAvatar member={stat.member} size="lg" />
        <div>
          <p className="font-semibold text-stone-800 dark:text-stone-100">
            {stat.member.name}
          </p>
          <p className="text-sm text-stone-500">{stat.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <StatItem
          icon={<BookCheck size={18} />}
          value={`${stat.booksRead}권`}
          label="읽은 책"
        />
        <StatItem
          icon={<Clock size={18} />}
          value={`${stat.readingMinutes}분`}
          label="독서 시간"
        />
        <StatItem
          icon={<Star size={18} />}
          value={stat.avgRating.toFixed(1)}
          label="평균 별점"
        />
      </div>
    </Card>
  );
}

function StatItem({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-stone-50 p-3 dark:bg-stone-700/40">
      <div className="mb-1 flex justify-center text-primary">{icon}</div>
      <p className="font-bold text-stone-800 dark:text-stone-100">{value}</p>
      <p className="text-xs text-stone-400">{label}</p>
    </div>
  );
}
