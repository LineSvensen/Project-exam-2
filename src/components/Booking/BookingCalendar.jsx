import { useState } from "react";
import { format } from "date-fns";
import "../../calendar.css";

import {
  addDays,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  isBefore,
} from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function BookingCalendar({ bookings = [], onSelectDates }) {
  const [guests, setGuests] = useState(1);
  const [range, setRange] = useState(undefined);
  const [error, setError] = useState("");

  const bookedNights = bookings.flatMap((booking) => {
    const from = parseISO(booking.dateFrom);
    const to = parseISO(booking.dateTo);
    return eachDayOfInterval({ start: from, end: addDays(to, -1) });
  });

  const handleRangeSelect = (selectedRange) => {
    setError("");
    setRange(selectedRange);
  };
  const handleConfirm = () => {
    if (!range?.from || !range?.to) {
      setError("Please select both check-in and check-out dates.");
      return;
    }

    const checkIn = range.from;
    const checkOut = range.to;

    if (isBefore(checkOut, checkIn)) {
      setError("Check-out must be after check-in.");
      return;
    }

    // ✅ Only subtract a day here when checking booked nights
    const selectedNights = eachDayOfInterval({
      start: checkIn,
      end: addDays(checkOut, -1),
    });

    const hasConflict = selectedNights.some((date) =>
      bookedNights.some((booked) => isSameDay(booked, date))
    );

    if (hasConflict) {
      setError("You can't book dates that are already reserved.");
      return;
    }

    // ✅ Pass the real check-in and check-out dates (not adjusted)
    onSelectDates({
      checkIn: format(checkIn, "yyyy-MM-dd"),
      checkOut: format(checkOut, "yyyy-MM-dd"),
      guests,
    });
    console.log(
      "📅 Calendar confirms:",
      checkIn.toISOString(),
      checkOut.toISOString()
    );
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-md space-y-6 border border-gray-200">
      <h3 className="text-xl font-bold">Choose your stay</h3>

      <label className="text-sm font-medium">
        Guests:
        <input
          type="number"
          min="1"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="shadow-md mt-1 ml-4 p-2 rounded border border-gray-00 w-64 mb-4"
        />
      </label>

      <div className="flex justify-center">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={handleRangeSelect}
          fromDate={new Date()}
          disabled={(date) =>
            bookedNights.some((booked) => isSameDay(booked, date))
          }
          numberOfMonths={2}
          className="mx-auto rdp"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleConfirm}
        disabled={!range?.from || !range?.to}
        className="button-secondary"
      >
        Choose dates
      </button>

      <p className="text-xs text-gray-500 italic mt-2">
        You’ll stay each night from check-in through the night before check-out.
      </p>
    </div>
  );
}
