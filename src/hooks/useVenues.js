import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

export function useVenues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVenues() {
      try {
        const res = await fetch(`${API_BASE}/venues`);
        if (!res.ok) throw new Error("Failed to fetch venues");

        const data = await res.json();
        console.log("API response:", data); // should show { data: [...] }
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
