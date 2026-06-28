"use client";

import { useState } from "react";
import { StepHeader } from "@/components/reading-log/StepHeader";
import { BookSearchStep } from "@/components/reading-log/BookSearchStep";
import { ReadingInfoStep } from "@/components/reading-log/ReadingInfoStep";
import type {
  BookSearchResult,
  ReadingLogForm,
} from "@/types/reading-log";

const INITIAL_FORM: ReadingLogForm = {
  status: "READING",
  startedAt: "",
  completedAt: "",
  pagesRead: 0,
  rating: 0,
  readingTimeMinutes: "",
  reviewContent: "",
  hasSpoiler: false,
};

/**
 * 독서 기록 작성 페이지
 *
 * 2단계 플로우 (wireframes.md 기준):
 *  1. 도서 검색 → 선택
 *  2. 독서 정보 입력 (상태/날짜/진행률/별점/감상평) → 저장
 *
 * NOTE: 저장은 현재 console 출력. 실제로는 POST /api/reading-logs.
 */
export default function NewReadingLogPage() {
  const [selectedBook, setSelectedBook] = useState<BookSearchResult | null>(
    null,
  );
  const [form, setForm] = useState<ReadingLogForm>(INITIAL_FORM);

  const step = selectedBook ? 2 : 1;

  const handleSelectBook = (book: BookSearchResult) => {
    setSelectedBook(book);
    // 선택한 책 기준으로 진행률 초기화
    setForm((prev) => ({ ...prev, pagesRead: 0 }));
  };

  const handleChange = (patch: Partial<ReadingLogForm>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = () => {
    // TODO: POST /api/reading-logs 연동
    console.log("저장할 독서 기록:", { book: selectedBook, ...form });
    alert(`「${selectedBook?.title}」 기록이 저장되었어요! 📚`);
  };

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-6 dark:bg-stone-900 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <StepHeader
          title="책 기록하기"
          step={step}
          totalSteps={2}
          onBack={step === 2 ? () => setSelectedBook(null) : undefined}
        />

        {step === 1 && <BookSearchStep onSelect={handleSelectBook} />}

        {step === 2 && selectedBook && (
          <ReadingInfoStep
            book={selectedBook}
            form={form}
            onChange={handleChange}
            onChangeBook={() => setSelectedBook(null)}
            onSave={handleSave}
          />
        )}
      </div>
    </main>
  );
}
