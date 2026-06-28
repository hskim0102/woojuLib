import { FamilyGoalProgress } from "@/components/dashboard/FamilyGoalProgress";
import { ReadingNowList } from "@/components/dashboard/ReadingNowList";
import { ReviewFeed } from "@/components/dashboard/ReviewFeed";
import { WeeklyReadingChart } from "@/components/dashboard/WeeklyReadingChart";
import {
  MOCK_FAMILY_GOAL,
  MOCK_READING_BOOKS,
  MOCK_REVIEW_FEED,
  MOCK_WEEKLY_STATS,
} from "@/lib/mock-data";

/**
 * 가족 독서 대시보드 메인 페이지
 *
 * 레이아웃:
 * - 상단: 가족 전체 이번 달 목표 달성률
 * - 좌측: 읽고 있는 책 목록 + 진행률
 * - 우측: 가족 감상평 피드
 * - 하단: 주간 독서 시간 그래프
 *
 * NOTE: 현재 목업 데이터 사용. API 연동 시 mock-data import 를
 *       서버 데이터 fetch 로 교체하면 된다.
 */
export default function DashboardPage() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* 페이지 헤더 */}
        <header className="mb-6">
          <h1 className="font-display text-2xl font-bold text-stone-800 dark:text-stone-100 sm:text-3xl">
            우리 가족 독서 대시보드 📚
          </h1>
          <p className="mt-1 text-stone-500 dark:text-stone-400">
            온 가족이 함께 만들어가는 독서 이야기를 한눈에 확인해요.
          </p>
        </header>

        {/* 상단: 가족 목표 달성률 */}
        <section className="mb-6">
          <FamilyGoalProgress goal={MOCK_FAMILY_GOAL} />
        </section>

        {/* 중단: 좌(읽는 책) / 우(감상평) 2단 그리드 */}
        <section className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ReadingNowList books={MOCK_READING_BOOKS} />
          <ReviewFeed reviews={MOCK_REVIEW_FEED} />
        </section>

        {/* 하단: 주간 독서 시간 그래프 */}
        <section>
          <WeeklyReadingChart data={MOCK_WEEKLY_STATS} />
        </section>
      </div>
    </div>
  );
}
