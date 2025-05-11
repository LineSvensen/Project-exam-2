import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import BookingsList from "../Booking/BookingsList";

export default function MyVenueCard({ venue }) {
  const imageUrl = venue.media?.[0]?.url;
  const isValidImage = imageUrl && imageUrl.startsWith("http");

  return (
    <div className="relative bg-white shadow-md rounded p-4 hover:shadow-lg transition">
      <img
        src={isValidImage ? imageUrl : "/fallback.jpg"}
        alt={venue.media?.[0]?.alt || venue.name}
        className="h-48 w-full object-cover rounded mb-2"
      />
      <h2 className="text-lg font-semibold truncate mb-2">{venue.name}</h2>

      <p className="text-sm">
        {venue.location?.city || "Unknown"},{" "}
        {venue.location?.country || "Unknown"}
      </p>
      <p className="text-sm font-bold">{venue.price} $ / night</p>

      {venue.rating > 0 ? (
        <div className="flex items-center text-yellow-500 text-sm mt-1">
          <FaStar className="mr-1" />
          {venue.rating.toFixed(1)} / 5
        </div>
      ) : (
        <p className="text-sm text-gray-500 mt-1 italic">No reviews yet</p>
      )}
      <div className="flex justify-between items-center mt-2">
        <div className="flex flex-row sm:flex-row gap-2 mb-2 mt-2">
          <Link
            to={`/venues/edit/${venue.id}`}
            className="text-sm bg-black text-white px-3 py-1 rounded text-center hover:bg-gray-800"
          >
            Edit
          </Link>
          <Link
            to={`/venues/${venue.id}/bookings`}
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded text-center hover:bg-blue-700"
          >
            View Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
