import type { CardListing } from "./listing.types";

export const DEMO_SELLER_ID = "demo-user";

export const initialListings: CardListing[] = [
  {
    id: "listing-1",
    cardId: "1",
    name: "Charizard",
    collection: "Base Set",
    category: "pokemon",
    rarity: "Holo Rare",
    condition: "Near Mint",
    price: 4500,
    quantity: 1,
    description: "Collector's card in excellent condition.",
    image: "/images/charizard.png",
    sellerId: "seller-1",
    sellerName: "CardCollector",
    createdAt: "2026-10-01T12:00:00.000Z",
    status: "active",
  },
  {
    id: "listing-2",
    cardId: "1",
    name: "Charizard",
    collection: "Base Set",
    category: "pokemon",
    rarity: "Holo Rare",
    condition: "Played",
    price: 2800,
    quantity: 1,
    description: "Original card with visible signs of use.",
    image: "/images/charizard.png",
    sellerId: "seller-2",
    sellerName: "RetroCards",
    createdAt: "2026-10-02T12:00:00.000Z",
    status: "active",
  },
];