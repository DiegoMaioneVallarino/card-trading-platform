import { create } from "zustand";
import { persist } from "zustand/middleware";
interface NotificationState { readIds: string[]; markRead: (id: string) => void; markAllRead: (ids: string[]) => void; }
export const useNotificationsStore = create<NotificationState>()(persist(set => ({
 readIds: [],
 markRead: id => set(s => ({ readIds: s.readIds.includes(id) ? s.readIds : [...s.readIds, id] })),
 markAllRead: ids => set(s => ({ readIds: Array.from(new Set([...s.readIds, ...ids])) })),
}), { name: "card-market-notifications-v1" }));
