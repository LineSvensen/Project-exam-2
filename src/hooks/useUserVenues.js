// hooks/useUserVenues.js
import { useEffect, useState } from "react";
import useAuthStore from "../stores/authStore";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_KEY = import.meta.env.VITE_API_KEY;

export function useUserVenues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useAuthStore(); // ✅ Make sure you use token if required

  useEffect(() => {
    if (!user?.name || !token) {
      setLoading(false); // ✅ prevent forever-loading if user is missing
      return;
    }

    async function fetchUserVenues() {
      try {
        const res = await fetch(`${API_BASE}/profiles/${user.name}/venues`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": API_KEY,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (!res.ok)
          throw new Error(
            data.errors?.[0]?.message || "Failed to fetch venues"
          );
        setVenues(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // ✅ ensure loading is stopped
      }
    }

    fetchUserVenues();
  }, [user, token]);

  return { venues, loading, error };
}
