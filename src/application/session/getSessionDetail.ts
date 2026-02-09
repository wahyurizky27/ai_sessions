import { SessionRepository } from "@/domain/session/ports";
import { NotFoundError } from "@/domain/session/errors";

export async function getSessionDetail(repo: SessionRepository, id: string) {
  const session = await repo.getSession(id);
  if (!session) throw new NotFoundError("Session not found");
  const messages = await repo.getMessages(id);
  return { session, messages };
}
