import { NextResponse } from "next/server";
import type { Genre } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/data";

interface UpdateSettingsBody {
  nickname?: string;
  genres?: Genre[];
  monthlyReadingGoal?: number;
  notifications?: {
    activity?: boolean;
    comment?: boolean;
    recommendation?: boolean;
    goal?: boolean;
  };
  darkMode?: boolean;
  fontSize?: string;
}

/**
 * PUT /api/settings
 * 현재 사용자의 프로필(닉네임) + 선호도(장르/목표/알림/UI) 저장.
 */
export async function PUT(request: Request) {
  let body: UpdateSettingsBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const userId = await getCurrentUserId();
  const n = body.notifications ?? {};

  // 닉네임(프로필) 업데이트
  if (typeof body.nickname === "string" && body.nickname.trim()) {
    await prisma.user.update({
      where: { id: userId },
      data: { nickname: body.nickname.trim() },
    });
  }

  // 선호도는 1:1 이므로 upsert
  const prefData = {
    genres: body.genres ?? [],
    monthlyReadingGoal: body.monthlyReadingGoal ?? 3,
    activityNotificationsEnabled: n.activity ?? true,
    commentNotificationsEnabled: n.comment ?? true,
    recommendationNotificationsEnabled: n.recommendation ?? true,
    goalNotificationsEnabled: n.goal ?? true,
    darkMode: body.darkMode ?? false,
    fontSize: body.fontSize ?? "normal",
  };

  await prisma.preference.upsert({
    where: { userId },
    create: { userId, ...prefData },
    update: prefData,
  });

  return NextResponse.json({ ok: true });
}
