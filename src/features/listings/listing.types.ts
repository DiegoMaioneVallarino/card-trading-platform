import type { CardCategory } from "../cards/card.types";

export type CardCondition =
  | "Mint"
  | "Near Mint"
  | "Excellent"
  | "Lightly Played"
  | "Played"
  | "Damaged";

export interface CardListing {
  id: string;
  cardId?: string;
  name: string;
  collection: string;
  category: CardCategory;
  rarity: string;
  condition: CardCondition;
  price: number;
  quantity: number;
  description: string;
  image: string;
  sellerId: string;
  sellerName: string;
  createdAt: string;
  images?: ListingImage[];
  status: "active" | "sold" | "draft";
}

export interface ListingImage {
  id: string;
  storageKey: string;
}