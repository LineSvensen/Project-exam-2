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
          await new Promise((resolve) => setTimeout(resolve, 300)); // wait 300ms between pages

          page++;
        }

        // Optional: Add your own validation strategy here if needed

        console.log("✅ Final venues fetched:", all.length);
        setVenues(all);
      } catch (err) {
        console.error("❌ useVenues error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVenues();
  }, [allVenues, setVenues]);

  return { loading, error };
}

// export function useVenues() {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { allVenues, setVenues } = useVenueStore();

//   useEffect(() => {
//     // ✅ Skip fetch if already cached
//     if (allVenues.length > 0) {
//       setLoading(false);
//       return;
//     }

//     async function fetchVenues() {
//       try {
//         const res1 = await fetch(
//           `${API_BASE}/venues?page=1&limit=33&_owner=true`
//         );
//         const data1 = await res1.json();
//         let all = data1.data;

//         setVenues(all);

//         let page = 2;
//         while (true) {
//           const res = await fetch(
//             `${API_BASE}/venues?page=${page}&limit=33&_owner=true`
//           );
//           const data = await res.json();
//           if (!data.data.length) break;
//           all = [...all, ...data.data];
//           setVenues(all);
//           page++;
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchVenues();
//   }, [allVenues, setVenues]);

//   return { loading, error };
// }

// import { useEffect, useState } from "react";
// import useVenueStore from "../stores/venueStore";

// const API_BASE = import.meta.env.VITE_API_BASE;

// export function useVenues() {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const setVenues = useVenueStore((state) => state.setVenues);

//   useEffect(() => {
//     async function fetchAllVenues() {
//       try {
//         const all = new Map(); // ✅ Map to track by ID
//         const limit = 33;
//         let page = 1;

//         while (true) {
//           const res = await fetch(
//             `${API_BASE}/venues?page=${page}&limit=${limit}&_owner=true`
//           );
//           const data = await res.json();
//           if (!Array.isArray(data.data) || data.data.length === 0) break;

//           for (const venue of data.data) {
//             all.set(venue.id, venue); // ✅ overwrite if duplicate
//           }

//           if (data.data.length < limit) break;
//           page++;
//         }

//         setVenues(Array.from(all.values())); // ✅ only unique venues
//       } catch (err) {
//         setError(err.message || "Unknown error");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchAllVenues();
//   }, [setVenues]);

//   return { loading, error };
// }
