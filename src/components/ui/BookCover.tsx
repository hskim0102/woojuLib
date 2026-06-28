import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookCoverProps {
  color: string;
  className?: string;
  iconSize?: number;
}

/**
 * 책 표지 플레이스홀더 (실제 coverImageUrl 대체용)
 * 크기는 className 으로 제어한다.
 */
export function BookCover({ color, className, iconSize = 24 }: BookCoverProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg text-white shadow-sm",
        className,
      )}
      style={{ backgroundColor: color }}
      aria-hidden
    >
      <BookOpen size={iconSize} className="opacity-80" />
    </div>
  );
}
