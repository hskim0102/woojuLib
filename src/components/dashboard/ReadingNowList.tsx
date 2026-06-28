import { BookOpen } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/Card";
import { MemberAvatar } from "@/components/ui/MemberAvatar";
import type { ReadingBook } from "@/types/dashboard";

interface ReadingNowListProps {
  books: ReadingBook[];
}

/**
 * [좌측] 가족이 최근 읽고 있는 책 목록 + 진행률 카드
 */
export function ReadingNowList({ books }: ReadingNowListProps) {
  return (
    <Card>
      <SectionTitle
        icon={<BookOpen size={22} className="text-primary" />}
        title="지금 읽고 있어요"
      />
      <ul className="flex flex-col gap-4">
        {books.map((book) => (
          <ReadingBookItem key={book.id} book={book} />
        ))}
      </ul>
    </Card>
  );
}

/** 개별 읽고 있는 책 항목 */
function ReadingBookItem({ book }: { book: ReadingBook }) {
  const percent = Math.min(
    Math.round((book.pagesRead / book.totalPages) * 100),
    100,
  );

  return (
    <li className="flex gap-3 rounded-xl p-2 transition-colors hover:bg-stone-50 dark:hover:bg-stone-700/40">
      {/* 표지 플레이스홀더 */}
      <div
        className="flex h-20 w-14 shrink-0 items-center justify-center rounded-lg text-white shadow-sm"
        style={{ backgroundColor: book.coverColor }}
        aria-hidden
      >
        <BookOpen size={20} className="opacity-80" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-semibold text-stone-800 dark:text-stone-100">
              {book.title}
            </p>
            <p className="truncate text-sm text-stone-500 dark:text-stone-400">
              {book.author}
            </p>
          </div>
          <MemberAvatar member={book.reader} size="sm" />
        </div>

        {/* 진행률 바 */}
        <div className="mt-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-stone-700">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-stone-400">
            <span>
              {book.pagesRead} / {book.totalPages}쪽
            </span>
            <span className="font-medium text-primary-600">{percent}%</span>
          </div>
        </div>
      </div>
    </li>
  );
}
