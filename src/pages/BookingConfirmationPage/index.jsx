import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state;

  useEffect(() => {
    // Redirect to home if accessed directly without booking data
    if (!booking) {
      navigate("/");
    }
  }, [booking, navigate]);

  if (!booking) return null;

  const { venueName, checkIn, checkOut, guests, nights, total } = booking;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-8 text-center font-inter">
      <h1 className="text-2xl font-bold mb-4 text-green-600">
        Booking Confirmed 🎉
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
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        Back to Home
      </button>
    </div>
  );
}
