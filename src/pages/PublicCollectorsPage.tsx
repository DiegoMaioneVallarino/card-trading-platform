import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Users, ArrowUpRight, Layers3 } from "lucide-react";
import { demoTraders } from "../features/trading/trading.store";
import { useListingStore } from "../features/listings/listing.store";
import { useProfileStore } from "../features/profile/profile.store";
import { useCollectionStore } from "../features/collections/collection.store";
import { DEMO_SELLER_ID } from "../features/listings/listing.data";
import "./publicCollectors.css";
export function PublicCollectorsPage() {
 const [query,setQuery]=useState("");
 const profile=useProfileStore(s=>s.profile);
 const listings=useListingStore(s=>s.listings);
 const items=useCollectionStore(s=>s.items);
 const collectors=useMemo(()=>[
  {id:DEMO_SELLER_ID,name:profile.displayName,handle:profile.handle,bio:profile.bio,category:profile.favoriteCategory,count:items.filter(c=>c.visibility!=="private").length},
  ...demoTraders.map(p=>({id:p.id,name:p.name,handle:p.id.replace("collector-",""),bio:p.description,category:"Trading",count:p.cards.length})),
  ...Array.from(new Map(listings.filter(l=>l.sellerId!==DEMO_SELLER_ID && !demoTraders.some(p=>p.id===l.sellerId)).map(l=>[l.sellerId,{id:l.sellerId,name:l.sellerName,handle:l.sellerName.toLowerCase().replace(/[^a-z0-9]/g,""),bio:"Marketplace seller",category:"Marketplace",count:0}])).values())
 ],[profile,listings,items]);
 const filtered=collectors.filter(p=>[p.name,p.handle,p.bio,p.category].join(" ").toLowerCase().includes(query.toLowerCase()));
 return <main className="public-collectors"><div className="pc-hero"><p className="pc-kicker">COMMUNITY / COLLECTORS</p><h1>Meet the collectors<span>.</span></h1><p>Explore public showcases, browse listings and discover collectors open to trading.</p></div><div className="pc-search"><Search size={19}/><input aria-label="Search collectors" placeholder="Search collectors, interests or handles..." value={query} onChange={e=>setQuery(e.target.value)}/><span>{filtered.length} collectors</span></div><div className="pc-grid">{filtered.map(p=><Link to={`/collectors/${encodeURIComponent(p.id)}`} className="pc-card" key={p.id}><div className="pc-avatar">{p.name.slice(0,1).toUpperCase()}</div><div className="pc-card-top"><span>{p.category}</span><ArrowUpRight size={18}/></div><h2>{p.name}</h2><p className="pc-handle">@{p.handle}</p><p className="pc-description">{p.bio}</p><div className="pc-card-footer"><Layers3 size={16}/> {p.count} public cards <span>View profile →</span></div></Link>)}</div>{!filtered.length&&<div className="pc-empty"><Users/><h2>No collectors found</h2><p>Try another search term.</p></div>}<p className="pc-note">Demo directory: profiles and conversations are local to this browser. No public accounts or live network connections.</p></main>;
}
