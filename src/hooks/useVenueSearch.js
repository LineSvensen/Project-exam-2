import useVenueStore from "../stores/venueStore"; // <- used for local fallback
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

      // Fallback: If API gives no matches, try local filtering
      if (apiResults.length === 0 && query.length > 2 && allVenues.length > 0) {
        const fuse = new Fuse(allVenues, {
          keys: [
            "name",
            "description",
            "location.city",
            "location.country",
            "meta.type",
            "tags",
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

// export function useVenueSearch() {
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const allVenues = useVenueStore((state) => state.allVenues);

//   async function searchVenues(query) {
//     setLoading(true);
//     setError(null);

//     try {
//       const url = `https://v2.api.noroff.dev/holidaze/venues/search?q=${query}`;
//       const response = await fetch(url);
//       const json = await response.json();

//       const apiResults = json.data || [];

//       // Fallback: If API gives no matches, try local filtering
//       if (apiResults.length === 0 && query.length > 2 && allVenues.length > 0) {
//         const q = query.toLowerCase();
//         const localResults = allVenues.filter((venue) => {
//           const combined = [
//             venue.name,
//             venue.description,
//             venue.location?.city,
//             venue.location?.country,
//             venue.meta?.type,
//             venue.tags?.join(" "),
//           ]
//             .filter(Boolean)
//             .join(" ")
//             .toLowerCase();

//           return combined.includes(q); // ✅ Substring match
//         });

//         setResults(localResults);
//       } else {
//         setResults(apiResults);
//       }
//     } catch (err) {
//       setError("Failed to search venues.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return { results, loading, error, searchVenues };
// }

// import { useState } from "react";

// export function useVenueSearch() {
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   async function searchVenues(query) {
//     setLoading(true);
//     setError(null);

//     try {
//       const url = `https://v2.api.noroff.dev/holidaze/venues/search?q=${query}`;

//       const response = await fetch(url);
//       const json = await response.json();

//       setResults(json.data || []);
//     } catch (err) {
//       setError("Failed to search venues.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return { results, loading, error, searchVenues };
// }
