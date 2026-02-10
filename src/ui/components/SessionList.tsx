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
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold mb-2">Chat Sessions</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Create a new session or continue from your previous conversations
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold mb-4">Create New Session</h3>
        <div className="flex gap-3">
          <input
            className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter session title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && title.trim()) {
                createM.mutate();
              }
            }}
          />
          <button
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg whitespace-nowrap"
            disabled={createM.isPending || !title.trim()}
            onClick={() => createM.mutate()}
          >
            {createM.isPending ? "Creating..." : "Create"}
          </button>
        </div>

        {createM.isError && (
          <div className="mt-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-600 dark:text-red-400">
            {(createM.error as Error).message}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold">Your Sessions</h3>
        </div>

        {sessionsQ.isLoading && (
          <div className="p-8 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2">Loading sessions...</p>
          </div>
        )}

        {sessionsQ.isError && (
          <div className="p-6">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
              {(sessionsQ.error as Error).message}
            </div>
          </div>
        )}

        {sessionsQ.isSuccess && (sessionsQ.data ?? []).length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="mt-4 text-lg font-medium">No sessions yet</p>
            <p className="mt-1">Create your first session to get started!</p>
          </div>
        )}

        {sessionsQ.isSuccess && (
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {(sessionsQ.data ?? []).map((s) => (
              <li key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <Link href={`/sessions/${s.id}`} className="block p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1">
                        {s.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Created {new Date(s.createdAt).toLocaleDateString()} at {new Date(s.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="ml-4">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}