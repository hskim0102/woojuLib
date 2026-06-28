import { colorForSeed } from "@/lib/colors";
import type { BookSearchResult } from "@/types/reading-log";

/**
 * 카카오 도서 검색 공용 모듈 (서버 전용).
 * 문서: https://developers.kakao.com/docs/latest/ko/daum-search/dev-guide#search-book
 */

const KAKAO_ENDPOINT = "https://dapi.kakao.com/v3/search/book";

export function getKakaoKey(): string {
  return process.env.KAKAO_REST_API_KEY ?? "";
}

interface KakaoBookDoc {
  title: string;
  authors: string[];
  publisher: string;
  datetime: string;
  isbn: string;
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
    totalPages: 0,
    genres: [],
    coverColor: colorForSeed(doc.title),
    coverImageUrl: doc.thumbnail || undefined,
    isbn: isbn13 || undefined,
    summary: doc.contents || undefined,
  };
}

interface SearchOptions {
  size?: number;
  target?: "title" | "person" | "publisher" | "isbn";
}

/**
 * 카카오 도서 검색. 실패/키없음 시 빈 배열 반환(안전).
 */
export async function searchKakaoBooks(
  query: string,
  opts: SearchOptions = {},
): Promise<BookSearchResult[]> {
  const key = getKakaoKey();
  if (!key || !query.trim()) return [];

  const params = new URLSearchParams({ query, size: String(opts.size ?? 10) });
  if (opts.target) params.set("target", opts.target);

  try {
    const res = await fetch(`${KAKAO_ENDPOINT}?${params}`, {
      headers: { Authorization: `KakaoAK ${key}` },
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data: { documents?: KakaoBookDoc[] } = await res.json();
    return (data.documents ?? []).map(normalize);
  } catch {
    return [];
  }
}
