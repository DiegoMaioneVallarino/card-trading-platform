import { Link, useParams } from "react-router-dom";
import { Heart, ArrowLeft, ShoppingBag } from "lucide-react";

import { cards } from "../features/cards/card.data";
import { useFavoritesStore } from "../store/favorites.store";

import "./CardDetailPage.css";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(price);

export function CardDetailPage() {
  const { cardId } = useParams();

  const card = cards.find((item) => item.id === cardId);

  const favorites = useFavoritesStore(
    (state) => state.favorites
  );

  const toggleFavorite = useFavoritesStore(
    (state) => state.toggleFavorite
  );

  if (!card) {
    return (
      <main className="card-detail__not-found">
        <h1>Card not found</h1>
        <Link to="/marketplace">Return to marketplace</Link>
      </main>
    );
  }

  const isFavorite = favorites.includes(card.id);

  return (
    <main className="card-detail">
      <Link
        to="/marketplace"
        className="card-detail__back"
      >
        <ArrowLeft size={16} />
        Back to marketplace
      </Link>

      <div className="card-detail__layout">
        <div className="card-detail__visual">
          <img src={card.image} alt={card.name} />
        </div>

        <section className="card-detail__info">
          <span className="card-detail__eyebrow">
            {card.collection} / {card.category}
          </span>

          <h1>{card.name}</h1>

          <p className="card-detail__rarity">
            {card.rarity}
          </p>

          <div className="card-detail__price">
            {formatPrice(card.price)}
          </div>

          <div className="card-detail__divider" />

          <div className="card-detail__specs">
            <div>
              <span>Condition</span>
              <strong>{card.condition}</strong>
            </div>

            <div>
              <span>Collection</span>
              <strong>{card.collection}</strong>
            </div>

            <div>
              <span>Seller</span>
              <strong>{card.seller}</strong>
            </div>
          </div>

          <div className="card-detail__actions">
            <button
              className="card-detail__buy"
              type="button"
              disabled
              title="Shopping cart coming soon"
            >
              <ShoppingBag size={18} />
              Add to bag — Coming soon
            </button>

            <button
              type="button"
              className="card-detail__favorite"
              onClick={() => toggleFavorite(card.id)}
              aria-label={
                isFavorite
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
              aria-pressed={isFavorite}
            >
              <Heart
                size={19}
                fill={isFavorite ? "currentColor" : "none"}
              />
            </button>
          </div>

          <p className="card-detail__notice">
            Listed by an independent collector.
            Secure checkout will be available soon.
          </p>
        </section>
      </div>
    </main>
  );
}