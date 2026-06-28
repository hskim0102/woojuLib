import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "crypto";
import { readFileSync } from "fs";

/** node 단독 실행 시 .env 를 process.env 로 로드 */
function loadEnv() {
  try {
    const txt = readFileSync(new URL("../.env", import.meta.url), "utf8");
    for (const line of txt.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
    }
  } catch {
    /* .env 없으면 무시 */
  }
}
loadEnv();

const prisma = new PrismaClient();

/**
 * 카카오 도서 검색으로 표지/ISBN/출판정보 조회.
 * 제목이 가장 잘 맞는 결과를 고른다. 실패하면 null.
 */
async function fetchKakaoMeta(title) {
  const key = process.env.KAKAO_REST_API_KEY;
  if (!key) return null;
  try {
    const url = `https://dapi.kakao.com/v3/search/book?target=title&size=5&query=${encodeURIComponent(title)}`;
    const res = await fetch(url, { headers: { Authorization: `KakaoAK ${key}` } });
    if (!res.ok) return null;
    const data = await res.json();
    const docs = data.documents ?? [];
    const pick = docs.find((d) => d.title.includes(title)) ?? docs[0];
    if (!pick) return null;
    const isbn13 = (pick.isbn || "").split(" ").find((s) => s.length === 13);
    return {
      coverImageUrl: pick.thumbnail || null,
      isbn: isbn13 || null,
      publisher: pick.publisher || null,
      publicationDate: pick.datetime ? new Date(pick.datetime) : null,
    };
  } catch {
    return null;
  }
}

/** src/lib/auth.ts 의 hashPassword 와 동일 방식 ("salt:hash") */
function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/** 데모용 공통 비밀번호 */
const DEMO_PASSWORD = "1234";

/**
 * 초기 시드 데이터: 우주네 가족 (샛별/호섭/우주/유주)
 * 재실행 가능하도록 기존 데이터를 먼저 정리한다.
 */
async function main() {
  // 의존성 역순으로 정리
  await prisma.readingSession.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.readingLog.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.userMonthlyStats.deleteMany();
  await prisma.familyMonthlyStats.deleteMany();
  await prisma.preference.deleteMany();
  await prisma.familyInvite.deleteMany();
  await prisma.book.deleteMany();
  // User <-> Family 순환참조 해제 후 삭제
  await prisma.user.updateMany({ data: { familyId: null } });
  await prisma.family.deleteMany();
  await prisma.user.deleteMany();

  // 1) 가족 생성자(샛별)를 먼저 만든다 (familyId 없이)
  const mom = await prisma.user.create({
    data: {
      loginId: "satbyul",
      email: "satbyul@wooju.family",
      nickname: "샛별",
      role: "PARENT",
      birthYear: 1986,
      passwordHash: hashPassword(DEMO_PASSWORD),
    },
  });

  // 2) 가족 생성
  const family = await prisma.family.create({
    data: {
      name: "우주네 가족",
      description: "온 가족이 함께 읽고 나누는 우리집 도서관 📚",
      inviteCode: "WOOJU2026",
      createdById: mom.id,
    },
  });

  // 3) 샛별을 가족에 편입 + 나머지 구성원 생성
  await prisma.user.update({
    where: { id: mom.id },
    data: { familyId: family.id },
  });

  const dad = await prisma.user.create({
    data: { loginId: "hoseop", email: "hoseop@wooju.family", nickname: "호섭", role: "PARENT", familyId: family.id, birthYear: 1984, passwordHash: hashPassword(DEMO_PASSWORD) },
  });
  const son = await prisma.user.create({
    data: { loginId: "wooju", email: "wooju@wooju.family", nickname: "우주", role: "CHILD", familyId: family.id, birthYear: 2018, passwordHash: hashPassword(DEMO_PASSWORD) },
  });
  const daughter = await prisma.user.create({
    data: { loginId: "yuju", email: "yuju@wooju.family", nickname: "유주", role: "CHILD", familyId: family.id, birthYear: 2019, passwordHash: hashPassword(DEMO_PASSWORD) },
  });

  // 4) 선호도/목표
  await prisma.preference.createMany({
    data: [
      { userId: mom.id, genres: ["NOVEL", "SELF_HELP", "ESSAY"], monthlyReadingGoal: 5 },
      { userId: dad.id, genres: ["ECONOMICS", "BUSINESS", "HISTORY"], monthlyReadingGoal: 3 },
      { userId: son.id, genres: ["FANTASY", "ADVENTURE", "SCIENCE"], monthlyReadingGoal: 8 },
      { userId: daughter.id, genres: ["NOVEL", "CHILDREN", "CLASSIC"], monthlyReadingGoal: 4 },
    ],
  });

  // 5) 책 생성
  const bookData = [
    { key: "harry1", title: "해리포터와 마법사의 돌", author: "J.K. 롤링", publisher: "문학수첩", pageCount: 328, genres: ["FANTASY", "ADVENTURE"] },
    { key: "harry2", title: "해리포터와 비밀의 방", author: "J.K. 롤링", publisher: "문학수첩", pageCount: 360, genres: ["FANTASY", "ADVENTURE"] },
    { key: "rich", title: "부의 추월차선", author: "엠제이 드마코", publisher: "토트", pageCount: 412, genres: ["ECONOMICS", "SELF_HELP"] },
    { key: "store", title: "불편한 편의점", author: "김호연", publisher: "나무옆의자", pageCount: 280, genres: ["NOVEL"] },
    { key: "dog", title: "강아지똥", author: "권정생", publisher: "길벗어린이", pageCount: 40, genres: ["CHILDREN"] },
    { key: "prince", title: "어린 왕자", author: "생텍쥐페리", publisher: "열린책들", pageCount: 136, genres: ["NOVEL", "CLASSIC"] },
    { key: "sapiens", title: "사피엔스", author: "유발 하라리", publisher: "김영사", pageCount: 636, genres: ["HUMANITIES", "HISTORY"] },
    { key: "cosmos", title: "코스모스", author: "칼 세이건", publisher: "사이언스북스", pageCount: 520, genres: ["SCIENCE"] },
    { key: "demian", title: "데미안", author: "헤르만 헤세", publisher: "민음사", pageCount: 240, genres: ["NOVEL", "CLASSIC"] },
    { key: "money", title: "돈의 속성", author: "김승호", publisher: "스노우폭스북스", pageCount: 308, genres: ["ECONOMICS", "SELF_HELP"] },
    { key: "midnight", title: "미드나잇 라이브러리", author: "매트 헤이그", publisher: "인플루엔셜", pageCount: 416, genres: ["NOVEL", "FANTASY"] },
  ];

  const books = {};
  let coverCount = 0;
  for (const b of bookData) {
    const meta = await fetchKakaoMeta(b.title); // 카카오에서 실제 표지 조회
    if (meta?.coverImageUrl) coverCount++;
    const created = await prisma.book.create({
      data: {
        title: b.title,
        author: b.author,
        publisher: meta?.publisher ?? b.publisher,
        pageCount: b.pageCount,
        genres: b.genres,
        isbn: meta?.isbn ?? null,
        coverImageUrl: meta?.coverImageUrl ?? null,
        publicationDate: meta?.publicationDate ?? null,
        externalSource: meta?.coverImageUrl ? "KAKAO_BOOKS" : "MANUAL",
      },
    });
    books[b.key] = created;
  }

  // 6) 독서 기록 (서재/대시보드용) — 6월 완료분은 이번 달 통계에 잡힘
  const d = (s) => new Date(s);
  await prisma.readingLog.createMany({
    data: [
      // 읽는 중
      { userId: son.id, bookId: books.harry1.id, status: "READING", pagesRead: 210, totalPages: 328, startedAt: d("2026-06-20") },
      { userId: dad.id, bookId: books.rich.id, status: "READING", pagesRead: 95, totalPages: 412, startedAt: d("2026-06-22") },
      { userId: mom.id, bookId: books.store.id, status: "READING", pagesRead: 160, totalPages: 280, startedAt: d("2026-06-18") },
      { userId: daughter.id, bookId: books.dog.id, status: "READING", pagesRead: 24, totalPages: 40, startedAt: d("2026-06-25") },
      // 읽고 싶은
      { userId: daughter.id, bookId: books.prince.id, status: "TO_READ", pagesRead: 0, totalPages: 136 },
      { userId: mom.id, bookId: books.sapiens.id, status: "TO_READ", pagesRead: 0, totalPages: 636 },
      // 완독 (이번 달)
      { userId: son.id, bookId: books.cosmos.id, status: "COMPLETED", pagesRead: 520, totalPages: 520, rating: 5, startedAt: d("2026-06-01"), completedAt: d("2026-06-10"), readingTimeMinutes: 600 },
      { userId: mom.id, bookId: books.midnight.id, status: "COMPLETED", pagesRead: 416, totalPages: 416, rating: 5, startedAt: d("2026-06-02"), completedAt: d("2026-06-12"), readingTimeMinutes: 420 },
      { userId: dad.id, bookId: books.money.id, status: "COMPLETED", pagesRead: 308, totalPages: 308, rating: 4, startedAt: d("2026-06-03"), completedAt: d("2026-06-15"), readingTimeMinutes: 300 },
      { userId: daughter.id, bookId: books.demian.id, status: "COMPLETED", pagesRead: 240, totalPages: 240, rating: 4, startedAt: d("2026-06-05"), completedAt: d("2026-06-20"), readingTimeMinutes: 280 },
    ],
  });

  // 7) 리뷰 (감상평 피드)
  await prisma.review.createMany({
    data: [
      { userId: son.id, bookId: books.harry1.id, rating: 5, hasSpoiler: false, likeCount: 3, commentCount: 2, content: "호그와트에 가고 싶어요! 론이랑 헤르미온느가 친구라서 부러웠어요. 다음 편도 빨리 읽고 싶어요." },
      { userId: daughter.id, bookId: books.demian.id, rating: 4, hasSpoiler: true, likeCount: 2, commentCount: 1, content: "새는 알을 깨고 나온다는 말이 계속 기억에 남아요. 조금 어려웠지만 멋진 책이에요." },
      { userId: mom.id, bookId: books.store.id, rating: 5, hasSpoiler: false, likeCount: 4, commentCount: 0, content: "평범한 사람들의 이야기가 이렇게 따뜻할 수 있다니. 아이들에게도 권해주고 싶은 책이에요." },
    ],
  });

  // 8) 추천 도서
  await prisma.recommendation.createMany({
    data: [
      { bookId: books.harry2.id, recommendedById: mom.id, recommendedToId: son.id, type: "manual", reason: "「해리포터와 마법사의 돌」을 재미있게 읽었어요" },
      { bookId: books.demian.id, recommendedById: mom.id, recommendedToId: daughter.id, type: "ai", reason: "성장 소설을 좋아하는 유주에게 추천해요" },
      { bookId: books.money.id, recommendedById: mom.id, recommendedToId: dad.id, type: "ai", reason: "경제 분야를 즐겨 읽는 호섭님 맞춤 추천" },
      { bookId: books.midnight.id, recommendedById: son.id, recommendedToId: mom.id, type: "manual", reason: "따뜻한 소설을 좋아하는 샛별님께" },
    ],
  });

  // 9) 주간 독서 세션 (2026-06-22 월 ~ 06-28 일, 구성원별 요일별 분)
  //    [월,화,수,목,금,토,일] 분 단위
  const weekDates = [
    "2026-06-22", "2026-06-23", "2026-06-24", "2026-06-25",
    "2026-06-26", "2026-06-27", "2026-06-28",
  ];
  const weekMinutes = {
    [mom.id]: [30, 25, 40, 20, 35, 50, 45],
    [dad.id]: [20, 0, 35, 15, 25, 45, 30],
    [son.id]: [45, 50, 30, 60, 40, 80, 70],
    [daughter.id]: [15, 20, 10, 25, 30, 40, 35],
  };
  const sessionRows = [];
  for (const [userId, minutesByDay] of Object.entries(weekMinutes)) {
    minutesByDay.forEach((minutes, idx) => {
      if (minutes > 0) {
        sessionRows.push({ userId, date: new Date(weekDates[idx]), minutes });
      }
    });
  }
  await prisma.readingSession.createMany({ data: sessionRows });

  console.log(
    `✅ 시드 완료: 가족 4명, 책 11권(표지 ${coverCount}권), 독서기록 10건, 리뷰 3건, 추천 4건, 주간세션 ${sessionRows.length}건`,
  );
}

main()
  .catch((e) => {
    console.error("❌ 시드 실패:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
