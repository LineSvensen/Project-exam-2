import { useState, useEffect } from "react";
import useAuthStore from "../stores/authStore";

export function useProfile() {
  const { user, token } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (!user?.name || !token) return;

    async function fetchProfile() {
      try {
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${user.name}?_count=true`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": API_KEY,
            },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.errors?.[0]?.message || "Failed");
        setProfile(data.data);
      } catch (err) {
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user?.name, token]);

  return { profile, loading, error };
}
