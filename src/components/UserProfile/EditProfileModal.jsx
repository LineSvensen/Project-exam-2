import { useState } from "react";
import useAuthStore from "../../stores/authStore";

export default function EditProfileModal({ onClose }) {
  const { user, token, login } = useAuthStore();

  const API_KEY = import.meta.env.VITE_API_KEY;
  const [form, setForm] = useState({
    avatar: user?.avatar?.url || "",
    bio: user?.bio || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://v2.api.noroff.dev/holidaze/profiles/${user.name}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Noroff-API-Key": API_KEY,
          },
          body: JSON.stringify({
            bio: form.bio,
            avatar: form.avatar ? { url: form.avatar } : undefined,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.errors?.[0]?.message || "Failed to update");

      login(data.data, token);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="block mb-1 font-medium">Profile picture URL:</span>
            <input
              name="avatar"
              value={form.avatar}
              onChange={handleChange}
              placeholder="Avatar URL"
              className="w-full border p-2 rounded"
            />
          </label>

          <label className="block">
            <span className="block mb-1 font-medium">
              Write about yourself:
            </span>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Short bio..."
              className="w-full h-52 border p-2 rounded"
            />
          </label>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded cursor-pointer hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-black hover:bg-gray-900 text-white rounded cursor-pointer"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
