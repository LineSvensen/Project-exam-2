import { useState } from "react";
import breakfastImg from "../../assets/breakfast.png";
import petsImg from "../../assets/pets.png";
import parkingImg from "../../assets/parking.png";
import wifiImg from "../../assets/wifi.png";
import Avatar from "../Avatar";

export default function VenueInfo({ venue }) {
  const [showFullDesc, setShowFullDesc] = useState(false);

  if (!venue) return null;

  const { name, location, owner, maxGuests, meta, description } = venue;
  const shortDesc = description?.slice(0, 200);

  return (
    <>
      <div className="bg-white shadow p-4 rounded space-y-4 font-inter">
        <div>
          <div className="flex flex-row justify-between">
            <h1 className="text-2xl font-bold font-poppins tracking-wide mb-4 truncate">
              {venue.name}
            </h1>
            {venue.rating > 0 && (
              <p className="text-sm text-yellow-600 font-medium">
                Rating:{" "}
                <span className="font-semibold">{venue.rating.toFixed(1)}</span>{" "}
                / 5
              </p>
            )}
          </div>
          <p>
            {venue.location?.city || "Unknown"},{" "}
            {venue.location?.country || "Unknown"}
          </p>

          <p className="font-bold mt-4 mb-4">
            Price per night:{" "}
            <span className="font-semibold">${venue.price}</span>
          </p>

          <p className="text-sm text-gray-500 mt-4 mb-4">
            For max {maxGuests} people
          </p>
          <p className="text-sm text-gray-500 mt-4 flex flex-row items-center gap-2">
            <Avatar url={owner?.avatar?.url} size="w-8 h-8" />
            <span className="font-semibold">{owner?.name}</span> is venue owner
          </p>
        </div>

        <div>
          <div className="gap-2 mt-4 mb-4">
            <h3 className="font-bold mb-2">About this place:</h3>

            {/* Mobile shortened text ... modal further down */}
            <p className="text-gray-700 block md:hidden">
              {shortDesc}...
              <button
                onClick={() => setShowFullDesc(true)}
                className="text-black underline ml-1"
              >
                Read more
              </button>
            </p>

            {/* full text. desktop. */}
            <p className="text-gray-700 hidden md:block">{description}</p>
          </div>

          <h3 className="font-bold mb-2">This place offers:</h3>
          <div className="flex flex-wrap items-start gap-4 text-sm py-2">
            {meta?.wifi && (
              <div className="flex flex-col items-center w-24 text-center">
                <img src={wifiImg} className="w-8 h-8 mb-1" alt="Wifi" />
                <span>Wifi</span>
              </div>
            )}
            {meta?.parking && (
              <div className="flex flex-col items-center w-24 text-center">
                <img src={parkingImg} className="w-8 h-8 mb-1" alt="Parking" />
                <span>Parking</span>
              </div>
            )}
            {meta?.breakfast && (
              <div className="flex flex-col items-center w-24 text-center">
                <img
                  src={breakfastImg}
                  className="w-8 h-8 mb-1"
                  alt="Breakfast"
                />
                <span>Breakfast</span>
              </div>
            )}
            {meta?.pets && (
              <div className="flex flex-col items-center w-24 text-center">
                <img
                  src={petsImg}
                  className="w-8 h-8 mb-1"
                  alt="Pets allowed"
                />
                <span>Pets allowed</span>
              </div>
            )}
          </div>

          <h3 className="font-bold mt-4">Full address:</h3>
          <p className="text-sm text-gray-600 mt-2 mb-4">
            {venue.location?.address || "No address provided"}{" "}
            {venue.location?.zip || ""}, {venue.location?.city || "Unknown"},{" "}
            {venue.location?.country || "Unknown"},{" "}
            {venue.location?.continent || "Unknown"}
          </p>

          <div className="flex flex-row gap-4">
            <p className="text-xs text-gray-400 mb-4">
              This venue was listed on:{" "}
              {new Date(venue.created).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-400">
              Last updated: {new Date(venue.updated).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* the popup modal! for full text*/}
      {showFullDesc && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg overflow-y-auto max-h-[80vh]">
            <h2 className="text-lg font-semibold mb-4">Full Description</h2>
            <p className="text-gray-800">{description}</p>
            <button
              onClick={() => setShowFullDesc(false)}
              className="mt-6 px-4 py-2 bg-black text-white rounded hover:bg-gray-900"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
