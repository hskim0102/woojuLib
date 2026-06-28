import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "crypto";
import { readFileSync } from "fs";

/** node 단독 실행 시 .env 로드 */
function loadEnv() {
  try {
    const txt = readFileSync(new URL("../.env", import.meta.url), "utf8");
    for (const line of txt.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
    }
  } catch {}
}
loadEnv();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const prisma = new PrismaClient();
const NEW_PASSWORD = "1234";

/** 데이터는 그대로 두고 모든 사용자 비밀번호만 1234 로 초기화 */
async function main() {
  const users = await prisma.user.findMany({ select: { id: true, nickname: true } });
  for (const u of users) {
    await prisma.user.update({
      where: { id: u.id },
      data: { passwordHash: hashPassword(NEW_PASSWORD) },
    });
    console.log(`🔑 ${u.nickname} 비밀번호 → ${NEW_PASSWORD}`);
  }
  console.log(`✅ 총 ${users.length}명 비밀번호 초기화 완료`);
}

main()
  .catch((e) => {
    console.error("❌ 실패:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
