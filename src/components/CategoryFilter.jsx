import React, { useState } from "react";
import cabinIcon from "../assets/cabin.png";
import modernIcon from "../assets/modern.png";
import beachIcon from "../assets/beach.png";
import poolIcon from "../assets/pool.png";
import castleIcon from "../assets/castle.png";
import wowIcon from "../assets/wow.png";
import culturalIcon from "../assets/cultural.png";
import { FiPlus } from "react-icons/fi"; // Feather Icons (clean + professional)

const categories = [
  { label: "Cabin", keyword: ["cabin"], icon: cabinIcon },
  { label: "Modern", keyword: ["modern", "luxury"], icon: modernIcon },
  { label: "Beach", keyword: ["beach"], icon: beachIcon },
  { label: "Pool", keyword: ["pool"], icon: poolIcon },
  { label: "Castle", keyword: ["castle"], icon: castleIcon },
  { label: "Wow", keyword: ["wow"], icon: wowIcon },
  { label: "Cultural", keyword: ["cultural"], icon: culturalIcon },
];

export default function CategoryFilter({ onSelect }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Desktop layout (unchanged) */}
      <div className="hidden sm:flex flex-wrap gap-4 mb-6 justify-between">
        {categories.map((cat) => (
          <button
            key={cat.label}
            onClick={() => onSelect(cat.keyword)}
            className="flex flex-col items-center p-2 rounded px-4 cursor-pointer hover:bg-gray-200 transition"
          >
            <img src={cat.icon} alt={cat.label} className="w-12 h-12 mb-1" />
            <span className="text-sm font-medium">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Mobile: first 3 + "More" button */}
      <div className="flex sm:hidden gap-4 mb-6 overflow-x-auto no-scrollbar">
        {categories.slice(0, 3).map((cat) => (
          <button
            key={cat.label}
            onClick={() => onSelect(cat.keyword)}
            className="flex-shrink-0 flex flex-col items-center p-2 rounded px-4 cursor-pointer hover:bg-gray-200 transition"
          >
            <img src={cat.icon} alt={cat.label} className="w-12 h-12 mb-1" />
            <span className="text-sm font-medium">{cat.label}</span>
          </button>
        ))}
        <button
          onClick={() => setShowModal(true)}
          className="flex-shrink-0 flex flex-col items-center justify-center p-2 rounded px-4 bg-gray-100 hover:bg-gray-200 transition"
        >
          <FiPlus className="text-xl mb-1" />
          <span className="text-sm font-medium">More</span>
        </button>
      </div>

      {/* Mobile modal for all categories */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full shadow-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Choose a Category</h2>
              <button onClick={() => setShowModal(false)} className="text-xl">
                ✕
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => {
                    onSelect(cat.keyword);
                    setShowModal(false);
                  }}
                  className="flex flex-col items-center p-2 rounded hover:bg-gray-100 transition"
                >
                  <img
                    src={cat.icon}
                    alt={cat.label}
                    className="w-10 h-10 mb-1"
                  />
                  <span className="text-xs font-medium text-center">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
