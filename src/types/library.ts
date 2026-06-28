import type { FamilyMember } from "@/types/dashboard";
import type { ReadingStatus } from "@/types/reading-log";

/** 서재에 담긴 책 (상태별 분류) */
export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  coverColor: string;
  status: ReadingStatus;
  pagesRead: number;
  totalPages: number;
  rating: number; // 완독 시 0~5, 그 외 0
  reader: FamilyMember;
}

/** AI/가족 추천 도서 */
export interface RecommendedBook {
  id: string;
  title: string;
  author: string;
  coverColor: string;
  genres: string[];
  reason: string; // 추천 이유
  forMember: FamilyMember; // 추천 대상
}
