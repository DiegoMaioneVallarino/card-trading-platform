import { useMemo, useState } from "react";
import { cards } from "../features/cards/card.data";
import { CardItem } from "../features/cards/components/CardItem";
import type { CardCategory } from "../features/cards/card.types";
import "./MarketplacePage.css";

type CategoryFilter = "all" | CardCategory;

const categories: {
  id: CategoryFilter;
  label: string;
}[] = [
  { id: "all", label: "All Cards" },
  { id: "pokemon", label: "Pokémon" },
  { id: "yugioh", label: "Yu-Gi-Oh!" },
  { id: "magic", label: "Magic" },
  { id: "sports", label: "Sports" },
];

export function MarketplacePage() {
  const [category, setCategory] =
    useState<CategoryFilter>("all");

  const [sort, setSort] = useState("featured");

  const filteredCards = useMemo(() => {
    const result = cards.filter(
      (card) =>
        category === "all" ||
        card.category === category
    );

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [category, sort]);

  return (
    <main className="marketplace">
      <section className="marketplace__hero">
        <span className="marketplace__eyebrow">
          THE COLLECTOR'S MARKETPLACE
        </span>

        <h1>
          Discover cards.
          <br />
          Build your collection.
        </h1>

        <p>
          Explore rare finds, iconic collections,
          and cards from collectors around the world.
        </p>

        <a href="#catalog" className="marketplace__cta">
          Explore collection →
        </a>
      </section>

      <section
        id="catalog"
        className="marketplace__catalog"
      >
        <div className="marketplace__heading">
          <div>
            <span className="marketplace__eyebrow">
              EXPLORE
            </span>
            <h2>Marketplace</h2>
          </div>

          <span className="marketplace__count">
            {filteredCards.length} cards
          </span>
        </div>

        <div className="marketplace__toolbar">
          <div className="marketplace__categories">
            {categories.map((item) => (
              <button
                key={item.id}
                className={
                  category === item.id ? "active" : ""
                }
                onClick={() => setCategory(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(event) =>
              setSort(event.target.value)
            }
            aria-label="Sort cards"
          >
            <option value="featured">Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>

        {filteredCards.length > 0 ? (
          <div className="marketplace__grid">
            {filteredCards.map((card) => (
              <CardItem key={card.id} card={card} />
            ))}
          </div>
        ) : (
          <p className="marketplace__empty">
            No cards available in this category yet.
          </p>
        )}
      </section>
    </main>
  );
}