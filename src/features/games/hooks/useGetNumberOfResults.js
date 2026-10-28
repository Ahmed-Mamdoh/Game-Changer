import { useQuery } from "@tanstack/react-query";
import { getNumberOfResults, DEFAULT_BROWSE_SORT } from "../../../api/igdbApi";
import useGetFiltersParams from "./useGetFiltersParams";
import { useSearchGames } from "./useSearchGames";

export function useGetNumberOfResults(path) {
  const { filters, search, platform, player_perspectives, sortBy } =
    useGetFiltersParams();
  const isUpcoming = path.includes("/upcomingGames");
  const isSearch = Boolean(search) && !isUpcoming;

  // Mirror exactly what each page lists: the upcoming list only uses filters,
  // and some browse sorts narrow the list (see browseScope in igdbApi).
  const countParams = isUpcoming
    ? { filters, isUpcoming }
    : {
        filters,
        platform,
        player_perspectives,
        isUpcoming,
        sortBy: sortBy || DEFAULT_BROWSE_SORT,
      };

  const searchQuery = useSearchGames();
  const countQuery = useQuery({
    queryKey: [
      "numberOfResults",
      isUpcoming ? "upcoming" : "all",
      filters,
      countParams.platform || null,
      countParams.player_perspectives || null,
      countParams.sortBy || null,
    ],
    queryFn: () => getNumberOfResults(countParams),
    enabled: !isSearch,
  });

  if (isSearch) {
    const { data, isLoading, error } = searchQuery;
    return { data: data && { count: data.length }, isLoading, error };
  }

  const { data, isLoading, error } = countQuery;
  return { data, isLoading, error };
}
