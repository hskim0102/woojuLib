import { cn } from "@/lib/utils";
import type { FamilyMember, MemberKey } from "@/types/dashboard";

/** 구성원 키 → ring 색상 (Tailwind safelist 대신 명시적 매핑) */
const RING_COLOR: Record<MemberKey, string> = {
  mom: "ring-member-mom",
  dad: "ring-member-dad",
  son: "ring-member-son",
  daughter: "ring-member-daughter",
};

const SIZE = {
  sm: "h-8 w-8 text-base",
  md: "h-10 w-10 text-lg",
  lg: "h-14 w-14 text-2xl",
};

interface MemberAvatarProps {
  member: FamilyMember;
  size?: keyof typeof SIZE;
  showName?: boolean;
}

/**
 * 가족 구성원 아바타 (구성원 컬러 링 + 이모지)
 */
export function MemberAvatar({
  member,
  size = "md",
  showName = false,
}: MemberAvatarProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-stone-100 ring-2 ring-offset-2",
          "dark:bg-stone-700 dark:ring-offset-stone-800",
          RING_COLOR[member.memberKey],
          SIZE[size],
        )}
        aria-label={`${member.name}의 프로필`}
      >
        <span>{member.emoji}</span>
      </div>
      {showName && (
        <span className="text-sm font-medium text-stone-700 dark:text-stone-200">
          {member.name}
        </span>
      )}
    </div>
  );
}
