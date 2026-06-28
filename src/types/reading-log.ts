/**
 * 독서 기록 작성 관련 타입
 * schema_draft.prisma 의 ReadingLog / Book 모델 기반
 */

/** 독서 상태 (schema 의 ReadingStatus enum 대응) */
export type ReadingStatus = "TO_READ" | "READING" | "COMPLETED";

/** 도서 검색 결과 / 선택된 도서 */
export interface BookSearchResult {
  id: string; // 카카오: ISBN13, 내부 DB: cuid
  title: string;
  author: string;
  publisher: string;
  publishedYear: string;
  publishedDate: string; // 출판일 (YYYY-MM-DD)
  totalPages: number; // 카카오는 페이지 수 미제공 → 0
  genres: string[];
  coverColor: string; // 표지 플레이스홀더 색상 (이미지 없을 때 폴백)
  coverImageUrl?: string; // 카카오 썸네일 표지
  isbn?: string;
  summary?: string;
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
