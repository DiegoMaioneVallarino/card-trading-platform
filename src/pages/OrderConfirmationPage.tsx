import { Link, useParams } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useOrderStore } from "../features/orders/order.store";
import { money } from "../features/cart/cart.utils";
import "./clientPages.css";
export function OrderConfirmationPage() {
  const { orderId } = useParams();
  const order = useOrderStore((s) => s.orders.find((o) => o.id === orderId));
  return <main className="client-page"><div className="client-empty client-empty--confirmation"><CheckCircle2 size={45} /><p className="client-kicker">CHECKOUT DEMONSTRATION</p><h1>{order ? "Demo order created." : "Order not found."}</h1><p>{order ? `Reference ${order.id} · ${money(order.total)} · ${order.items.length} item(s)` : "This demo order isn't saved in this browser."}</p><p className="client-note">{order ? "This is not a real purchase. No money was charged, no inventory was changed, and no seller was contacted." : "Please return to your profile or marketplace."}</p><div className="client-hero-actions"><Link className="client-button" to="/orders">View demo orders <ArrowRight size={16} /></Link><Link className="client-button client-button--light" to="/marketplace">Continue exploring</Link></div></div></main>;
}
