import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight, Layers3, ArrowLeftRight, ShieldCheck, Sparkles } from "lucide-react";
import { cards } from "../features/cards/card.data";
import { useListingStore } from "../features/listings/listing.store";
import { useCollectionStore } from "../features/collections/collection.store";
import { useTradingStore } from "../features/trading/trading.store";
import { ListingCard } from "../features/listings/components/ListingCard";
import "./HomePage.css";

const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
const categories = [
  { name: "Pokémon", slug: "pokemon", description: "Icons, holos & rare finds", className: "pokemon" },
  { name: "Yu-Gi-Oh!", slug: "yugioh", description: "Legendary duels await", className: "yugioh" },
  { name: "Magic", slug: "magic", description: "Collect the extraordinary", className: "magic" },
  { name: "Sports", slug: "sports", description: "Moments worth keeping", className: "sports" },
];

export function HomePage() {
  const listings = useListingStore((s) => s.listings);
  const collection = useCollectionStore((s) => s.items);
  const offers = useTradingStore((s) => s.offers);
  const recent = [...listings].filter((l) => l.status === "active").sort((a,b) => b.createdAt.localeCompare(a.createdAt)).slice(0,4);
  const featured = cards[0];
  return <main className="cm-home">
    <section className="cm-home-hero">
      <div className="cm-home-hero-copy">
        <span className="cm-kicker"><span className="cm-kicker-dot"/> THE COLLECTOR'S SPACE</span>
        <h1>Every card<br/>has a <em>story.</em></h1>
        <p>Discover iconic cards, curate your personal collection, and connect with collectors through trading.</p>
        <div className="cm-home-hero-actions"><Link className="cm-btn-dark" to="/discover">Explore cards <ArrowUpRight size={17}/></Link><Link className="cm-btn-text" to="/trading">Start trading <ArrowRight size={17}/></Link></div>
        <div className="cm-home-hero-foot"><span>01 / 04</span><span>DISCOVER · COLLECT · TRADE</span></div>
      </div>
      <div className="cm-home-hero-art">
        <span className="cm-art-orbit cm-art-orbit-one"/><span className="cm-art-orbit cm-art-orbit-two"/>
        <span className="cm-art-index">FEATURED / 001</span>
        {featured && <Link to={`/cards/${featured.id}`} className="cm-feature-card"><img src={featured.image} alt={featured.name}/></Link>}
        <div className="cm-art-caption"><span>THE ICONS COLLECTION</span><strong>{featured?.name ?? "Featured card"}</strong><span>{featured ? money(featured.price) : ""}</span></div>
      </div>
    </section>

    <section className="cm-home-section cm-home-categories">
      <div className="cm-section-heading"><div><span className="cm-kicker">FIND YOUR WORLD</span><h2>Explore by universe<span className="cm-period">.</span></h2></div><Link to="/discover">View all cards <ArrowUpRight size={16}/></Link></div>
      <div className="cm-category-grid">{categories.map((cat,i) => <Link to={`/discover?category=${cat.slug}`} key={cat.slug} className={`cm-category-card cm-category-${cat.className}`}><span className="cm-category-number">0{i+1} / COLLECTION</span><div><h3>{cat.name}</h3><p>{cat.description}</p></div><ArrowUpRight size={22}/></Link>)}</div>
    </section>

    <section className="cm-home-section">
      <div className="cm-section-heading"><div><span className="cm-kicker">FROM THE COMMUNITY</span><h2>Fresh on the market<span className="cm-period">.</span></h2><p>Recently listed cards from collectors.</p></div><Link to="/marketplace">Browse marketplace <ArrowUpRight size={16}/></Link></div>
      {recent.length ? <div className="cm-home-listings">{recent.map((listing) => <ListingCard key={listing.id} listing={listing}/>)}</div> : <div className="cm-home-empty">No active listings yet. <Link to="/sell">Create the first one</Link></div>}
    </section>

    <section className="cm-home-split">
      <div className="cm-home-trade"><span className="cm-kicker">MORE THAN A MARKETPLACE</span><ArrowLeftRight size={40} strokeWidth={1.2}/><h2>Great collections<br/>are built together.</h2><p>Make an offer, find a trade partner, and give your cards a new story.</p><Link to="/trading">Explore trading <ArrowUpRight size={17}/></Link></div>
      <div className="cm-home-collection"><span className="cm-kicker">YOUR COLLECTOR'S CORNER</span><Layers3 size={40} strokeWidth={1.2}/><h2>Your collection.<br/>Your way.</h2><p>{collection.length ? `You have ${collection.length} unique card entries in your collection.` : "Organize what you own, track values and decide what you're ready to trade."}</p><Link to="/my-collection">My collection <ArrowUpRight size={17}/></Link></div>
    </section>
    <section className="cm-home-bottom"><div><Sparkles size={20}/><strong>{cards.length} catalog cards</strong><span>Demo catalog, ready to explore</span></div><div><ArrowLeftRight size={20}/><strong>{offers.length} trade proposals</strong><span>In your local trading center</span></div><div><ShieldCheck size={20}/><strong>Built for collectors</strong><span>Marketplace demo experience</span></div></section>
  </main>;
}
