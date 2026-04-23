import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllGames } from "../../../api/igdbApi";
import useGetFiltersParams from "./useGetFiltersParams";

export function useGetAllGames() {
  const { filters, sortBy, platform, page, search } = useGetFiltersParams();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["games", "all", page, search, filters, sortBy, platform],
    queryFn: () =>
      getAllGames({
        filters,
        platform,
        sortBy: sortBy || "total_rating_count",
        page,
        search,
      }),
  });

  queryClient.prefetchQuery({
    queryKey: ["games", "all", page + 1, search, filters, sortBy, platform],
    queryFn: () =>
      getAllGames({
        filters,
        platform,
        sortBy: sortBy || "total_rating_count",
        page: page + 1,
        search,
      }),
  });

  return { data, isLoading, error };
}
