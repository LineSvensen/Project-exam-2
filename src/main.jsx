import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

// Pages
import Home from "./pages/HomePage/Home";
import SinglePage from "./pages/SinglePage";
import FavouritesPage from "./pages/FavouritesPage";
import LoginRegisterPage from "./pages/LoginRegisterPage";
import ProfilePage from "./pages/ProfilePage";

// Layout
import Layout from "./components/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "venue/:id", element: <SinglePage /> },
      { path: "favourites", element: <FavouritesPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "login", element: <LoginRegisterPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
