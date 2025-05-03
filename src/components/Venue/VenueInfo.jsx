export default function VenueInfo({ venue }) {
  if (!venue) return null;

  const { name, location, owner, maxGuests, meta, description } = venue;

  return (
    <div className="bg-white shadow p-4 rounded space-y-4">
      <div>
        <p className="text-gray-600">
          {location?.city}, {location?.country}
        </p>
        <p className="text-sm text-gray-500">{maxGuests} people max</p>
        <p className="text-sm text-gray-500 mt-1">
          <span className="font-semibold">{owner?.name}</span> is venue owner
        </p>
      </div>

      <div>
        <h3 className="font-semibold mb-2">This place offers:</h3>
        <div className="flex gap-4">
          {meta?.wifi && <span>📶 Wifi</span>}
          {meta?.parking && <span>🅿️ Parking</span>}
          {meta?.breakfast && <span>🥐 Breakfast</span>}
          {meta?.pets && <span>🐾 Pets allowed</span>}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">About this place:</h3>
        <p className="text-gray-700">{description}</p>
      </div>
    </div>
  );
}
