import { Search, X } from "lucide-react";

interface SpotSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export function SpotSearch({ query, onQueryChange }: SpotSearchProps) {
  return (
    <label className="spot-search">
      <Search aria-hidden="true" size={20} strokeWidth={1.8} />
      <span className="visually-hidden">Search Tokyo photo spots</span>
      <input
        type="search"
        value={query}
        placeholder="Search Tokyo spots"
        onChange={(event) => onQueryChange(event.target.value)}
      />
      {query ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onQueryChange("")}
        >
          <X aria-hidden="true" size={18} />
        </button>
      ) : null}
    </label>
  );
}
