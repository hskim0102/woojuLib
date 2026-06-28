/** 표지 플레이스홀더 색상 팔레트 (design_system 계열) */
const COVER_PALETTE = [
  "#8B5CF6", // violet
  "#FB7185", // rose
  "#3B82F6", // blue
  "#14B8A6", // teal
  "#F59E0B", // amber
  "#F472B6", // pink
  "#6D28D9", // deep violet
  "#0D9488", // deep teal
];

/**
 * 문자열(책 제목/id)로부터 결정적(deterministic) 표지 색상을 만든다.
 * DB 에 표지 이미지가 없을 때 일관된 색을 보여주기 위함.
 */
export function colorForSeed(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return COVER_PALETTE[Math.abs(hash) % COVER_PALETTE.length];
}
