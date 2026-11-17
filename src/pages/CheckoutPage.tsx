import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LockKeyhole, CheckCircle2 } from "lucide-react";
import { useCartStore } from "../features/cart/cart.store";
import { useListingStore } from "../features/listings/listing.store";
import { useOrderStore } from "../features/orders/order.store";
import { cartSubtotal, money, resolveCart } from "../features/cart/cart.utils";
import "./clientPages.css";
export function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const listings = useListingStore((s) => s.listings);
  const addOrder = useOrderStore((s) => s.addOrder);
  const lines = resolveCart(items, listings);
  const subtotal = cartSubtotal(lines);
  const shipping = lines.length ? 0 : 0;
  const [recipient, setRecipient] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  function placeOrder(e: FormEvent) { e.preventDefault(); if (!lines.length || !recipient.trim() || !email.trim() || !address.trim() || !city.trim() || !postal.trim()) return;
    const id = `DEMO-${Date.now().toString(36).toUpperCase()}`;
    addOrder({ id, createdAt: new Date().toISOString(), items: lines.map((line) => ({ listingId: line.listingId, name: line.listing.name, quantity: Math.min(line.quantity, line.listing.quantity), price: line.listing.price, sellerName: line.listing.sellerName })), subtotal, shipping, total: subtotal + shipping, recipient: recipient.trim(), email: email.trim(), address: `${address.trim()}, ${city.trim()}, ${postal.trim()}`, status: "demo" });
    clearCart(); navigate(`/order-confirmation/${id}`, { replace: true });
  }
  return <main className="client-page"><Link to="/cart" className="client-back"><ArrowLeft size={16} /> Back to bag</Link><div className="client-hero client-hero--compact"><p className="client-kicker">STEP 02 / 02 · DEMONSTRATION</p><h1>Checkout<span className="client-period">.</span></h1><p>Preview the checkout experience. No real purchase will be made.</p></div>
    {lines.length ? <form className="cart-layout" onSubmit={placeOrder}><section className="checkout-form"><div className="client-panel"><h2>Contact information</h2><label>Email address<input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label></div><div className="client-panel"><h2>Delivery details</h2><div className="client-fields"><label>Full name<input required autoComplete="name" value={recipient} onChange={(e) => setRecipient(e.target.value)} /></label><label>Street address<input required autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} /></label><label>City<input required autoComplete="address-level2" value={city} onChange={(e) => setCity(e.target.value)} /></label><label>Postal code<input required autoComplete="postal-code" value={postal} onChange={(e) => setPostal(e.target.value)} /></label></div></div><div className="client-panel"><h2>Payment method</h2><div className="checkout-placeholder"><LockKeyhole size={20} /><div><strong>Demo checkout — no payment</strong><p>Payment details are not collected or processed.</p></div><CheckCircle2 size={18} /></div></div></section><aside className="client-panel cart-summary"><p className="client-kicker">REVIEW ORDER</p><h2>Order summary</h2>{lines.map((line) => <div className="summary-line" key={line.listingId}><span>{line.listing.name} × {Math.min(line.quantity, line.listing.quantity)}</span><strong>{money(line.listing.price * Math.min(line.quantity, line.listing.quantity))}</strong></div>)}<div className="summary-line"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div className="summary-line"><span>Shipping (demo)</span><span>{money(shipping)}</span></div><div className="summary-total"><span>Total</span><strong>{money(subtotal + shipping)}</strong></div><button type="submit" className="client-button client-button--full">Place demo order</button><p className="client-note">No inventory is reserved, no seller is notified, and no charge is made. Enter sample contact details only.</p></aside></form> : <div className="client-empty"><h3>Nothing to check out</h3><p>Add an available listing to your bag first.</p><Link className="client-button" to="/marketplace">Browse marketplace</Link></div>}
  </main>;
}
