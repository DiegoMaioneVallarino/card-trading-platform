import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CardCategory } from "../cards/card.types";

export type CollectionVisibility = "private" | "showcase" | "trade";
export interface CollectionItem {
  id: string;
  cardId?: string;
  name: string;
  collection: string;
  category: CardCategory;
  image: string;
  condition: string;
  quantity: number;
  estimatedValue: number;
  visibility: CollectionVisibility;
  notes: string;
  addedAt: string;
}
interface CollectionState {
  items: CollectionItem[];
  addItem: (item: CollectionItem) => void;
  updateItem: (id: string, changes: Partial<CollectionItem>) => void;
  removeItem: (id: string) => void;
}
export const useCollectionStore = create<CollectionState>()(persist((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [item, ...state.items] })),
  updateItem: (id, changes) => set((state) => ({ items: state.items.map((item) => item.id === id ? { ...item, ...changes, id: item.id } : item) })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
}), { name: "card-market-collection" }));
