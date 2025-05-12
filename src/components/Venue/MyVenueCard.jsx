import { Link, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import FallbackImage from "../../assets/fallback-img-x.png";

export default function MyVenueCard({ venue }) {
  const imageUrl = venue.media?.[0]?.url;
  const isValidImage = imageUrl && imageUrl.startsWith("http");

  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/venue/${venue.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative bg-white shadow-md rounded p-4 hover:shadow-lg transition cursor-pointer"
    >
      <img
        src={isValidImage ? imageUrl : FallbackImage}
        alt={venue.media?.[0]?.alt || venue.name}
        className="h-48 w-full object-cover rounded mb-2"
      />
      <h2 className="text-lg font-semibold truncate mb-2">{venue.name}</h2>

      <p className="text-sm">
        {venue.location?.city || "Unknown"},{" "}
        {venue.location?.country || "Unknown"}
      </p>
      <p className="text-sm font-bold">{venue.price} $ / night</p>

      {venue.rating > 0 && (
        <div className="flex items-center text-yellow-500 text-sm mt-1">
          <FaStar className="mr-1" />
          {venue.rating.toFixed(1)} / 5
        </div>
      )}

      <div
        className="flex gap-2 mt-3"
        onClick={(e) => e.stopPropagation()} // Stop bubbling to card click
      >
        <Link to={`/venues/edit/${venue.id}`} className="button-secondary">
          Edit
        </Link>
        <Link to={`/venues/${venue.id}/bookings`} className="button-secondary">
          View Bookings
        </Link>
      </div>
    </div>
  );
}
