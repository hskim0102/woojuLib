import { Target, BookCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { FamilyGoal } from "@/types/dashboard";

interface FamilyGoalProgressProps {
  goal: FamilyGoal;
}

/**
 * [상단] 가족 전체의 이번 달 독서 목표 달성률
 * 프로그레스 바 + 격려 메시지
 */
export function FamilyGoalProgress({ goal }: FamilyGoalProgressProps) {
  const percent = Math.min(
    Math.round((goal.current / goal.target) * 100),
    100,
  );
  const remaining = Math.max(goal.target - goal.current, 0);
  const achieved = remaining === 0;

  return (
    <Card className="bg-gradient-to-br from-primary-50 to-white dark:from-stone-800 dark:to-stone-800">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Target size={26} />
          </div>
          <div>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              {goal.month} 가족 독서 목표
            </p>
            <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">
              {goal.current}
              <span className="text-lg font-medium text-stone-400">
                {" "}
                / {goal.target}권
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-primary-700 shadow-sm dark:bg-stone-700/50 dark:text-primary-300">
          <BookCheck size={18} />
          {achieved
            ? "목표 달성! 정말 멋져요 🎉"
            : `목표까지 ${remaining}권 남았어요!`}
        </div>
      </div>

      {/* 프로그레스 바 */}
      <div className="mt-5">
        <div
          className="h-4 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-stone-700"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-300 to-primary-600 transition-[width] duration-700 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-2 text-right text-sm font-semibold text-primary-700 dark:text-primary-300">
          {percent}% 달성
        </p>
      </div>
    </Card>
  );
}
