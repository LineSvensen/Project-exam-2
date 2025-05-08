import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

export default function BookingSummary({
  checkIn,
  checkOut,
  pricePerNight,
  venueId,
  guests = 1,
  venueName,
}) {
  const [nights, setNights] = useState(0);
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (checkIn && checkOut) {
      const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays);
    } else {
      setNights(0);
    }
  }, [checkIn, checkOut]);

  const total = nights * pricePerNight;

  const handleReserve = async () => {
    try {
      const res = await fetch("https://v2.api.noroff.dev/holidaze/bookings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify({
          dateFrom: checkIn,
          dateTo: checkOut,
          guests: guests || 1,
          venueId,
        }),
      });

      if (!res.ok) throw new Error("Booking failed");

      navigate("/confirmation", {
        state: {
          venueName,
          checkIn,
          checkOut,
          guests,
          nights,
          total,
        },
      });
    } catch (err) {
      console.error(err);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div className="bg-white shadow p-4 rounded space-y-2 mt-6 font-inter">
      <h3 className="text-lg font-bold">Your Booking</h3>
      <p>
        Guests: <strong>{guests}</strong>
      </p>
      <p>
        Check-in: <strong>{checkIn || "—"}</strong>
      </p>
      <p>
        Check-out: <strong>{checkOut || "—"}</strong>
      </p>
      <p>
        Nights: <strong>{nights}</strong>
      </p>
      <p>
        Total: <strong>${total}</strong>
      </p>

      <button
        disabled={!checkIn || !checkOut || !guests}
        onClick={handleReserve}
        className="w-full mt-4 py-2 px-4 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-300"
      >
        Reserve
      </button>
    </div>
  );
}
