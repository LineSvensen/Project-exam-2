import useVenueStore from "../stores/venueStore";
import { useState } from "react";
import Fuse from "fuse.js";

export function useVenueSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const allVenues = useVenueStore((state) => state.allVenues);

  async function searchVenues(query) {
    setLoading(true);
    setError(null);

    try {
      const url = `https://v2.api.noroff.dev/holidaze/venues/search?q=${query}`;
      const response = await fetch(url);
      const json = await response.json();

      const apiResults = json.data || [];

      if (apiResults.length === 0 && query.length > 2 && allVenues.length > 0) {
        const fuse = new Fuse(allVenues, {
          keys: [
            "name",
            "description",
            "location.city",
            "location.country",
            "meta.type",
            "tags",
            "owner.name",
          ],
          threshold: 0.3,
          ignoreLocation: true,
          tokenize: true,
          matchAllTokens: true,
          minMatchCharLength: 2,
          useExtendedSearch: true,
          includeScore: true,
        });

        const localResults = fuse.search(query).map((r) => r.item);

        setResults(localResults);
      } else {
        setResults(apiResults);
      }
    } catch (err) {
      setError("Failed to search venues.");
    } finally {
      setLoading(false);
    }
  }

  return { results, loading, error, searchVenues };
}
