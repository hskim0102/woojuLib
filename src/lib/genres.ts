import type { Genre } from "@prisma/client";

/** Genre enum → 한국어 라벨 */
export const GENRE_LABEL: Record<Genre, string> = {
  NOVEL: "소설",
  SELF_HELP: "자기계발",
  ESSAY: "에세이",
  FANTASY: "판타지",
  ADVENTURE: "모험",
  MYSTERY: "추리",
  SCIENCE_FICTION: "SF",
  ROMANCE: "로맨스",
  ECONOMICS: "경제",
  BUSINESS: "비즈니스",
  HISTORY: "역사",
  HUMANITIES: "인문학",
  YOUNG_ADULT: "청소년",
  CHILDREN: "어린이",
  CLASSIC: "고전",
  WEB_NOVEL: "웹소설",
  MARTIAL_ARTS: "무협",
  BIOGRAPHY: "전기",
  POETRY: "시",
  COOKING: "요리",
  ART_DESIGN: "미술",
  TRAVEL: "여행",
  SCIENCE: "과학",
  TECHNOLOGY: "기술",
  PSYCHOLOGY: "심리학",
  EDUCATION: "교육",
  RELIGION: "종교",
  SPORTS: "스포츠",
  OTHERS: "기타",
};

/** enum 배열 → 한국어 라벨 배열 */
export function genreLabels(genres: Genre[]): string[] {
  return genres.map((g) => GENRE_LABEL[g] ?? g);
}
