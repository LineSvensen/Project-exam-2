import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export function useVenueBookings() {
  const { id } = useParams(); // Venue ID from URL
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${id}/bookings`
        );
        const data = await response.json();
        setBookings(data.data || []);
      } catch (err) {
        setError("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [id]);

  return { bookings, loading, error };
}
