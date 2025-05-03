import { useState } from "react";
import SearchButton from "../components/Buttons/SearchButton";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

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
