import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useVenue } from "../../hooks/useSingleVenue";
import { useVenueBookings } from "../../hooks/useVenueBookings";
import ImageGallery from "../../components/Venue/VenueImageGallery";
import VenueInfo from "../../components/Venue/VenueInfo";
import BookingCalendar from "../../components/Booking/BookingCalendar";
import BookingSummary from "../../components/Booking/BookingSummary";
import useAuthStore from "../../stores/authStore";
import FavouriteButton from "../../components/Buttons/FavouritesButton";
import useFavouritesStore from "../../stores/favouritesStore";
import BackButton from "../../components/Buttons/BackButton";

export default function SinglePage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const summaryRef = useRef();
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
    refetchBookings,
  } = useVenueBookings(id);

  useEffect(() => {
    console.log("📦 Dates received by SinglePage:", selectedDates);
  }, [selectedDates]);

  useEffect(() => {
    if (venue?.name) {
      document.title = `${venue.name} | Holidaze`;
    } else {
      document.title = "Venue | Holidaze";
    }
  }, [venue]);

  if (venueLoading || bookingsLoading) {
    return <p className="text-center text-gray-600 mt-10">Loading venue...</p>;
  }

  if (venueError === "Venue not found") {
    return (
      <p className="text-center text-red-500 mt-10">
        This venue has been removed or does not exist.
      </p>
    );
  }

  if (venueError || bookingsError) {
    return (
      <p className="text-center text-red-500 mt-10">
        Error loading venue or bookings.
      </p>
    );
  }

  const isOwner = venue?.owner?.name === user?.name;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <BackButton />

      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          <FavouriteButton venue={venue} />
        </div>
        <ImageGallery media={venue.media} altFallback={venue.name} />
      </div>

      <div className="mt-6">
        <VenueInfo venue={venue} />
      </div>

      <div className="flex flex-col md:flex-row md:space-x-4 w-full">
        {isOwner ? (
          <div className="text-center w-full bg-yellow-100 p-4 rounded mt-4">
            <p className="text-yellow-800 font-semibold">
              You cannot book your own venue.
            </p>
          </div>
        ) : (
          <>
            <div className="w-full md:w-2/3 mt-4">
              <BookingCalendar
                bookings={bookings}
                onSelectDates={setSelectedDates}
              />
            </div>

            <div className="w-full md:w-1/3 mt-4 md:mt-0">
              <BookingSummary
                checkIn={selectedDates.checkIn}
                checkOut={selectedDates.checkOut}
                pricePerNight={venue.price}
                venueId={venue.id}
                guests={selectedDates.guests}
                bookings={bookings}
                venueName={venue.name}
                refetchBookings={refetchBookings}
                ref={summaryRef}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
