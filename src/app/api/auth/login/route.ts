import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyPassword,
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth";

interface LoginBody {
  loginId?: string;
  password?: string;
}

/** POST /api/auth/login — 아이디/비밀번호 검증 후 세션 쿠키 설정 */
export async function POST(request: Request) {
  let body: LoginBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const loginId = body.loginId?.trim().toLowerCase();
  const password = body.password ?? "";
  if (!loginId || !password) {
    return NextResponse.json(
      { error: "아이디와 비밀번호를 입력해 주세요." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({ where: { loginId } });
  // 사용자 부재/비밀번호 불일치 모두 동일 메시지 (계정 존재 여부 노출 방지)
  if (!user?.passwordHash || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json(
      { error: "아이디 또는 비밀번호가 올바르지 않아요." },
      { status: 401 },
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, createSessionToken(user.id), sessionCookieOptions);
  return res;
}
