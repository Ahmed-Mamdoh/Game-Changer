import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { quickSearchGames } from "../../../api/igdbApi";

const MIN_CHARS = 2;
const DEBOUNCE_MS = 250;

// Typeahead results for the header search. Debounced so a request goes out
// only once typing pauses.
export function useQuickSearch(search, limit = 6) {
  const [query, setQuery] = useState(search.trim());

  useEffect(() => {
    const id = setTimeout(() => setQuery(search.trim()), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [search]);

  const enabled = query.length >= MIN_CHARS;
  const result = useQuery({
    queryKey: ["games", "quick-search", query],
    queryFn: () => quickSearchGames(query),
    enabled,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
    select: (games) => games.slice(0, limit),
  });

  return {
    ...result,
    enabled,
    // True while typing has not settled yet or the request is in flight
    isPending: search.trim() !== query || (enabled && result.isFetching),
  };
}
