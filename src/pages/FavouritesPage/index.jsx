import useAuthStore from "../../stores/authStore";
import useFavouritesStore from "../../stores/favouritesStore";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import VenueCard from "../../components/Venue/VenueCard";
import BackButton from "../../components/Buttons/BackButton";

export default function FavouritesPage() {
  const { user } = useAuthStore();
  const { favourites, loadFavourites } = useFavouritesStore();

  useEffect(() => {
    if (user) {
      loadFavourites();
    }
  }, [user]);

  useEffect(() => {
    document.title = "Your favourites | Holidaze";
  }, []);

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center flex justify-center flex-col items-center gap-4">
        <BackButton />
        <h1 className="text-2xl font-bold mb-4">Favourites</h1>
        <p className="text-gray-600 mb-4">
          You must be logged in to view and save favourites.
        </p>
        <Link to="/login" className="px-4 py-2 button-primary max-w-52">
          Log in or Register
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <BackButton />
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
