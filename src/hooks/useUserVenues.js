import { useEffect, useState } from "react";
import useAuthStore from "../stores/authStore";

const API_BASE = import.meta.env.VITE_API_BASE;

export function useUserVenues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    async function fetchUserVenues() {
      try {
        const res = await fetch(
          `${API_BASE}/holidaze/profiles/${user.name}/venues`,
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch user venues");
        const data = await res.json();
        setVenues(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserVenues();
  }, [user]);

  return { venues, loading, error };
}
