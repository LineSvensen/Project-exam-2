import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import FallbackImage from "../../assets/fallback-img-x.png";
import useAuthStore from "../../stores/authStore";

export default function MyVenueCard({ venue }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const imageUrl = venue.media?.[0]?.url;
  const isValidImage = imageUrl && imageUrl.startsWith("http");

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/venues/${venue.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete venue");

      navigate("/venues");
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

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
        alt={venue.name}
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
        className="flex flex-wrap gap-2 mt-3"
        onClick={(e) => e.stopPropagation()}
      >
        <Link to={`/venues/edit/${venue.id}`} className="button-primary">
          Edit
        </Link>
        <Link to={`/venues/${venue.id}/bookings`} className="button-secondary">
          View Bookings
        </Link>
        <button
          onClick={() => setShowConfirm(true)}
          className="button-destructive"
        >
          Delete
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete this venue?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
