"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { RatingInput } from "@/components/ui/RatingInput";
import { ReadingStatusSelector } from "@/components/reading-log/ReadingStatusSelector";
import type { LibraryBook } from "@/types/library";
import type { ReadingStatus } from "@/types/reading-log";

interface EditBookModalProps {
  book: LibraryBook;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

/** 서재 책 수정 모달 — 상태/진행률/별점 변경 */
export function EditBookModal({
  book,
  open,
  onClose,
  onSaved,
}: EditBookModalProps) {
  const [status, setStatus] = useState<ReadingStatus>(book.status);
  const [pagesRead, setPagesRead] = useState(book.pagesRead);
  const [rating, setRating] = useState(book.rating);
  const [saving, setSaving] = useState(false);

  const showDetail = status !== "TO_READ";
  const percent =
    book.totalPages > 0
      ? Math.min(Math.round((pagesRead / book.totalPages) * 100), 100)
      : 0;

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/reading-logs/${book.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, pagesRead, rating }),
      });
      if (!res.ok) throw new Error("수정에 실패했어요.");
      onSaved();
      onClose();
    } catch (e) {
      alert(e instanceof Error ? e.message : "수정 중 문제가 발생했어요.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`「${book.title}」 수정`}>
      <div className="flex flex-col gap-5">
        {/* 상태 */}
        <div>
          <p className="mb-2 text-sm font-semibold text-stone-700 dark:text-stone-200">
            독서 상태
          </p>
          <ReadingStatusSelector value={status} onChange={setStatus} />
        </div>

        {showDetail && (
          <>
            {/* 읽은 페이지 */}
            <div>
              <p className="mb-2 text-sm font-semibold text-stone-700 dark:text-stone-200">
                읽은 페이지
              </p>
              {book.totalPages > 0 ? (
                <>
                  <input
                    type="range"
                    min={0}
                    max={book.totalPages}
                    value={pagesRead}
                    onChange={(e) => setPagesRead(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="mt-1 flex justify-between text-sm text-stone-500">
                    <span>
                      {pagesRead} / {book.totalPages}쪽
                    </span>
                    <span className="font-medium text-primary-600">{percent}%</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={pagesRead || ""}
                    onChange={(e) => setPagesRead(Number(e.target.value))}
                    placeholder="0"
                    className="max-w-[120px] rounded-button border border-stone-200 px-4 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary-100 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-100"
                  />
                  <span className="text-stone-500">쪽까지 읽음</span>
                </div>
              )}
            </div>

            {/* 별점 */}
            <div>
              <p className="mb-2 text-sm font-semibold text-stone-700 dark:text-stone-200">
                별점
              </p>
              <RatingInput value={rating} onChange={setRating} />
            </div>
          </>
        )}

        <div className="mt-1 flex gap-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            취소
          </Button>
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            {saving ? "저장 중..." : "저장"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
