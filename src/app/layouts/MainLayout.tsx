import { Outlet } from "react-router-dom";
import { Header } from "../../components/navigation/Header/Header";

export function MainLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}