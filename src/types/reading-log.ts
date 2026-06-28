/**
 * 독서 기록 작성 관련 타입
 * schema_draft.prisma 의 ReadingLog / Book 모델 기반
 */

/** 독서 상태 (schema 의 ReadingStatus enum 대응) */
export type ReadingStatus = "TO_READ" | "READING" | "COMPLETED";

/** 도서 검색 결과 / 선택된 도서 */
export interface BookSearchResult {
  id: string;
  title: string;
  author: string;
  publisher: string;
  publishedYear: string;
  totalPages: number;
  genres: string[];
  coverColor: string; // 표지 플레이스홀더 색상 (실제로는 coverImageUrl)
}

/** 독서 기록 폼 상태 */
export interface ReadingLogForm {
  status: ReadingStatus;
  startedAt: string; // "2026-06-01"
  completedAt: string;
  pagesRead: number;
  rating: number; // 0~5
  readingTimeMinutes: number | "";
  reviewContent: string;
  hasSpoiler: boolean;
}

/** 독서 상태 표시 메타 */
export const READING_STATUS_META: Record<
  ReadingStatus,
  { label: string; emoji: string }
> = {
  TO_READ: { label: "읽고 싶어요", emoji: "🔖" },
  READING: { label: "읽는 중", emoji: "📖" },
  COMPLETED: { label: "완독", emoji: "✅" },
};
