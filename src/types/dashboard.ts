/**
 * 대시보드 관련 타입 정의
 * schema_draft.prisma 의 모델을 프론트엔드용으로 단순화
 */

/** 가족 구성원 식별자 (테마 컬러 매핑용) */
export type MemberKey = "mom" | "dad" | "son" | "daughter";

/** 가족 구성원 */
export interface FamilyMember {
  id: string;
  name: string;
  memberKey: MemberKey;
  emoji: string;
}

/** 가족 전체 월간 목표 현황 */
export interface FamilyGoal {
  month: string; // "2026-06"
  current: number; // 이번 달 읽은 권수
  target: number; // 목표 권수
}

/** 읽고 있는 책 (진행률 카드용) */
export interface ReadingBook {
  id: string;
  title: string;
  author: string;
  coverColor: string; // 표지 플레이스홀더 색상
  coverImageUrl?: string; // 실제 표지
  pagesRead: number;
  totalPages: number;
  reader: FamilyMember;
}

/** 감상평 피드 아이템 */
export interface ReviewFeedItem {
  id: string;
  bookTitle: string;
  content: string;
  rating: number; // 1~5
  hasSpoiler: boolean;
  likeCount: number;
  commentCount: number;
  createdAt: string; // 상대 시간 문자열 (예: "2시간 전")
  author: FamilyMember;
}

/** 주간 독서 시간 통계 (요일별, 구성원별 누적) */
export interface WeeklyReadingStat {
  day: string; // "월", "화" ...
  mom: number; // 분
  dad: number;
  son: number;
  daughter: number;
}
