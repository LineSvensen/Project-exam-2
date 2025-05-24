import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import CompleteLoader from "../../components/Shared/Loaders/CompleteLoader";

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state;

  useEffect(() => {
    document.title = "Booking confirmed | Holidaze";
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/profile");
    }, 20000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!booking) {
      navigate("/");
    }
  }, [booking, navigate]);

  if (!booking) return null;

  const { venueName, checkIn, checkOut, guests, nights, total } = booking;

  return (
    <>
      <CompleteLoader />
      <div className="max-w-xl mx-auto p-6 bg-white shadow rounded text-center font-inter flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-4 text-green-600">
          Booking Confirmed
        </h1>
        <p className="mb-2">
          <strong>{venueName}</strong>
        </p>
        <p className="text-sm text-gray-600 mb-1">
          Check-in: <strong>{checkIn}</strong>
        </p>
        <p className="text-sm text-gray-600 mb-1">
          Check-out: <strong>{checkOut}</strong>
        </p>
        <p className="text-sm text-gray-600 mb-1">
          Guests: <strong>{guests}</strong>
        </p>
        <p className="text-sm text-gray-600 mb-1">
          Nights: <strong>{nights}</strong>
        </p>
        <p className="text-lg font-semibold mt-4">Total Paid: ${total}</p>

        <button
          onClick={() => navigate("/trips")}
          className="mt-6 px-6 py-2 button-descret flex justify-center items-center"
        >
          Go to my trips
        </button>
      </div>
    </>
  );
}
