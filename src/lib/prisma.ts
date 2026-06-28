import { PrismaClient } from "@prisma/client";

/**
 * Prisma 클라이언트 싱글톤.
 * Next.js 개발 모드의 HMR 로 인해 인스턴스가 중복 생성되는 것을 방지한다.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
