import { NextResponse } from "next/server";
import { sessionRepoPrisma } from "@/infrastructure/db/sessionRepo.prisma";
import { createSession } from "@/application/session/createSession";
import { listSessions } from "@/application/session/listSessions";
import { SentryLike } from "@/infrastructure/monitoring/sentryLike";

export async function GET() {
  try {
    const data = await listSessions(sessionRepoPrisma);
    return NextResponse.json(data);
  } catch (e) {
    SentryLike.captureException(e, { tags: { route: "GET /api/sessions" } });
    return NextResponse.json({ error: "Failed to load sessions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const session = await createSession(sessionRepoPrisma, body.title);
    return NextResponse.json(session, { status: 201 });
  } catch (e: any) {
    SentryLike.captureException(e, { tags: { route: "POST /api/sessions" } });
    const status = e?.code === "VALIDATION_ERROR" ? 400 : 500;
    return NextResponse.json({ error: e?.message ?? "Failed to create session" }, { status });
  }
}
