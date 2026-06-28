interface PageContainerProps {
  title: string;
  description?: string;
  emoji?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * 메인 콘텐츠 페이지 공통 컨테이너
 * 제목/설명 헤더 + 최대 폭 래퍼
 */
export function PageContainer({
  title,
  description,
  emoji,
  action,
  children,
}: PageContainerProps) {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-stone-800 dark:text-stone-100 sm:text-3xl">
              {title} {emoji}
            </h1>
            {description && (
              <p className="mt-1 text-stone-500 dark:text-stone-400">
                {description}
              </p>
            )}
          </div>
          {action}
        </header>
        {children}
      </div>
    </div>
  );
}
