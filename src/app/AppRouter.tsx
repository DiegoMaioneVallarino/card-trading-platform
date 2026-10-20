import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { MainLayout } from "./layouts/MainLayout";
import { MarketplacePage } from "../pages/MarketplacePage";
import { CardDetailPage } from "../pages/CardDetailPage";
import { SellPage } from "../pages/SellPage";
import { MyListingsPage } from "../pages/MyListingsPage";


export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<MarketplacePage />} />
          <Route
            path="/marketplace"
            element={<MarketplacePage />}
          />
          <Route
            path="/cards/:cardId"
            element={<CardDetailPage />}
          />
          <Route path="/sell" element={<SellPage />} />
            <Route
            path="/my-listings"
            element={<MyListingsPage />}
            />
        </Route>
        <Route
  path="/my-listings/:listingId/edit"
  element={<SellPage />}
/>
      </Routes>
    </BrowserRouter>
  );
}