import { SessionRepository } from "@/domain/session/ports";

export async function listSessions(repo: SessionRepository) {
  return repo.listSessions();
}
