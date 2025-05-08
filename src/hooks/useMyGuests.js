import { useEffect, useState } from "react";
import useAuthStore from "../stores/authStore";

export function useMyGuests() {
  const { user, token } = useAuthStore();
  const [guestBookings, setGuestBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.name || !token) return;

    async function fetchGuestBookings() {
      try {
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${user.name}/venues?_bookings=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              
            },
          }
        );

        const data = await res.json();
        if (!res.ok)
          throw new Error(
            data.errors?.[0]?.message || "Failed to fetch guest bookings"
          );

        const allBookings = data.data.flatMap((venue) =>
          venue.bookings.map((booking) => ({
            ...booking,
            venueName: venue.name,
            venueId: venue.id,
          }))
        );

        setGuestBookings(allBookings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGuestBookings();
  }, [user?.name, token]);

  return { guestBookings, loading, error };
}
