import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;

export function useVenueBookings() {
  const { id } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/venues/${id}?_bookings=true`);

      if (res.status === 404) {
        setError("Venue not found");
        setBookings([]);
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch venue bookings");
      }

      const data = await res.json();
      const bookingsData = data?.data?.bookings ?? [];
      setBookings(bookingsData);
    } catch (err) {
      console.error("useVenueBookings error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBookings();
    }
  }, [id]);

  return { bookings, loading, error, refetchBookings: fetchBookings };
}
