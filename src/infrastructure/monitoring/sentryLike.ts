type CaptureContext = { tags?: Record<string, string>; extra?: unknown };

export const SentryLike = {
  captureException(err: unknown, ctx?: CaptureContext) {
    console.error("[SentryLike] captured:", err, ctx ?? {});
  },
};
