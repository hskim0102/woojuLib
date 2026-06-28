import type { FamilyMember, MemberKey } from "@/types/dashboard";

/** 닉네임 → 화면 테마(컬러 키 + 이모지) 매핑 */
const THEME_BY_NICKNAME: Record<string, { memberKey: MemberKey; emoji: string }> = {
  샛별: { memberKey: "mom", emoji: "🌸" },
  호섭: { memberKey: "dad", emoji: "📘" },
  우주: { memberKey: "son", emoji: "🚀" },
  유주: { memberKey: "daughter", emoji: "🌷" },
};

/** 등록되지 않은 구성원을 위한 역할 기반 기본값 */
const FALLBACK: Record<string, { memberKey: MemberKey; emoji: string }> = {
  PARENT: { memberKey: "mom", emoji: "🙂" },
  CHILD: { memberKey: "son", emoji: "🧒" },
  GUEST: { memberKey: "dad", emoji: "👤" },
};

/**
 * Prisma User → 프론트엔드 FamilyMember 변환.
 * 표지 색상처럼 화면 표현은 DB 에 없으므로 여기서 파생한다.
 */
export function toFamilyMember(user: {
  id: string;
  nickname: string;
  role?: string;
}): FamilyMember {
  const theme =
    THEME_BY_NICKNAME[user.nickname] ??
    FALLBACK[user.role ?? "GUEST"] ??
    FALLBACK.GUEST;

  return {
    id: user.id,
    name: user.nickname,
    memberKey: theme.memberKey,
    emoji: theme.emoji,
  };
}
