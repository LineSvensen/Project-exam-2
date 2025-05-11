import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import useAuthStore from "../../stores/authStore";
import useFavouritesStore from "../../stores/favouritesStore";

export default function Layout() {
  const { loadUserFromStorage } = useAuthStore();
  const { loadFavourites } = useFavouritesStore();

  useEffect(() => {
    loadUserFromStorage();
    loadFavourites();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
