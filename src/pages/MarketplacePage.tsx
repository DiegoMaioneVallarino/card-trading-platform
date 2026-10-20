import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";


import { cards } from "../features/cards/card.data";
import { CardItem } from "../features/cards/components/CardItem";
import type { CardCategory } from "../features/cards/card.types";
import "./MarketplacePage.css";
import { useListingStore } from "../features/listings/listing.store";
import { ListingCard } from "../features/listings/components/ListingCard";
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
const [searchParams] = useSearchParams();
const searchQuery = (searchParams.get("q") ?? "")
  .trim()
  .toLowerCase();
const filteredCards = useMemo(() => {
  const result = cards.filter((card) => {
    const matchesCategory =
      category === "all" ||
      card.category === category;

    const searchableText = [
      card.name,
      card.collection,
      card.rarity,
      card.seller,
    ]
      .join(" ")
      .toLowerCase();

    return (
      matchesCategory &&
      searchableText.includes(searchQuery)
    );
  });

  if (sort === "low") {
    result.sort((a, b) => a.price - b.price);
  }

  if (sort === "high") {
    result.sort((a, b) => b.price - a.price);
  }

  return result;
}, [category, sort, searchQuery]);


const listings = useListingStore(
  (state) => state.listings
);

const activeListings = useMemo(() => {
  return listings
    .filter((listing) => {
      const matchesCategory =
        category === "all" ||
        listing.category === category;

      const matchesSearch = [
        listing.name,
        listing.collection,
        listing.rarity,
        listing.sellerName,
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery);

      return (
        listing.status === "active" &&
        matchesCategory &&
        matchesSearch
      );
    })
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      return 0;
    });
}, [listings, category, searchQuery, sort]);

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
      <section className="marketplace__catalog">
  <div className="marketplace__heading">
    <div>
      <span className="marketplace__eyebrow">
        COMMUNITY
      </span>
      <h2>Collector listings</h2>
    </div>

    <span className="marketplace__count">
      {activeListings.length} listings
    </span>
  </div>

  {activeListings.length > 0 ? (
    <div
      className="marketplace__grid"
      style={{ marginTop: 35 }}
    >
      {activeListings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
        />
      ))}
    </div>
  ) : (
    <p className="marketplace__empty">
      No listings match your filters.
    </p>
  )}
</section>
    </main>
  );
}