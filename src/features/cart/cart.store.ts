import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine { listingId: string; quantity: number; }
interface CartState {
  items: CartLine[];
  addItem: (listingId: string, stock: number) => void;
  setQuantity: (listingId: string, quantity: number, stock: number) => void;
  removeItem: (listingId: string) => void;
  clearCart: () => void;
}
export const useCartStore = create<CartState>()(persist((set) => ({
  items: [],
  addItem: (listingId, stock) => set((state) => {
    if (stock < 1) return state;
    const found = state.items.find((line) => line.listingId === listingId);
    if (found) return { items: state.items.map((line) => line.listingId === listingId ? { ...line, quantity: Math.min(stock, line.quantity + 1) } : line) };
    return { items: [...state.items, { listingId, quantity: 1 }] };
  }),
  setQuantity: (listingId, quantity, stock) => set((state) => ({ items: state.items.map((line) => line.listingId === listingId ? { ...line, quantity: Math.max(1, Math.min(stock, Math.floor(quantity) || 1)) } : line) })),
  removeItem: (listingId) => set((state) => ({ items: state.items.filter((line) => line.listingId !== listingId) })),
  clearCart: () => set({ items: [] }),
}), { name: "card-market-cart" }));
