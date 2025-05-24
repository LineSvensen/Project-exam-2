import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useVenue } from "../../hooks/useSingleVenue";
import { useVenueBookings } from "../../hooks/useVenueBookings";
import VenueCard from "../../components/Venue/VenueCard";
import BackButton from "../../components/Buttons/BackButton";
import Avatar from "../../components/Shared/Avatar";

export default function VenueBookingsPage() {
  const { id } = useParams();
  const { venue, loading: venueLoading } = useVenue(id);
  const { bookings, loading: bookingsLoading, error } = useVenueBookings(id);

  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const FEE = 15;

  useEffect(() => {
    document.title = "My venue bookings | Holidaze";
  }, []);

  useEffect(() => {
    if (!bookings || bookings.length === 0 || !venue) return;

    const now = new Date();
    const future = [];
    const previous = [];
    let earnings = 0;

    bookings.forEach((booking) => {
      const from = new Date(booking.dateFrom);
      const to = new Date(booking.dateTo);
      const nights = Math.max(
        1,
        Math.ceil((to - from) / (1000 * 60 * 60 * 24))
      );
      const total = venue.price * nights;
      const afterFee = total - FEE;
      earnings += afterFee;

      if (to >= now) {
        future.push({ ...booking, nights, total, afterFee });
      } else {
        previous.push({ ...booking, nights, total, afterFee });
      }
    });

    setUpcoming(future);
    setPast(previous);
    setTotalEarnings(earnings);
  }, [bookings, venue]);

  if (venueLoading || bookingsLoading)
    return <p className="p-6">Loading venue and bookings...</p>;
  if (error) return <p className="text-red-500 p-6">Error loading bookings</p>;
  if (!venue) return <p className="p-6">Venue not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4 mt-4">
        Bookings for: {venue.name}
      </h1>

      <VenueCard venue={venue} />

      <div className="bg-green-50 border border-green-200 text-green-800 rounded p-4 mt-6">
        <h2 className="text-lg font-semibold mb-1">Total earnings after fee</h2>
        <p className="text-2xl font-bold">${totalEarnings.toFixed(2)}</p>
        <p className="text-xs text-gray-500 pt-2">
          A $15 fee is deducted per booking
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Upcoming Bookings</h2>
        {upcoming.length === 0 ? (
          <p className="text-gray-500">No upcoming bookings.</p>
        ) : (
          <ul className="space-y-3">
            {upcoming.map((booking) => (
              <li key={booking.id} className="bg-white shadow p-3 rounded">
                <div className="flex items-center gap-3 mb-1">
                  <Avatar
                    url={booking.customer?.avatar?.url}
                    size="w-10 h-10"
                  />
                  <strong>{booking.customer?.name}</strong>
                  <span className="text-sm text-gray-500">
                    — {booking.guests} guest(s)
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  From{" "}
                  <strong>
                    {new Date(booking.dateFrom).toLocaleDateString()}
                  </strong>{" "}
                  to{" "}
                  <strong>
                    {new Date(booking.dateTo).toLocaleDateString()}
                  </strong>
                </p>
                <p className="text-sm mt-1">
                  Total: ${booking.total} ({booking.nights} night
                  {booking.nights > 1 ? "s" : ""})
                </p>
                <div className="flex flex-row text-center pt-2">
                  <p className="text-sm text-green-700 font-medium">
                    Your earnings: ${booking.afterFee.toFixed(2)}
                  </p>
                  <p className="text-sm pl-2 text-gray-600">
                    (after $15 Holidaze fee)
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Past Bookings</h2>
        {past.length === 0 ? (
          <p className="text-gray-500">No previous bookings.</p>
        ) : (
          <ul className="space-y-3">
            {past.map((booking) => (
              <li
                key={booking.id}
                className="bg-gray-100 shadow-inner p-3 rounded"
              >
                <div className="flex items-center gap-3 mb-1">
                  <Avatar
                    url={booking.customer?.avatar?.url}
                    size="w-10 h-10"
                  />
                  <strong>{booking.customer?.name}</strong>
                  <span className="text-sm text-gray-500">
                    — {booking.guests} guest(s)
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  From{" "}
                  <strong>
                    {new Date(booking.dateFrom).toLocaleDateString()}
                  </strong>{" "}
                  to{" "}
                  <strong>
                    {new Date(booking.dateTo).toLocaleDateString()}
                  </strong>
                </p>
                <p className="text-sm mt-1">
                  Total: ${booking.total} for {booking.nights} night
                  {booking.nights > 1 ? "s" : ""}
                </p>
                <p className="text-sm text-green-700 font-medium">
                  Earnings after fee: ${booking.afterFee.toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
