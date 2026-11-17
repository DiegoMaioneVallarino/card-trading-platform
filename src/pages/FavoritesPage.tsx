import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useFavoritesStore } from "../store/favorites.store";
import { cards } from "../features/cards/card.data";
import { CardItem } from "../features/cards/components/CardItem";
import "./clientPages.css";
export function FavoritesPage() {
 const favorites = useFavoritesStore((s) => s.favorites);
 const selected = cards.filter((card) => favorites.includes(card.id));
 return <main className="client-page"><div className="client-hero"><p className="client-kicker">YOUR SHORTLIST</p><h1>Saved cards<span className="client-period">.</span></h1><p>All the catalog cards you've bookmarked.</p></div>{selected.length ? <div className="collection-grid">{selected.map((card) => <CardItem key={card.id} card={card} />)}</div> : <div className="client-empty"><Heart size={36} /><h3>No favorites yet</h3><p>Tap the heart on a catalog card to save it here.</p><Link className="client-button" to="/marketplace">Explore cards</Link></div>}</main>;
}
