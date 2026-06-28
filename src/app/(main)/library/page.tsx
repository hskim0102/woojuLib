import Link from "next/link";
import { Plus } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { LibraryView } from "@/components/library/LibraryView";
import { getLibraryBooks } from "@/lib/data";

/** 내 서재 페이지 — 읽는 중 / 읽고 싶은 / 읽은 책 상태별 분류 */
export default async function LibraryPage() {
  const books = await getLibraryBooks();
  return (
    <PageContainer
      title="내 서재"
      emoji="📚"
      description="우리 가족이 담아둔 책들을 상태별로 모아봤어요."
      action={
        <Link href="/reading-log/new" className="hidden sm:block">
          <Button>
            <Plus size={18} />책 추가
          </Button>
        </Link>
      }
    >
      <LibraryView books={books} />
    </PageContainer>
  );
}
