import type { CardListing } from "../listing.types";
import "./ListingCard.css";
import { ListingImage } from "./ListingImage";

interface ListingCardProps {
  listing: CardListing;
  onDelete?: (id: string) => void;
}

export function ListingCard({
  listing,
  onDelete,
}: ListingCardProps) {
  const price = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(listing.price);

  return (
    <article className="listing-card">
      <div className="listing-card__image">
       <ListingImage listing={listing} />

        <span className="listing-card__condition">
          {listing.condition}
        </span>
      </div>

      <div className="listing-card__content">
        <span className="listing-card__collection">
          {listing.collection}
        </span>

        <h3>{listing.name}</h3>

        <div className="listing-card__metadata">
          <span>{listing.rarity}</span>
          <span>Qty: {listing.quantity}</span>
        </div>

        <div className="listing-card__footer">
          <div>
            <strong>{price}</strong>
            <span>{listing.sellerName}</span>
          </div>

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(listing.id)}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </article>
  );
}