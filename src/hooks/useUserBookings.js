import { useEffect, useState } from "react";
import useAuthStore from "../stores/authStore";

export function useBookings() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.name) return;

    async function fetchBookings() {
      try {
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${user.name}/bookings`
        );
        const data = await res.json();
        setBookings(data.data);
      } catch (err) {
        setError("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [user?.name]);

  return { bookings, loading, error };
}
