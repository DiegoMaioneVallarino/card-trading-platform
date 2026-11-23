import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, ArrowUpRight, SlidersHorizontal, X } from "lucide-react";
import { cards } from "../features/cards/card.data";
import type { CardCategory } from "../features/cards/card.types";
import { useListingStore } from "../features/listings/listing.store";
import { CardItem } from "../features/cards/components/CardItem";
import { ListingCard } from "../features/listings/components/ListingCard";
import "./DiscoverPage.css";

type Category = "all" | CardCategory;
type View = "all" | "catalog" | "listings";
const categoryOptions: { label: string; value: Category }[] = [{ label: "All", value: "all" },{ label: "Pokémon", value: "pokemon" },{ label: "Yu-Gi-Oh!", value: "yugioh" },{ label: "Magic", value: "magic" },{ label: "Sports", value: "sports" }];
export function DiscoverPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const category = categoryOptions.some((x) => x.value === params.get("category")) ? params.get("category") as Category : "all";
  const [view, setView] = useState<View>("all");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const listings = useListingStore((s) => s.listings);
  function changeParam(key: string, value: string) { const next = new URLSearchParams(params); if (value && value !== "all") next.set(key,value); else next.delete(key); setParams(next); }
  const matches = (item: {name: string; collection: string; rarity: string; category: CardCategory; price: number}, extra = "") => (category === "all" || item.category === category) && `${item.name} ${item.collection} ${item.rarity} ${extra}`.toLowerCase().includes(query.trim().toLowerCase()) && (!maxPrice || item.price <= Number(maxPrice));
  const catalogResults = useMemo(() => cards.filter((c) => matches(c,c.seller)).sort((a,b) => sort === "low" ? a.price-b.price : sort === "high" ? b.price-a.price : sort === "name" ? a.name.localeCompare(b.name) : 0),[query,category,maxPrice,sort]);
  const listingResults = useMemo(() => listings.filter((l) => l.status === "active" && matches(l,l.sellerName)).sort((a,b) => sort === "low" ? a.price-b.price : sort === "high" ? b.price-a.price : sort === "name" ? a.name.localeCompare(b.name) : b.createdAt.localeCompare(a.createdAt)),[listings,query,category,maxPrice,sort]);
  const count = (view === "listings" ? 0 : catalogResults.length) + (view === "catalog" ? 0 : listingResults.length);
  return <main className="cm-discover">
    <header className="cm-discover-intro"><span className="cm-kicker">CURATED FOR THE CURIOUS</span><h1>Discover<span className="cm-period">.</span></h1><p>Find your next favorite card. Explore the catalog and discover listings from the community.</p></header>
    <div className="cm-discover-search"><Search size={21}/><input aria-label="Search cards and listings" placeholder="Search cards, sets, rarities, collectors..." value={query} onChange={(e) => changeParam("q",e.target.value)}/>{query && <button aria-label="Clear search" onClick={() => changeParam("q","")}><X size={18}/></button>}</div>
    <div className="cm-discover-category-row">{categoryOptions.map((c) => <button key={c.value} className={category === c.value ? "active" : ""} onClick={() => changeParam("category",c.value)}>{c.label}</button>)}</div>
    <div className="cm-discover-toolbar"><div className="cm-discover-tabs">{([{value:"all",label:"All results"},{value:"catalog",label:"Catalog"},{value:"listings",label:"For sale"}] as const).map((t) => <button key={t.value} className={view === t.value ? "active" : ""} onClick={() => setView(t.value)}>{t.label}</button>)}</div><div className="cm-discover-controls"><button className={filtersOpen ? "active" : ""} onClick={() => setFiltersOpen(!filtersOpen)}><SlidersHorizontal size={16}/> Filters</button><select aria-label="Sort results" value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Featured / Newest</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="name">Name: A–Z</option></select></div></div>
    {filtersOpen && <div className="cm-discover-filter-panel"><label>Maximum price (MXN)<input type="number" min="0" placeholder="No limit" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}/></label><button onClick={() => {setMaxPrice("");changeParam("category","all")}}>Reset filters</button></div>}
    <div className="cm-discover-count">{count} {count === 1 ? "result" : "results"}{query ? ` for “${query}”` : ""}</div>
    {view !== "listings" && catalogResults.length > 0 && <section className="cm-discover-results"><div className="cm-discover-section-head"><div><span className="cm-kicker">REFERENCE LIBRARY</span><h2>Catalog cards</h2></div><span>{catalogResults.length} cards</span></div><div className="cm-discover-grid">{catalogResults.map((c) => <CardItem key={c.id} card={c}/>)}</div></section>}
    {view !== "catalog" && listingResults.length > 0 && <section className="cm-discover-results"><div className="cm-discover-section-head"><div><span className="cm-kicker">COLLECTOR MARKETPLACE</span><h2>Available listings</h2></div><Link to="/marketplace">Full marketplace <ArrowUpRight size={15}/></Link></div><div className="cm-discover-grid">{listingResults.map((l) => <ListingCard key={l.id} listing={l}/>)}</div></section>}
    {count === 0 && <div className="cm-discover-empty"><Search size={30}/><h2>No cards found</h2><p>Try a different search or remove your filters.</p><button onClick={() => {setParams({});setMaxPrice("");setView("all")}}>Clear all filters</button></div>}
    <aside className="cm-discover-end"><span>HAVE SOMETHING SPECIAL?</span><h2>Share a card with the community.</h2><Link to="/sell">Create a listing <ArrowUpRight size={17}/></Link></aside>
  </main>;
}
