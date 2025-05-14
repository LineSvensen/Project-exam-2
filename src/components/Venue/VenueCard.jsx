import { Link, useLocation } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import FavouriteButton from "../Buttons/FavouritesButton";
import fallbackImg from "../../assets/fallback-img-x.png";
import { FEATURED_IDS } from "../../utils/featured";

export default function VenueCard({ venue }) {
  const location = useLocation();

  const handleClick = () => {
    sessionStorage.setItem("scrollY", window.scrollY);
  };

  const imageUrl = venue.media?.[0]?.url;
  const isValidImage = imageUrl && imageUrl.startsWith("http");

  return (
    <Link to={`/venue/${venue.id}`} onClick={handleClick}>
      <div className="bg-white shadow-md rounded hover:shadow-lg transition overflow-hidden">
        <div className="relative h-48 w-full">
          <img
            src={isValidImage ? imageUrl : fallbackImg}
            alt={venue.media?.[0]?.alt || venue.name}
            onError={(e) => (e.target.src = fallbackImg)}
            className="h-48 w-full object-cover"
          />
          <div className="absolute top-2 right-2 z-10">
            <FavouriteButton venue={venue} />
          </div>
          <div className="absolute top-1 left-1 z-10">
            {FEATURED_IDS.includes(venue.id) && (
              <span className="flex w-16 text-center ml-4 mt-2 text-xs bg-gray-950/70 text-white font-bold px-2 py-1 rounded">
                Featured
              </span>
            )}
          </div>
        </div>

        <div className="p-4">
          <h2 className="text-lg font-semibold truncate">{venue.name}</h2>
          <p className="text-sm">
            {venue.location?.city || "Unknown"},{" "}
            {venue.location?.country || "Unknown"}
          </p>
          <p className="text-sm font-bold py-1">{venue.price} $ / night</p>
        </div>
      </div>
    </Link>
  );
}
