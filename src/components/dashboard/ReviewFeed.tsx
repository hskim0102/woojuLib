import { MessageSquare, Heart, EyeOff } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/Card";
import { MemberAvatar } from "@/components/ui/MemberAvatar";
import { RatingStars } from "@/components/ui/RatingStars";
import type { ReviewFeedItem } from "@/types/dashboard";

interface ReviewFeedProps {
  reviews: ReviewFeedItem[];
}

/**
 * [우측] 가족들의 최신 감상평 / 생각 피드
 */
export function ReviewFeed({ reviews }: ReviewFeedProps) {
  return (
    <Card>
      <SectionTitle
        icon={<MessageSquare size={22} className="text-secondary" />}
        title="가족들의 생각"
      />
      <ul className="flex flex-col divide-y divide-stone-100 dark:divide-stone-700">
        {reviews.map((review) => (
          <ReviewFeedCard key={review.id} review={review} />
        ))}
      </ul>
    </Card>
  );
}

/** 개별 감상평 카드 */
function ReviewFeedCard({ review }: { review: ReviewFeedItem }) {
  return (
    <li className="py-4 first:pt-0 last:pb-0">
      <div className="mb-2 flex items-center justify-between">
        <MemberAvatar member={review.author} size="sm" showName />
        <span className="text-xs text-stone-400">{review.createdAt}</span>
      </div>

      <div className="mb-1 flex items-center gap-2">
        <span className="text-sm font-semibold text-stone-700 dark:text-stone-200">
          「{review.bookTitle}」
        </span>
        <RatingStars value={review.rating} size={14} />
      </div>

      {/* 감상 본문 (스포일러 시 블러 처리) */}
      {review.hasSpoiler ? (
        <p className="group relative cursor-pointer text-sm leading-relaxed text-stone-600 dark:text-stone-300">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-red-400">
            <EyeOff size={12} /> 스포일러 · 눌러서 보기
          </span>
          <span className="mt-1 block select-none blur-sm transition group-hover:blur-none group-focus:blur-none">
            {review.content}
          </span>
        </p>
      ) : (
        <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-300">
          {review.content}
        </p>
      )}

      {/* 상호작용 바 */}
      <div className="mt-3 flex items-center gap-4 text-stone-400">
        <button className="flex items-center gap-1 text-sm transition-colors hover:text-member-mom">
          <Heart size={16} />
          {review.likeCount}
        </button>
        <button className="flex items-center gap-1 text-sm transition-colors hover:text-secondary">
          <MessageSquare size={16} />
          {review.commentCount}
        </button>
      </div>
    </li>
  );
}
