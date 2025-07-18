import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

export function useVenue(id) {
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchVenue() {
      try {
        const res = await fetch(`${API_BASE}/venues/${id}?_owner=true`);

        if (res.status === 404) {
          setError("Venue not found");
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch venue");

        const data = await res.json();
        setVenue(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [id]);

  return { venue, loading, error };
}
