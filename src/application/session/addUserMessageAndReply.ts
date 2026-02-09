import { AIGateway, SessionRepository } from "@/domain/session/ports";
import { NotFoundError, ValidationError } from "@/domain/session/errors";

export async function addUserMessageAndReply(
  repo: SessionRepository,
  ai: AIGateway,
  sessionId: string,
  userContent: string
) {
  const content = userContent.trim();
  if (!content) throw new ValidationError("Message cannot be empty");

  const session = await repo.getSession(sessionId);
  if (!session) throw new NotFoundError("Session not found");

  await repo.addMessage(sessionId, "user", content);

  const thread = await repo.getMessages(sessionId);
  const aiText = await ai.reply(thread.map((m) => ({ role: m.role as any, content: m.content })));
  const assistantMsg = await repo.addMessage(sessionId, "assistant", aiText);

  return assistantMsg;
}
