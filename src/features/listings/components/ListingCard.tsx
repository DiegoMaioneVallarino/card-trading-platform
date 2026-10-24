import type { CardListing } from "../listing.types";
import "./ListingCard.css";
import { ListingImage } from "./ListingImage";
import { Link } from "react-router-dom";
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
  <Link
    to={`/listings/${listing.id}`}
    className="listing-card__image-link"
    aria-label={`View ${listing.name}`}
  >
    <ListingImage listing={listing} />
  </Link>

        <span className="listing-card__condition">
          {listing.condition}
        </span>
      </div>

      <div className="listing-card__content">
        <span className="listing-card__collection">
          {listing.collection}
        </span>

<Link
  to={`/listings/${listing.id}`}
  className="listing-card__title"
>
  <h3>{listing.name}</h3>
</Link>
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
  <div className="listing-card__actions">
    <Link to={`/my-listings/${listing.id}/edit`}>
      Edit
    </Link>

    <button
      type="button"
      onClick={() => onDelete(listing.id)}
    >
      Remove
    </button>
  </div>
)}
        </div>
      </div>
    </article>
  );
}