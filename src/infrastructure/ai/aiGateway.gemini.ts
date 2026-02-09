import { AIGateway } from "@/domain/session/ports";
import { makeGemini } from "./geminiClient";

export const aiGatewayGemini: AIGateway = {
  async reply(messages) {
    const genAI = makeGemini();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    const res = await model.generateContent(prompt);
    return res.response.text();
  },
};