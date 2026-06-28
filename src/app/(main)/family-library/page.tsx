import { PageContainer } from "@/components/layout/PageContainer";
import { LibraryView } from "@/components/library/LibraryView";
import { getLibraryBooks, getCurrentUserId } from "@/lib/data";

/** 가족 서재 — 가족 구성원 모두가 읽은/읽는 책 */
export default async function FamilyLibraryPage() {
  const [books, currentUserId] = await Promise.all([
    getLibraryBooks("family"),
    getCurrentUserId(),
  ]);

  return (
    <PageContainer
      title="가족 서재"
      emoji="👨‍👩‍👧‍👦"
      description="우리 가족이 함께 읽어온 책들을 한곳에서 모아봤어요."
    >
      <LibraryView
        books={books}
        currentUserId={currentUserId}
        showReader
        emptyText="아직 가족이 담은 책이 없어요."
      />
    </PageContainer>
  );
}
