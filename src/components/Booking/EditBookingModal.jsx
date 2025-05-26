import { useState, useEffect, useRef } from "react";
import useAuthStore from "../../stores/authStore";
import { differenceInCalendarDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import "/src/calendar.css";

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
  const modalRef = useRef();
  const [range, setRange] = useState({
    from: booking.dateFrom ? parseISO(booking.dateFrom) : undefined,
    to: booking.dateTo ? parseISO(booking.dateTo) : undefined,
  });
  const [guests, setGuests] = useState(booking.guests);
  const [error, setError] = useState("");
  const [bookedNights, setBookedNights] = useState([]);
  const API_KEY = import.meta.env.VITE_API_KEY;
  const { token } = useAuthStore();

  const nights =
    range?.from && range?.to
      ? Math.max(1, differenceInCalendarDays(range.to, range.from))
      : 0;

  const total = nights * booking.venue.price;

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
          return eachDayOfInterval({ start: from, end: addDays(to, -1) });
        });
        setBookedNights(nights);
      } catch (err) {
        setError("Something went wrong. Please try again later.");
      }
    }
    fetchVenueBookings();
  }, [booking.id, booking.venue.id, API_KEY]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleConfirm = async () => {
    setError("");

    if (!range.from || !range.to) {
      setError("Please select both check-in and check-out dates.");
      return;
    }

    if (guests > booking.venue.maxGuests) {
      setError(`Max allowed guests is ${booking.venue.maxGuests}`);
      return;
    }

    if (isBefore(range.to, range.from)) {
      setError("Check-out must be after check-in.");
      return;
    }

    const selectedDates = eachDayOfInterval({
      start: range.from,
      end: addDays(range.to, -1),
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
    <div className="fixed inset-0 bg-black/50 bg-opacity-40 z-50 flex justify-center items-center">
      <div
        ref={modalRef}
        className="bg-white rounded p-6 w-full max-w-sm mx-auto max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-lg font-semibold mb-4">Edit Booking</h2>

        <label className="block text-sm font-medium mb-1">Guests:</label>
        <div className="flex items-center gap-3 mb-3">
          <button
            type="button"
            onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
            className="px-3 py-1 button-descret w-8 h-8 text-lg"
          >
            −
          </button>
          <span className="text-lg font-semibold">{guests}</span>
          <button
            type="button"
            onClick={() =>
              setGuests((prev) => Math.min(booking.venue.maxGuests, prev + 1))
            }
            className="px-3 py-1 button-descret w-8 h-8 text-lg"
          >
            +
          </button>
          <span className="text-sm text-gray-500 ml-2">
            Max {booking.venue.maxGuests}
          </span>
        </div>

        <label className="block text-sm font-medium mb-2">
          Select new dates:
        </label>
        <div className="flex flex-col justify-center items-center">
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
            className="mx-auto"
            disabled={(date) =>
              isBefore(date, new Date()) ||
              bookedNights.some((booked) => isSameDay(booked, date))
            }
            modifiersClassNames={{
              disabled: "text-gray-400 line-through",
              selected: "bg-red-500 text-white",
              today: "text-red-700 font-bold",
            }}
          />
        </div>

        {range?.from && range?.to && (
          <p className="text-md font-bold text-gray-700 mt-4">
            <strong>New Dates:</strong> {format(range.from, "dd.MM.yyyy")} →{" "}
            {format(range.to, "dd.MM.yyyy")}
          </p>
        )}

        {nights > 0 && (
          <>
            <p className="text-md font-bold text-gray-700 mt-2">
              <strong>Total:</strong> ${total}
            </p>
            <p className="text-sm text-gray-500">
              (${booking.venue.price} per night)
            </p>
          </>
        )}

        <p className="text-xs mt-4">
          By clicking "Update booking" you agree to pay a new amount and will
          get refunded for the previous chosen dates if done 48 hours before
          original booking date. Read more <b>here</b>.
        </p>

        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 button-cancel-ignore">
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
