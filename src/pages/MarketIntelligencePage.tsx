import { useMemo } from "react";
import { Activity, BarChart3, TrendingDown, TrendingUp } from "lucide-react";
import { cards } from "../features/cards/card.data";
import { useListingStore } from "../features/listings/listing.store";
import { money } from "../features/cart/cart.utils";
import "./clientPages.css";

const trendSeed = [92, 95, 98, 97, 103, 106, 109];

export function MarketIntelligencePage() {
  const listings = useListingStore((s) => s.listings.filter((listing) => listing.status === "active"));

  const priceMoments = useMemo(() => {
    return cards.map((card) => {
      const comparable = listings.filter((listing) => listing.name.toLowerCase() === card.name.toLowerCase());
      const listedAverage = comparable.length
        ? comparable.reduce((sum, listing) => sum + listing.price, 0) / comparable.length
        : card.price;
      const change = listedAverage - card.price;
      return {
        id: card.id,
        name: card.name,
        collection: card.collection,
        referencePrice: card.price,
        listedAverage,
        spread: comparable.length ? Math.max(...comparable.map((listing) => listing.price)) - Math.min(...comparable.map((listing) => listing.price)) : 0,
        change,
        listings: comparable.length,
      };
    }).sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
  }, [listings]);

  const liquidityScore = listings.length ? Math.round((listings.length / Math.max(cards.length, 1)) * 100) : 0;
  const averageSpread = priceMoments.length ? Math.round(priceMoments.reduce((sum, item) => sum + item.spread, 0) / priceMoments.length) : 0;
  const hottest = priceMoments[0];

  return (
    <main className="client-page">
      <div className="client-hero client-hero--compact">
        <p className="client-kicker">MARKET TOOLS / INTELLIGENCE</p>
        <h1>Read the market<span className="client-period">.</span></h1>
        <p>Monitor pricing, identify volatility and understand which cards are attracting the most collector attention.</p>
      </div>

      <div className="collection-metrics">
        <div><span>ACTIVE OFFERS</span><strong>{listings.length}</strong></div>
        <div><span>LIQUIDITY SCORE</span><strong>{liquidityScore}%</strong></div>
        <div><span>AVERAGE SPREAD</span><strong>{money(averageSpread)}</strong></div>
        <div><span>HOT CARD</span><strong>{hottest?.name ?? "—"}</strong></div>
      </div>

      <div className="client-fields" style={{ alignItems: "start" }}>
        <section className="client-panel">
          <div className="client-section-head"><div><p className="client-kicker">MARKET HEATMAP</p><h2>Price movement snapshot</h2></div><Activity size={18} color="#777" /></div>
          <div style={{ display: "grid", gap: 12 }}>
            {priceMoments.map((item) => {
              const positive = item.change >= 0;
              const width = Math.min(100, Math.max(12, Math.round((Math.abs(item.change) / Math.max(item.referencePrice, 1)) * 100 * 2)));
              return (
                <div key={item.id} style={{ display: "grid", gap: 8, border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
                  <div className="collection-card-row"><strong>{item.name}</strong><span>{item.collection}</span></div>
                  <div style={{ height: 10, borderRadius: 999, background: "#f1f1f1", overflow: "hidden" }}>
                    <div style={{ width: `${width}%`, height: "100%", background: positive ? "#79a95a" : "#cf6b6b" }} />
                  </div>
                  <div className="collection-card-row"><span>Reference {money(item.referencePrice)}</span><strong style={{ color: positive ? "#658d4e" : "#bb6060" }}>{positive ? "+" : ""}{money(item.change)}</strong></div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="client-panel">
          <div className="client-section-head"><div><p className="client-kicker">DEMO SIGNALS</p><h2>Reading guide</h2></div><BarChart3 size={18} color="#777" /></div>
          <div className="orders-list">
            <article className="client-panel" style={{ padding: 18, background: "#fafafa" }}>
              <div className="client-section-head" style={{ margin: 0 }}><div><p className="client-kicker">TOP MOMENTUM</p><h2 style={{ marginBottom: 8 }}>{hottest?.name ?? "—"}</h2></div><TrendingUp size={18} color="#658d4e" /></div>
              <p className="client-note">Largest absolute difference versus the internal reference price. Useful to detect unusually optimistic or discounted asks.</p>
            </article>
            <article className="client-panel" style={{ padding: 18, background: "#fafafa" }}>
              <div className="client-section-head" style={{ margin: 0 }}><div><p className="client-kicker">SPREAD RISK</p><h2 style={{ marginBottom: 8 }}>Watch wide price bands</h2></div><TrendingDown size={18} color="#c67" /></div>
              <p className="client-note">A large spread between the cheapest and the most expensive listing usually means condition, scarcity or seller confidence is diverging.</p>
            </article>
          </div>
        </section>
      </div>

      <section className="client-panel" style={{ marginTop: 28 }}>
        <div className="client-section-head"><div><p className="client-kicker">REFERENCE TABLE</p><h2>Price intelligence board</h2></div><span className="client-muted">Mock analytics derived from current local data</span></div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#777", borderBottom: "1px solid #eee" }}>
                <th style={{ padding: "12px 10px" }}>Card</th>
                <th style={{ padding: "12px 10px" }}>Ref. price</th>
                <th style={{ padding: "12px 10px" }}>Avg ask</th>
                <th style={{ padding: "12px 10px" }}>Listings</th>
                <th style={{ padding: "12px 10px" }}>Spread</th>
                <th style={{ padding: "12px 10px" }}>Signal</th>
              </tr>
            </thead>
            <tbody>
              {priceMoments.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #f1f1f1" }}>
                  <td style={{ padding: "14px 10px" }}>{item.name}</td>
                  <td style={{ padding: "14px 10px" }}>{money(item.referencePrice)}</td>
                  <td style={{ padding: "14px 10px" }}>{money(Math.round(item.listedAverage))}</td>
                  <td style={{ padding: "14px 10px" }}>{item.listings}</td>
                  <td style={{ padding: "14px 10px" }}>{money(item.spread)}</td>
                  <td style={{ padding: "14px 10px", fontWeight: 700 }}>{item.change > 0 ? "Seller premium" : item.change < 0 ? "Below ref." : "Neutral"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="client-panel" style={{ marginTop: 28 }}>
        <div className="client-section-head"><div><p className="client-kicker">DEMO TREND</p><h2>7-point sentiment strip</h2></div><span className="client-muted">Illustrative only</span></div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${trendSeed.length}, minmax(0, 1fr))`, gap: 10, alignItems: "end", minHeight: 180 }}>
          {trendSeed.map((value, index) => (
            <div key={index} style={{ display: "grid", gap: 8 }}>
              <div style={{ height: `${value}px`, borderRadius: 10, background: "linear-gradient(180deg,#bbb 0%,#222 100%)" }} />
              <small style={{ textAlign: "center", color: "#888" }}>W{index + 1}</small>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
