import { NextResponse } from "next/server";
import { sessionRepoPrisma } from "@/infrastructure/db/sessionRepo.prisma";
import { getSessionDetail } from "@/application/session/getSessionDetail";
import { SentryLike } from "@/infrastructure/monitoring/sentryLike";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing session id" }, { status: 400 });
    }

    const data = await getSessionDetail(sessionRepoPrisma, id);
    return NextResponse.json(data);
  } catch (e: any) {
    SentryLike.captureException(e, { tags: { route: "GET /api/sessions/:id" } });
    const status = e?.code === "NOT_FOUND" ? 404 : 500;
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status });
  }
}
