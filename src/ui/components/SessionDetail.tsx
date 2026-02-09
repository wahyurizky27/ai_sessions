"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type Message = { id: string; role: "user" | "assistant"; content: string; createdAt: string };
type Detail = { session: { id: string; title: string }; messages: Message[] };

export function SessionDetail({ sessionId }: { sessionId: string }) {
  const qc = useQueryClient();
  const [text, setText] = useState("");

  const detailQ = useQuery({
    queryKey: ["session", sessionId],
    queryFn: async (): Promise<Detail> => {
      const res = await fetch(`/api/sessions/${sessionId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Failed to load session");
      return data;
    },
  });

  const sendM = useMutation({
    mutationFn: async (messageText: string) => {
      const res = await fetch(`/api/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: messageText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Failed to send message");
      return data;
    },
    onMutate: async (messageText) => {
      const msg: Message = {
        id: `temp-${Date.now()}`,
        role: "user",
        content: messageText,
        createdAt: new Date().toISOString(),
      };
      setText("");

      await qc.cancelQueries({ queryKey: ["session", sessionId] });
      const prev = qc.getQueryData<Detail>(["session", sessionId]);
      if (prev) {
        qc.setQueryData<Detail>(["session", sessionId], {
          ...prev,
          messages: [...prev.messages, msg],
        });
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["session", sessionId], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["session", sessionId] });
    },
  });

  if (detailQ.isLoading) return <div>Loading...</div>;
  if (detailQ.isError) return <div className="text-red-600">{(detailQ.error as Error).message}</div>;

  const { session, messages } = detailQ.data!;
  const canSend = text.trim().length > 0 && !sendM.isPending;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{session.title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          AI reply has random delay + failure (simulate real API).
        </p>
      </div>

      <div className="border rounded p-3 space-y-3 dark:border-gray-700">
        {messages.map((m) => (
          <div key={m.id} className="text-sm">
            <span className="font-semibold">{m.role}:</span>{" "}
            <span className="whitespace-pre-wrap">{m.content}</span>
          </div>
        ))}
        {sendM.isPending && <div className="text-xs text-gray-500">AI is thinking...</div>}
      </div>

      {sendM.isError && (
        <div className="text-sm text-red-600">
          {(sendM.error as Error).message} (try send again)
        </div>
      )}

      <div className="flex gap-2">
        <input
          className="border rounded px-3 py-2 flex-1 dark:bg-black dark:border-gray-700"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (sendM.isError) sendM.reset();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (!canSend) return;
              sendM.mutate(text);
            }
          }}
        />

        <button
          className="border rounded px-3 py-2 disabled:opacity-50 dark:border-gray-700"
          disabled={!canSend}
          onClick={() => {
            if (!canSend) return;
            sendM.mutate(text);
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
