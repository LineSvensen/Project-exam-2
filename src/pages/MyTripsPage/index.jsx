import { useBookings } from "../../hooks/useUserBookings";
import { Link } from "react-router-dom";
import BackButton from "../../components/Buttons/BackButton";

export default function MyTripsPage() {
  const { bookings, loading, error } = useBookings();

  if (loading) return <p>Loading your bookings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const trips = Array.isArray(bookings) ? bookings : [];
  const today = new Date();

  const pastTrips = trips.filter((trip) => new Date(trip.dateTo) < today);
  const upcomingTrips = trips.filter((trip) => new Date(trip.dateTo) >= today);

  const renderTrip = (trip) => {
    const venue = trip.venue;
    const image = venue?.media?.[0]?.url;

    return (
      <Link to={`/venue/${venue?.id}`} key={trip.id}>
        <li className="border p-4 rounded shadow hover:bg-gray-50 flex flex-col md:flex-row gap-4 transition">
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
      </Link>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">My Trips</h1>

      {trips.length === 0 ? (
        <p>You haven't made any bookings yet.</p>
      ) : (
        <>
          {upcomingTrips.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-2">Upcoming Trips</h2>
              <ul className="space-y-4 mb-8">
                {upcomingTrips.map(renderTrip)}
              </ul>
            </>
          )}

          {pastTrips.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-2">Past Trips</h2>
              <ul className="space-y-4">{pastTrips.map(renderTrip)}</ul>
            </>
          )}
        </>
      )}
    </div>
  );
}
