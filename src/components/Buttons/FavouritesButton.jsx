// src/components/FavouriteButton.jsx
import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import useAuthStore from "../../stores/authStore";
import useFavouritesStore from "../../stores/favouritesStore";

export default function FavouriteButton({ venue, className = "" }) {
  const { user } = useAuthStore();
  const { favourites, addFavourite, removeFavourite } = useFavouritesStore();
  const [showLoginHint, setShowLoginHint] = useState(false);

  const isFavourite = favourites.some((fav) => fav.id === venue.id);
  const isOwnVenue = user?.name === venue.owner?.name;

  const toggleFavourite = (e) => {
    e.preventDefault();
    if (!user?.name) {
      setShowLoginHint(true);
      return;
    }
    isFavourite ? removeFavourite(venue.id) : addFavourite(venue);
  };

  useEffect(() => {
    if (showLoginHint) {
      const timer = setTimeout(() => setShowLoginHint(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showLoginHint]);

  if (isOwnVenue) return null;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={toggleFavourite}
        className="p-2 bg-white/70 rounded shadow text-black hover:text-gray-700 transition"
        title={isFavourite ? "Remove from favourites" : "Add to favourites"}
      >
        {isFavourite ? <FaHeart /> : <FaRegHeart />}
      </button>
      {showLoginHint && (
        <div className="absolute top-full w-20 text-center right-2 mt-1 text-xs bg-white/50 text-gray-800 px-2 py-1 rounded shadow">
          Log in or register to favourite
        </div>
      )}
    </div>
  );
}
