import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useVenue } from "../../hooks/useSingleVenue";
import { useVenueBookings } from "../../hooks/useVenueBookings";
import VenueCard from "../../components/Venue/VenueCard";
import BackButton from "../../components/Buttons/BackButton";

export default function VenueBookingsPage() {
  const { id } = useParams();
  const { venue, loading: venueLoading } = useVenue(id);
  const { bookings, loading: bookingsLoading, error } = useVenueBookings(id);

  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);

  useEffect(() => {
    if (!bookings || bookings.length === 0) return;

    const now = new Date();
    const futureBookings = [];
    const pastBookings = [];

    bookings.forEach((booking) => {
      const dateFrom = new Date(booking.dateFrom);
      const dateTo = new Date(booking.dateTo);

      if (dateTo >= now) {
        futureBookings.push(booking);
      } else {
        pastBookings.push(booking);
      }
    });

    setUpcoming(futureBookings);
    setPast(pastBookings);
  }, [bookings]);

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

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Upcoming Bookings</h2>
        {upcoming.length === 0 ? (
          <p className="text-gray-500">No upcoming bookings.</p>
        ) : (
          <ul className="space-y-3">
            {upcoming.map((booking) => (
              <li key={booking.id} className="bg-white shadow p-3 rounded">
                <p>
                  <strong>{booking.customer?.name}</strong> — {booking.guests}{" "}
                  guest(s)
                </p>
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
                <p>
                  <strong>{booking.customer?.name}</strong> — {booking.guests}{" "}
                  guest(s)
                </p>
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
