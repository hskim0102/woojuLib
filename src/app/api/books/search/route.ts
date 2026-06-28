import { NextResponse } from "next/server";
import { colorForSeed } from "@/lib/colors";
import type { BookSearchResult } from "@/types/reading-log";

/**
 * GET /api/books/search?q=책제목
 * 카카오 도서 검색 API로 제목 검색 → 표지/저자/출판일 등을 정규화해 반환.
 * 문서: https://developers.kakao.com/docs/latest/ko/daum-search/dev-guide#search-book
 */

const KAKAO_ENDPOINT = "https://dapi.kakao.com/v3/search/book";

/** 카카오 REST 키 (서버 전용) */
function getKakaoKey(): string {
  return process.env.KAKAO_REST_API_KEY ?? "";
}

interface KakaoBookDoc {
  title: string;
  authors: string[];
  publisher: string;
  datetime: string; // ISO (출판일)
  isbn: string; // "ISBN10 ISBN13" 공백 구분
  thumbnail: string;
  contents: string;
}

/** 카카오 문서 → 앱 공통 BookSearchResult */
function normalize(doc: KakaoBookDoc): BookSearchResult {
  const isbn13 =
    doc.isbn?.split(" ").find((s) => s.length === 13) ?? doc.isbn ?? "";
  const publishedDate = doc.datetime ? doc.datetime.slice(0, 10) : "";
  const publishedYear = publishedDate ? publishedDate.slice(0, 4) : "";

  return {
    id: isbn13 || doc.title,
    title: doc.title,
    author: doc.authors?.length ? doc.authors.join(", ") : "저자 미상",
    publisher: doc.publisher ?? "",
    publishedYear,
    publishedDate,
    totalPages: 0, // 카카오 미제공
    genres: [],
    coverColor: colorForSeed(doc.title),
    coverImageUrl: doc.thumbnail || undefined,
    isbn: isbn13 || undefined,
    summary: doc.contents || undefined,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  if (!q) return NextResponse.json<BookSearchResult[]>([]);

  const key = getKakaoKey();
  if (!key) {
    return NextResponse.json(
      { error: "카카오 API 키가 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  const url = `${KAKAO_ENDPOINT}?target=title&size=20&query=${encodeURIComponent(q)}`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Authorization: `KakaoAK ${key}` },
      // 동일 검색어 결과는 잠시 캐시
      next: { revalidate: 60 },
    });
  } catch {
    return NextResponse.json(
      { error: "카카오 도서 검색 요청에 실패했습니다." },
      { status: 502 },
    );
  }

  if (!res.ok) {
    return NextResponse.json(
      { error: `카카오 API 오류 (${res.status})` },
      { status: 502 },
    );
  }

  const data: { documents?: KakaoBookDoc[] } = await res.json();
  const results = (data.documents ?? []).map(normalize);
  return NextResponse.json<BookSearchResult[]>(results);
}
