import { Button } from "@/components/ui/Button";
import { BookCover } from "@/components/ui/BookCover";
import type { BookSearchResult } from "@/types/reading-log";

interface SelectedBookCardProps {
  book: BookSearchResult;
  onChange: () => void;
}

/** 2단계 상단: 선택된 도서 정보 표시 + 변경 버튼 */
export function SelectedBookCard({ book, onChange }: SelectedBookCardProps) {
  return (
    <div className="flex items-center gap-4 border-b border-stone-100 pb-5 dark:border-stone-700">
      <BookCover
        color={book.coverColor}
        imageUrl={book.coverImageUrl}
        alt={book.title}
        className="h-24 w-16"
        iconSize={24}
      />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-stone-800 dark:text-stone-100">
          {book.title}
        </p>
        <p className="text-sm text-stone-500">
          {book.author}
          {book.publisher && ` · ${book.publisher}`}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-1">
          {book.publishedDate && (
            <span className="text-xs text-stone-400">
              출판일 {book.publishedDate}
            </span>
          )}
          {book.genres.map((g) => (
            <span
              key={g}
              className="rounded-full bg-secondary-100 px-2 py-0.5 text-xs font-medium text-secondary-700 dark:bg-secondary-700/30 dark:text-secondary-100"
            >
              #{g}
            </span>
          ))}
        </div>
      </div>
      <Button variant="ghost" onClick={onChange} className="shrink-0 px-3 text-sm">
        변경
      </Button>
    </div>
  );
}
