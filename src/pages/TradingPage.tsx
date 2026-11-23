import { useMemo, useState, type FormEvent } from "react";
import { ArrowLeftRight, Check, ChevronRight, Plus, RefreshCw, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useCollectionStore } from "../features/collections/collection.store";
import { money } from "../features/cart/cart.utils";
import { demoTraders, toTradeCard, tradeTotal, useTradingStore, type TradeCard, type TradeOffer } from "../features/trading/trading.store";
import "./TradingPage.css";

function CardLine({ card, onRemove }: { card: TradeCard; onRemove?: () => void }) {
 return <div className="trade-card-line"><div className="trade-card-art">{card.image ? <img src={card.image} alt="" /> : <ArrowLeftRight size={22} />}</div><div className="trade-card-copy"><strong>{card.name}</strong><span>{card.collection} · Qty {card.quantity}</span></div><b>{money(card.estimatedValue * card.quantity)}</b>{onRemove && <button type="button" onClick={onRemove} aria-label={`Remove ${card.name}`}><X size={15}/></button>}</div>;
}
function OfferCard({ offer }: { offer: TradeOffer }) {
 const cancel = useTradingStore((s) => s.cancelOffer);
 const respond = useTradingStore((s) => s.respondToOffer);
 const counter = useTradingStore((s) => s.counterOffer);
 const [countering, setCountering] = useState(false);
 const [cash, setCash] = useState(String(offer.cashAdjustment));
 const [message, setMessage] = useState(offer.message);
 const active = offer.status === "pending" || offer.status === "countered";
 return <article className="trade-offer"><div className="trade-offer-head"><div><span className="trade-kicker">{offer.direction === "incoming" ? "INCOMING OFFER" : "SENT OFFER"} · {new Date(offer.createdAt).toLocaleDateString()}</span><h3><Link to={`/collectors/${encodeURIComponent(offer.partnerId)}`}>{offer.partnerName}</Link></h3></div><span className={`trade-status trade-status--${offer.status}`}>{offer.status}</span></div>
 <div className="trade-offer-sides"><div><h4>{offer.direction === "outgoing" ? "You offer" : "They offer"}</h4>{offer.offered.length ? offer.offered.map((c) => <CardLine key={c.id} card={c}/>) : <p className="trade-muted">No cards selected</p>}<strong className="trade-total">{money(tradeTotal(offer.offered))}</strong></div><div><h4>{offer.direction === "outgoing" ? "You request" : "They request"}</h4>{offer.requested.length ? offer.requested.map((c) => <CardLine key={c.id} card={c}/>) : <p className="trade-muted">No cards specified</p>}<strong className="trade-total">{money(tradeTotal(offer.requested))}</strong></div></div>
 <p className="trade-offer-note">{offer.message || "No message"}</p><p className="trade-muted">Cash adjustment: {money(offer.cashAdjustment)} · Revision {offer.revision}</p>
 {active && <div className="trade-offer-actions">{offer.direction === "outgoing" ? <button className="trade-button trade-button--ghost" onClick={() => cancel(offer.id)}>Cancel offer</button> : <><button className="trade-button" onClick={() => respond(offer.id,"accepted")}><Check size={15}/> Accept demo</button><button className="trade-button trade-button--ghost" onClick={() => respond(offer.id,"declined")}>Decline</button><button className="trade-button trade-button--ghost" onClick={() => setCountering(!countering)}>Counteroffer</button></>}</div>}
 {countering && active && offer.direction === "incoming" && <form className="trade-counter" onSubmit={(e) => { e.preventDefault(); if (!Number.isFinite(Number(cash)) || Number(cash) < 0) return; counter(offer.id,{ cashAdjustment:Number(cash),message }); setCountering(false); }}><label>Suggested cash adjustment (MXN)<input type="number" min="0" step="0.01" value={cash} onChange={(e)=>setCash(e.target.value)} /></label><label>Message<textarea value={message} onChange={(e)=>setMessage(e.target.value)} /></label><button className="trade-button" type="submit">Save demo counteroffer</button><p className="trade-muted">This changes the local mock offer only; no other user receives it.</p></form>}</article>;
}
export function TradingPage() {
 const items = useCollectionStore((s) => s.items);
 const offers = useTradingStore((s) => s.offers);
 const createOffer = useTradingStore((s) => s.createOffer);
 const [tab, setTab] = useState<"all" | "incoming" | "outgoing">("all");
 const [creating, setCreating] = useState(false);
 const [searchParams] = useSearchParams();
 const [partnerId, setPartnerId] = useState(() => demoTraders.some(p=>p.id===searchParams.get("collector")) ? searchParams.get("collector")! : demoTraders[0].id);
 const [mine, setMine] = useState<string[]>([]);
 const [theirs, setTheirs] = useState<string[]>([]);
 const [cash, setCash] = useState("0");
 const [message, setMessage] = useState("");
 const [error, setError] = useState("");
 const partner = demoTraders.find((p) => p.id === partnerId) ?? demoTraders[0];
 const tradable = useMemo(() => items.filter((item) => item.visibility === "trade" && item.quantity > 0), [items]);
 const selectedMine = tradable.filter((item) => mine.includes(item.id)).map(toTradeCard);
 const selectedTheirs = partner.cards.filter((item) => theirs.includes(item.id));
 const visibleOffers = offers.filter((offer) => tab === "all" || offer.direction === tab);
 function toggle(id: string, selected: string[], set: (ids: string[]) => void) { set(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected,id]); }
 function submit(e: FormEvent) { e.preventDefault(); const adjustment = Number(cash); if (!selectedMine.length || !selectedTheirs.length) { setError("Select at least one card from each side."); return; } if (!Number.isFinite(adjustment) || adjustment < 0) { setError("Enter a valid non-negative cash adjustment."); return; } createOffer({ partnerId:partner.id,partnerName:partner.name,offered:selectedMine,requested:selectedTheirs,cashAdjustment:adjustment,message:message.trim() }); setCreating(false); setMine([]); setTheirs([]); setCash("0"); setMessage(""); setError(""); setTab("outgoing"); }
 return <main className="trade-page"><div className="trade-hero"><div><p className="trade-kicker">COLLECTOR EXCHANGE · LOCAL DEMO</p><h1>Trading center<span>.</span></h1><p>Build an offer from your collection, explore demo collectors and manage negotiations.</p></div><button className="trade-button" onClick={()=>setCreating(!creating)}>{creating ? <X size={17}/> : <Plus size={17}/>} {creating ? "Close composer" : "New trade offer"}</button></div>
 <p className="trade-muted">Explore <Link to="/collectors">collector profiles</Link> to discover their public cards.</p>
 <div className="trade-metrics"><div><span>ALL OFFERS</span><strong>{offers.length}</strong></div><div><span>AWAITING ACTION</span><strong>{offers.filter((o)=>o.status === "pending" || o.status === "countered").length}</strong></div><div><span>YOUR TRADE CARDS</span><strong>{tradable.length}</strong></div><div><span>ACCEPTED DEMOS</span><strong>{offers.filter((o)=>o.status === "accepted").length}</strong></div></div>
 {creating && <form className="trade-composer" onSubmit={submit}><div className="trade-section-head"><div><p className="trade-kicker">CREATE AN OFFER</p><h2>Build your trade</h2></div><button type="button" className="trade-link" onClick={()=>{setMine([]);setTheirs([]);setCash("0");setMessage("");setError("");}}><RefreshCw size={15}/> Clear</button></div><label className="trade-partner">Trade with <select value={partnerId} onChange={(e)=>{setPartnerId(e.target.value);setTheirs([]);}}>{demoTraders.map((p)=><option key={p.id} value={p.id}>{p.name} — {p.description}</option>)}</select></label><div className="trade-columns"><section><h3>Your offer <span>{selectedMine.length} selected</span></h3><p className="trade-muted">Only cards marked Open to trade appear here.</p>{tradable.length ? tradable.map((item)=><label className="trade-select-card" key={item.id}><input type="checkbox" checked={mine.includes(item.id)} onChange={()=>toggle(item.id,mine,setMine)}/><CardLine card={toTradeCard(item)}/></label>) : <div className="trade-empty-mini">No tradable cards yet. <Link to="/my-collection">Open your collection <ChevronRight size={13}/></Link> and set a card to Open to trade.</div>}<strong className="trade-total">Your total: {money(tradeTotal(selectedMine))}</strong></section><section><h3>Request from {partner.name} <span>{selectedTheirs.length} selected</span></h3><p className="trade-muted">Demo inventory — not real listings.</p>{partner.cards.map((item)=><label className="trade-select-card" key={item.id}><input type="checkbox" checked={theirs.includes(item.id)} onChange={()=>toggle(item.id,theirs,setTheirs)}/><CardLine card={item}/></label>)}<strong className="trade-total">Their total: {money(tradeTotal(selectedTheirs))}</strong></section></div><div className="trade-summary"><span>Estimated difference (your cards − requested cards)</span><strong>{money(tradeTotal(selectedMine)-tradeTotal(selectedTheirs))}</strong></div><div className="trade-form-fields"><label>Optional cash adjustment (MXN)<input type="number" min="0" step="0.01" value={cash} onChange={(e)=>setCash(e.target.value)}/></label><label>Message<textarea placeholder="Tell the collector why you'd like to trade..." value={message} onChange={(e)=>setMessage(e.target.value)} rows={3}/></label></div>{error && <p className="trade-error" role="alert">{error}</p>}<button className="trade-button" type="submit" disabled={!selectedMine.length || !selectedTheirs.length}>Send demo offer <ArrowLeftRight size={17}/></button><p className="trade-muted">Offers are stored only in this browser. Sending does not contact another person or transfer cards.</p></form>}
 <div className="trade-section-head trade-history"><div><p className="trade-kicker">YOUR ACTIVITY</p><h2>Trade offers</h2></div><div className="trade-tabs">{(["all","incoming","outgoing"] as const).map((value)=><button key={value} className={tab===value ? "active" : ""} onClick={()=>setTab(value)}>{value === "all" ? "All" : value === "incoming" ? "Incoming" : "Sent"}</button>)}</div></div>
 {visibleOffers.length ? <div className="trade-offers">{visibleOffers.map((offer)=><OfferCard key={offer.id} offer={offer}/>)}</div> : <div className="trade-empty"><ArrowLeftRight size={32}/><h3>No offers here yet</h3><p>Start by creating a trade proposal with a demo collector.</p><button className="trade-button" onClick={()=>setCreating(true)}>Create an offer</button></div>}
 <p className="trade-disclaimer">Prototype only. Accepted trades do not change collection ownership, process money, or notify other collectors.</p></main>;
}
