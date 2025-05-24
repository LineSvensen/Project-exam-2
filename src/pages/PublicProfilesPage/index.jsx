import { useParams } from "react-router-dom";
import { useEffect } from "react";
import useVenueStore from "../../stores/venueStore";
import VenueCard from "../../components/Venue/VenueCard";

export default function PublicProfilePage() {
  const { username } = useParams();
  const allVenues = useVenueStore((state) => state.allVenues);

  const venues = allVenues.filter(
    (venue) => venue.owner?.name.toLowerCase() === username.toLowerCase()
  );

  const owner = venues[0]?.owner;

  useEffect(() => {
    document.title = "View profile | Holidaze";
  }, []);

  if (!owner) {
    return <p className="p-8">No venues found for user: {username}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded p-6 mb-8 flex items-center gap-4">
        <img
          src={owner.avatar?.url || "/fallback.jpg"}
          alt={owner.avatar?.alt || owner.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold font-color">{owner.name}</h1>
          <p className="text-sm font-color">
            Hosting {venues.length} {venues.length === 1 ? "venue" : "venues"}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold font-color mb-4">
        Venues by {owner.name}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </div>
  );
}
