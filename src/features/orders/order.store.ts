import { create } from "zustand";
import { persist } from "zustand/middleware";
export interface MockOrderLine { listingId: string; name: string; quantity: number; price: number; sellerName: string; }
export interface MockOrder { id: string; createdAt: string; items: MockOrderLine[]; subtotal: number; shipping: number; total: number; recipient: string; email: string; address: string; status: "demo"; }
interface OrderState { orders: MockOrder[]; addOrder: (order: MockOrder) => void; }
export const useOrderStore = create<OrderState>()(persist((set) => ({
  orders: [], addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
}), { name: "card-market-demo-orders" }));
