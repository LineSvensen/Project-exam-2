import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

export function useVenues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVenues() {
      try {
        // ✅ Add _owner=true to include venue owner info
        const res = await fetch(`${API_BASE}/venues?_owner=true`);
        if (!res.ok) throw new Error("Failed to fetch venues");

        const data = await res.json();
        setVenues(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVenues();
  }, []);

  return { venues, loading, error };
}
