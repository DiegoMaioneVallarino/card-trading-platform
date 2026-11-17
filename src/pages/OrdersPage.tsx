import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { useOrderStore } from "../features/orders/order.store";
import { money } from "../features/cart/cart.utils";
import "./clientPages.css";
export function OrdersPage() {
  const orders = useOrderStore((s) => s.orders);
  return <main className="client-page"><div className="client-hero"><p className="client-kicker">LOCAL DEMONSTRATION</p><h1>Demo orders<span className="client-period">.</span></h1><p>Past checkout previews saved in this browser. No real transactions.</p></div>{orders.length ? <div className="orders-list">{orders.map((order) => <article className="client-panel" key={order.id}><div className="client-section-head"><div><p className="client-kicker">{new Date(order.createdAt).toLocaleDateString("en-US")}</p><h2>{order.id}</h2></div><strong>{money(order.total)}</strong></div><p>{order.items.map((item) => `${item.name} × ${item.quantity}`).join(" · ")}</p><small>Demo only · No payment or fulfillment</small></article>)}</div> : <div className="client-empty"><Package size={36} /><h3>No demo orders yet</h3><p>Your checkout previews will appear here.</p><Link className="client-button" to="/marketplace">Browse cards</Link></div>}</main>;
}
