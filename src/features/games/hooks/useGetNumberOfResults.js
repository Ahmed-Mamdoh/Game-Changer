import { useQuery } from "@tanstack/react-query";
import { getNumberOfResults } from "../../../api/igdbApi";
import useGetFiltersParams from "./useGetFiltersParams";
import { useSearchGames } from "./useSearchGames";

export function useGetNumberOfResults(path) {
  const { filters, search, platform, player_perspectives } =
    useGetFiltersParams();
  const isUpcoming = path.includes("/upcomingGames");
  const isSearch = Boolean(search) && !isUpcoming;

  // Mirror exactly what each page lists: the upcoming list only uses filters.
  const countParams = isUpcoming
    ? { filters, isUpcoming }
    : { filters, platform, player_perspectives, isUpcoming };

  const searchQuery = useSearchGames();
  const countQuery = useQuery({
    queryKey: [
      "numberOfResults",
      isUpcoming ? "upcoming" : "all",
      filters,
      countParams.platform || null,
      countParams.player_perspectives || null,
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
