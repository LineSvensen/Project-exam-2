import { useState } from "react";

export function useVenueSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function searchVenues(query, sort = "", sortOrder = "") {
    setLoading(true);
    setError(null);

    try {
      let url = `https://v2.api.noroff.dev/holidaze/venues/search?q=${query}`;
      if (sort) {
        url += `&sort=${sort}`;
        if (sortOrder) {
          url += `&sortOrder=${sortOrder}`;
        }
      }

      const response = await fetch(url);
      const json = await response.json();
      setResults(json.data);
    } catch (err) {
      setError("Failed to search venues.");
    } finally {
      setLoading(false);
    }
  }

  return { results, loading, error, searchVenues };
}
