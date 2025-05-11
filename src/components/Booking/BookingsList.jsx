// components/Venue/BookingsList.jsx
import { useEffect, useState } from "react";

export default function BookingsList({ venueId }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE;

  const fetchBookings = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/venues/${venueId}?_bookings=true&_customer=true`
      );
      const data = await res.json();
      setBookings(data.data.bookings || []);
    } catch (err) {
      setError("Could not fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!show) {
      fetchBookings();
    }
    setShow((prev) => !prev);
  };

  return (
    <div className="mt-2">
      <button
        onClick={handleToggle}
        className="text-sm text-blue-600 underline"
      >
        {show ? "Hide Bookings" : "View Bookings"}
      </button>

      {show && (
        <div className="mt-2">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : bookings.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            <ul className="space-y-2">
              {bookings.map((booking) => (
                <li
                  key={booking.id}
                  className="border p-2 rounded shadow-sm text-sm"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src={booking.customer?.avatar?.url}
                      alt=""
                      className="w-6 h-6 rounded-full"
                    />
                    <strong>{booking.customer?.name}</strong>
                  </div>
                  <p>
                    From: {booking.dateFrom} — To: {booking.dateTo}
                  </p>
                  <p>Guests: {booking.guests}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
