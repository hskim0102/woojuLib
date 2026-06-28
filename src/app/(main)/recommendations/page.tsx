import { Sparkles } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BookCover } from "@/components/ui/BookCover";
import { MemberAvatar } from "@/components/ui/MemberAvatar";
import { MOCK_RECOMMENDATIONS } from "@/lib/mock-data";
import type { RecommendedBook } from "@/types/library";

/** 추천 페이지 — AI/가족 맞춤 추천 도서 */
export default function RecommendationsPage() {
  return (
    <PageContainer
      title="오늘의 추천"
      emoji="✨"
      description="가족 각자의 독서 취향에 맞춰 골라봤어요."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {MOCK_RECOMMENDATIONS.map((book) => (
          <RecommendationCard key={book.id} book={book} />
        ))}
      </div>
    </PageContainer>
  );
}

function RecommendationCard({ book }: { book: RecommendedBook }) {
  return (
    <Card className="flex gap-4 hover:shadow-md">
      <BookCover color={book.coverColor} className="h-32 w-24" iconSize={30} />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="font-semibold text-stone-800 dark:text-stone-100">
          {book.title}
        </p>
        <p className="text-sm text-stone-500">{book.author}</p>

        <div className="mt-2 flex flex-wrap gap-1">
          {book.genres.map((g) => (
            <span
              key={g}
              className="rounded-full bg-secondary-100 px-2 py-0.5 text-xs font-medium text-secondary-700 dark:bg-secondary-700/30 dark:text-secondary-100"
            >
              #{g}
            </span>
          ))}
        </div>

        {/* 추천 이유 */}
        <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-primary-50 p-2.5 text-xs text-primary-700 dark:bg-primary/10 dark:text-primary-300">
          <Sparkles size={14} className="mt-0.5 shrink-0" />
          <span>{book.reason}</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <MemberAvatar member={book.forMember} size="sm" showName />
          <Button variant="secondary" className="px-4 py-2 text-sm">
            서재에 담기
          </Button>
        </div>
      </div>
    </Card>
  );
}
