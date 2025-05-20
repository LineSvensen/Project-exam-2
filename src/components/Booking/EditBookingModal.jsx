// components/Booking/EditBookingModal.jsx
import { useState, useEffect } from "react";
import useAuthStore from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import {
  addDays,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  isBefore,
  format,
} from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function EditBookingModal({ booking, onClose }) {
  const navigate = useNavigate();
  const [range, setRange] = useState({
    from: booking.dateFrom ? parseISO(booking.dateFrom) : undefined,
    to: booking.dateTo ? parseISO(booking.dateTo) : undefined,
  });
  const [guests, setGuests] = useState(booking.guests);
  const [error, setError] = useState("");
  const [bookedNights, setBookedNights] = useState([]);
  const API_KEY = import.meta.env.VITE_API_KEY;
  const { token } = useAuthStore();

  useEffect(() => {
    async function fetchVenueBookings() {
      try {
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${booking.venue.id}?_bookings=true`,
          {
            headers: {
              "X-Noroff-API-Key": API_KEY,
            },
          }
        );
        const data = await res.json();
        const filteredBookings = data.data.bookings.filter(
          (b) => b.id !== booking.id
        );
        const nights = filteredBookings.flatMap((b) => {
          const from = parseISO(b.dateFrom);
          const to = parseISO(b.dateTo);
          return eachDayOfInterval({ start: from, end: addDays(to, -1) }); // ✅
        });
        setBookedNights(nights);
      } catch (err) {
        console.error("Error fetching venue bookings", err);
      }
    }
    fetchVenueBookings();
  }, [booking.id, booking.venue.id, API_KEY]);

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const handleConfirm = async () => {
    setError("");

    if (!range.from || !range.to) {
      setError("Please select both check-in and check-out dates.");
      return;
    }

    if (isBefore(range.to, range.from)) {
      setError("Check-out must be after check-in.");
      return;
    }

    const selectedDates = eachDayOfInterval({
      start: range.from,
      end: addDays(range.to, -1), // ✅ Do NOT include the checkout day in billing
    });

    const hasConflict = selectedDates.some((date) =>
      bookedNights.some((booked) => isSameDay(booked, date))
    );

    if (hasConflict) {
      setError("You can't book dates that are already reserved.");
      return;
    }

    const payload = {
      dateFrom: range.from.toISOString(),
      dateTo: range.to.toISOString(),
      guests: Number(guests),
    };

    try {
      const res = await fetch(
        `https://v2.api.noroff.dev/holidaze/bookings/${booking.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Noroff-API-Key": API_KEY,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.errors?.[0]?.message || "Failed to update.");
      }

      navigate("/confirmation", {
        state: {
          venueName: booking.venue.name,
          checkIn: format(range.from, "yyyy-MM-dd"),
          checkOut: format(range.to, "yyyy-MM-dd"),
          guests,
          nights: selectedDates.length,
          total: selectedDates.length * booking.venue.price,
        },
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white rounded p-6 w-full max-w-xl mx-auto max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Edit Booking</h2>

        <label className="block text-sm font-medium mb-2">Guests:</label>
        <input
          type="number"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          min={1}
          className="w-full mb-4 p-2 border rounded"
        />

        <label className="block text-sm font-medium mb-2">
          Select new dates:
        </label>
        <DayPicker
          mode="range"
          selected={range}
          onSelect={(selectedRange) => {
            if (!selectedRange?.from) {
              setRange({ from: undefined, to: undefined });
            } else if (selectedRange.from && !selectedRange.to) {
              setRange({ from: selectedRange.from, to: undefined });
            } else {
              setRange(selectedRange);
            }
          }}
          fromDate={new Date()}
          numberOfMonths={2}
          pagedNavigation
          disabled={(date) =>
            bookedNights.some((booked) => isSameDay(booked, date))
          }
          modifiersClassNames={{
            disabled: "text-gray-400 line-through",
            selected: "bg-red-500 text-white",
            today: "text-red-700 font-bold",
          }}
        />
        {range?.from && range?.to && (
          <p className="text-md font-bold text-gray-700 mt-4">
            <strong>New Dates:</strong> {format(range.from, "dd.MM.yyyy")} →{" "}
            {format(range.to, "dd.MM.yyyy")}
          </p>
        )}
        <p className="text-xs mt-2">
          By clicking "Update booking" you agree to pay a new amount and will
          get refunded for the previous chosen dates if done 48 hours before
          original booking date. Read more <b>here</b>.
        </p>
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 button-descret">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!range?.from || !range?.to}
            className="px-4 py-2 button-primary disabled:opacity-50"
          >
            Update Booking
          </button>
        </div>
      </div>
    </div>
  );
}
