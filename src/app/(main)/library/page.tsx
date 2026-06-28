import Link from "next/link";
import { Plus } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { LibraryView } from "@/components/library/LibraryView";
import { getLibraryBooks, getCurrentUserId } from "@/lib/data";

/** 내 서재 — 내가 읽은/읽는/읽고 싶은 책 */
export default async function LibraryPage() {
  const [books, currentUserId] = await Promise.all([
    getLibraryBooks("mine"),
    getCurrentUserId(),
  ]);

  return (
    <PageContainer
      title="내 서재"
      emoji="📚"
      description="내가 담아둔 책들을 상태별로 모아봤어요."
      action={
        <Link href="/reading-log/new" className="hidden sm:block">
          <Button>
            <Plus size={18} />책 추가
          </Button>
        </Link>
      }
    >
      <LibraryView
        books={books}
        currentUserId={currentUserId}
        showReader={false}
        emptyText="아직 이 상태의 책이 없어요. 새 책을 추가해 보세요."
      />
    </PageContainer>
  );
}
