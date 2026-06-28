"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BookCover } from "@/components/ui/BookCover";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MemberAvatar } from "@/components/ui/MemberAvatar";
import { RatingStars } from "@/components/ui/RatingStars";
import { EditBookModal } from "@/components/library/EditBookModal";
import { cn } from "@/lib/utils";
import type { LibraryBook } from "@/types/library";
import {
  READING_STATUS_META,
  type ReadingStatus,
} from "@/types/reading-log";

interface LibraryViewProps {
  books: LibraryBook[];
  /** 현재 로그인 사용자 id — 본인 책만 수정/삭제 가능 */
  currentUserId: string;
  /** 책마다 읽은 구성원 아바타 표시 (가족 서재용) */
  showReader?: boolean;
  /** 빈 상태 안내 문구 */
  emptyText?: string;
}

const TABS: { key: ReadingStatus; label: string }[] = [
  { key: "READING", label: READING_STATUS_META.READING.label },
  { key: "TO_READ", label: READING_STATUS_META.TO_READ.label },
  { key: "COMPLETED", label: READING_STATUS_META.COMPLETED.label },
];

/** 내 서재: 상태별 탭 + 책 그리드 (수정/삭제 지원) */
export function LibraryView({
  books,
  currentUserId,
  showReader = true,
  emptyText = "아직 이 상태의 책이 없어요.",
}: LibraryViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ReadingStatus>("READING");
  const [editing, setEditing] = useState<LibraryBook | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = books.filter((b) => b.status === activeTab);

  const handleDelete = async (book: LibraryBook) => {
    if (!confirm(`「${book.title}」을(를) 서재에서 삭제할까요?`)) return;
    setDeletingId(book.id);
    try {
      const res = await fetch(`/api/reading-logs/${book.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("삭제에 실패했어요.");
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "삭제 중 문제가 발생했어요.");
    } finally {
      setDeletingId(null);
    }
  };

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
            <LibraryBookCard
              key={book.id}
              book={book}
              owned={book.reader.id === currentUserId}
              showReader={showReader}
              deleting={deletingId === book.id}
              onEdit={() => setEditing(book)}
              onDelete={() => handleDelete(book)}
            />
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-stone-400">{emptyText}</p>
          <Link href="/reading-log/new">
            <Button>
              <Plus size={18} />책 추가하기
            </Button>
          </Link>
        </Card>
      )}

      {/* 수정 모달 */}
      {editing && (
        <EditBookModal
          book={editing}
          open={!!editing}
          onClose={() => setEditing(null)}
          onSaved={() => router.refresh()}
        />
      )}
    </>
  );
}

/** 서재 책 카드 */
function LibraryBookCard({
  book,
  owned,
  showReader,
  deleting,
  onEdit,
  onDelete,
}: {
  book: LibraryBook;
  owned: boolean;
  showReader: boolean;
  deleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const percent = Math.min(
    Math.round((book.pagesRead / book.totalPages) * 100) || 0,
    100,
  );

  return (
    <Card className="flex gap-4 p-4 hover:shadow-md">
      <BookCover
        color={book.coverColor}
        imageUrl={book.coverImageUrl}
        alt={book.title}
        className="h-28 w-20"
        iconSize={28}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-semibold text-stone-800 dark:text-stone-100">
              {book.title}
            </p>
            <p className="truncate text-sm text-stone-500">{book.author}</p>
          </div>
          {showReader && <MemberAvatar member={book.reader} size="sm" />}
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
            <p className="text-xs text-stone-400">
              {book.totalPages > 0 ? `${book.totalPages}쪽` : "읽고 싶은 책"}
            </p>
          )}
        </div>

        {/* 본인 책에만 수정/삭제 액션 */}
        {owned && (
          <div className="mt-3 flex gap-1 border-t border-stone-100 pt-3 dark:border-stone-700">
            <button
              onClick={onEdit}
              className="flex flex-1 items-center justify-center gap-1 rounded-button py-1.5 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-100 hover:text-primary dark:hover:bg-stone-700"
            >
              <Pencil size={15} />수정
            </button>
            <button
              onClick={onDelete}
              disabled={deleting}
              className="flex flex-1 items-center justify-center gap-1 rounded-button py-1.5 text-sm font-medium text-stone-500 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50 dark:hover:bg-red-900/20"
            >
              <Trash2 size={15} />
              {deleting ? "삭제 중..." : "삭제"}
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}
