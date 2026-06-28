import { cn } from "@/lib/utils";
import {
  READING_STATUS_META,
  type ReadingStatus,
} from "@/types/reading-log";

/** 상태별 배지 색상 (design_system.md 독서 상태 컬러) */
const STATUS_STYLE: Record<ReadingStatus, string> = {
  TO_READ: "bg-stone-100 text-stone-500 dark:bg-stone-700 dark:text-stone-300",
  READING: "bg-primary-100 text-primary-700 dark:bg-primary/10 dark:text-primary-300",
  COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
};

interface StatusBadgeProps {
  status: ReadingStatus;
}

/** 독서 상태 배지 */
export function StatusBadge({ status }: StatusBadgeProps) {
  const meta = READING_STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLE[status],
      )}
    >
      <span>{meta.emoji}</span>
      {meta.label}
    </span>
  );
}
