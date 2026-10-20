import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  favorites: string[];
  toggleFavorite: (cardId: string) => void;
  isFavorite: (cardId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (cardId) =>
        set((state) => ({
          favorites: state.favorites.includes(cardId)
            ? state.favorites.filter((id) => id !== cardId)
            : [...state.favorites, cardId],
        })),

      isFavorite: (cardId) =>
        get().favorites.includes(cardId),
    }),
    {
      name: "card-market-favorites",
    }
  )
);