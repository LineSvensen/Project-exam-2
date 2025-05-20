import { useState } from "react";
import { useEffect } from "react";
import SearchButton from "../components/Buttons/SearchButton";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      const params = new URLSearchParams(window.location.search);
      params.set("search", trimmed);
      params.set("page", 1); // reset pagination
      window.history.pushState({}, "", `?${params}`);
      onSearch(trimmed);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get("search") || "";
    setQuery(search);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search venues..."
        className="flex-grow p-2 border rounded"
      />
      <SearchButton disabled={!query.trim()} />
    </form>
  );
}
