import { useEffect, useState } from "react";
import useVenueStore from "../stores/venueStore";

const API_BASE = import.meta.env.VITE_API_BASE;

export function useVenues() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { allVenues, setVenues } = useVenueStore();

  useEffect(() => {
    if (allVenues.length > 0) {
      setLoading(false);
      return;
    }

    async function fetchVenues() {
      try {
        let all = [];
        let page = 1;

        while (true) {
          const res = await fetch(
            `${API_BASE}/venues?page=${page}&limit=100&_owner=true`
          );
          if (res.status === 429) {
            throw new Error("Rate limit hit while fetching venues.");
          }

          const data = await res.json();
          if (!data.data.length) break;

          all = [...all, ...data.data];
          await new Promise((resolve) => setTimeout(resolve, 300));

          page++;
        }
        
        setVenues(all);
      } catch (err) {
        
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVenues();
  }, [allVenues, setVenues]);

  return { loading, error };
}
