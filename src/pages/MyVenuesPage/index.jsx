import { useUserVenues } from "../../hooks/useUserVenues";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import VenueCard from "../../components/Venue/VenueCard";
import MyVenueCard from "../../components/Venue/MyVenueCard";
import { useVenueBookings } from "../../hooks/useVenueBookings";
import BackButton from "../../components/Buttons/BackButton";

export default function MyVenuesPage() {
  const { venues, loading, error } = useUserVenues();

  useEffect(() => {
    document.title = "My venues | Holidaze";
  }, []);

  if (loading) return <p className="p-8 text-center">Loading your venues...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  const noVenues = !venues || venues.length === 0;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <BackButton fallback="/profile" />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Venues</h1>
        {!noVenues && (
          <Link to="/venues/create" className="button-primary">
            + Create Venue
          </Link>
        )}
      </div>

      {noVenues ? (
        <div className="flex flex-col items-center justify-center text-center text-gray-600 mt-20">
          <p className="mb-4 text-lg">You haven't listed any venues yet.</p>
          <Link to="/venues/create" className="button-primary">
            + Create your first venue
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {venues.map((venue) => (
            <MyVenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}
    </div>
  );
}
