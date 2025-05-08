import { useEffect, useState } from "react";
import useAuthStore from "../stores/authStore";

export function useBookings() {
  const { user, token } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (!user?.name || !token) return;

    async function fetchBookings() {
      try {
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${user.name}/bookings?_venue=true`,
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
            data.errors?.[0]?.message || "Failed to fetch bookings"
          );

        setBookings(data.data);
      } catch (err) {
        setError("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [user?.name, token, API_KEY]);

  return { bookings, loading, error };
}
