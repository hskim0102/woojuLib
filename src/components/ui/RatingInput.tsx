"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingInputProps {
  value: number; // 0~5
  onChange: (value: number) => void;
  size?: number;
}

/**
 * 입력형 별점 (클릭으로 평점 선택, 호버 미리보기)
 */
export function RatingInput({ value, onChange, size = 32 }: RatingInputProps) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="별점">
      {Array.from({ length: 5 }).map((_, i) => {
        const star = i + 1;
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star}점`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="rounded p-1 transition-transform hover:scale-110"
          >
            <Star
              size={size}
              className={cn(
                star <= display
                  ? "fill-primary text-primary"
                  : "fill-stone-200 text-stone-200 dark:fill-stone-600 dark:text-stone-600",
              )}
            />
          </button>
        );
      })}
      {value > 0 && (
        <span className="ml-2 text-sm font-medium text-stone-500">
          {value}점
        </span>
      )}
    </div>
  );
}
