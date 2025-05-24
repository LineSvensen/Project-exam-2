import { useState } from "react";
import breakfastImg from "../../assets/breakfast.png";
import petsImg from "../../assets/pets.png";
import parkingImg from "../../assets/parking.png";
import wifiImg from "../../assets/wifi.png";
import Avatar from "../Shared/Avatar";
import { Link } from "react-router-dom";

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
            <h1 className="text-2xl font-bold font-poppins tracking-wide mb-4 wrap capitalize">
              {venue.name}
            </h1>
          </div>
          <p className="text-gray-600">
            {venue.location?.city || "Unknown"},{" "}
            {venue.location?.country || "Unknown"}
          </p>

          <p className="text-sm text-gray-600 mt-4 mb-4">
            For max {maxGuests} people
          </p>

          <h2 className="font-bold mt-4 mb-4">
            Price per night: <span className="font-bold">${venue.price}</span>
          </h2>

          <Link
            to={`/profile/${owner?.name}`}
            className="text-sm font-color mt-4 flex flex-row items-center gap-2"
          >
            <Avatar url={owner?.avatar?.url} size="w-8 h-8" />
            <span className="font-bold hover:text-gray-600">
              {owner?.name}
            </span>{" "}
            is venue owner
          </Link>
        </div>

        <div>
          <div className="gap-2 mt-4 mb-4">
            <h2 className="font-bold mb-2">About this place:</h2>

            {/* mobile shortened text. modal further down */}
            <p className="text-gray-600 block md:hidden">
              {shortDesc}...
              <button
                onClick={() => setShowFullDesc(true)}
                className="font-color underline ml-1"
              >
                Read more
              </button>
            </p>

            {/* full text. desktop. */}
            <p className="text-gray-600 hidden md:block max-h-52 overflow-y-auto pr-2">
              {description}
            </p>
          </div>
          {(meta?.wifi || meta?.parking || meta?.breakfast || meta?.pets) && (
            <>
              <h2 className="font-bold mb-2">This place offers:</h2>
              <div className="flex flex-wrap items-start gap-4 text-sm py-2">
                {meta?.wifi && (
                  <div className="flex flex-col items-center w-24 text-center">
                    <img src={wifiImg} className="w-8 h-8 mb-1" alt="Wifi" />
                    <span>Wifi</span>
                  </div>
                )}
                {meta?.parking && (
                  <div className="flex flex-col items-center w-24 text-center">
                    <img
                      src={parkingImg}
                      className="w-8 h-8 mb-1"
                      alt="Parking"
                    />
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
            </>
          )}

          <h2 className="font-bold mt-4">Full address:</h2>
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
        <div
          className="fixed inset-0 z-50 bg-black/50 bg-opacity-40 flex justify-center items-center"
          onClick={() => setShowFullDesc(false)}
        >
          <div
            className="bg-white rounded p-6 max-w-md w-full mx-4 shadow-lg overflow-y-auto max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">Full Description</h2>
            <p className="text-gray-600">{description}</p>
            <button
              onClick={() => setShowFullDesc(false)}
              className="mt-6 px-4 py-2 button-cancel-ignore"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
