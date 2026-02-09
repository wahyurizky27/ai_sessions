import { prisma } from "./prisma";
import { SessionRepository } from "@/domain/session/ports";
import type { Message } from "@/domain/session/Message";

export const sessionRepoPrisma: SessionRepository = {
  async createSession(title) {
    const s = await prisma.session.create({ data: { title } });
    return { ...s };
  },

  async listSessions() {
    const list = await prisma.session.findMany({ orderBy: { createdAt: "desc" } });
    return list;
  },

  async getSession(id) {
    const s = await prisma.session.findUnique({ where: { id } });
    return s;
  },

  async getMessages(sessionId): Promise<Message[]> {
    const rows = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
    });

    // Prisma enum Role will align with "user" | "assistant"
    return rows as unknown as Message[];
  },

  async addMessage(sessionId, role, content) {
    return prisma.message.create({ data: { sessionId, role, content } });
  },
};
