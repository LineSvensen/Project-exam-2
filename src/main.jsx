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
import BookingConfirmation from "./pages/BookingConfirmationPage/index.jsx";
import MyTripsPage from "./pages/MyTripsPage/index.jsx";
import MyVenuesPage from "./pages/MyVenuesPage/index.jsx";
import CreateVenuePage from "./pages/CreateVenuePage/index.jsx";
import EditVenuePage from "./pages/EditVenuePage/index.jsx";
import VenueBookingsPage from "./pages/VenuesBookingPage/index.jsx";

// Layout
import Layout from "./components/Shared/Layout.jsx";

// External CSS (Slick carousel)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
      { path: "confirmation", element: <BookingConfirmation /> },
      { path: "trips", element: <MyTripsPage /> },
      { path: "venues", element: <MyVenuesPage /> },
      { path: "venues/create", element: <CreateVenuePage /> },
      { path: "venues/edit/:id", element: <EditVenuePage /> },
      {
        path: "venues/:id/bookings",
        element: <VenueBookingsPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
