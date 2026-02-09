import { describe, it, expect } from "vitest";
import { addUserMessageAndReply } from "./addUserMessageAndReply";
import type { AIGateway, SessionRepository } from "@/domain/session/ports";

function makeRepo(): SessionRepository {
  const sessions = new Map<string, { id: string; title: string; createdAt: Date }>();
  const messages: any[] = [];

  return {
    async createSession(title) {
      const s = { id: "s1", title, createdAt: new Date() };
      sessions.set(s.id, s);
      return s;
    },
    async listSessions() {
      return Array.from(sessions.values());
    },
    async getSession(id) {
      return sessions.get(id) ?? null;
    },
    async getMessages(sessionId) {
      return messages.filter((m) => m.sessionId === sessionId);
    },
    async addMessage(sessionId, role, content) {
      const m = { id: `m${messages.length + 1}`, sessionId, role, content, createdAt: new Date() };
      messages.push(m);
      return m;
    },
  };
}

describe("addUserMessageAndReply", () => {
  it("stores user message then assistant reply", async () => {
    const repo = makeRepo();
    await repo.createSession("Test");

    const ai: AIGateway = {
      async reply(msgs) {
        // verify thread is passed
        expect(msgs[msgs.length - 1].role).toBe("user");
        return "Hello from AI";
      },
    };

    const assistantMsg = await addUserMessageAndReply(repo, ai, "s1", "Hi");
    expect(assistantMsg.role).toBe("assistant");
    expect(assistantMsg.content).toBe("Hello from AI");

    const thread = await repo.getMessages("s1");
    expect(thread).toHaveLength(2);
    expect(thread[0].role).toBe("user");
    expect(thread[1].role).toBe("assistant");
  });
});
