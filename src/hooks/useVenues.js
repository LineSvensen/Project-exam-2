// src/hooks/useVenues.js
import { useEffect, useState } from "react";
import useVenueStore from "../stores/venueStore";

const API_BASE = import.meta.env.VITE_API_BASE;

export function useVenues() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const setVenues = useVenueStore((state) => state.setVenues);

  useEffect(() => {
    async function fetchVenues() {
      try {
        const res = await fetch(
          `${API_BASE}/venues?_owner=true&limit=100&sort=created&sortOrder=desc`
        );

        if (!res.ok) throw new Error("Failed to fetch venues");

        const data = await res.json();
        setVenues(data.data); // ✅ Store in Zustand
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVenues();
  }, []);

  return { loading, error };
}
