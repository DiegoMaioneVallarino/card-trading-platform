import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { MainLayout } from "./layouts/MainLayout";
import { MarketplacePage } from "../pages/MarketplacePage";
import { CardDetailPage } from "../pages/CardDetailPage";

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}