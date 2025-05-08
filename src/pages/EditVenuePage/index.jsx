import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_KEY = import.meta.env.VITE_API_KEY;

export default function EditVenuePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();

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
        const res = await fetch(`${API_BASE}/holidaze/venues/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error("Failed to load venue");

        const venue = data.data;
        setForm({
          name: venue.name || "",
          description: venue.description || "",
          media: venue.media?.map((m) => m.url) || [""],
          price: venue.price || 0,
          maxGuests: venue.maxGuests || 1,
          meta: venue.meta || {},
          location: venue.location || {},
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
    try {
      const res = await fetch(`${API_BASE}/holidaze/venues/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update venue");
      navigate("/venues");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/holidaze/venues/${id}`, {
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

  if (loading) return <p>Loading venue...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

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
        <button type="button" onClick={addMediaField} className="text-blue-500">
          + Add another image
        </button>

        <h2 className="font-semibold mt-4">Amenities</h2>
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
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Update Venue
          </button>
          <button
            type="button"
            onClick={() => setShowConfirmDelete(true)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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
