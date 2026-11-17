import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight, Trash2, Minus, Plus } from "lucide-react";
import { useCartStore } from "../features/cart/cart.store";
import { cartSubtotal, money, resolveCart } from "../features/cart/cart.utils";
import { useListingStore } from "../features/listings/listing.store";
import { ListingImage } from "../features/listings/components/ListingImage";
import "./clientPages.css";
export function CartPage() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const listings = useListingStore((s) => s.listings);
  const lines = resolveCart(items, listings);
  const subtotal = cartSubtotal(lines);
  const invalid = items.filter((item) => !lines.some((line) => line.listingId === item.listingId));
  return <main className="client-page"><div className="client-hero"><p className="client-kicker">YOUR SELECTION</p><h1>Shopping bag<span className="client-period">.</span></h1><p>Review your finds before placing a demo order.</p></div>
    {lines.length || invalid.length ? <div className="cart-layout"><section><div className="client-section-head"><h2>Your bag <span className="client-muted">({lines.length})</span></h2><Link to="/marketplace" className="client-text-button">Continue shopping →</Link></div>{lines.map((line) => <article className="cart-row" key={line.listingId}><Link to={`/listings/${line.listingId}`} className="cart-row-image"><ListingImage listing={line.listing} /></Link><div className="cart-row-info"><small>{line.listing.collection} · {line.listing.condition}</small><Link to={`/listings/${line.listingId}`}><h3>{line.listing.name}</h3></Link><p>Sold by {line.listing.sellerName}</p><div className="cart-qty"><button aria-label="Decrease quantity" disabled={line.quantity <= 1} onClick={() => setQuantity(line.listingId, line.quantity - 1, line.listing.quantity)}><Minus size={14} /></button><span>{Math.min(line.quantity, line.listing.quantity)}</span><button aria-label="Increase quantity" disabled={line.quantity >= line.listing.quantity} onClick={() => setQuantity(line.listingId, line.quantity + 1, line.listing.quantity)}><Plus size={14} /></button></div></div><div className="cart-row-end"><strong>{money(line.listing.price * Math.min(line.quantity, line.listing.quantity))}</strong><button className="client-text-button" onClick={() => removeItem(line.listingId)}><Trash2 size={15} /> Remove</button></div></article>)}{invalid.map((line) => <div className="cart-invalid" key={line.listingId}>An item is no longer available. <button className="client-text-button" onClick={() => removeItem(line.listingId)}>Remove</button></div>)}</section><aside className="client-panel cart-summary"><p className="client-kicker">ORDER SUMMARY</p><h2>Overview</h2><div className="summary-line"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div className="summary-line"><span>Shipping</span><span>Calculated at checkout</span></div><div className="summary-total"><span>Estimated total</span><strong>{money(subtotal)}</strong></div>{lines.length ? <Link to="/checkout" className="client-button client-button--full">Continue to checkout <ArrowRight size={17} /></Link> : <button className="client-button client-button--full" disabled>Continue to checkout</button>}<p className="client-note">Demo checkout only. No payments will be collected.</p></aside></div> : <div className="client-empty"><ShoppingBag size={36} /><h3>Your bag is empty</h3><p>Explore the marketplace to find something worth collecting.</p><Link to="/marketplace" className="client-button">Explore cards <ArrowRight size={16} /></Link></div>}
  </main>;
}
