import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_KEY = import.meta.env.VITE_API_KEY;

export default function VenueForm({ mode = "create", initialData = {} }) {
  const { token } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    media: [""],
    price: 0,
    maxGuests: 1,
    meta: { wifi: false, parking: false, breakfast: false, pets: false },
    location: { address: "", city: "", zip: "", country: "", continent: "" },
    ...initialData,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name in form.meta) {
      setForm((prev) => ({ ...prev, meta: { ...prev.meta, [name]: checked } }));
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
      const res = await fetch(`${API_BASE}/venues`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify({
          ...form,
          media: form.media.map((url) => ({ url })),
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.errors?.[0]?.message || "Failed to create venue");

      navigate("/venues");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
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
          {key}
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
          placeholder={key}
        />
      ))}

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        {mode === "edit" ? "Update Venue" : "Create Venue"}
      </button>
    </form>
  );
}
