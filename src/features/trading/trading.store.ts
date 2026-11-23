import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CollectionItem } from "../collections/collection.store";

export type TradeStatus = "pending" | "countered" | "accepted" | "declined" | "cancelled";
export interface TradeCard { id: string; name: string; image: string; collection: string; estimatedValue: number; quantity: number; }
export interface TradeOffer {
  id: string; partnerId: string; partnerName: string; offered: TradeCard[]; requested: TradeCard[];
  cashAdjustment: number; message: string; status: TradeStatus; createdAt: string; updatedAt: string;
  direction: "outgoing" | "incoming"; revision: number;
}
export interface DemoTrader { id: string; name: string; description: string; cards: TradeCard[]; }
export const demoTraders: DemoTrader[] = [
 { id: "collector-alex", name: "Alex Rivera", description: "Vintage Pokémon collector", cards: [
  { id: "alex-blastoise", name: "Blastoise", collection: "Base Set", image: "", estimatedValue: 4200, quantity: 1 },
  { id: "alex-pikachu", name: "Pikachu", collection: "Jungle", image: "/images/pikachu.png", estimatedValue: 650, quantity: 2 },
  { id: "alex-mewtwo", name: "Mewtwo", collection: "Base Set", image: "", estimatedValue: 1900, quantity: 1 },
 ]},
 { id: "collector-jamie", name: "Jamie Chen", description: "Yu-Gi-Oh! and Magic enthusiast", cards: [
  { id: "jamie-blueeyes", name: "Blue-Eyes White Dragon", collection: "Legend of Blue Eyes", image: "/images/blue-eyes.png", estimatedValue: 3100, quantity: 1 },
  { id: "jamie-blacklotus", name: "Black Lotus", collection: "Alpha", image: "/images/black-lotus.png", estimatedValue: 9000, quantity: 1 },
 ]},
];
export function toTradeCard(item: CollectionItem): TradeCard {
 return { id: item.id, name: item.name, image: item.image, collection: item.collection, estimatedValue: item.estimatedValue, quantity: item.quantity };
}
export const tradeTotal = (cards: TradeCard[]) => cards.reduce((sum, card) => sum + card.estimatedValue * card.quantity, 0);
interface TradingState {
 offers: TradeOffer[];
 createOffer: (offer: Omit<TradeOffer, "id" | "createdAt" | "updatedAt" | "status" | "revision" | "direction">) => void;
 cancelOffer: (id: string) => void;
 respondToOffer: (id: string, status: "accepted" | "declined") => void;
 counterOffer: (id: string, changes: Pick<TradeOffer, "cashAdjustment" | "message">) => void;
 resetDemo: () => void;
}
const seed: TradeOffer[] = [{
 id: "demo-incoming-1", partnerId: "collector-alex", partnerName: "Alex Rivera",
 offered: [{ id: "alex-blastoise", name: "Blastoise", collection: "Base Set", image: "", estimatedValue: 4200, quantity: 1 }],
 requested: [], cashAdjustment: 0, message: "Hi! Would you consider a trade? Select your cards and send a counteroffer.",
 status: "pending", direction: "incoming", revision: 0,
 createdAt: "2026-11-20T10:00:00.000Z", updatedAt: "2026-11-20T10:00:00.000Z",
}];
export const useTradingStore = create<TradingState>()(persist((set) => ({
 offers: seed,
 createOffer: (offer) => set((s) => ({ offers: [{ ...offer, id: crypto.randomUUID(), direction: "outgoing", status: "pending", revision: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...s.offers] })),
 cancelOffer: (id) => set((s) => ({ offers: s.offers.map((o) => o.id === id && o.direction === "outgoing" && ["pending", "countered"].includes(o.status) ? { ...o, status: "cancelled", updatedAt: new Date().toISOString() } : o) })),
 respondToOffer: (id, status) => set((s) => ({ offers: s.offers.map((o) => o.id === id && o.direction === "incoming" && ["pending", "countered"].includes(o.status) ? { ...o, status, updatedAt: new Date().toISOString() } : o) })),
 counterOffer: (id, changes) => set((s) => ({ offers: s.offers.map((o) => o.id === id && o.direction === "incoming" && ["pending", "countered"].includes(o.status) ? { ...o, ...changes, status: "countered", revision: o.revision + 1, updatedAt: new Date().toISOString() } : o) })),
 resetDemo: () => set({ offers: seed }),
}), { name: "card-market-trading" }));
