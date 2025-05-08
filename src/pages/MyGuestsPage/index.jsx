import { useEffect, useState } from "react";
import useAuthStore from "../../stores/authStore";

export default function MyGuestsPage() {
  const { user, token } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    async function fetchBookings() {
      if (!user?.venueManager) return;

      try {
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${user.name}/bookings?_customer=true&_venue=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": API_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        if (!res.ok)
          throw new Error(
            data.errors?.[0]?.message || "Failed to fetch guest bookings"
          );

        setBookings(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [user?.name, token, API_KEY]);

  if (!user?.venueManager) {
    return (
      <p className="text-red-500 text-center">
        You must be a venue manager to view guest bookings.
      </p>
    );
  }

  if (loading) return <p>Loading guest bookings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Guests</h1>
      {bookings.length === 0 ? (
        <p>No guests have booked your venues yet.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="border p-4 rounded shadow hover:bg-gray-50"
            >
              <h2 className="font-semibold text-lg">{booking.venue?.name}</h2>
              <p className="text-sm text-gray-600">
                Guest: {booking.customer?.name || "Unknown"}
              </p>
              <p className="text-sm">
                {new Date(booking.dateFrom).toLocaleDateString()} →{" "}
                {new Date(booking.dateTo).toLocaleDateString()}
              </p>
              <p className="text-sm">Guests: {booking.guests}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
