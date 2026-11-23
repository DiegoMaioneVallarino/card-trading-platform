import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowLeftRight, MessageCircle, MapPin, Layers3, Package, UserRound } from "lucide-react";
import { demoTraders, type TradeCard } from "../features/trading/trading.store";
import { useCollectionStore } from "../features/collections/collection.store";
import { useListingStore } from "../features/listings/listing.store";
import { useProfileStore } from "../features/profile/profile.store";
import { useMessagingStore } from "../features/messaging.store";
import { DEMO_SELLER_ID } from "../features/listings/listing.data";
import { money } from "../features/cart/cart.utils";
import "./publicCollectors.css";
export function PublicCollectorProfilePage(){
 const {collectorId}=useParams<{collectorId:string}>();
 const navigate=useNavigate();
 const profile=useProfileStore(s=>s.profile);
 const items=useCollectionStore(s=>s.items);
 const listings=useListingStore(s=>s.listings);
 const openThread=useMessagingStore(s=>s.openThread);
 const trader=demoTraders.find(p=>p.id===collectorId);
 const isMe=collectorId===DEMO_SELLER_ID;
 const sellerListings=listings.filter(l=>l.sellerId===collectorId&&l.status==="active");
 const seller=sellerListings[0]??listings.find(l=>l.sellerId===collectorId);
 if(!isMe&&!trader&&!seller)return <main className="public-collectors pc-empty"><UserRound size={30}/><h1>Collector not found</h1><Link to="/collectors">Back to collectors</Link></main>;
 const name=isMe?profile.displayName:trader?.name??seller?.sellerName??"Collector";
 const description=isMe?profile.bio:trader?.description??"Marketplace seller";
 const publicCards:TradeCard[]=isMe?items.filter(i=>i.visibility!=="private").map(i=>({id:i.id,name:i.name,image:i.image,collection:i.collection,estimatedValue:i.estimatedValue,quantity:i.quantity})):trader?.cards??[];
 const tradeCount=isMe?items.filter(i=>i.visibility==="trade").length:trader?.cards.length??0;
 const startChat=()=>{if(!collectorId||isMe)return;const id=openThread(collectorId,name,"Collector profile");navigate(`/messages/${id}`);};
 return <main className="public-collectors"><Link className="pc-back" to="/collectors"><ArrowLeft size={17}/> All collectors</Link><div className="pc-profile-cover"><span>COLLECTOR COMMUNITY</span></div><div className="pc-profile-header"><div className="pc-profile-identity"><div className="pc-avatar pc-avatar-large">{name.slice(0,1).toUpperCase()}</div><div><p className="pc-kicker">{isMe?"YOUR PUBLIC PREVIEW":"COLLECTOR PROFILE · DEMO"}</p><h1>{name}</h1><p>{isMe?`@${profile.handle}`:trader?`@${trader.id.replace("collector-","")}`:`@${seller?.sellerName}`}{isMe&&<> · <MapPin size={13} style={{display:"inline"}}/> {profile.location}</>}</p></div></div><div className="pc-actions">{isMe?<Link className="pc-button" to="/profile">Edit my profile</Link>:<><button className="pc-button" onClick={startChat}><MessageCircle size={16}/> Message</button>{trader&&<Link className="pc-button pc-button-dark" to={`/trading?collector=${encodeURIComponent(trader.id)}`}><ArrowLeftRight size={16}/> Propose trade</Link>}</>}</div></div><p className="pc-profile-bio">{description}</p><div className="pc-metrics"><div><Layers3/><strong>{publicCards.length}</strong><span>Public cards</span></div><div><ArrowLeftRight/><strong>{tradeCount}</strong><span>Open to trade</span></div><div><Package/><strong>{sellerListings.length}</strong><span>Active listings</span></div></div><div className="pc-section-heading"><div><p className="pc-kicker">PUBLIC SHOWCASE</p><h2>Collector's cards</h2></div></div>{publicCards.length?<div className="pc-items">{publicCards.map(c=><article className="pc-item" key={c.id}><div className="pc-item-image">{c.image?<img src={c.image} alt={c.name}/>:<Layers3 size={34}/>}</div><div className="pc-item-content"><h3>{c.name}</h3><p>{c.collection}</p><strong>{money(c.estimatedValue)}</strong><small>Quantity: {c.quantity}</small></div></article>)}</div>:<div className="pc-empty"><Layers3/><h3>No public cards yet</h3><p>Private cards are never shown on this page.</p></div>}<div className="pc-section-heading"><div><p className="pc-kicker">MARKETPLACE</p><h2>Active listings</h2></div></div>{sellerListings.length?<div className="pc-items">{sellerListings.map(l=><Link to={`/listings/${l.id}`} className="pc-item" key={l.id}><div className="pc-item-image">{l.image?<img src={l.image} alt={l.name}/>:<Package/>}</div><div className="pc-item-content"><h3>{l.name}</h3><p>{l.collection} · {l.condition}</p><strong>{money(l.price)}</strong><small>View listing →</small></div></Link>)}</div>:<p className="pc-note">No active marketplace listings for this collector.</p>}<p className="pc-note">Public profiles are previews based on local demo data. Messages and trade offers are not delivered to real people.</p></main>;
}
