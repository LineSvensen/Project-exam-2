import { useState } from "react";
import {
  format,
  addDays,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  isBefore,
} from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "../../calendar.css";

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
    if (!selectedRange?.from) {
      setRange(undefined);
      return;
    }

    if (selectedRange?.from && !selectedRange?.to) {
      setRange({ from: selectedRange.from });
      return;
    }

    if (selectedRange?.from && selectedRange?.to) {
      setRange(selectedRange);
    }
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

    onSelectDates({
      checkIn: format(checkIn, "yyyy-MM-dd"),
      checkOut: format(checkOut, "yyyy-MM-dd"),
      guests,
    });

    // 💡 Smooth scroll to Booking Summary after date selection
    setTimeout(() => {
      const summaryEl = document.getElementById("summary");
      if (summaryEl) {
        summaryEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-md space-y-6 border border-gray-200 flex flex-col justify-center items-center">
      <h3 className="text-xl font-bold">Choose your stay</h3>

      <label className="text-sm font-medium">
        Guests:
        <input
          type="number"
          min="1"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="shadow-md mt-1 ml-4 p-2 rounded border border-gray-300 w-64 mb-4"
        />
      </label>

      <div className="flex justify-center items-center">
        <div className="w-full sm:w-auto">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleRangeSelect}
            fromDate={new Date()}
            numberOfMonths={2}
            pagedNavigation
            className="mx-auto"
            disabled={(date) =>
              bookedNights.some((booked) => isSameDay(booked, date))
            }
            modifiersClassNames={{
              disabled: "text-gray-400 line-through",
              selected: "bg-teal-500 text-white", // or change to "bg-red-500 text-white" for red theme
              today: "text-teal-700 font-bold",
            }}
            styles={{
              months: {
                flexDirection: "column",
              },
            }}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleConfirm}
        disabled={!range?.from || !range?.to}
        className="button-secondary max-w-80"
      >
        Choose dates
      </button>

      <p className="text-xs text-gray-500 italic mt-2">
        You’ll stay each night from check-in through the night before check-out.
      </p>
    </div>
  );
}

// import { useState } from "react";
// import { format } from "date-fns";
// import "../../calendar.css";

// import {
//   addDays,
//   eachDayOfInterval,
//   isSameDay,
//   parseISO,
//   isBefore,
// } from "date-fns";
// import { DayPicker } from "react-day-picker";
// import "react-day-picker/dist/style.css";

// export default function BookingCalendar({ bookings = [], onSelectDates }) {
//   const [guests, setGuests] = useState(1);
//   const [range, setRange] = useState(undefined);
//   const [error, setError] = useState("");

//   const bookedNights = bookings.flatMap((booking) => {
//     const from = parseISO(booking.dateFrom);
//     const to = parseISO(booking.dateTo);
//     return eachDayOfInterval({ start: from, end: addDays(to, -1) });
//   });

//   const handleRangeSelect = (selectedRange) => {
//     // Prevent DayPicker from resetting the range on paged navigation
//     if (!selectedRange?.from) {
//       setRange(undefined);
//       return;
//     }

//     if (selectedRange?.from && !selectedRange?.to) {
//       setRange({ from: selectedRange.from });
//       return;
//     }

//     // Ensure full range is set before proceeding
//     if (selectedRange?.from && selectedRange?.to) {
//       setRange(selectedRange);
//     }
//   };

//   const handleConfirm = () => {
//     if (!range?.from || !range?.to) {
//       setError("Please select both check-in and check-out dates.");
//       return;
//     }

//     const checkIn = range.from;
//     const checkOut = range.to;

//     if (isBefore(checkOut, checkIn)) {
//       setError("Check-out must be after check-in.");
//       return;
//     }

//     const selectedNights = eachDayOfInterval({
//       start: checkIn,
//       end: addDays(checkOut, -1),
//     });

//     const hasConflict = selectedNights.some((date) =>
//       bookedNights.some((booked) => isSameDay(booked, date))
//     );

//     if (hasConflict) {
//       setError("You can't book dates that are already reserved.");
//       return;
//     }

//     onSelectDates({
//       checkIn: format(checkIn, "yyyy-MM-dd"),
//       checkOut: format(checkOut, "yyyy-MM-dd"),
//       guests,
//     });
//     console.log(
//       "📅 Calendar confirms:",
//       checkIn.toISOString(),
//       checkOut.toISOString()
//     );
//   };

//   return (
//     <div className="bg-white shadow-lg p-6 rounded-md space-y-6 border border-gray-200 flex flex-col justify-center items-center">
//       <h3 className="text-xl font-bold">Choose your stay</h3>

//       <label className="text-sm font-medium">
//         Guests:
//         <input
//           type="number"
//           min="1"
//           value={guests}
//           onChange={(e) => setGuests(Number(e.target.value))}
//           className="shadow-md mt-1 ml-4 p-2 rounded border border-gray-00 w-64 mb-4"
//         />
//       </label>

//       <div className="flex justify-center items-center">
//         <div className="w-full sm:w-auto">
//           <DayPicker
//             mode="range"
//             selected={range}
//             onSelect={handleRangeSelect}
//             fromDate={new Date()}
//             numberOfMonths={2}
//             pagedNavigation
//             className="mx-auto"
//             disabled={(date) =>
//               bookedNights.some((booked) => isSameDay(booked, date))
//             }
//             modifiersClassNames={{
//               disabled: "text-gray-400 line-through",
//               selected: "bg-teal-500 text-white", // or "bg-red-500" if you want red
//               today: "text-teal-700 font-bold",
//             }}
//             styles={{
//               months: {
//                 flexDirection: "column",
//               },
//             }}
//           />
//         </div>
//       </div>

//       {error && <p className="text-red-500 text-sm">{error}</p>}

//       <button
//         onClick={handleConfirm}
//         disabled={!range?.from || !range?.to}
//         className="button-secondary max-w-80"
//       >
//         Choose dates
//       </button>

//       <p className="text-xs text-gray-500 italic mt-2">
//         You’ll stay each night from check-in through the night before check-out.
//       </p>
//     </div>
//   );
// }
