import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ChatMessage { id: string; threadId: string; author: "me" | "them"; body: string; createdAt: string; }
export interface ChatThread { id: string; participantId: string; participantName: string; context?: string; createdAt: string; updatedAt: string; }
interface MessagingState {
 threads: ChatThread[]; messages: ChatMessage[];
 openThread: (participantId: string, participantName: string, context?: string) => string;
 sendMessage: (threadId: string, body: string) => void;
 markThreadRead: (threadId: string) => void;
 readThreadIds: Record<string, string>;
}
const demoThread: ChatThread = { id: "demo-chat-alex", participantId: "collector-alex", participantName: "Alex Rivera", context: "Trading Center", createdAt: "2026-11-20T10:00:00.000Z", updatedAt: "2026-11-20T10:00:00.000Z" };
const demoMessage: ChatMessage = { id: "demo-message-alex", threadId: demoThread.id, author: "them", body: "Hey! I saw your collection. Interested in trading?", createdAt: demoThread.createdAt };
export const useMessagingStore = create<MessagingState>()(persist((set, get) => ({
 threads: [demoThread], messages: [demoMessage], readThreadIds: {},
 openThread: (participantId, participantName, context) => {
  const existing = get().threads.find(t => t.participantId === participantId && (t.context ?? "") === (context ?? ""));
  if (existing) return existing.id;
  const id = crypto.randomUUID(); const now = new Date().toISOString();
  set(s => ({ threads: [{ id, participantId, participantName, context, createdAt: now, updatedAt: now }, ...s.threads] }));
  return id;
 },
 sendMessage: (threadId, body) => {
  const value = body.trim(); if (!value || !get().threads.some(t => t.id === threadId)) return;
  const now = new Date().toISOString();
  set(s => ({ messages: [...s.messages, { id: crypto.randomUUID(), threadId, author: "me", body: value.slice(0, 2000), createdAt: now }], threads: s.threads.map(t => t.id === threadId ? { ...t, updatedAt: now } : t) }));
 },
 markThreadRead: threadId => set(s => {
  const last = s.messages.filter(m => m.threadId === threadId && m.author === "them").at(-1);
  return last ? { readThreadIds: { ...s.readThreadIds, [threadId]: last.id } } : s;
 }),
}), { name: "card-market-messaging-v1" }));

export function unreadThreadCount(state: MessagingState) {
 return state.threads.filter(t => { const incoming = state.messages.filter(m => m.threadId === t.id && m.author === "them"); return incoming.length > 0 && incoming[incoming.length - 1].id !== state.readThreadIds[t.id]; }).length;
}
