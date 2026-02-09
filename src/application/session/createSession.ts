import { SessionRepository } from "@/domain/session/ports";
import { ValidationError } from "@/domain/session/errors";

export async function createSession(repo: SessionRepository, title?: string) {
  const t = (title ?? "").trim();
  if (!t) throw new ValidationError("Title is required");
  return repo.createSession(t);
}
