"use client";

import { Calendar, Clock, Save } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RatingInput } from "@/components/ui/RatingInput";
import { SelectedBookCard } from "./SelectedBookCard";
import { ReadingStatusSelector } from "./ReadingStatusSelector";
import type { BookSearchResult, ReadingLogForm } from "@/types/reading-log";

interface ReadingInfoStepProps {
  book: BookSearchResult;
  form: ReadingLogForm;
  onChange: (patch: Partial<ReadingLogForm>) => void;
  onChangeBook: () => void;
  onSave: () => void;
  saving?: boolean;
}

/** 라벨 래퍼 */
function Field({
  label,
  icon,
  optional,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-stone-700 dark:text-stone-200">
        {icon}
        {label}
        {optional && (
          <span className="font-normal text-stone-400">(선택)</span>
        )}
      </label>
      {children}
    </div>
  );
}

/**
 * [2단계] 독서 정보 입력
 * 상태에 따라 날짜/진행률/별점/리뷰 필드를 동적으로 노출
 */
export function ReadingInfoStep({
  book,
  form,
  onChange,
  onChangeBook,
  onSave,
  saving = false,
}: ReadingInfoStepProps) {
  const showDetailFields = form.status !== "TO_READ";
  const isCompleted = form.status === "COMPLETED";
  const progressPercent = Math.min(
    Math.round((form.pagesRead / book.totalPages) * 100) || 0,
    100,
  );

  const inputClass =
    "w-full rounded-button border border-stone-200 px-4 py-2.5 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary-100 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-100";

  return (
    <Card>
      <SelectedBookCard book={book} onChange={onChangeBook} />

      <div className="mt-6 flex flex-col gap-6">
        {/* 독서 상태 */}
        <Field label="독서 상태">
          <ReadingStatusSelector
            value={form.status}
            onChange={(status) => onChange({ status })}
          />
        </Field>

        {/* 상태가 '읽고 싶어요'가 아닐 때만 상세 필드 노출 */}
        {showDetailFields && (
          <>
            {/* 읽은 기간 */}
            <Field label="읽은 기간" icon={<Calendar size={16} />} optional>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={form.startedAt}
                  onChange={(e) => onChange({ startedAt: e.target.value })}
                  className={inputClass}
                  aria-label="시작일"
                />
                {isCompleted && (
                  <>
                    <span className="text-stone-400">~</span>
                    <input
                      type="date"
                      value={form.completedAt}
                      onChange={(e) =>
                        onChange({ completedAt: e.target.value })
                      }
                      className={inputClass}
                      aria-label="완료일"
                    />
                  </>
                )}
              </div>
            </Field>

            {/* 읽은 페이지 — 총 페이지를 알면 슬라이더, 모르면 숫자 입력 */}
            <Field label="읽은 페이지" optional>
              {book.totalPages > 0 ? (
                <>
                  <input
                    type="range"
                    min={0}
                    max={book.totalPages}
                    value={form.pagesRead}
                    onChange={(e) =>
                      onChange({ pagesRead: Number(e.target.value) })
                    }
                    className="w-full accent-primary"
                    aria-label="읽은 페이지"
                  />
                  <div className="mt-1 flex justify-between text-sm text-stone-500">
                    <span>
                      {form.pagesRead} / {book.totalPages}쪽
                    </span>
                    <span className="font-medium text-primary-600">
                      {progressPercent}%
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={form.pagesRead || ""}
                    onChange={(e) =>
                      onChange({ pagesRead: Number(e.target.value) })
                    }
                    placeholder="0"
                    className={`${inputClass} max-w-[120px]`}
                    aria-label="읽은 페이지"
                  />
                  <span className="text-stone-500">쪽까지 읽음</span>
                </div>
              )}
            </Field>

            {/* 별점 */}
            <Field label="별점" optional>
              <RatingInput
                value={form.rating}
                onChange={(rating) => onChange({ rating })}
              />
            </Field>

            {/* 독서 시간 */}
            <Field label="독서 시간" icon={<Clock size={16} />} optional>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  value={form.readingTimeMinutes}
                  onChange={(e) =>
                    onChange({
                      readingTimeMinutes:
                        e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  placeholder="0"
                  className={`${inputClass} max-w-[120px]`}
                />
                <span className="text-stone-500">분</span>
              </div>
            </Field>

            {/* 감상평 */}
            <Field label="감상평 작성하기" optional>
              <textarea
                value={form.reviewContent}
                onChange={(e) => onChange({ reviewContent: e.target.value })}
                placeholder="이 책을 읽고 어떤 생각이 들었나요?"
                rows={4}
                className={`${inputClass} resize-none leading-relaxed`}
              />
              <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-stone-500">
                <input
                  type="checkbox"
                  checked={form.hasSpoiler}
                  onChange={(e) => onChange({ hasSpoiler: e.target.checked })}
                  className="h-4 w-4 rounded accent-primary"
                />
                스포일러 포함
              </label>
            </Field>
          </>
        )}

        {/* 저장 버튼 */}
        <Button fullWidth onClick={onSave} disabled={saving} className="mt-2">
          <Save size={20} />
          {saving ? "저장 중..." : "기록 저장하기"}
        </Button>
      </div>
    </Card>
  );
}
