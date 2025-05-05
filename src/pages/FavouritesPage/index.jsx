import { useEffect } from "react";
import useFavouritesStore from "../../stores/favouritesStore";
import VenueCard from "../../components/Venue/VenueCard";

export default function FavouritesPage() {
  const { favourites, loadFavourites } = useFavouritesStore();

  useEffect(() => {
    loadFavourites();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Favourites</h1>
      {favourites.length === 0 ? (
        <p className="text-gray-500">You have no favourite venues yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favourites.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}
    </div>
  );
}
