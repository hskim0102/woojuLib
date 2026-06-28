import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepHeaderProps {
  title: string;
  step: number; // 1-based
  totalSteps: number;
  onBack?: () => void;
}

/**
 * 페이지 상단 헤더 + 단계 진행 표시기
 */
export function StepHeader({ title, step, totalSteps, onBack }: StepHeaderProps) {
  return (
    <header className="mb-6">
      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          disabled={!onBack}
          aria-label="뒤로 가기"
          className="rounded-full p-2 text-stone-500 transition-colors hover:bg-stone-100 disabled:opacity-30 dark:hover:bg-stone-700"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-display text-xl font-bold text-stone-800 dark:text-stone-100 sm:text-2xl">
          {title}
        </h1>
        <span className="ml-auto text-sm font-medium text-stone-400">
          {step} / {totalSteps}
        </span>
      </div>

      {/* 단계 인디케이터 바 */}
      <div className="flex gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i < step ? "bg-primary" : "bg-stone-200 dark:bg-stone-700",
            )}
          />
        ))}
      </div>
    </header>
  );
}
