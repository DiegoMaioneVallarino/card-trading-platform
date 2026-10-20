import { useState } from "react";
import { Search, ShoppingBag, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

import { SearchPanel } from "../../../features/marketplace/components/SearchPanel/SearchPanel";

import "./Header.css";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <Link className="site-header__logo" to="/">
          CARD<span>MARKET</span>
        </Link>

        <nav className="site-header__nav">
<Link to="/sell">Sell a Card</Link>
<Link to="/my-listings">My Listings</Link>          <Link to="/">Discover</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/collections">Collections</Link>
          <Link to="/trading">Trading</Link>
        </nav>

        <div className="site-header__actions">
          <button
            type="button"
            aria-label="Search cards"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={19} />
          </button>

          <button type="button" aria-label="Account">
            <UserRound size={19} />
          </button>

          <button type="button" aria-label="Shopping bag">
            <ShoppingBag size={19} />
          </button>
        </div>
      </header>

      <SearchPanel
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}