import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import type { BookSearchResult, ReadingStatus } from "@/types/reading-log";

interface CreateReadingLogBody {
  /** 기존 DB 책 id (있으면 우선 사용) */
  bookId?: string;
  /** 검색 결과 책 정보 (DB에 없으면 이걸로 생성) */
  book?: BookSearchResult;
  status: ReadingStatus;
  startedAt?: string;
  completedAt?: string;
  pagesRead?: number;
  rating?: number;
  readingTimeMinutes?: number | "";
  reviewContent?: string;
  hasSpoiler?: boolean;
}

/**
 * 책 식별: 기존 id가 있으면 그대로, 없으면 검색 결과를 ISBN 기준으로 upsert.
 * 반환값은 DB의 책 id, 또는 책 정보가 부족하면 null.
 */
async function resolveBookId(body: CreateReadingLogBody): Promise<string | null> {
  if (body.bookId) {
    const existing = await prisma.book.findUnique({ where: { id: body.bookId } });
    if (existing) return existing.id;
  }

  const book = body.book;
  if (!book?.title) return null;

  if (book.isbn) {
    const byIsbn = await prisma.book.findUnique({ where: { isbn: book.isbn } });
    if (byIsbn) return byIsbn.id;
  }

  const created = await prisma.book.create({
    data: {
      title: book.title,
      author: book.author || "저자 미상",
      publisher: book.publisher || null,
      isbn: book.isbn || null,
      pageCount: book.totalPages || null,
      coverImageUrl: book.coverImageUrl || null,
      summary: book.summary || null,
      publicationDate: book.publishedDate ? new Date(book.publishedDate) : null,
      externalSource: "KAKAO_BOOKS",
    },
  });
  return created.id;
}

/**
 * POST /api/reading-logs
 * 독서 기록 생성/갱신. 완독이며 감상평이 있으면 리뷰도 함께 생성.
 */
export async function POST(request: Request) {
  let body: CreateReadingLogBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }

  if (!body.status) {
    return NextResponse.json({ error: "status 는 필수입니다." }, { status: 400 });
  }

  const bookId = await resolveBookId(body);
  if (!bookId) {
    return NextResponse.json(
      { error: "책 정보를 찾을 수 없습니다." },
      { status: 400 },
    );
  }

  const book = await prisma.book.findUniqueOrThrow({ where: { id: bookId } });
  const readingTime =
    body.readingTimeMinutes === "" || body.readingTimeMinutes == null
      ? null
      : Number(body.readingTimeMinutes);

  // 사용자-책 조합은 유니크 → upsert
  const log = await prisma.readingLog.upsert({
    where: { userId_bookId: { userId, bookId } },
    create: {
      userId,
      bookId,
      status: body.status,
      startedAt: body.startedAt ? new Date(body.startedAt) : null,
      completedAt: body.completedAt ? new Date(body.completedAt) : null,
      pagesRead: body.pagesRead ?? 0,
      totalPages: book.pageCount,
      rating: body.rating || null,
      readingTimeMinutes: readingTime,
    },
    update: {
      status: body.status,
      startedAt: body.startedAt ? new Date(body.startedAt) : null,
      completedAt: body.completedAt ? new Date(body.completedAt) : null,
      pagesRead: body.pagesRead ?? 0,
      rating: body.rating || null,
      readingTimeMinutes: readingTime,
    },
  });

  // 완독 + 감상평 → 리뷰 생성
  if (body.status === "COMPLETED" && body.reviewContent?.trim()) {
    await prisma.review.create({
      data: {
        userId,
        bookId,
        rating: body.rating || 0,
        content: body.reviewContent.trim(),
        hasSpoiler: body.hasSpoiler ?? false,
      },
    });
  }

  return NextResponse.json({ id: log.id }, { status: 201 });
}
