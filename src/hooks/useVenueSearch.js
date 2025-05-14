import { useState } from "react";

export function useVenueSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function searchVenues(query) {
    setLoading(true);
    setError(null);

    try {
      const url = `https://v2.api.noroff.dev/holidaze/venues/search?q=${query}`;

      const response = await fetch(url);
      const json = await response.json();

      setResults(json.data || []);
    } catch (err) {
      setError("Failed to search venues.");
    } finally {
      setLoading(false);
    }
  }

  return { results, loading, error, searchVenues };
}
