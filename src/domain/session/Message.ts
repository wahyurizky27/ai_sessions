export type Role = "user" | "assistant";

export type Message = {
  id: string;
  sessionId: string;
  role: Role;
  content: string;
  createdAt: Date;
};
