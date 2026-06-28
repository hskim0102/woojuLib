import { NextResponse } from "next/server";
import { searchKakaoBooks, getKakaoKey } from "@/lib/kakao";
import type { BookSearchResult } from "@/types/reading-log";

/**
 * GET /api/books/search?q=책제목
 * 카카오 도서 검색 API로 제목 검색 → 표지/저자/출판일 등을 반환.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  if (!q) return NextResponse.json<BookSearchResult[]>([]);

  if (!getKakaoKey()) {
    return NextResponse.json(
      { error: "카카오 API 키가 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  const results = await searchKakaoBooks(q, { target: "title", size: 20 });
  return NextResponse.json<BookSearchResult[]>(results);
}
