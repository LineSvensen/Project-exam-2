import { useBookings } from "../../hooks/useUserBookings";

export default function MyTripsPage() {
  const { bookings, loading, error } = useBookings();

  if (loading) return <p>Loading your bookings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const trips = Array.isArray(bookings) ? bookings : [];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Trips</h1>
      {trips.length === 0 ? (
        <p>You haven't made any bookings yet.</p>
      ) : (
        <ul className="space-y-4">
          {trips.map((trip) => {
            const venue = trip.venue;
            const image = venue?.media?.[0]?.url;

            return (
              <li
                key={trip.id}
                className="border p-4 rounded shadow hover:bg-gray-50 flex flex-col md:flex-row gap-4"
              >
                {image && (
                  <img
                    src={image}
                    alt={venue?.media?.[0]?.alt || venue?.name}
                    className="w-full md:w-48 h-32 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">
                    {venue?.name || "Unknown Venue"}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Location: {venue?.location?.city || "Unknown"},{" "}
                    {venue?.location?.country || ""}
                  </p>
                  <p className="text-sm">
                    Dates: {new Date(trip.dateFrom).toLocaleDateString()} →{" "}
                    {new Date(trip.dateTo).toLocaleDateString()}
                  </p>
                  <p className="text-sm">Guests: {trip.guests || "N/A"}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
