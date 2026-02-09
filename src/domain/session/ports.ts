import { Session } from "./Session";
import { Message } from "./Message";

export interface SessionRepository {
  createSession(title: string): Promise<Session>;
  listSessions(): Promise<Session[]>;
  getSession(id: string): Promise<Session | null>;
  getMessages(sessionId: string): Promise<Message[]>;
  addMessage(sessionId: string, role: "user" | "assistant", content: string): Promise<Message>;
}

export interface AIGateway {
  reply(messages: { role: "user" | "assistant"; content: string }[]): Promise<string>;
}
