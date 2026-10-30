import { useQuery } from "@tanstack/react-query";
import { searchGames } from "../../../api/igdbApi";
import useGetFiltersParams from "./useGetFiltersParams";

// One ranked pool per search + filters. The list and the result count both read
// from it, so they can never disagree, and changing page needs no new request.
export function useSearchGames() {
  const { filters, platform, search, player_perspectives, length } =
    useGetFiltersParams();

  return useQuery({
    queryKey: [
      "games",
      "search",
      search,
      filters,
      platform,
      player_perspectives,
      length,
    ],
    queryFn: () =>
      searchGames({ search, filters, platform, player_perspectives, length }),
    enabled: Boolean(search),
    staleTime: 5 * 60 * 1000,
  });
}
