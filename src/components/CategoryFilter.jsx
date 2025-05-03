import React from "react";
import cabinIcon from "../assets/cabin.png";
import modernIcon from "../assets/modern.png";
import beachIcon from "../assets/beach.png";
import poolIcon from "../assets/pool.png";
import castleIcon from "../assets/castle.png";
import wowIcon from "../assets/wow.png";
import culturalIcon from "../assets/cultural.png";

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
  return (
    <div className="flex flex-wrap gap-4 mb-6 justify-between">
      {categories.map((cat) => (
        <button
          key={cat.keyword}
          onClick={() => onSelect(cat.keyword)}
          className="flex flex-col items-center p-2 rounded justify-between px-4 cursor-pointer hover:bg-gray-200 transition"
        >
          <img src={cat.icon} alt={cat.label} className="w-12 h-12 mb-1" />
          <span className="text-sm font-medium">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
