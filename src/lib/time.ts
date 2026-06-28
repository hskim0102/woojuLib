/** Date → "방금 전 / N시간 전 / 어제 / N일 전" 상대 시간 문자열 */
export function formatRelative(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "방금 전";
  if (min < 60) return `${min}분 전`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}시간 전`;
  const day = Math.floor(hour / 24);
  if (day === 1) return "어제";
  if (day < 7) return `${day}일 전`;
  return date.toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
}
