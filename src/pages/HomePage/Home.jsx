// Updated Home.jsx
import { useState } from "react";
import { useVenues } from "../../hooks/useVenues";
import { useVenueSearch } from "../../hooks/useVenueSearch";
import VenueCard from "../../components/Venue/VenueCard";
import SearchBar from "../../components/Search";
import CategoryFilter from "../../components/CategoryFilter";
import SortBy from "../../components/SortBy";
import Pagination from "../../components/Pagination";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { venues, loading: loadingVenues, error: venuesError } = useVenues();
  const {
    results,
    loading: loadingSearch,
    error: searchError,
    searchVenues,
  } = useVenueSearch();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const isSearching = Array.isArray(results) && results.length > 0;

  const rawVenues = isSearching ? results : venues;

  const filteredVenues = selectedCategory
    ? rawVenues.filter((venue) =>
        selectedCategory.some((keyword) =>
          (venue.title + venue.description).toLowerCase().includes(keyword)
        )
      )
    : rawVenues;

  const sortedVenues = [...filteredVenues].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating-high":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  const finalError = searchError || venuesError;
  if (loadingVenues || loadingSearch)
    return <div className="p-8">Loading...</div>;
  if (finalError)
    return <div className="text-red-500 p-8">Error: {finalError}</div>;

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    if (sortOption) {
      const [sort, sortOrder] = sortOption.split("-");
      searchVenues(query, sort, sortOrder);
    } else {
      searchVenues(query);
    }
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    setCurrentPage(1);
    if (searchQuery) {
      const [sort, sortOrder] = option.split("-");
      searchVenues(searchQuery, sort, sortOrder);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Unlock the holiday of your dreams
      </h1>

      <SearchBar onSearch={handleSearch} />
      <CategoryFilter
        onSelect={(cat) => {
          setSelectedCategory(cat);
          setCurrentPage(1);
        }}
      />
      <SortBy onChange={handleSortChange} />

      {sortedVenues.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No venues found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {sortedVenues
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalItems={sortedVenues.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
