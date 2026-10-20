import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

import type { TradingCard } from "../card.types";
import { useFavoritesStore } from "../../../store/favorites.store";

import "./CardItem.css";

interface CardItemProps {
  card: TradingCard;
}

export function CardItem({ card }: CardItemProps) {
  const isFavorite = useFavoritesStore(
    (state) => state.favorites.includes(card.id)
  );

  const toggleFavorite = useFavoritesStore(
    (state) => state.toggleFavorite
  );

  return (
    <article className="card-item">
      <div className="card-item__image">
        <Link to={`/cards/${card.id}`}>
          <img src={card.image} alt={card.name} />
        </Link>

        <button
          type="button"
          className={`card-item__favorite ${
            isFavorite ? "active" : ""
          }`}
          onClick={() => toggleFavorite(card.id)}
          aria-label={
            isFavorite
              ? "Remove from favorites"
              : "Add to favorites"
          }
          aria-pressed={isFavorite}
        >
          <Heart
            size={18}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="card-item__details">
        <span className="card-item__collection">
          {card.collection}
        </span>

        <Link
          to={`/cards/${card.id}`}
          className="card-item__title"
        >
          <h3>{card.name}</h3>
        </Link>

        <div className="card-item__metadata">
          <span>{card.rarity}</span>
          <span>{card.condition}</span>
        </div>

        <div className="card-item__bottom">
          <strong>
            {new Intl.NumberFormat("es-MX", {
              style: "currency",
              currency: "MXN",
            }).format(card.price)}
          </strong>

          <span>by {card.seller}</span>
        </div>
      </div>
    </article>
  );
}