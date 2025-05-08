import { useParams } from "react-router-dom";
import { useVenue } from "../../hooks/useSingleVenue";
import { useState } from "react";
import { useVenueBookings } from "../../hooks/useVenueBookings";
import ImageGallery from "../../components/Venue/VenueImageGallery";
import VenueInfo from "../../components/Venue/VenueInfo";
import VenueReviews from "../../components/Venue/VenueReviews";
import BookingCalendar from "../../components/BookingCalendar";
import BookingSummary from "../../components/BookingSummary";
import useAuthStore from "../../stores/authStore";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import useFavouritesStore from "../../stores/favouritesStore";

export default function SinglePage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { favourites, addFavourite, removeFavourite } = useFavouritesStore();

  const [selectedDates, setSelectedDates] = useState({
    checkIn: null,
    checkOut: null,
    guests: 1,
  });

  const { venue, loading: venueLoading, error: venueError } = useVenue(id);
  const {
    bookings,
    loading: bookingsLoading,
    error: bookingsError,
  } = useVenueBookings();

  // Early returns always come AFTER hooks
  if (venueLoading || bookingsLoading) return <p>Loading venue...</p>;
  if (venueError || bookingsError)
    return <p className="text-red-500">Error loading venue or bookings</p>;
  if (!venue) return <p>Venue not found.</p>;

  const isOwner = venue.owner?.name === user?.name;
  const isFavourite = favourites.some((fav) => fav.id === venue.id);

  const toggleFavourite = () => {
    isFavourite ? removeFavourite(venue.id) : addFavourite(venue);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="relative">
        <div className="relative">
          <ImageGallery media={venue.media} altFallback={venue.name} />
          {!isOwner && (
            <button
              onClick={toggleFavourite}
              className="absolute top-4 right-4 p-2 bg-white/70 rounded shadow-md text-black hover:text-gray-700 cursor-pointer transition z-10 flex justify-center items-center"
              title={
                isFavourite ? "Remove from favourites" : "Add to favourites"
              }
            >
              {isFavourite ? <FaHeart /> : <FaRegHeart />}
            </button>
          )}
        </div>
      </div>
      <div className="mt-6">
        <VenueInfo venue={venue} />
      </div>
      <VenueReviews venueId={venue.id} />
      <div className="flex flex-col md:flex-row md:space-x-4 w-full">
        {isOwner ? (
          <div className="text-center w-full bg-yellow-100 p-4 rounded mt-4">
            <p className="text-yellow-800 font-semibold">
              You cannot book your own venue.
            </p>
          </div>
        ) : (
          <>
            <div className="w-full md:w-2/3">
              <BookingCalendar
                onSelectDates={setSelectedDates}
                bookings={venue.bookings}
              />
            </div>

            <div className="w-full md:w-1/3 mt-4 md:mt-0">
              <BookingSummary
                checkIn={selectedDates.checkIn}
                checkOut={selectedDates.checkOut}
                pricePerNight={venue.price}
                venueId={venue.id}
                guests={selectedDates.guests}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
