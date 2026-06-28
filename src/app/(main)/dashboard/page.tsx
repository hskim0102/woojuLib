import { FamilyGoalProgress } from "@/components/dashboard/FamilyGoalProgress";
import { ReadingNowList } from "@/components/dashboard/ReadingNowList";
import { ReviewFeed } from "@/components/dashboard/ReviewFeed";
import { WeeklyReadingChart } from "@/components/dashboard/WeeklyReadingChart";
import {
  getFamilyGoal,
  getReadingBooks,
  getReviewFeed,
  getWeeklyStats,
} from "@/lib/data";

/**
 * 가족 독서 대시보드 메인 페이지 (서버 컴포넌트)
 *
 * - 상단: 가족 이번 달 목표 달성률
 * - 좌: 읽고 있는 책 / 우: 감상평 피드
 * - 하단: 주간 독서 시간 그래프 (ReadingSession 집계)
 */
export default async function DashboardPage() {
  const [goal, readingBooks, reviews, weeklyStats] = await Promise.all([
    getFamilyGoal(),
    getReadingBooks(),
    getReviewFeed(),
    getWeeklyStats(),
  ]);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* 페이지 헤더 */}
        <header className="mb-6">
          <h1 className="font-display text-2xl font-bold text-stone-800 dark:text-stone-100 sm:text-3xl">
            우리 가족 독서 대시보드 📚
          </h1>
          <p className="mt-1 text-stone-500 dark:text-stone-400">
            이번 달 가족이 함께 {goal.current}권을 읽었어요.
          </p>
        </header>

        {/* 상단: 가족 목표 달성률 */}
        <section className="mb-6">
          <FamilyGoalProgress goal={goal} />
        </section>

        {/* 중단: 좌(읽는 책) / 우(감상평) 2단 그리드 */}
        <section className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ReadingNowList books={readingBooks} />
          <ReviewFeed reviews={reviews} />
        </section>

        {/* 하단: 주간 독서 시간 그래프 */}
        <section>
          <WeeklyReadingChart data={weeklyStats} />
        </section>
      </div>
    </div>
  );
}
