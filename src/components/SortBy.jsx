import React from "react";
import useFilterStore from "../stores/filterStore"; // adjust path if needed
export default function SortBy({ value, onChange }) {
  return (
    <div className="mb-6 font-inter">
      <label htmlFor="sort" className="mr-2 pr-2">
        Sort by:
      </label>
      <select
        id="sort"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:outline-none"
      >
        <option value="featured">Featured</option>
        <option value="newest">Newest</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
      </select>
    </div>
  );
}
