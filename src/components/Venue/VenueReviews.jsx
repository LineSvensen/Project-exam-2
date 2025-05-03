import { useState } from "react";
import VenueRating from "./VenueRating";

export default function VenueReviews({ venueId, user }) {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: "Jane Doe",
      date: "2025-05-01",
      rating: 4,
      text: "Lovely stay, cozy place!",
    },
  ]);

  const [newReview, setNewReview] = useState({ rating: 0, text: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    const review = {
      id: reviews.length + 1,
      author: user.name || "Anonymous",
      date: new Date().toISOString().slice(0, 10),
      ...newReview,
    };
    setReviews([review, ...reviews]);
    setNewReview({ rating: 0, text: "" });
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Guest Reviews</h3>

      {user && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-2">
            <label className="block mb-1">Rating</label>
            <select
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: +e.target.value })
              }
              className="border px-2 py-1 rounded"
              required
            >
              <option value="">Select</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} Star{num > 1 && "s"}
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={newReview.text}
            onChange={(e) =>
              setNewReview({ ...newReview, text: e.target.value })
            }
            className="w-full border rounded p-2 mb-2"
            placeholder="Write your review..."
            required
          ></textarea>
          <button
            type="submit"
            className="bg-primaryRed text-white px-4 py-2 rounded"
          >
            Submit Review
          </button>
        </form>
      )}

      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="border p-4 rounded shadow-sm">
            <div className="flex justify-between">
              <span className="font-semibold">{r.author}</span>
              <span className="text-sm text-gray-500">{r.date}</span>
            </div>
            <VenueRating rating={r.rating} />
            <p className="mt-2">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
