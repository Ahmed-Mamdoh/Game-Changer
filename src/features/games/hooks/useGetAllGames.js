import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllGames } from "../../../api/igdbApi";
import useGetFiltersParams from "./useGetFiltersParams";

export function useGetAllGames() {
  const { filters, sortBy, platform, page, search, player_perspectives } =
    useGetFiltersParams();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "games",
      "all",
      page,
      search,
      filters,
      sortBy,
      platform,
      player_perspectives,
    ],
    queryFn: () =>
      getAllGames({
        filters,
        platform,
        sortBy: sortBy || "total_rating_count",
        page,
        search,
        player_perspectives,
      }),
  });

  queryClient.prefetchQuery({
    queryKey: [
      "games",
      "all",
      page + 1,
      search,
      filters,
      sortBy,
      platform,
      player_perspectives,
    ],
    queryFn: () =>
      getAllGames({
        filters,
        platform,
        sortBy: sortBy || "total_rating_count",
        page: page + 1,
        search,
        player_perspectives,
      }),
  });

  return { data, isLoading, error };
}
