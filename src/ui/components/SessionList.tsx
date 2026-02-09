"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type Session = { id: string; title: string; createdAt: string };

export function SessionList() {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");

  const sessionsQ = useQuery({
    queryKey: ["sessions"],
    queryFn: async (): Promise<Session[]> => {
      const res = await fetch("/api/sessions");
      if (!res.ok) throw new Error("Failed to load sessions");
      return res.json();
    },
  });

  const createM = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Failed to create");
      return data;
    },
    onSuccess: () => {
      setTitle("");
      qc.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Sessions</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Create a session, then open it to chat.
        </p>
      </div>

      <div className="flex gap-2">
        <input
          className="border rounded px-3 py-2 flex-1 dark:bg-black dark:border-gray-700"
          placeholder="Session title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="border rounded px-3 py-2 disabled:opacity-50 dark:border-gray-700"
          disabled={createM.isPending}
          onClick={() => createM.mutate()}
        >
          {createM.isPending ? "Creating..." : "Create"}
        </button>
      </div>

      {createM.isError && (
        <div className="text-sm text-red-600">{(createM.error as Error).message}</div>
      )}

      {sessionsQ.isLoading && <div>Loading...</div>}
      {sessionsQ.isError && <div className="text-red-600">{(sessionsQ.error as Error).message}</div>}

      <ul className="space-y-2">
        {(sessionsQ.data ?? []).map((s) => (
          <li key={s.id} className="border rounded p-3 dark:border-gray-700">
            <div className="font-medium">{s.title}</div>
            <div className="text-xs text-gray-500">{new Date(s.createdAt).toLocaleString()}</div>
            <Link className="underline text-sm" href={`/sessions/${s.id}`}>
              Open
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
