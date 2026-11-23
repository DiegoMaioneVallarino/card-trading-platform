import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Camera, MapPin, Package, Heart, Layers3, Pencil } from "lucide-react";
import { useProfileStore } from "../features/profile/profile.store";
import { useCollectionStore } from "../features/collections/collection.store";
import { useListingStore } from "../features/listings/listing.store";
import { useFavoritesStore } from "../store/favorites.store";
import { DEMO_SELLER_ID } from "../features/listings/listing.data";
import { money } from "../features/cart/cart.utils";
import "./clientPages.css";
export function ProfilePage() {
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const items = useCollectionStore((s) => s.items);
  const listings = useListingStore((s) => s.listings);
  const favorites = useFavoritesStore((s) => s.favorites);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const active = listings.filter((l) => l.sellerId === DEMO_SELLER_ID && l.status === "active").length;
  function save(e: FormEvent) { e.preventDefault(); updateProfile({ ...draft, displayName: draft.displayName.trim() || profile.displayName, handle: draft.handle.trim().replace(/[^a-zA-Z0-9_]/g, "") || profile.handle }); setEditing(false); }
  return <main className="client-page">
    <div className="profile-cover"><span>THE COLLECTOR CLUB</span><div className="profile-avatar">{profile.displayName.slice(0, 1).toUpperCase()}</div></div>
    <div className="profile-heading"><div><p className="client-kicker">COLLECTOR PROFILE · DEMO ACCOUNT</p><h1>{profile.displayName}</h1><p className="client-muted">@{profile.handle} <span className="profile-dot">·</span> <MapPin size={13} /> {profile.location}</p></div><button className="client-button client-button--light" onClick={() => { setDraft(profile); setEditing((v) => !v); }}><Pencil size={16} /> {editing ? "Cancel" : "Edit profile"}</button></div>
    {editing && <form className="client-panel profile-form" onSubmit={save}><div className="client-fields"><label>Display name<input value={draft.displayName} maxLength={50} onChange={(e) => setDraft({ ...draft, displayName: e.target.value })} /></label><label>Username<input value={draft.handle} maxLength={30} onChange={(e) => setDraft({ ...draft, handle: e.target.value })} /></label><label>Location<input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} /></label><label>Favorite category<input value={draft.favoriteCategory} onChange={(e) => setDraft({ ...draft, favoriteCategory: e.target.value })} /></label></div><label>Bio<textarea rows={3} value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} /></label><button className="client-button">Save profile</button></form>}
    <p className="profile-bio">{profile.bio}</p><p><Link to={`/collectors/${DEMO_SELLER_ID}`}>View my public profile preview →</Link> · <Link to="/collectors">Browse collectors →</Link></p>
    <div className="profile-stats"><div><Layers3 size={18} /><strong>{items.reduce((n, item) => n + item.quantity, 0)}</strong><span>Cards owned</span></div><div><Package size={18} /><strong>{active}</strong><span>Active listings</span></div><div><Heart size={18} /><strong>{favorites.length}</strong><span>Favorites</span></div><div><Camera size={18} /><strong>{money(items.reduce((n, item) => n + item.estimatedValue * item.quantity, 0))}</strong><span>Estimated collection value</span></div></div>
    <div className="client-section-head"><div><p className="client-kicker">YOUR SPACE</p><h2>Collector dashboard</h2></div></div>
    <div className="profile-links"><Link to="/my-collection"><Layers3 /><strong>My collection</strong><span>Organize cards you own, track their value and trade status.</span><b>Explore collection →</b></Link><Link to="/my-listings"><Package /><strong>My listings</strong><span>Manage your active sale listings and pricing.</span><b>Manage listings →</b></Link><Link to="/favorites"><Heart /><strong>Saved cards</strong><span>Return to the cards you bookmarked.</span><b>View favorites →</b></Link></div>
    <p className="client-note">This is a local demo profile. No account or public profile is created.</p>
  </main>;
}
