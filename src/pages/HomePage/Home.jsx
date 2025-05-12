import { useEffect } from "react";
import { useVenues } from "../../hooks/useVenues";
import { useVenueSearch } from "../../hooks/useVenueSearch";
import VenueCard from "../../components/Venue/VenueCard";
import SearchBar from "../../components/Search";
import CategoryFilter from "../../components/CategoryFilter";
import SortBy from "../../components/SortBy";
import Pagination from "../../components/Pagination";
import { matchesCategory } from "../../utils/categoryMatcher";
import useVenueStore from "../../stores/venueStore";
import { useSearchParams } from "react-router-dom";
import useFilterStore from "../../stores/filterStore";
import { FEATURED_IDS } from "../../utils/featured";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 15;

  const allVenues = useVenueStore((state) => state.allVenues);
  const { venues, loading: loadingVenues, error: venuesError } = useVenues();
  const {
    results,
    loading: loadingSearch,
    error: searchError,
    searchVenues,
  } = useVenueSearch();

  const {
    category,
    sort = "featured",
    search,
    setCategory,
    setSort,
    setSearch,
  } = useFilterStore();

  const isSearching = !!search && results.length > 0;
  const rawVenues = isSearching ? results : allVenues;

  const handlePageChange = (page) => {
    setSearchParams({ page: String(page) });
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  };

  const handleCategorySelect = (keywords) => {
    setCategory(keywords);
    setSearch(""); // clear search
    setSearchParams({ page: "1" });
  };

  const handleSearch = (query) => {
    setSearch(query);
    setCategory([]); // clear category
    setSearchParams({ page: "1" });

    if (sort) {
      const [s, o] = sort.split("-");
      searchVenues(query, s, o);
    } else {
      searchVenues(query);
    }
  };

  const handleSortChange = (option) => {
    setSort(option);
    setSearchParams({ page: "1" });

    if (search) {
      const [s, o] = option.split("-");
      searchVenues(search, s, o);
    }
  };

  useEffect(() => {
    const y = sessionStorage.getItem("scrollY");
    if (y) {
      window.scrollTo({ top: parseInt(y), behavior: "instant" });
      sessionStorage.removeItem("scrollY");
    }
  }, [rawVenues]);

  const filteredVenues =
    category.length > 0
      ? rawVenues.filter((venue) =>
          matchesCategory(
            venue.name,
            venue.description,
            venue.location,
            venue.meta,
            venue.tags,
            category
          )
        )
      : rawVenues;

  const sortedVenues = [...filteredVenues].sort((a, b) => {
    switch (sort) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating-high":
        return (b.rating || 0) - (a.rating || 0);
      case "featured":
        const aIndex = FEATURED_IDS.indexOf(a.id);
        const bIndex = FEATURED_IDS.indexOf(b.id);
        return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
      default:
        return new Date(b.created) - new Date(a.created);
    }
  });

  const finalError = searchError || venuesError;
  if (loadingVenues || loadingSearch)
    return <div className="p-8">Loading...</div>;
  if (finalError)
    return <div className="text-red-500 p-8">Error: {finalError}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Unlock the holiday of your dreams
      </h1>

      <SearchBar onSearch={handleSearch} />
      <CategoryFilter onSelect={handleCategorySelect} />
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

      <div className="flex justify-center mt-8">
        <div className="flex space-x-2 min-w-[320px] justify-center items-center">
          <Pagination
            currentPage={currentPage}
            totalItems={sortedVenues.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
