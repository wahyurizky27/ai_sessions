import { prisma } from "./prisma";
import { SessionRepository } from "@/domain/session/ports";

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

  async getMessages(sessionId) {
    return prisma.message.findMany({ where: { sessionId }, orderBy: { createdAt: "asc" } });
  },

  async addMessage(sessionId, role, content) {
    return prisma.message.create({ data: { sessionId, role, content } });
  },
};
