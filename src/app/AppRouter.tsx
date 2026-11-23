import { HomePage } from "../pages/HomePage";
import { DiscoverPage } from "../pages/DiscoverPage";
import { TradingPage } from "../pages/TradingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { MarketplacePage } from "../pages/MarketplacePage";
import { CardDetailPage } from "../pages/CardDetailPage";
import { SellPage } from "../pages/SellPage";
import { MyListingsPage } from "../pages/MyListingsPage";
import { ListingDetailPage } from "../pages/ListingDetailPage";
import { ProfilePage } from "../pages/ProfilePage";
import { CollectionPage } from "../pages/CollectionPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { OrderConfirmationPage } from "../pages/OrderConfirmationPage";
import { OrdersPage } from "../pages/OrdersPage";
import { FavoritesPage } from "../pages/FavoritesPage";
export function AppRouter() {
 return <BrowserRouter><Routes><Route element={<MainLayout />}>
  <Route path="/" element={<HomePage />} />
  <Route path="/discover" element={<DiscoverPage />} />
  <Route path="/marketplace" element={<MarketplacePage />} />
  <Route path="/cards/:cardId" element={<CardDetailPage />} />
  <Route path="/sell" element={<SellPage />} />
  <Route path="/my-listings" element={<MyListingsPage />} />
  <Route path="/my-listings/:listingId/edit" element={<SellPage />} />
  <Route path="/listings/:listingId" element={<ListingDetailPage />} />
  <Route path="/profile" element={<ProfilePage />} />
  <Route path="/collections" element={<CollectionPage />} />
  <Route path="/my-collection" element={<CollectionPage />} />
  <Route path="/trading" element={<TradingPage />} />
  <Route path="/favorites" element={<FavoritesPage />} />
  <Route path="/cart" element={<CartPage />} />
  <Route path="/checkout" element={<CheckoutPage />} />
  <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
  <Route path="/orders" element={<OrdersPage />} />
 </Route></Routes></BrowserRouter>;
}
