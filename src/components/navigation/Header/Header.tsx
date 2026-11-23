import { useState } from "react";
import { Search, ShoppingBag, UserRound, Menu, X, Heart, Bell, MessageCircle } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { SearchPanel } from "../../../features/marketplace/components/SearchPanel/SearchPanel";
import { useCartStore } from "../../../features/cart/cart.store";
import { useMessagingStore, unreadThreadCount } from "../../../features/messaging.store";
import { useNotificationsStore } from "../../../features/notifications.store";
import { useTradingStore } from "../../../features/trading/trading.store";
import "./Header.css";
export function Header() {
 const [searchOpen, setSearchOpen] = useState(false);
 const [menuOpen, setMenuOpen] = useState(false);
 const unreadMessages = useMessagingStore(unreadThreadCount);
 const offers = useTradingStore(s=>s.offers);
 const messages = useMessagingStore(s=>s.messages);
 const readIds = useNotificationsStore(s=>s.readIds);
 const notificationCount = offers.filter(o=>!readIds.includes(`trade-${o.id}-${o.status}-${o.revision}`)).length + messages.filter(m=>m.author==="them" && !readIds.includes(`message-${m.id}`)).length;
 const cartCount = useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));
 const nav = [{ to: "/", label: "Home" }, { to: "/discover", label: "Discover" }, { to: "/marketplace", label: "Marketplace" }, { to: "/collections", label: "Collections" }, { to: "/catalog", label: "Catalog" }, { to: "/collectors", label: "Collectors" }, { to: "/my-collection", label: "My collection" }, { to: "/trading", label: "Trading" }, { to: "/sell", label: "Sell a Card" }, { to: "/my-listings", label: "My Listings" }, { to: "/seller/dashboard", label: "Seller Dashboard" }, { to: "/orders", label: "Demo Orders" }, { to: "/messages", label: "Messages" }, { to: "/notifications", label: "Notifications" }];
 return <><header className="site-header"><Link className="site-header__logo" to="/">CARD<span>MARKET</span></Link><nav className="site-header__nav">{nav.slice(0,7).map((item) => <NavLink key={item.to} to={item.to}>{item.label}</NavLink>)}</nav><div className="site-header__actions"><button type="button" aria-label="Search cards" onClick={() => setSearchOpen(true)}><Search size={19}/></button><Link className="header-notice" to="/messages" aria-label={`Messages, ${unreadMessages} unread`}><MessageCircle size={19}/>{unreadMessages>0&&<span className="header-cart-count">{unreadMessages}</span>}</Link><Link className="header-notice" to="/notifications" aria-label={`Notifications, ${notificationCount} unread`}><Bell size={19}/>{notificationCount>0&&<span className="header-cart-count">{notificationCount}</span>}</Link><Link to="/favorites" aria-label="Favorites"><Heart size={19}/></Link><Link to="/profile" aria-label="My profile"><UserRound size={19}/></Link><Link className="header-cart" to="/cart" aria-label={`Shopping bag, ${cartCount} items`}><ShoppingBag size={19}/>{cartCount > 0 && <span className="header-cart-count">{cartCount}</span>}</Link><button className="header-menu-button" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={21}/> : <Menu size={21}/>}</button></div></header>{menuOpen && <nav className="header-mobile-nav">{nav.map((item) => <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)}>{item.label}</Link>)}<Link to="/profile" onClick={() => setMenuOpen(false)}>My profile</Link><Link to="/favorites" onClick={() => setMenuOpen(false)}>Favorites</Link><Link to="/cart" onClick={() => setMenuOpen(false)}>Shopping bag ({cartCount})</Link></nav>}<SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)}/></>;
}
