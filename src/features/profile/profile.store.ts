import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CollectorProfile {
  displayName: string;
  handle: string;
  bio: string;
  location: string;
  favoriteCategory: string;
  joined: string;
}
interface ProfileState {
  profile: CollectorProfile;
  updateProfile: (changes: Partial<CollectorProfile>) => void;
}
export const useProfileStore = create<ProfileState>()(persist((set) => ({
  profile: {
    displayName: "Your Collector Profile",
    handle: "collector_demo",
    bio: "Collecting the cards that tell a story. Always looking for the next favorite.",
    location: "Mexico",
    favoriteCategory: "Pokémon",
    joined: "2026",
  },
  updateProfile: (changes) => set((state) => ({ profile: { ...state.profile, ...changes } })),
}), { name: "card-market-profile" }));
