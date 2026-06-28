import type { Genre } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { colorForSeed } from "@/lib/colors";
import { searchKakaoBooks } from "@/lib/kakao";
import { toFamilyMember } from "@/lib/member-theme";
import { formatRelative } from "@/lib/time";
import type {
  FamilyGoal,
  FamilyMember,
  ReadingBook,
  ReviewFeedItem,
  WeeklyReadingStat,
} from "@/types/dashboard";
import type { LibraryBook, RecommendedBook } from "@/types/library";
import type { ReadingStatus } from "@/types/reading-log";

/**
 * 서버 데이터 액세스 레이어.
 * Prisma 모델을 프론트엔드 타입으로 변환해 반환한다.
 * (인증 도입 전이므로 단일 가족 기준으로 동작)
 */

/** 현재 로그인 사용자의 가족 (세션 기반, 폴백: 첫 번째 가족) */
async function getFamily() {
  const userId = await getSessionUserId();
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { family: true },
    });
    if (user?.family) return user.family;
  }
  const family = await prisma.family.findFirst();
  if (!family) throw new Error("가족 데이터가 없습니다. 시드를 실행하세요.");
  return family;
}

/** 현재 로그인 사용자 ID (미인증 시 예외) */
export async function getCurrentUserId(): Promise<string> {
  const userId = await getSessionUserId();
  if (!userId) throw new Error("UNAUTHENTICATED");
  return userId;
}

/** 현재 로그인 사용자 (미인증 시 null) */
export async function getCurrentUserOrNull(): Promise<FamilyMember | null> {
  const userId = await getSessionUserId();
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user ? toFamilyMember(user) : null;
}

/** 헤더용: 현재 로그인 사용자 (미인증 시 예외 — 게이트 통과 후 사용) */
export async function getCurrentUser(): Promise<FamilyMember> {
  const member = await getCurrentUserOrNull();
  if (!member) throw new Error("UNAUTHENTICATED");
  return member;
}

/** 설정 페이지용 사용자 설정 */
export interface UserSettings {
  nickname: string;
  genres: Genre[];
  monthlyReadingGoal: number;
  notifications: {
    activity: boolean;
    comment: boolean;
    recommendation: boolean;
    goal: boolean;
  };
  darkMode: boolean;
  fontSize: string;
}

/** 현재 사용자의 설정(프로필+선호도) 조회 */
export async function getUserSettings(): Promise<UserSettings> {
  const userId = await getCurrentUserId();
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: { preferences: true },
  });
  const p = user.preferences;

  return {
    nickname: user.nickname,
    genres: p?.genres ?? [],
    monthlyReadingGoal: p?.monthlyReadingGoal ?? 3,
    notifications: {
      activity: p?.activityNotificationsEnabled ?? true,
      comment: p?.commentNotificationsEnabled ?? true,
      recommendation: p?.recommendationNotificationsEnabled ?? true,
      goal: p?.goalNotificationsEnabled ?? true,
    },
    darkMode: p?.darkMode ?? false,
    fontSize: p?.fontSize ?? "normal",
  };
}

/** 가족 전체의 이번 달 독서 목표 현황 */
export async function getFamilyGoal(): Promise<FamilyGoal> {
  const family = await getFamily();

  const [users, completedLogs] = await Promise.all([
    prisma.user.findMany({
      where: { familyId: family.id },
      include: { preferences: true },
    }),
    prisma.readingLog.findMany({
      where: {
        status: "COMPLETED",
        completedAt: { not: null },
        user: { familyId: family.id },
      },
      select: { completedAt: true },
    }),
  ]);

  // 데이터가 있는 가장 최근 월을 '이번 달'로 사용 (시계와 무관하게 안정적)
  const latest = completedLogs
    .map((l) => l.completedAt as Date)
    .sort((a, b) => b.getTime() - a.getTime())[0] ?? new Date();
  const year = latest.getFullYear();
  const month = latest.getMonth();

  const current = completedLogs.filter((l) => {
    const c = l.completedAt as Date;
    return c.getFullYear() === year && c.getMonth() === month;
  }).length;

  const target = users.reduce(
    (sum, u) => sum + (u.preferences?.monthlyReadingGoal ?? 3),
    0,
  );

  return {
    month: `${year}년 ${month + 1}월`,
    current,
    target,
  };
}

/** 읽고 있는 책 목록 (대시보드 좌측) */
export async function getReadingBooks(): Promise<ReadingBook[]> {
  const family = await getFamily();
  const logs = await prisma.readingLog.findMany({
    where: { status: "READING", user: { familyId: family.id } },
    include: { book: true, user: true },
    orderBy: { updatedAt: "desc" },
  });

  return logs.map((log) => ({
    id: log.id,
    title: log.book.title,
    author: log.book.author,
    coverColor: colorForSeed(log.book.title),
    coverImageUrl: log.book.coverImageUrl ?? undefined,
    pagesRead: log.pagesRead ?? 0,
    totalPages: log.totalPages ?? log.book.pageCount ?? 0,
    reader: toFamilyMember(log.user),
  }));
}

/** 최신 감상평 피드 (대시보드 우측 / 리뷰 페이지) */
export async function getReviewFeed(limit = 10): Promise<ReviewFeedItem[]> {
  const family = await getFamily();
  const reviews = await prisma.review.findMany({
    where: { user: { familyId: family.id } },
    include: { book: true, user: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return reviews.map((r) => ({
    id: r.id,
    bookTitle: r.book.title,
    content: r.content,
    rating: r.rating,
    hasSpoiler: r.hasSpoiler,
    likeCount: r.likeCount,
    commentCount: r.commentCount,
    createdAt: formatRelative(r.createdAt),
    author: toFamilyMember(r.user),
  }));
}

/**
 * 서재 책 목록 (상태 무관 전체).
 * @param scope "mine" = 내 책만 / "family" = 가족 전체
 */
export async function getLibraryBooks(
  scope: "mine" | "family" = "family",
): Promise<LibraryBook[]> {
  const where =
    scope === "mine"
      ? { userId: await getCurrentUserId() }
      : { user: { familyId: (await getFamily()).id } };

  const logs = await prisma.readingLog.findMany({
    where,
    include: { book: true, user: true },
    orderBy: { updatedAt: "desc" },
  });

  return logs.map((log) => ({
    id: log.id,
    title: log.book.title,
    author: log.book.author,
    coverColor: colorForSeed(log.book.title),
    coverImageUrl: log.book.coverImageUrl ?? undefined,
    status: log.status as ReadingStatus,
    pagesRead: log.pagesRead ?? 0,
    totalPages: log.totalPages ?? log.book.pageCount ?? 0,
    rating: log.rating ?? 0,
    reader: toFamilyMember(log.user),
  }));
}

/** 나이대별 추천 키워드 풀 (월마다 다른 키워드 선택) */
function keywordsForAge(age: number): string[] {
  if (age <= 7) return ["그림책", "유아 동화", "창작 동화"];
  if (age <= 9) return ["어린이 동화", "초등 저학년", "어린이 모험"];
  if (age <= 13) return ["어린이 소설", "초등 고학년", "청소년 모험"];
  if (age <= 18) return ["청소년 소설", "성장 소설", "청소년 추천"];
  if (age <= 39) return ["베스트셀러 소설", "자기계발", "에세이"];
  return ["인문 교양", "경제 경영", "역사 교양"];
}

/**
 * 추천 도서 목록 — 구성원 각자의 나이에 맞춰 이번 달 추천 도서를 생성.
 * 카카오 도서 검색을 활용하며, 월(month)에 따라 키워드/선택이 바뀐다.
 */
export async function getRecommendations(): Promise<RecommendedBook[]> {
  const family = await getFamily();
  const users = await prisma.user.findMany({
    where: { familyId: family.id },
    orderBy: { createdAt: "asc" },
  });

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1~12

  const perMember = await Promise.all(
    users.map(async (u) => {
      const age = u.birthYear ? year - u.birthYear : 30;
      const keywords = keywordsForAge(age);
      const keyword = keywords[(month - 1) % keywords.length];

      const books = await searchKakaoBooks(keyword, {
        target: "title",
        size: 10,
      });
      if (books.length === 0) return [] as RecommendedBook[];

      // 월에 따라 시작 위치를 바꿔 매달 다른 책이 추천되도록
      const offset = (month * 3) % books.length;
      const picks: RecommendedBook[] = [];
      for (let i = 0; i < books.length && picks.length < 2; i++) {
        const b = books[(offset + i) % books.length];
        picks.push({
          id: `${u.id}-${b.id}`,
          title: b.title,
          author: b.author,
          coverColor: b.coverColor,
          coverImageUrl: b.coverImageUrl,
          genres: [keyword], // 추천 카테고리를 태그로 노출
          reason: `${age}세 ${u.nickname}님을 위한 ${month}월 추천 도서`,
          forMember: toFamilyMember(u),
        });
      }
      return picks;
    }),
  );

  return perMember.flat();
}

/**
 * 주간 독서 시간 통계 (대시보드 하단 그래프).
 * 가장 최근 세션이 속한 주(월~일)를 요일별·구성원별 분으로 집계한다.
 */
export async function getWeeklyStats(): Promise<WeeklyReadingStat[]> {
  const family = await getFamily();
  const sessions = await prisma.readingSession.findMany({
    where: { user: { familyId: family.id } },
    include: { user: true },
    orderBy: { date: "desc" },
  });

  const DAYS = ["월", "화", "수", "목", "금", "토", "일"];
  // 빈 주 틀 생성
  const empty = (): WeeklyReadingStat[] =>
    DAYS.map((day) => ({ day, mom: 0, dad: 0, son: 0, daughter: 0 }));

  if (sessions.length === 0) return empty();

  // 가장 최근 세션이 속한 주의 월요일(주 시작) 계산
  const latest = sessions[0].date;
  const dow = (latest.getUTCDay() + 6) % 7; // 월=0 ... 일=6
  const monday = new Date(latest);
  monday.setUTCDate(latest.getUTCDate() - dow);
  monday.setUTCHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  sunday.setUTCHours(23, 59, 59, 999);

  const week = empty();
  for (const s of sessions) {
    if (s.date < monday || s.date > sunday) continue;
    const idx = (s.date.getUTCDay() + 6) % 7;
    const key = toFamilyMember(s.user).memberKey;
    week[idx][key] += s.minutes;
  }
  return week;
}

/** 구성원별 이번 달 통계 (가족 페이지) */
export interface MemberStat {
  member: FamilyMember;
  role: string;
  booksRead: number;
  readingMinutes: number;
  avgRating: number;
}

const ROLE_LABEL: Record<string, string> = {
  PARENT: "부모",
  CHILD: "자녀",
  GUEST: "게스트",
};

export async function getFamilyMemberStats(): Promise<MemberStat[]> {
  const family = await getFamily();
  const users = await prisma.user.findMany({
    where: { familyId: family.id },
    include: {
      readingLogs: { where: { status: "COMPLETED" } },
    },
  });

  return users.map((u) => {
    const completed = u.readingLogs;
    const ratings = completed
      .map((l) => l.rating)
      .filter((r): r is number => r != null);
    const avg =
      ratings.length > 0
        ? ratings.reduce((s, r) => s + r, 0) / ratings.length
        : 0;
    const minutes = completed.reduce(
      (s, l) => s + (l.readingTimeMinutes ?? 0),
      0,
    );

    return {
      member: toFamilyMember(u),
      role: ROLE_LABEL[u.role] ?? u.role,
      booksRead: completed.length,
      readingMinutes: minutes,
      avgRating: avg,
    };
  });
}
