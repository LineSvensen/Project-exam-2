import { useEffect, useState, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import { format } from "date-fns";
import ErrorMessage from "../Shared/ErrorMessage";
import { eachDayOfInterval, parseISO, addDays } from "date-fns";
import { differenceInCalendarDays } from "date-fns";

const BookingSummary = forwardRef(function BookingSummary(
  {
    checkIn,
    checkOut,
    pricePerNight,
    venueId,
    guests = 1,
    bookings = [],
    venueName,
    refetchBookings,
  },
  ref
) {
  const [nights, setNights] = useState(0);
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [error, setError] = useState("");

  useEffect(() => {
    if (checkIn && checkOut) {
      const calculatedNights = Math.max(
        1,
        differenceInCalendarDays(new Date(checkOut), new Date(checkIn))
      );
      setNights(calculatedNights);
    } else {
      setNights(0);
    }
  }, [checkIn, checkOut]);

  const total = nights * pricePerNight;

  const handleReserve = async () => {
    if (!checkIn || !checkOut || !venueId || !guests || guests < 1) {
      setError("Please make sure all booking details are valid.");
      return;
    }

    const payload = {
      dateFrom: new Date(checkIn).toISOString(),
      dateTo: new Date(checkOut).toISOString(),
      guests: Number(guests),
      venueId,
    };

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

      const data = await res.json();

      if (!res.ok) {
        let message =
          data?.errors?.[0]?.message || "Booking failed. Please try again.";

        // Customize for invalid token
        if (message.toLowerCase().includes("authorization token")) {
          message = "Please Log in or register to reserve";
        }

        setError(message);
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
      setError("Booking failed. Please try again.");
    }
  };

  const displayCheckIn = checkIn
    ? format(new Date(checkIn), "dd.MM.yyyy")
    : "—";
  const displayCheckOut = checkOut
    ? format(new Date(checkOut), "dd.MM.yyyy")
    : "—";

  return (
    <div
      ref={ref}
      id="summary"
      className="bg-white shadow p-4 rounded space-y-2 mt-6 font-inter"
    >
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
        className="w-full mt-4 py-2 px-4 button-primary disabled:opacity-50"
      >
        Reserve
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
});

export default BookingSummary;
