/* eslint-disable @next/next/no-img-element */
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookCoverProps {
  color: string;
  imageUrl?: string;
  alt?: string;
  className?: string;
  iconSize?: number;
}

/**
 * 책 표지.
 * imageUrl 이 있으면 실제 표지를, 없으면 색상 플레이스홀더를 렌더한다.
 * (카카오 썸네일 등 외부 도메인 다수 → next/image 대신 img 사용)
 */
export function BookCover({
  color,
  imageUrl,
  alt = "",
  className,
  iconSize = 24,
}: BookCoverProps) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        loading="lazy"
        className={cn(
          "shrink-0 rounded-lg object-cover shadow-sm",
          className,
        )}
      />
    );
  }

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
