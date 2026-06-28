import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import type { ReadingStatus } from "@/types/reading-log";

interface UpdateBody {
  status?: ReadingStatus;
  pagesRead?: number;
  rating?: number;
}

/** 로그가 현재 사용자 소유인지 확인 (아니면 null) */
async function getOwnedLog(id: string, userId: string) {
  const log = await prisma.readingLog.findUnique({ where: { id } });
  if (!log || log.userId !== userId) return null;
  return log;
}

/** PATCH /api/reading-logs/[id] — 상태/진행/별점 수정 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }
  const log = await getOwnedLog(id, userId);
  if (!log) {
    return NextResponse.json(
      { error: "수정할 권한이 없거나 기록을 찾을 수 없어요." },
      { status: 404 },
    );
  }

  let body: UpdateBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (body.status) {
    data.status = body.status;
    // 완독으로 바뀌면 완료일 기록, 다른 상태로 바뀌면 해제
    if (body.status === "COMPLETED" && !log.completedAt) {
      data.completedAt = new Date();
    } else if (body.status !== "COMPLETED") {
      data.completedAt = null;
    }
  }
  if (body.pagesRead != null) data.pagesRead = body.pagesRead;
  if (body.rating != null) data.rating = body.rating || null;

  const updated = await prisma.readingLog.update({ where: { id }, data });
  return NextResponse.json({ id: updated.id });
}

/** DELETE /api/reading-logs/[id] — 서재에서 제거 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }
  const log = await getOwnedLog(id, userId);
  if (!log) {
    return NextResponse.json(
      { error: "삭제할 권한이 없거나 기록을 찾을 수 없어요." },
      { status: 404 },
    );
  }

  await prisma.readingLog.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
