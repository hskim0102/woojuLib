import type {
  FamilyGoal,
  FamilyMember,
  ReadingBook,
  ReviewFeedItem,
  WeeklyReadingStat,
} from "@/types/dashboard";
import type { BookSearchResult } from "@/types/reading-log";
import type { LibraryBook, RecommendedBook } from "@/types/library";

/**
 * 백엔드 연동 전까지 사용할 목업 데이터.
 * API 연동 시 이 파일의 export 들을 fetch 결과로 교체하면 된다.
 */

export const FAMILY_MEMBERS: Record<string, FamilyMember> = {
  mom: { id: "u1", name: "샛별", memberKey: "mom", emoji: "🌸" },
  dad: { id: "u2", name: "호섭", memberKey: "dad", emoji: "📘" },
  son: { id: "u3", name: "우주", memberKey: "son", emoji: "🚀" },
  daughter: { id: "u4", name: "유주", memberKey: "daughter", emoji: "🌷" },
};

export const MOCK_FAMILY_GOAL: FamilyGoal = {
  month: "2026년 6월",
  current: 18,
  target: 25,
};

export const MOCK_READING_BOOKS: ReadingBook[] = [
  {
    id: "b1",
    title: "해리포터와 마법사의 돌",
    author: "J.K. 롤링",
    coverColor: "#8B5CF6",
    pagesRead: 210,
    totalPages: 328,
    reader: FAMILY_MEMBERS.son,
  },
  {
    id: "b2",
    title: "부의 추월차선",
    author: "엠제이 드마코",
    coverColor: "#3B82F6",
    pagesRead: 95,
    totalPages: 412,
    reader: FAMILY_MEMBERS.dad,
  },
  {
    id: "b3",
    title: "불편한 편의점",
    author: "김호연",
    coverColor: "#FB7185",
    pagesRead: 160,
    totalPages: 280,
    reader: FAMILY_MEMBERS.mom,
  },
  {
    id: "b4",
    title: "강아지똥",
    author: "권정생",
    coverColor: "#F472B6",
    pagesRead: 24,
    totalPages: 40,
    reader: FAMILY_MEMBERS.daughter,
  },
];

export const MOCK_REVIEW_FEED: ReviewFeedItem[] = [
  {
    id: "r1",
    bookTitle: "해리포터와 마법사의 돌",
    content:
      "호그와트에 가고 싶어요! 론이랑 헤르미온느가 친구라서 부러웠어요. 다음 편도 빨리 읽고 싶어요.",
    rating: 5,
    hasSpoiler: false,
    likeCount: 3,
    commentCount: 2,
    createdAt: "2시간 전",
    author: FAMILY_MEMBERS.son,
  },
  {
    id: "r2",
    bookTitle: "강아지똥",
    content: "강아지똥이 민들레를 피우는 게 너무 슬프고 예뻤어요.",
    rating: 4,
    hasSpoiler: true,
    likeCount: 2,
    commentCount: 1,
    createdAt: "5시간 전",
    author: FAMILY_MEMBERS.daughter,
  },
  {
    id: "r3",
    bookTitle: "불편한 편의점",
    content:
      "평범한 사람들의 이야기가 이렇게 따뜻할 수 있다니. 아이들에게도 권해주고 싶은 책이에요.",
    rating: 5,
    hasSpoiler: false,
    likeCount: 4,
    commentCount: 0,
    createdAt: "어제",
    author: FAMILY_MEMBERS.mom,
  },
];

export const MOCK_WEEKLY_STATS: WeeklyReadingStat[] = [
  { day: "월", mom: 30, dad: 20, son: 45, daughter: 15 },
  { day: "화", mom: 25, dad: 0, son: 50, daughter: 20 },
  { day: "수", mom: 40, dad: 35, son: 30, daughter: 10 },
  { day: "목", mom: 20, dad: 15, son: 60, daughter: 25 },
  { day: "금", mom: 35, dad: 25, son: 40, daughter: 30 },
  { day: "토", mom: 50, dad: 45, son: 80, daughter: 40 },
  { day: "일", mom: 45, dad: 30, son: 70, daughter: 35 },
];

/** 도서 검색 목업 결과 (실제로는 Google/Naver/Kakao Books API 호출) */
export const MOCK_BOOK_SEARCH: BookSearchResult[] = [
  {
    id: "s1",
    title: "해리포터와 마법사의 돌",
    author: "J.K. 롤링",
    publisher: "문학수첩",
    publishedYear: "2019",
    totalPages: 328,
    genres: ["판타지", "모험"],
    coverColor: "#8B5CF6",
  },
  {
    id: "s2",
    title: "해리포터와 비밀의 방",
    author: "J.K. 롤링",
    publisher: "문학수첩",
    publishedYear: "2019",
    totalPages: 360,
    genres: ["판타지", "모험"],
    coverColor: "#6D28D9",
  },
  {
    id: "s3",
    title: "불편한 편의점",
    author: "김호연",
    publisher: "나무옆의자",
    publishedYear: "2021",
    totalPages: 280,
    genres: ["소설"],
    coverColor: "#FB7185",
  },
  {
    id: "s4",
    title: "어린 왕자",
    author: "생텍쥐페리",
    publisher: "열린책들",
    publishedYear: "2015",
    totalPages: 136,
    genres: ["소설", "고전"],
    coverColor: "#14B8A6",
  },
];

/** 내 서재 목업 (상태별 분류 데이터) */
export const MOCK_LIBRARY_BOOKS: LibraryBook[] = [
  // 읽는 중
  {
    id: "l1",
    title: "해리포터와 마법사의 돌",
    author: "J.K. 롤링",
    coverColor: "#8B5CF6",
    status: "READING",
    pagesRead: 210,
    totalPages: 328,
    rating: 0,
    reader: FAMILY_MEMBERS.son,
  },
  {
    id: "l2",
    title: "부의 추월차선",
    author: "엠제이 드마코",
    coverColor: "#3B82F6",
    status: "READING",
    pagesRead: 95,
    totalPages: 412,
    rating: 0,
    reader: FAMILY_MEMBERS.dad,
  },
  // 읽고 싶은
  {
    id: "l3",
    title: "어린 왕자",
    author: "생텍쥐페리",
    coverColor: "#14B8A6",
    status: "TO_READ",
    pagesRead: 0,
    totalPages: 136,
    rating: 0,
    reader: FAMILY_MEMBERS.daughter,
  },
  {
    id: "l4",
    title: "사피엔스",
    author: "유발 하라리",
    coverColor: "#F59E0B",
    status: "TO_READ",
    pagesRead: 0,
    totalPages: 636,
    rating: 0,
    reader: FAMILY_MEMBERS.mom,
  },
  // 읽음 (완독)
  {
    id: "l5",
    title: "불편한 편의점",
    author: "김호연",
    coverColor: "#FB7185",
    status: "COMPLETED",
    pagesRead: 280,
    totalPages: 280,
    rating: 5,
    reader: FAMILY_MEMBERS.mom,
  },
  {
    id: "l6",
    title: "강아지똥",
    author: "권정생",
    coverColor: "#F472B6",
    status: "COMPLETED",
    pagesRead: 40,
    totalPages: 40,
    rating: 4,
    reader: FAMILY_MEMBERS.daughter,
  },
  {
    id: "l7",
    title: "코스모스",
    author: "칼 세이건",
    coverColor: "#6D28D9",
    status: "COMPLETED",
    pagesRead: 520,
    totalPages: 520,
    rating: 5,
    reader: FAMILY_MEMBERS.son,
  },
];

/** 추천 도서 목업 (실제로는 AI 추천 엔진 결과) */
export const MOCK_RECOMMENDATIONS: RecommendedBook[] = [
  {
    id: "rec1",
    title: "해리포터와 비밀의 방",
    author: "J.K. 롤링",
    coverColor: "#6D28D9",
    genres: ["판타지", "모험"],
    reason: "「해리포터와 마법사의 돌」을 재미있게 읽었어요",
    forMember: FAMILY_MEMBERS.son,
  },
  {
    id: "rec2",
    title: "데미안",
    author: "헤르만 헤세",
    coverColor: "#14B8A6",
    genres: ["소설", "고전"],
    reason: "성장 소설을 좋아하는 유주님께 추천해요",
    forMember: FAMILY_MEMBERS.daughter,
  },
  {
    id: "rec3",
    title: "돈의 속성",
    author: "김승호",
    coverColor: "#3B82F6",
    genres: ["경제", "자기계발"],
    reason: "경제 분야를 즐겨 읽는 호섭님 맞춤 추천",
    forMember: FAMILY_MEMBERS.dad,
  },
  {
    id: "rec4",
    title: "미드나잇 라이브러리",
    author: "매트 헤이그",
    coverColor: "#FB7185",
    genres: ["소설", "판타지"],
    reason: "따뜻한 소설을 좋아하는 샛별님께",
    forMember: FAMILY_MEMBERS.mom,
  },
];
