import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import PublishedLoader from "../../components/Shared/Loaders/PublishedLoader";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_KEY = import.meta.env.VITE_API_KEY;

export default function EditVenuePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();

  const [showLoader, setShowLoader] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    media: [""],
    price: 0,
    maxGuests: 1,
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
    location: {
      address: "",
      city: "",
      zip: "",
      country: "",
      continent: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    async function fetchVenue() {
      try {
        const res = await fetch(`${API_BASE}/venues/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error("Failed to load venue");

        const venue = data.data;
        const { lat, lng, ...cleanedLocation } = venue.location || {};

        setForm({
          name: venue.name || "",
          description: venue.description || "",
          media: venue.media?.map((m) => m.url) || [""],
          price: venue.price || 0,
          maxGuests: venue.maxGuests || 1,
          meta: venue.meta || {},
          location: cleanedLocation,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name in form.meta) {
      setForm((prev) => ({
        ...prev,
        meta: { ...prev.meta, [name]: checked },
      }));
    } else if (name in form.location) {
      setForm((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const handleMediaChange = (i, value) => {
    const updated = [...form.media];
    updated[i] = value;
    setForm((prev) => ({ ...prev, media: updated }));
  };

  const addMediaField = () =>
    setForm((prev) => ({ ...prev, media: [...prev.media, ""] }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedMedia = form.media
      .filter((url) => url.trim() !== "")
      .map((url) => ({ url }));

    const payload = {
      ...form,
      media: cleanedMedia,
      location: form.location,
    };

    try {
      const res = await fetch(`${API_BASE}/venues/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update venue");

      setShowLoader(true);
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/venues/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
      });

      if (!res.ok) throw new Error("Failed to delete venue");

      alert("Venue deleted");
      navigate("/venues");
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (showLoader) return <PublishedLoader />;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Venue</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Venue name"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Description"
          required
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Price"
          required
        />
        <input
          name="maxGuests"
          type="number"
          value={form.maxGuests}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Max Guests"
          required
        />

        <h2 className="font-semibold">Images</h2>
        {form.media.map((url, i) => (
          <input
            key={i}
            value={url}
            onChange={(e) => handleMediaChange(i, e.target.value)}
            className="w-full p-2 border rounded mb-2"
            placeholder="Image URL"
          />
        ))}
        <button
          type="button"
          onClick={addMediaField}
          className="button-secondary disabled:opacity-30"
          disabled={form.media.length >= 8}
        >
          + Add another image
        </button>

        <h2 className="font-semibold mt-4">This venue offers:</h2>
        {Object.keys(form.meta).map((key) => (
          <label key={key} className="block">
            <input
              type="checkbox"
              name={key}
              checked={form.meta[key]}
              onChange={handleChange}
            />{" "}
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
        ))}

        <h2 className="font-semibold mt-4">Location</h2>
        {Object.keys(form.location).map((key) => (
          <input
            key={key}
            name={key}
            value={form.location[key] || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
          />
        ))}

        <div className="flex gap-4 mt-6">
          <button type="submit" className="button-primary">
            Update Venue
          </button>

          <button
            type="button"
            onClick={() => navigate("/venues")}
            className="button-cancel-ignore"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => setShowConfirmDelete(true)}
            className="button-destructive"
          >
            Delete Venue
          </button>
        </div>
      </form>

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete this venue?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import useAuthStore from "../../stores/authStore";
// // import useVenueTagStore from "../../stores/venueTagStore";
// import PublishedLoader from "../../components/Shared/Loaders/PublishedLoader";

// const API_BASE = import.meta.env.VITE_API_BASE;
// const API_KEY = import.meta.env.VITE_API_KEY;

// export default function EditVenuePage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user, token } = useAuthStore();

//   //   const { setTagsForVenue, getTagsForVenue } = useVenueTagStore(); // ✅ Use tag store
//   const [showLoader, setShowLoader] = useState(false);
//   const { lat, lng, ...cleanedLocation } = venue.location || {};
//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     media: [""],
//     price: 0,
//     maxGuests: 1,
//     meta: {
//       wifi: false,
//       parking: false,
//       breakfast: false,
//       pets: false,
//     },
//     location: cleanedLocation,
//     // tags: "",
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showConfirmDelete, setShowConfirmDelete] = useState(false);

//   useEffect(() => {
//     async function fetchVenue() {
//       try {
//         const res = await fetch(`${API_BASE}/venues/${id}`);
//         const data = await res.json();
//         if (!res.ok) throw new Error("Failed to load venue");

//         const venue = data.data;
//         // const existingTags = getTagsForVenue(venue.id).join(", ");

//         setForm({
//           name: venue.name || "",
//           description: venue.description || "",
//           media: venue.media?.map((m) => m.url) || [""],
//           price: venue.price || 0,
//           maxGuests: venue.maxGuests || 1,
//           meta: venue.meta || {},
//           location: venue.location || {},
//           //   tags: existingTags,
//         });
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchVenue();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (name in form.meta) {
//       setForm((prev) => ({
//         ...prev,
//         meta: { ...prev.meta, [name]: checked },
//       }));
//     } else if (name in form.location) {
//       setForm((prev) => ({
//         ...prev,
//         location: { ...prev.location, [name]: value },
//       }));
//     } else {
//       setForm((prev) => ({
//         ...prev,
//         [name]: type === "number" ? Number(value) : value,
//       }));
//     }
//   };

//   const handleMediaChange = (i, value) => {
//     const updated = [...form.media];
//     updated[i] = value;
//     setForm((prev) => ({ ...prev, media: updated }));
//   };

//   const addMediaField = () =>
//     setForm((prev) => ({ ...prev, media: [...prev.media, ""] }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const cleanedMedia = form.media
//       .filter((url) => url.trim() !== "")
//       .map((url) => ({ url }));

//     // const cleanedLocation = {
//     //   ...form.location,
//     //   lat: Number(form.location.lat) || 0,
//     //   lng: Number(form.location.lng) || 0,
//     // };

//     const payload = {
//       ...form,
//       media: cleanedMedia,
//       location: form.location,
//     };

//     try {
//       const res = await fetch(`${API_BASE}/venues/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//           "X-Noroff-API-Key": API_KEY,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("Failed to update venue");

//       setShowLoader(true); // Show loader

//       // ✅ Save tags locally
//       //   const cleanedTags = form.tags
//       //     .split(",")
//       //     .map((t) => t.trim())
//       //     .filter(Boolean);

//       //   setTagsForVenue(id, cleanedTags);

//       setTimeout(() => {
//         navigate("/profile"); // Redirect after 2s
//       }, 2000);
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/venues/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "X-Noroff-API-Key": API_KEY,
//         },
//       });

//       if (!res.ok) throw new Error("Failed to delete venue");

//       alert("Venue deleted");
//       navigate("/venues");
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   if (error) return <p className="text-red-500">{error}</p>;
//   if (showLoader) return <PublishedLoader />;

//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Edit Venue</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           name="name"
//           value={form.name}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           placeholder="Venue name"
//           required
//         />
//         <textarea
//           name="description"
//           value={form.description}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           placeholder="Description"
//           required
//         />
//         <input
//           name="price"
//           type="number"
//           value={form.price}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           placeholder="Price"
//           required
//         />
//         <input
//           name="maxGuests"
//           type="number"
//           value={form.maxGuests}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           placeholder="Max Guests"
//           required
//         />

//         <h2 className="font-semibold">Images</h2>
//         {form.media.map((url, i) => (
//           <input
//             key={i}
//             value={url}
//             onChange={(e) => handleMediaChange(i, e.target.value)}
//             className="w-full p-2 border rounded mb-2"
//             placeholder="Image URL"
//           />
//         ))}
//         <button
//           type="button"
//           onClick={addMediaField}
//           className="button-secondary"
//         >
//           + Add another image
//         </button>

//         <h2 className="font-semibold mt-4">This venue offers:</h2>
//         {Object.keys(form.meta).map((key) => (
//           <label key={key} className="block">
//             <input
//               type="checkbox"
//               name={key}
//               checked={form.meta[key]}
//               onChange={handleChange}
//             />{" "}
//             {key.charAt(0).toUpperCase() + key.slice(1)}
//           </label>
//         ))}

//         <h2 className="font-semibold mt-4">Location</h2>
//         {Object.keys(form.location).map((key) => (
//           <input
//             key={key}
//             name={key}
//             value={form.location[key] || ""}
//             onChange={handleChange}
//             className="w-full p-2 border rounded mb-2"
//             placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
//           />
//         ))}

//         {/* <h2 className="font-semibold">Tags (comma separated):</h2>
//         <input
//           name="tags"
//           value={form.tags}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           placeholder="e.g. cabin, wow, mountain"
//         /> */}

//         <div className="flex gap-4 mt-6">
//           <button type="submit" className="button-primary">
//             Update Venue
//           </button>

//           <button
//             type="button"
//             onClick={() => navigate("/venues")}
//             className="button-cancel-ignore"
//           >
//             Cancel
//           </button>

//           <button
//             type="button"
//             onClick={() => setShowConfirmDelete(true)}
//             className="button-destructive"
//           >
//             Delete Venue
//           </button>
//         </div>
//       </form>

//       {showConfirmDelete && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
//             <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
//             <p className="mb-4">Are you sure you want to delete this venue?</p>
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setShowConfirmDelete(false)}
//                 className="bg-gray-300 px-4 py-2 rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//               >
//                 Yes, Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
