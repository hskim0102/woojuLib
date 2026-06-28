import { cn } from "@/lib/utils";
import {
  READING_STATUS_META,
  type ReadingStatus,
} from "@/types/reading-log";

interface ReadingStatusSelectorProps {
  value: ReadingStatus;
  onChange: (status: ReadingStatus) => void;
}

const STATUS_ORDER: ReadingStatus[] = ["TO_READ", "READING", "COMPLETED"];

/** 독서 상태 선택 (3단계 토글 버튼) */
export function ReadingStatusSelector({
  value,
  onChange,
}: ReadingStatusSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {STATUS_ORDER.map((status) => {
        const meta = READING_STATUS_META[status];
        const active = value === status;
        return (
          <button
            key={status}
            type="button"
            onClick={() => onChange(status)}
            aria-pressed={active}
            className={cn(
              "flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl border-2 px-2 py-2 text-sm font-medium transition-all",
              active
                ? "border-primary bg-primary-50 text-primary-700 dark:bg-primary/10 dark:text-primary-300"
                : "border-stone-200 text-stone-500 hover:border-stone-300 dark:border-stone-600",
            )}
          >
            <span className="text-lg">{meta.emoji}</span>
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}
