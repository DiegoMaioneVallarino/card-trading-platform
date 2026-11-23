import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Boxes, CircleDollarSign, ClipboardList, Plus, Search, Store, TrendingUp } from "lucide-react";
import { useListingStore } from "../features/listings/listing.store";
import { DEMO_SELLER_ID } from "../features/listings/listing.data";
import { useProfileStore } from "../features/profile/profile.store";
import type { CardListing } from "../features/listings/listing.types";
import { ListingImage } from "../features/listings/components/ListingImage";
import "./DashboardPage.css";

const money = (value: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(value);
const statusOptions = ["all", "active", "draft", "sold"] as const;
type StatusFilter = typeof statusOptions[number];

export function DashboardPage() {
  const listings = useListingStore((state) => state.listings);
  const updateListing = useListingStore((state) => state.updateListing);
  const removeListing = useListingStore((state) => state.removeListing);
  const profile = useProfileStore((state) => state.profile);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [feedback, setFeedback] = useState("");

  const mine = useMemo(() => listings.filter((listing) => listing.sellerId === DEMO_SELLER_ID), [listings]);
  const active = mine.filter((item) => item.status === "active");
  const draft = mine.filter((item) => item.status === "draft");
  const sold = mine.filter((item) => item.status === "sold");
  const units = active.reduce((total, item) => total + item.quantity, 0);
  const inventoryValue = active.reduce((total, item) => total + item.price * item.quantity, 0);
  const filtered = useMemo(() => mine.filter((item) =>
    (status === "all" || item.status === status) &&
    [item.name, item.collection, item.category, item.rarity].join(" ").toLowerCase().includes(query.trim().toLowerCase())
  ).sort((a,b) => sort === "price-high" ? b.price - a.price : sort === "price-low" ? a.price - b.price : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [mine, status, query, sort]);

  const months = useMemo(() => {
    const now = new Date();
    return Array.from({length: 6}, (_, index) => {
      const start = new Date(now.getFullYear(), now.getMonth() - (5-index), 1);
      const end = new Date(start.getFullYear(), start.getMonth()+1, 1);
      return { key: start.toISOString(), label: start.toLocaleDateString("en-US", { month: "short" }), count: mine.filter(item => {
        const date = new Date(item.createdAt);
        return !Number.isNaN(date.getTime()) && date >= start && date < end;
      }).length };
    });
  }, [mine]);
  const maxCount = Math.max(1, ...months.map(m => m.count));

  function changeStatus(item: CardListing, next: CardListing["status"]) {
    updateListing(item.id, {status: next});
    setFeedback(`${item.name} updated to ${next}.`);
  }
  function deleteListing(item: CardListing) {
    if (!window.confirm(`Remove “${item.name}” from your listings?`)) return;
    removeListing(item.id);
    setFeedback(`${item.name} removed.`);
  }

  return <main className="seller-dashboard">
    <div className="seller-dashboard__topline"><span><Store size={15}/> SELLER STUDIO</span><Link to="/profile">View collector profile <ArrowUpRight size={15}/></Link></div>
    <header className="seller-dashboard__hero"><div><p>Welcome back, {profile.displayName}.</p><h1>Your seller dashboard.</h1><span>Manage your inventory and track your listing activity.</span></div><Link className="seller-dashboard__primary" to="/sell"><Plus size={18}/> New listing</Link></header>
    <div className="seller-dashboard__notice">Demo workspace · Values are calculated from your locally saved listings. No real sales, revenue or traffic analytics are connected.</div>
    <section className="seller-dashboard__stats" aria-label="Seller statistics">
      <div className="seller-dashboard__stat"><span><ClipboardList size={17}/> Total listings</span><strong>{mine.length}</strong><small>All statuses</small></div>
      <div className="seller-dashboard__stat"><span><Store size={17}/> Active listings</span><strong>{active.length}</strong><small>{draft.length} drafts · {sold.length} marked sold</small></div>
      <div className="seller-dashboard__stat"><span><Boxes size={17}/> Available units</span><strong>{units}</strong><small>Across active listings</small></div>
      <div className="seller-dashboard__stat"><span><CircleDollarSign size={17}/> Listed inventory value</span><strong>{money(inventoryValue)}</strong><small>Asking prices, not revenue</small></div>
    </section>
    <div className="seller-dashboard__middle">
      <section className="seller-dashboard__panel"><div className="seller-dashboard__panel-head"><div><span>ACTIVITY</span><h2>Listings created</h2></div><TrendingUp size={19}/></div><p className="seller-dashboard__muted">Last six calendar months · Your listings</p><div className="seller-dashboard__chart" role="img" aria-label={months.map(m=>`${m.label}: ${m.count} listings`).join(", ")}>{months.map((m) => <div className="seller-dashboard__bar-col" key={m.key}><strong>{m.count || ""}</strong><div className="seller-dashboard__bar-track"><div className="seller-dashboard__bar" style={{height: `${m.count ? Math.max(8, m.count/maxCount*100) : 0}%`}}/></div><span>{m.label}</span></div>)}</div></section>
      <section className="seller-dashboard__panel"><div className="seller-dashboard__panel-head"><div><span>QUICK ACCESS</span><h2>Seller tools</h2></div></div><div className="seller-dashboard__shortcuts"><Link to="/sell"><Plus size={18}/><span><strong>Create a listing</strong><small>Add a card for sale</small></span><ArrowUpRight size={17}/></Link><Link to="/my-listings"><ClipboardList size={18}/><span><strong>My listings</strong><small>Browse your inventory</small></span><ArrowUpRight size={17}/></Link><Link to="/my-collection"><Boxes size={18}/><span><strong>My collection</strong><small>Manage owned cards</small></span><ArrowUpRight size={17}/></Link><Link to="/orders"><CircleDollarSign size={18}/><span><strong>Demo purchases</strong><small>Buyer-side mock orders</small></span><ArrowUpRight size={17}/></Link></div></section>
    </div>
    <section className="seller-dashboard__inventory" id="inventory"><div className="seller-dashboard__inventory-head"><div><span>INVENTORY</span><h2>Manage listings</h2></div><span>{filtered.length} shown</span></div>
      <div className="seller-dashboard__toolbar"><div className="seller-dashboard__tabs" aria-label="Filter by status">{statusOptions.map(option => <button type="button" key={option} className={status === option ? "is-active" : ""} onClick={()=>setStatus(option)}>{option === "all" ? "All" : option[0].toUpperCase()+option.slice(1)} <span>{option === "all" ? mine.length : mine.filter(item=>item.status===option).length}</span></button>)}</div><label className="seller-dashboard__search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search your listings" aria-label="Search your listings"/></label><select value={sort} onChange={e=>setSort(e.target.value)} aria-label="Sort listings"><option value="newest">Newest first</option><option value="price-high">Price: high to low</option><option value="price-low">Price: low to high</option></select></div>
      {feedback && <div className="seller-dashboard__feedback" role="status">{feedback}<button type="button" onClick={()=>setFeedback("")} aria-label="Dismiss message">×</button></div>}
      {filtered.length ? <div className="seller-dashboard__table-wrap"><table className="seller-dashboard__table"><thead><tr><th>Card</th><th>Status</th><th>Price</th><th>Qty</th><th>Actions</th></tr></thead><tbody>{filtered.map(item=><tr key={item.id}><td><Link className="seller-dashboard__product" to={`/listings/${item.id}`}><div className="seller-dashboard__thumb"><ListingImage listing={item}/></div><span><strong>{item.name}</strong><small>{item.collection} · {item.condition}</small></span></Link></td><td><span className={`seller-dashboard__status seller-dashboard__status--${item.status}`}>{item.status}</span></td><td>{money(item.price)}</td><td>{item.quantity}</td><td><div className="seller-dashboard__row-actions"><Link to={`/my-listings/${item.id}/edit`}>Edit</Link><select value={item.status} onChange={e=>changeStatus(item,e.target.value as CardListing["status"])} aria-label={`Status of ${item.name}`}><option value="active">Active</option><option value="draft">Draft</option><option value="sold">Sold</option></select><button type="button" onClick={()=>deleteListing(item)}>Remove</button></div></td></tr>)}</tbody></table></div> : <div className="seller-dashboard__empty"><Boxes size={30}/><h3>{mine.length ? "No listings match your filters" : "Your inventory starts here"}</h3><p>{mine.length ? "Try another status or search term." : "Create your first listing to see your seller dashboard come to life."}</p><Link to="/sell">Create listing <ArrowUpRight size={16}/></Link></div>}
    </section>
  </main>;
}
