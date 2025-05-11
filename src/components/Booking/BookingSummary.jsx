import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import { format } from "date-fns";

export default function BookingSummary({
  checkIn,
  checkOut,
  pricePerNight,
  venueId,
  guests = 1,
  bookings = [],
  venueName,
  refetchBookings, // ✅ Add refetch function from useVenueBookings
}) {
  console.log("🧾 BookingSummary sees:", { checkIn, checkOut });
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
    console.log(checkIn, checkOut);
  }, [checkIn, checkOut]);

  const total = nights * pricePerNight;

  const handleReserve = async () => {
    if (!checkIn || !checkOut || !venueId || !guests || guests < 1) {
      alert("Please make sure all booking details are valid.");
      return;
    }

    const payload = {
      dateFrom: new Date(checkIn).toISOString(),
      dateTo: new Date(checkOut).toISOString(),
      guests: Number(guests),
      venueId,
    };

    console.log("📦 Booking payload:", payload);

    try {
      const res = await fetch("https://v2.api.noroff.dev/holidaze/bookings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify(payload),
      });

      console.log("📡 Response status:", res.status);
      const data = await res.json();
      console.log("📬 API response:", data);

      if (!res.ok) {
        const message =
          data?.errors?.[0]?.message || "Booking failed. Please try again.";
        alert(message);
        return;
      }

      if (typeof refetchBookings === "function") {
        await refetchBookings();
      }

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
      console.error("❌ Booking error:", err);
      alert("Booking failed. Please try again.");
    }
  };

  const displayCheckIn = checkIn
    ? format(new Date(checkIn), "dd.MM.yyyy")
    : "—";
  const displayCheckOut = checkOut
    ? format(new Date(checkOut), "dd.MM.yyyy")
    : "—";

  return (
    <div className="bg-white shadow p-4 rounded space-y-2 mt-6 font-inter">
      <h3 className="text-lg font-bold">Your Booking</h3>
      <p>
        Guests: <strong>{guests}</strong>
      </p>
      <p>
        Check-in: <strong>{displayCheckIn}</strong>
      </p>
      <p>
        Check-out: <strong>{displayCheckOut}</strong>
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
