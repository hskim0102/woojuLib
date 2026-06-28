import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, verifyPassword, hashPassword } from "@/lib/auth";

interface ChangePasswordBody {
  currentPassword?: string;
  newPassword?: string;
}

/**
 * PUT /api/settings/password
 * 현재 비밀번호 확인 후 새 비밀번호로 변경.
 */
export async function PUT(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }

  let body: ChangePasswordBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const currentPassword = body.currentPassword ?? "";
  const newPassword = body.newPassword ?? "";

  if (newPassword.length < 4) {
    return NextResponse.json(
      { error: "새 비밀번호는 4자 이상이어야 해요." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.passwordHash || !verifyPassword(currentPassword, user.passwordHash)) {
    return NextResponse.json(
      { error: "현재 비밀번호가 올바르지 않아요." },
      { status: 400 },
    );
  }

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: hashPassword(newPassword) },
  });

  return NextResponse.json({ ok: true });
}
