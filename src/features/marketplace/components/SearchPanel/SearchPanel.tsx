import { useEffect, useRef, useState } from "react";
import { Search, ArrowUpRight, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { cards } from "../../../cards/card.data";
import "./SearchPanel.css";

interface SearchPanelProps {
  open: boolean;
  onClose: () => void;
}

export function SearchPanel({
  open,
  onClose,
}: SearchPanelProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;

    inputRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const normalizedQuery = query.trim().toLowerCase();

  const results = normalizedQuery
    ? cards.filter((card) =>
        [
          card.name,
          card.collection,
          card.category,
          card.rarity,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      ).slice(0, 5)
    : [];

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();

    if (!normalizedQuery) return;

    navigate(
      `/marketplace?q=${encodeURIComponent(query.trim())}`
    );

    onClose();
  }

  return (
    <div className="search-overlay" onClick={onClose}>
      <div
        className="search-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Search cards"
        onClick={(event) => event.stopPropagation()}
      >
        <form
          className="search-panel__input"
          onSubmit={submitSearch}
        >
          <Search size={21} />

          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search cards, collections, sellers..."
            aria-label="Search cards"
          />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
          >
            <X size={19} />
          </button>
        </form>

        <div className="search-panel__content">
          {!normalizedQuery ? (
            <div className="search-panel__empty">
              <span>EXPLORE</span>
              <p>Find your next collectible.</p>
            </div>
          ) : results.length > 0 ? (
            <>
              <span className="search-panel__label">
                SUGGESTED CARDS
              </span>

              {results.map((card) => (
                <Link
                  key={card.id}
                  to={`/cards/${card.id}`}
                  className="search-panel__result"
                  onClick={onClose}
                >
                  <div className="search-panel__thumbnail">
                    <img src={card.image} alt="" />
                  </div>

                  <div className="search-panel__result-info">
                    <strong>{card.name}</strong>
                    <span>{card.collection}</span>
                  </div>

                  <ArrowUpRight size={17} />
                </Link>
              ))}

              <button
                className="search-panel__view-all"
                onClick={() => {
                  navigate(
                    `/marketplace?q=${encodeURIComponent(query.trim())}`
                  );
                  onClose();
                }}
              >
                View all results
                <ArrowUpRight size={16} />
              </button>
            </>
          ) : (
            <div className="search-panel__empty">
              <span>NO RESULTS</span>
              <p>No cards found for "{query}".</p>
            </div>
          )}
        </div>

        <div className="search-panel__footer">
          <span>ESC to close</span>
          <span>ENTER to search</span>
        </div>
      </div>
    </div>
  );
}