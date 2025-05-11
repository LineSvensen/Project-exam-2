import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function useVenueBookings() {
  const { id } = useParams(); // Venue ID from URL
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://v2.api.noroff.dev/holidaze/venues/${id}?_bookings=true`
      );
      if (!res.ok) throw new Error("Failed to fetch venue bookings");

      const data = await res.json();

      // ✅ This is where you place the line
      setBookings(data.data?.bookings || []);
    } catch (err) {
      console.error("useVenueBookings error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [id]);

  return { bookings, loading, error, refetchBookings: fetchBookings };
}
