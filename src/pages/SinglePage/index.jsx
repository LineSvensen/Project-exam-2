import { useParams } from "react-router-dom";
import { useVenue } from "../../hooks/useSingleVenue";
import { useVenueBookings } from "../../hooks/useVenueBookings"; // ✅ You missed this import
import ImageGallery from "../../components/Venue/VenueImageGallery";
import VenueInfo from "../../components/Venue/VenueInfo";
import VenueReviews from "../../components/Venue/VenueReviews";

export default function SinglePage() {
  const { id } = useParams();
  const { venue, loading: venueLoading, error: venueError } = useVenue(id);
  const {
    bookings,
    loading: bookingsLoading,
    error: bookingsError,
  } = useVenueBookings();

  if (venueLoading || bookingsLoading) return <p>Loading venue...</p>;
  if (venueError || bookingsError)
    return <p className="text-red-500">Error loading venue or bookings</p>;

  if (!venue) return <p>Venue not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{venue.name}</h1>

      <ImageGallery media={venue.media} altFallback={venue.name} />

      <p>{venue.description}</p>
      <div className="mt-6">
        <VenueInfo venue={venue} />
      </div>

      {/* You can pass `user` here later when auth is ready */}
      <VenueReviews venueId={venue.id} />
    </div>
  );
}
