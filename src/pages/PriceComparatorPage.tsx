import { useMemo, useState } from "react";
import { ArrowRightLeft, BarChart3, Search } from "lucide-react";
import { cards } from "../features/cards/card.data";
import { useListingStore } from "../features/listings/listing.store";
import { money } from "../features/cart/cart.utils";
import "./clientPages.css";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function PriceComparatorPage() {
  const listings = useListingStore((s) => s.listings.filter((listing) => listing.status === "active"));
  const candidateNames = useMemo(
    () => Array.from(new Set([...cards.map((card) => card.name), ...listings.map((listing) => listing.name)])).sort(),
    [listings],
  );
  const [query, setQuery] = useState(candidateNames[0] ?? "");
  const selectedName = query || candidateNames[0] || "";

  const reference = cards.find((card) => normalize(card.name) === normalize(selectedName));
  const comparisons = useMemo(
    () =>
      listings
        .filter((listing) => normalize(listing.name) === normalize(selectedName))
        .sort((a, b) => a.price - b.price),
    [listings, selectedName],
  );

  const minPrice = comparisons[0]?.price ?? 0;
  const maxPrice = comparisons.at(-1)?.price ?? 0;
  const avgPrice = comparisons.length
    ? Math.round(comparisons.reduce((sum, listing) => sum + listing.price, 0) / comparisons.length)
    : reference?.price ?? 0;

  return (
    <main className="client-page">
      <div className="client-hero client-hero--compact">
        <p className="client-kicker">MARKET TOOLS / PRICE COMPARATOR</p>
        <h1>Compare seller prices<span className="client-period">.</span></h1>
        <p>Review how multiple collectors are pricing the same card and compare their conditions, quantities and collections.</p>
      </div>

      <section className="client-panel" style={{ marginBottom: 28 }}>
        <div className="client-fields" style={{ alignItems: "end" }}>
          <label>
            Card name
            <div style={{ position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: 12, top: 14, color: "#999" }} />
              <input list="price-card-list" value={query} onChange={(e) => setQuery(e.target.value)} style={{ paddingLeft: 38 }} placeholder="Search a card..." />
              <datalist id="price-card-list">
                {candidateNames.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </div>
          </label>
          <div className="client-panel" style={{ padding: 16, background: "#fafafa" }}>
            <div className="collection-card-row"><span>Reference price</span><strong>{money(reference?.price ?? avgPrice)}</strong></div>
            <div className="collection-card-row"><span>Listings available</span><strong>{comparisons.length}</strong></div>
          </div>
        </div>
      </section>

      <div className="collection-metrics">
        <div><span>LOWEST ASK</span><strong>{money(minPrice)}</strong></div>
        <div><span>AVERAGE ASK</span><strong>{money(avgPrice)}</strong></div>
        <div><span>HIGHEST ASK</span><strong>{money(maxPrice)}</strong></div>
        <div><span>SPREAD</span><strong>{money(Math.max(0, maxPrice - minPrice))}</strong></div>
      </div>

      <section className="client-panel">
        <div className="client-section-head">
          <div>
            <p className="client-kicker">SELLER OFFERS</p>
            <h2>{selectedName || "Select a card"}</h2>
          </div>
          <span className="client-muted">{comparisons.length} comparable listings</span>
        </div>

        {comparisons.length ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#777", borderBottom: "1px solid #eee" }}>
                  <th style={{ padding: "12px 10px" }}>Seller</th>
                  <th style={{ padding: "12px 10px" }}>Collection</th>
                  <th style={{ padding: "12px 10px" }}>Condition</th>
                  <th style={{ padding: "12px 10px" }}>Quantity</th>
                  <th style={{ padding: "12px 10px" }}>Price</th>
                  <th style={{ padding: "12px 10px" }}>Variance</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((listing) => {
                  const variance = listing.price - avgPrice;
                  return (
                    <tr key={listing.id} style={{ borderBottom: "1px solid #f1f1f1" }}>
                      <td style={{ padding: "14px 10px" }}>{listing.sellerName}</td>
                      <td style={{ padding: "14px 10px" }}>{listing.collection}</td>
                      <td style={{ padding: "14px 10px" }}>{listing.condition}</td>
                      <td style={{ padding: "14px 10px" }}>{listing.quantity}</td>
                      <td style={{ padding: "14px 10px", fontWeight: 700 }}>{money(listing.price)}</td>
                      <td style={{ padding: "14px 10px", color: variance > 0 ? "#9a4" : variance < 0 ? "#c55" : "#777" }}>
                        {variance === 0 ? "At average" : `${variance > 0 ? "+" : ""}${money(variance)}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="client-empty">
            <ArrowRightLeft size={30} />
            <h3>No comparable listings</h3>
            <p>Add more community listings for this card to compare asking prices and spreads.</p>
          </div>
        )}
      </section>

      <section className="client-panel" style={{ marginTop: 28 }}>
        <div className="client-section-head"><div><p className="client-kicker">QUICK READ</p><h2>What this tool tells you</h2></div><BarChart3 size={18} color="#777" /></div>
        <div className="client-fields">
          <div className="client-panel" style={{ padding: 18, background: "#fafafa" }}>
            <strong>Best entry price</strong>
            <p className="client-note">Use the lowest ask to spot accessible copies, especially when you only need a binder copy.</p>
          </div>
          <div className="client-panel" style={{ padding: 18, background: "#fafafa" }}>
            <strong>Condition premium</strong>
            <p className="client-note">Look at how much sellers charge for Near Mint or graded-worthy copies compared with played copies.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
