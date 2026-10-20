import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CardListing } from "./listing.types";
import { initialListings } from "./listing.data";

interface ListingState {
  listings: CardListing[];

  addListing: (listing: CardListing) => void;

  removeListing: (id: string) => void;

  updateListing: (
    id: string,
    changes: Partial<CardListing>
  ) => void;
}

export const useListingStore = create<ListingState>()(
  persist(
    (set) => ({
      listings: initialListings,

      addListing: (listing) =>
        set((state) => ({
          listings: [listing, ...state.listings],
        })),

      removeListing: (id) =>
        set((state) => ({
          listings: state.listings.filter(
            (listing) =>
              !(
                listing.id === id &&
                listing.sellerId === "demo-user"
              )
          ),
        })),

      updateListing: (id, changes) =>
        set((state) => ({
          listings: state.listings.map((listing) =>
            listing.id === id &&
            listing.sellerId === "demo-user"
              ? {
                  ...listing,
                  ...changes,
                  id: listing.id,
                  sellerId: listing.sellerId,
                }
              : listing
          ),
        })),
    }),
    {
      name: "card-market-listings",
    }
  )
);