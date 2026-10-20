import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { useListingStore } from "../features/listings/listing.store";
import { DEMO_SELLER_ID } from "../features/listings/listing.data";
import { ListingCard } from "../features/listings/components/ListingCard";

import "./MyListingsPage.css";

export function MyListingsPage() {
  const listings = useListingStore(
    (state) => state.listings
  );

  const removeListing = useListingStore(
    (state) => state.removeListing
  );

  const myListings = listings.filter(
    (listing) => listing.sellerId === DEMO_SELLER_ID
  );

  function handleDelete(id: string) {
    if (window.confirm("Remove this listing?")) {
      removeListing(id);
    }
  }

  return (
    <main className="my-listings">
      <div className="my-listings__header">
        <div>
          <span>SELLER DASHBOARD</span>
          <h1>My listings</h1>
          <p>Manage your cards for sale.</p>
        </div>

        <Link to="/sell" className="my-listings__add">
          <Plus size={17} />
          New listing
        </Link>
      </div>

      {myListings.length > 0 ? (
        <div className="my-listings__grid">
          {myListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="my-listings__empty">
          <h2>No listings yet</h2>
          <p>
            Start selling by creating your first listing.
          </p>
          <Link to="/sell">Create listing →</Link>
        </div>
      )}
    </main>
  );
}