import { useBookings } from "../../hooks/useUserBookings";
import { useEffect } from "react";
import BackButton from "../../components/Buttons/BackButton";
import useAuthStore from "../../stores/authStore";
import { useState } from "react";
import EditBookingModal from "../../components/Booking/EditBookingModal";
import { useNavigate } from "react-router-dom";

export default function MyTripsPage() {
  const { bookings, loading, error } = useBookings();
  const [editingBooking, setEditingBooking] = useState(null);
  const navigate = useNavigate();

  const { token } = useAuthStore();
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    document.title = "My Trips | Holidaze";
  }, []);

  if (loading) return <p>Loading your bookings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const now = new Date();
  const trips = Array.isArray(bookings) ? bookings : [];

  const upcomingTrips = trips.filter((trip) => new Date(trip.dateTo) >= now);
  const pastTrips = trips.filter((trip) => new Date(trip.dateTo) < now);

  const renderTripCard = (trip) => {
    const venue = trip.venue;
    const image = venue?.media?.[0]?.url;

    const handleCancelBooking = async (bookingId) => {
      if (!confirm("Are you sure you want to cancel this booking?")) return;

      setDeletingId(bookingId);
      try {
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/bookings/${bookingId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": API_KEY,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to cancel booking.");
        }

        window.location.reload();
      } catch (err) {
        alert(err.message);
      } finally {
        setDeletingId(null);
      }
    };

    return (
      <li
        key={trip.id}
        className=" p-4 rounded shadow hover:bg-gray-50 flex flex-col md:flex-row gap-4 cursor-pointer font-inter"
        onClick={() => navigate(`/venue/${venue?.id}`)}
      >
        {image && (
          <img
            src={image}
            alt={venue?.media?.[0]?.alt || venue?.name}
            className="w-full md:w-48 h-32 object-cover rounded"
          />
        )}
        <div className="flex-1">
          <h2 className="font-bold text-lg mt-2 mb-2">
            {venue?.name || "Unknown Venue"}
          </h2>
          <p className="text-sm text-gray-600">
            Location: {venue?.location?.city || "Unknown"},{" "}
            {venue?.location?.country || ""}
          </p>
          <p className="text-sm">
            Dates: {new Date(trip.dateFrom).toLocaleDateString()} →{" "}
            {new Date(trip.dateTo).toLocaleDateString()}
          </p>
          <p className="text-sm mb-2">Guests: {trip.guests || "N/A"}</p>

          {new Date(trip.dateTo) >= now && (
            <div className="flex gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingBooking(trip);
                }}
                className="button-secondary"
              >
                Edit Booking
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelBooking(trip.id);
                }}
                disabled={deletingId === trip.id}
                className="button-destructive"
              >
                {deletingId === trip.id ? "Cancelling..." : "Cancel Booking"}
              </button>
            </div>
          )}
        </div>
      </li>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">My Trips</h1>

      {upcomingTrips.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-2">Upcoming Trips</h2>
          <ul className="space-y-4 mb-6">
            {upcomingTrips.map(renderTripCard)}
          </ul>
        </>
      )}

      {pastTrips.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-2">Past Trips</h2>
          <ul className="space-y-4">{pastTrips.map(renderTripCard)}</ul>
        </>
      )}

      {upcomingTrips.length === 0 && pastTrips.length === 0 && (
        <p>You haven't made any bookings yet.</p>
      )}

      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
        />
      )}
    </div>
  );
}
