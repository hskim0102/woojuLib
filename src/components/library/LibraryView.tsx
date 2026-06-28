"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BookCover } from "@/components/ui/BookCover";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MemberAvatar } from "@/components/ui/MemberAvatar";
import { RatingStars } from "@/components/ui/RatingStars";
import { cn } from "@/lib/utils";
import type { LibraryBook } from "@/types/library";
import {
  READING_STATUS_META,
  type ReadingStatus,
} from "@/types/reading-log";

interface LibraryViewProps {
  books: LibraryBook[];
}

const TABS: { key: ReadingStatus; label: string }[] = [
  { key: "READING", label: READING_STATUS_META.READING.label },
  { key: "TO_READ", label: READING_STATUS_META.TO_READ.label },
  { key: "COMPLETED", label: READING_STATUS_META.COMPLETED.label },
];

/** 내 서재: 상태별 탭 + 책 그리드 */
export function LibraryView({ books }: LibraryViewProps) {
  const [activeTab, setActiveTab] = useState<ReadingStatus>("READING");
  const filtered = books.filter((b) => b.status === activeTab);

  return (
    <>
      {/* 상태 탭 */}
      <div className="mb-6 flex gap-2 border-b border-stone-200 dark:border-stone-700">
        {TABS.map((tab) => {
          const count = books.filter((b) => b.status === tab.key).length;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "relative -mb-px flex items-center gap-1.5 px-4 py-3 text-sm font-semibold transition-colors",
                active
                  ? "border-b-2 border-primary text-primary"
                  : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-200",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-xs",
                  active
                    ? "bg-primary-100 text-primary-700 dark:bg-primary/20"
                    : "bg-stone-100 text-stone-400 dark:bg-stone-700",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 책 그리드 */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((book) => (
            <LibraryBookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-stone-400">아직 이 상태의 책이 없어요.</p>
          <Link href="/reading-log/new">
            <Button>
              <Plus size={18} />책 추가하기
            </Button>
          </Link>
        </Card>
      )}
    </>
  );
}

/** 서재 책 카드 */
function LibraryBookCard({ book }: { book: LibraryBook }) {
  const percent = Math.min(
    Math.round((book.pagesRead / book.totalPages) * 100) || 0,
    100,
  );

  return (
    <Card className="flex gap-4 p-4 hover:shadow-md">
      <BookCover color={book.coverColor} className="h-28 w-20" iconSize={28} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-semibold text-stone-800 dark:text-stone-100">
              {book.title}
            </p>
            <p className="truncate text-sm text-stone-500">{book.author}</p>
          </div>
          <MemberAvatar member={book.reader} size="sm" />
        </div>

        <div className="mt-2">
          <StatusBadge status={book.status} />
        </div>

        {/* 상태별 부가 정보 */}
        <div className="mt-auto pt-3">
          {book.status === "READING" && (
            <>
              <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-stone-700">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-stone-400">
                {book.pagesRead} / {book.totalPages}쪽 · {percent}%
              </p>
            </>
          )}
          {book.status === "COMPLETED" && (
            <RatingStars value={book.rating} size={16} />
          )}
          {book.status === "TO_READ" && (
            <p className="text-xs text-stone-400">{book.totalPages}쪽</p>
          )}
        </div>
      </div>
    </Card>
  );
}
