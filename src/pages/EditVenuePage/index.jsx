import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import PublishedLoader from "../../components/Shared/Loaders/PublishedLoader";
import BackButton from "../../components/Buttons/BackButton";

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

  

  if (error) return <p className="text-red-500">{error}</p>;
  if (showLoader) return <PublishedLoader />;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Edit Venue</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="font-bold">Venue name:</h2>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Venue name"
          required
        />
        <h2 className="font-bold">Description:</h2>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Description"
          required
        />
        <h2 className="font-bold">$ Price:</h2>
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Price"
          required
        />
        <h2 className="font-bold">Max guests:</h2>
        <input
          name="maxGuests"
          type="number"
          value={form.maxGuests}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Max Guests"
          required
        />

        <h2 className="font-bold">Images</h2>
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

        <h2 className="font-bold mt-4">This venue offers:</h2>
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

        <h2 className="font-bold mt-4">Location</h2>
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

        
        </div>
      </form>
    </div>
  );
}
