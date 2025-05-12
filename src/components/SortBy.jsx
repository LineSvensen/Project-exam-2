import React from "react";

export default function SortBy({ onChange }) {
  return (
    <div className="mb-6">
      <label htmlFor="sort" className="mr-2 font-medium">
        Sort by:
      </label>
      <select
        id="sort"
        onChange={(e) => onChange(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="featured">Featured</option>
        <option value="newest">Newest</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
      </select>
    </div>
  );
}
