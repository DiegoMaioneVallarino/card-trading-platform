import { Search, ShoppingBag, UserRound } from "lucide-react";
import "./Header.css";

export function Header() {
  return (
    <header className="site-header">
      <a className="site-header__logo" href="/">
        CARD<span>MARKET</span>
      </a>

      <nav className="site-header__nav">
        <a href="/">Discover</a>
        <a href="/marketplace">Marketplace</a>
        <a href="/collections">Collections</a>
        <a href="/trading">Trading</a>
      </nav>

      <div className="site-header__actions">
        <button aria-label="Search">
          <Search size={19} />
        </button>
        <button aria-label="Account">
          <UserRound size={19} />
        </button>
        <button aria-label="Shopping bag">
          <ShoppingBag size={19} />
        </button>
      </div>
    </header>
  );
}