import { useState, useEffect } from "react";
import useAuthStore from "../stores/authStore";

export function useProfile() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.name) return;

    async function fetchProfile() {
      try {
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${user.name}`
        );
        const data = await res.json();
        setProfile(data.data);
      } catch (err) {
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user?.name]);

  return { profile, loading, error };
}
