import { Link, useLocation } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import FavouriteButton from "../Buttons/FavouritesButton";

export default function VenueCard({ venue }) {
  const location = useLocation();

  const handleClick = () => {
    sessionStorage.setItem("scrollY", window.scrollY); // ✅ Save scroll position
  };

  const imageUrl = venue.media?.[0]?.url;
  const isValidImage = imageUrl && imageUrl.startsWith("http");

  return (
    <Link to={`/venue/${venue.id}`} onClick={handleClick}>
      <div className="bg-white shadow-md rounded hover:shadow-lg transition overflow-hidden">
        <div className="relative h-48 w-full">
          <img
            src={isValidImage ? imageUrl : "/fallback.jpg"}
            alt={venue.media?.[0]?.alt || venue.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-2 right-2 z-10">
            <FavouriteButton venue={venue} />
          </div>
        </div>

        <div className="p-4">
          <h2 className="text-lg font-semibold truncate">{venue.name}</h2>
          <p className="text-sm">
            {venue.location?.city || "Unknown"},{" "}
            {venue.location?.country || "Unknown"}
          </p>
          <p className="text-sm font-bold">{venue.price} kr / night</p>

          {venue.rating > 0 ? (
            <div className="flex items-center text-yellow-500 text-sm mt-1">
              <FaStar className="mr-1" />
              {venue.rating.toFixed(1)} / 5
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-1 italic">No reviews yet</p>
          )}
        </div>
      </div>
    </Link>
  );
}
