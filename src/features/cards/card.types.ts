export type CardCategory =
  | "pokemon"
  | "yugioh"
  | "magic"
  | "sports";

export interface TradingCard {
  id: string;
  name: string;
  collection: string;
  category: CardCategory;
  rarity: string;
  condition: string;
  price: number;
  image: string;
  seller: string;
}