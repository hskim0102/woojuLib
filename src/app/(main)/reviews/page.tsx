import { PageContainer } from "@/components/layout/PageContainer";
import { ReviewFeed } from "@/components/dashboard/ReviewFeed";
import { getReviewFeed } from "@/lib/data";

/** 리뷰 페이지 — 가족 전체의 감상평 모아보기 */
export default async function ReviewsPage() {
  const reviews = await getReviewFeed(50);
  return (
    <PageContainer
      title="가족 리뷰"
      emoji="💬"
      description="가족들이 남긴 책 감상평을 한곳에서 확인해요."
    >
      <ReviewFeed reviews={reviews} />
    </PageContainer>
  );
}
