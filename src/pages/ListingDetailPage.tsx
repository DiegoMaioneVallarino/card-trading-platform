import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useMessagingStore } from "../features/messaging.store";
import { useCartStore } from "../features/cart/cart.store";
import { useState } from "react";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import { useListingStore } from "../features/listings/listing.store";
import { ListingGallery } from "../features/listings/components/ListingGallery/ListingGallery";
import { DEMO_SELLER_ID } from "../features/listings/listing.data";

import "./ListingDetailPage.css";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);

export function ListingDetailPage() {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const openThread = useMessagingStore(s=>s.openThread);
  const addToCart = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const listing = useListingStore((state) =>
    state.listings.find(
      (item) => item.id === listingId
    )
  );

  if (!listing || listing.status !== "active") {
    return (
      <main className="listing-detail__not-found">
        <h1>Listing not found</h1>
        <p>This listing is no longer available.</p>
        <Link to="/marketplace">Back to marketplace</Link>
      </main>
    );
  }

  const isOwner = listing.sellerId === DEMO_SELLER_ID;

  return (
    <main className="listing-detail">
      <Link
        to="/marketplace"
        className="listing-detail__back"
      >
        <ArrowLeft size={16} />
        Back to marketplace
      </Link>

      <div className="listing-detail__layout">
        <ListingGallery listing={listing} />

        <section className="listing-detail__info">
          <span className="listing-detail__eyebrow">
            {listing.category} / {listing.collection}
          </span>

          <h1>{listing.name}</h1>

          <p className="listing-detail__rarity">
            {listing.rarity}
          </p>

          <div className="listing-detail__price">
            {formatPrice(listing.price)}
          </div>

          <div className="listing-detail__divider" />

          <div className="listing-detail__specs">
            <div>
              <span>Condition</span>
              <strong>{listing.condition}</strong>
            </div>

            <div>
              <span>Available</span>
              <strong>{listing.quantity}</strong>
            </div>

            <div>
              <span>Collection</span>
              <strong>{listing.collection}</strong>
            </div>

            <div>
              <span>Seller</span>
              <strong>{listing.sellerName}</strong>
            </div>
          </div>

          <div className="listing-detail__actions">
            {isOwner ? (
              <Link
                to={`/my-listings/${listing.id}/edit`}
                className="listing-detail__buy"
              >
                Edit your listing
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  className="listing-detail__buy"
                  disabled={listing.quantity < 1}
                  onClick={() => { addToCart(listing.id, listing.quantity); setAdded(true); }}
                >
                  <ShoppingBag size={18} />
                  {added ? "Added to bag ✓" : "Add to bag"}
                </button>

                <button
                  type="button"
                  className="listing-detail__favorite"
                  disabled
                  title="Listing favorites coming soon"
                  aria-label="Save listing — coming soon"
                >
                  <Heart size={19} />
                </button>
              </>
            )}
          </div>

          {!isOwner && added && <Link to="/cart" className="client-text-button">View shopping bag →</Link>}

          {!isOwner && (
            <button
              className="listing-detail__contact"
              type="button"
              onClick={() => navigate(`/messages/${openThread(listing.sellerId, listing.sellerName, `Listing: ${listing.name}`)}`)}
            >
              <MessageCircle size={17} />
              Contact seller
            </button>
          )}

          <div className="listing-detail__seller">
            <div className="listing-detail__avatar">
              {listing.sellerName.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{listing.sellerName}</strong>
              <span>Independent collector</span>
            </div>
          </div>

          <div className="listing-detail__description">
            <h2>Description</h2>
            <p>
              {listing.description ||
                "No description provided by the seller."}
            </p>
          </div>

          <div className="listing-detail__notice">
            <ShieldCheck size={18} />
            <p>
              This is a demonstration listing.
              Secure payments and buyer protection
              are not available yet.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}