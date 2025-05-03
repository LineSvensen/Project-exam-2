import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import useAuthStore from "../stores/authStore"; // ✅ correct path

export default function Layout() {
  const { loadUserFromStorage } = useAuthStore();

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow max-w-6xl mx-auto p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
