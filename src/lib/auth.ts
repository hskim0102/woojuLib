import {
  scryptSync,
  randomBytes,
  timingSafeEqual,
  createHmac,
} from "crypto";
import { cookies } from "next/headers";

/**
 * 경량 세션 인증 (의존성 없이 Node crypto 사용).
 * - 비밀번호: scrypt 해시 ("salt:hash")
 * - 세션: "userId.expiry.HMAC(userId.expiry)" 형태의 서명 토큰을 httpOnly 쿠키에 저장
 *
 * NOTE: 단일 가족 MVP용. 추후 OAuth/NextAuth 도입 시 이 모듈만 교체하면 된다.
 */

export const SESSION_COOKIE = "wooju_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30일(초)

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET 환경변수가 필요합니다.");
  return secret;
}

/** 비밀번호 → "salt:hash" */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/** 비밀번호 검증 (타이밍 안전 비교) */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, 64);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function sign(data: string): string {
  return createHmac("sha256", getSecret()).update(data).digest("hex");
}

/** 세션 토큰 생성 */
export function createSessionToken(userId: string): string {
  const expiry = Date.now() + SESSION_MAX_AGE * 1000;
  const data = `${userId}.${expiry}`;
  return `${data}.${sign(data)}`;
}

/** 세션 토큰 검증 → userId | null */
export function verifySessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, expiry, sig] = parts;
  if (sign(`${userId}.${expiry}`) !== sig) return null;
  if (Date.now() > Number(expiry)) return null;
  return userId;
}

/** 현재 요청의 세션에서 userId 추출 (없으면 null) */
export async function getSessionUserId(): Promise<string | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
  secure: process.env.NODE_ENV === "production",
};
