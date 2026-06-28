"use client";

import { useState } from "react";
import { Search, BookOpen, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MOCK_BOOK_SEARCH } from "@/lib/mock-data";
import type { BookSearchResult } from "@/types/reading-log";

interface BookSearchStepProps {
  onSelect: (book: BookSearchResult) => void;
}

/**
 * [1단계] 도서 검색
 * 제목/저자/ISBN 검색 → 결과 리스트 → 선택
 *
 * NOTE: 현재 목업 필터링. 실제로는 /api/books/search 호출.
 */
export function BookSearchStep({ onSelect }: BookSearchStepProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookSearchResult[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    const keyword = query.trim();
    if (!keyword) return;
    // 목업 검색: 제목/저자에 키워드 포함 여부로 필터
    const filtered = MOCK_BOOK_SEARCH.filter(
      (b) => b.title.includes(keyword) || b.author.includes(keyword),
    );
    setResults(filtered);
    setSearched(true);
  };

  return (
    <Card>
      <p className="mb-4 text-lg font-semibold text-stone-700 dark:text-stone-200">
        어떤 책을 읽으셨나요?
      </p>

      {/* 검색 바 */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="책 제목, 저자로 검색..."
            className="w-full rounded-button border border-stone-200 py-3 pl-10 pr-4 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary-100 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-100"
          />
        </div>
        <Button onClick={handleSearch}>검색</Button>
      </div>

      {/* 검색 결과 */}
      {searched && (
        <div className="mt-6">
          <p className="mb-3 text-sm font-medium text-stone-500">
            검색 결과 {results.length}건
          </p>

          {results.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {results.map((book) => (
                <BookResultItem
                  key={book.id}
                  book={book}
                  onSelect={() => onSelect(book)}
                />
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-stone-400">
              검색 결과가 없어요. 직접 입력해 보세요.
            </p>
          )}

          {/* 수동 입력 안내 */}
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-button border border-dashed border-stone-300 py-3 text-sm font-medium text-stone-500 transition-colors hover:border-primary hover:text-primary dark:border-stone-600">
            <Plus size={18} />
            찾는 책이 없나요? 직접 입력하기
          </button>
        </div>
      )}
    </Card>
  );
}

/** 검색 결과 개별 항목 */
function BookResultItem({
  book,
  onSelect,
}: {
  book: BookSearchResult;
  onSelect: () => void;
}) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-stone-100 p-3 transition-colors hover:border-primary-300 hover:bg-primary-50/40 dark:border-stone-700 dark:hover:bg-stone-700/40">
      <div
        className="flex h-16 w-12 shrink-0 items-center justify-center rounded-lg text-white shadow-sm"
        style={{ backgroundColor: book.coverColor }}
        aria-hidden
      >
        <BookOpen size={18} className="opacity-80" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-stone-800 dark:text-stone-100">
          {book.title}
        </p>
        <p className="truncate text-sm text-stone-500">
          {book.author} · {book.publisher}
        </p>
        <p className="text-xs text-stone-400">
          {book.publishedYear} · {book.totalPages}쪽
        </p>
      </div>
      <Button variant="secondary" onClick={onSelect} className="shrink-0 px-4">
        선택
      </Button>
    </li>
  );
}
