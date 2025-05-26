import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import PublishedLoader from "../Shared/Loaders/PublishedLoader";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_KEY = import.meta.env.VITE_API_KEY;

export default function VenueForm({ mode = "create", initialData = {} }) {
  const { token, user } = useAuthStore();
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    media: [""],
    price: "",
    maxGuests: "",
    meta: { wifi: false, parking: false, breakfast: false, pets: false },
    location: { address: "", city: "", zip: "", country: "", continent: "" },
    ...initialData,
  });

  const [errors, setErrors] = useState({});

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
        [name]: type === "number" ? value.replace(/^0+(?=\d)/, "") : value,
      }));
    }
  };

  const handleMediaChange = (i, value) => {
    const updated = [...form.media];
    updated[i] = value;
    setForm((prev) => ({ ...prev, media: updated }));
  };

  const addMediaField = () => {
    if (form.media.length < 8) {
      setForm((prev) => ({ ...prev, media: [...prev.media, ""] }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.description.trim())
      newErrors.description = "Description is required.";
    if (!form.location.address.trim())
      newErrors.address = "Address is required.";
    if (!form.location.city.trim()) newErrors.city = "City is required.";
    if (!form.location.country.trim())
      newErrors.country = "Country is required.";
    if (!form.price || isNaN(Number(form.price)))
      newErrors.price = "Price must be a number.";
    if (!form.maxGuests || isNaN(Number(form.maxGuests)))
      newErrors.maxGuests = "Max guests must be a number.";
    if (form.media.filter((url) => url.trim()).length === 0)
      newErrors.media = "At least one image is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      
      if (!user?.venueManager) {
        await fetch(`${API_BASE}/profiles/${user.name}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": API_KEY,
          },
          body: JSON.stringify({ venueManager: true }),
        });

        const updatedUser = { ...user, venueManager: true };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        useAuthStore.setState({ user: updatedUser });
      }

   
      const res = await fetch(`${API_BASE}/venues`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          maxGuests: Number(form.maxGuests),
          media: form.media.filter((url) => url.trim()).map((url) => ({ url })),
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.errors?.[0]?.message || "Failed to create venue");

    
      setShowLoader(true);
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      setErrors({ form: err.message });
    }
  };


  if (showLoader) return <PublishedLoader />;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="font-semibold">Venue name:</h2>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        placeholder="Venue name"
      />
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

      <h2 className="font-semibold">Description:</h2>
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        placeholder="Description"
      />
      {errors.description && (
        <p className="text-red-500 text-sm">{errors.description}</p>
      )}

      <h2 className="font-semibold">$ Price:</h2>
      <input
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        placeholder="Price"
      />
      {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}

      <h2 className="font-semibold">Max guests:</h2>
      <input
        name="maxGuests"
        type="number"
        value={form.maxGuests}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        placeholder="Max Guests"
      />
      {errors.maxGuests && (
        <p className="text-red-500 text-sm">{errors.maxGuests}</p>
      )}

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
      {errors.media && <p className="text-red-500 text-sm">{errors.media}</p>}

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
          {key}
        </label>
      ))}

      <h2 className="font-semibold mt-4">Location</h2>
      {Object.keys(form.location).map((key) => (
        <div key={key}>
          <input
            name={key}
            value={form.location[key] || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-1"
            placeholder={key}
          />
          {errors[key] && <p className="text-red-500 text-sm">{errors[key]}</p>}
        </div>
      ))}

      {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}

      <button type="submit" className="button-primary">
        {mode === "edit" ? "Update Venue" : "Create Venue"}
      </button>
    </form>
  );
}
