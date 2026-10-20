import type { TradingCard } from "../card.types";
import "./CardItem.css";

interface CardItemProps {
  card: TradingCard;
}

export function CardItem({ card }: CardItemProps) {
  return (
    <article className="card-item">
      <div className="card-item__image">
        <img src={card.image} alt={card.name} />
      </div>

      <div className="card-item__details">
        <span className="card-item__collection">
          {card.collection}
        </span>

        <h3>{card.name}</h3>

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