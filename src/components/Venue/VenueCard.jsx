// components/VenueCard.jsx
import noImage from "../../assets/no-image.png";
import { Link } from "react-router-dom";

export default function VenueCard({ venue }) {
  const imageUrl = venue.media?.[0]?.url;
  const isValidImage = imageUrl && imageUrl.startsWith("http");

  return (
    <Link to={`/venue/${venue.id}`}>
      <div className="bg-white shadow-md rounded p-4 hover:shadow-lg transition">
        <img
          src={isValidImage ? imageUrl : "/fallback.jpg"} // or noImage
          alt={venue.media?.[0]?.alt || venue.name}
          className="h-48 w-full object-cover rounded mb-2"
        />
        <h2 className="text-lg font-semibold truncate">{venue.name}</h2>
        <p className="text-sm">
          {venue.location?.city || "Unknown"},{" "}
          {venue.location?.country || "Unknown"}
        </p>
        <p className="text-sm font-bold">{venue.price} kr / night</p>
      </div>
    </Link>
  );
}
