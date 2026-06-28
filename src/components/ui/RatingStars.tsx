import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  value: number; // 0~5
  size?: number;
}

/** 별점 표시 (읽기 전용) */
export function RatingStars({ value, size = 16 }: RatingStarsProps) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`별점 ${value}점`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            i < value
              ? "fill-primary text-primary"
              : "fill-stone-200 text-stone-200 dark:fill-stone-600 dark:text-stone-600",
          )}
        />
      ))}
    </div>
  );
}
