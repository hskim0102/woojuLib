import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * 디자인 시스템 기본 카드 컨테이너
 * 흰 배경 + 둥근 모서리(rounded-2xl) + 은은한 그림자
 */
export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-shadow",
        "dark:border-stone-700 dark:bg-stone-800",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface SectionTitleProps {
  icon?: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}

/** 카드/섹션 상단 제목 영역 */
export function SectionTitle({ icon, title, action }: SectionTitleProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="flex items-center gap-2 text-xl font-semibold text-stone-800 dark:text-stone-100">
        {icon}
        {title}
      </h2>
      {action}
    </div>
  );
}
