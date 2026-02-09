import { NextResponse } from "next/server";
import { sessionRepoPrisma } from "@/infrastructure/db/sessionRepo.prisma";
import { addUserMessageAndReply } from "@/application/session/addUserMessageAndReply";
import { aiGatewayGemini } from "@/infrastructure/ai/aiGateway.gemini";
import { withDelayAndFailure } from "@/infrastructure/ai/aiGateway.mockDelayFail";
import { SentryLike } from "@/infrastructure/monitoring/sentryLike";

const ai = aiGatewayGemini

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing session id" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    
    console.log("📨 Received body:", body);
    console.log("📝 Content value:", body.content);
    console.log("📏 Content type:", typeof body.content);
    
    const assistantMsg = await addUserMessageAndReply(
      sessionRepoPrisma,
      ai,
      id,
      body.content ?? ""
    );

    return NextResponse.json(assistantMsg, { status: 201 });
  } catch (e: any) {
    // 🔍 DEBUG: Log the error
    console.error("❌ Error:", e);
    
    const status =
        e?.code === "VALIDATION_ERROR" ? 400 :
        e?.code === "NOT_FOUND" ? 404 :
        502;

    const isExpected = status === 400 || status === 404;
    if (!isExpected) {
        SentryLike.captureException(e, { tags: { route: "POST /api/sessions/:id/messages" } });
    }

    return NextResponse.json({ error: e?.message ?? "Failed to send message" }, { status });
  }
}
