import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import useFavouritesStore from "../../stores/favouritesStore";
import useAuthStore from "../../stores/authStore";

export default function VenueCard({ venue }) {
  const { user } = useAuthStore();
  const { favourites, addFavourite, removeFavourite } = useFavouritesStore();

  const isFavourite = favourites.some((fav) => fav.id === venue.id);
  const imageUrl = venue.media?.[0]?.url;
  const isValidImage = imageUrl && imageUrl.startsWith("http");

  // Always compare safely, even when logged out
  const isOwnVenue =
    user?.name && venue?.owner?.name && user.name === venue.owner.name;

  const toggleFavourite = (e) => {
    e.preventDefault();
    if (!isOwnVenue) {
      isFavourite ? removeFavourite(venue.id) : addFavourite(venue);
    }
  };

  return (
    <Link to={`/venue/${venue.id}`}>
      <div className="bg-white shadow-md rounded p-4 hover:shadow-lg transition relative">
        <img
          src={isValidImage ? imageUrl : "/fallback.jpg"}
          alt={venue.media?.[0]?.alt || venue.name}
          className="h-48 w-full object-cover rounded mb-2"
        />

        {/* ❤️ Show heart if NOT own venue */}
        {!isOwnVenue && (
          <button
            onClick={toggleFavourite}
            className="absolute top-6 right-6 p-2 bg-white/70 rounded shadow-md text-black hover:text-gray-700 cursor-pointer transition flex justify-center items-center"
          >
            {isFavourite ? <FaHeart /> : <FaRegHeart />}
          </button>
        )}

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
    </Link>
  );
}
