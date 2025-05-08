// BookingCalendar.jsx
import { useState, useEffect } from "react";
import {
  addDays,
  isBefore,
  isAfter,
  isWithinInterval,
  parseISO,
} from "date-fns";

export default function BookingCalendar({ bookings = [], onSelectDates }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const disabledDates = bookings.flatMap((booking) => {
    const from = parseISO(booking.dateFrom);
    const to = parseISO(booking.dateTo);
    const days = [];
    for (let d = from; d <= to; d = addDays(d, 1)) {
      days.push(d.toISOString().split("T")[0]);
    }
    return days;
  });

  const handleSelect = () => {
    if (checkIn && checkOut && checkIn < checkOut && guests > 0) {
      onSelectDates({ checkIn, checkOut, guests });
    }
  };

  return (
    <div className="bg-white shadow p-4 rounded space-y-4">
      <h3 className="font-semibold">Choose your stay</h3>
      <div className="flex flex-col gap-4">
        <label className="text-sm">
          Guests:
          <input
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="border p-2 rounded w-full"
          />
        </label>
        <label className="text-sm">
          Check-in:
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="border p-2 rounded w-full"
            min={new Date().toISOString().split("T")[0]}
          />
        </label>
        <label className="text-sm">
          Check-out:
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="border p-2 rounded w-full"
            min={checkIn}
          />
        </label>
        <button
          onClick={handleSelect}
          className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
          disabled={!checkIn || !checkOut || checkIn >= checkOut}
        >
          Choose dates
        </button>
        <div className="text-xs text-gray-500">
          <p className="mt-2">Unavailable Dates:</p>
          <ul className="flex flex-wrap gap-2">
            {disabledDates.map((date) => (
              <li key={date} className="text-red-400">
                {date}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
