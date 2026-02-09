import { AIGateway } from "@/domain/session/ports";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function withDelayAndFailure(inner: AIGateway): AIGateway {
  return {
    async reply(messages) {
      const min = Number(process.env.AI_MIN_DELAY_MS ?? 800);
      const max = Number(process.env.AI_MAX_DELAY_MS ?? 1600);
      const failRate = Number(process.env.AI_FAILURE_RATE ?? 0.2);

      const delay = Math.floor(min + Math.random() * (max - min));
      await sleep(delay);

      if (Math.random() < failRate) {
        throw new Error("Simulated AI provider failure");
      }

      return inner.reply(messages);
    },
  };
}
