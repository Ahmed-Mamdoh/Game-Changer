import { getAllGames } from "@/api/igdbApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useGetFiltersParams from "./useGetFiltersParams";

export function useGetUpcomingGames(limit) {
  const { filters, sortBy, page, search } = useGetFiltersParams();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["games", "upcoming", page, search || null, filters, limit || undefined, sortBy || null],
    queryFn: () =>
      getAllGames({
        filters,
        page,
        limit,
        sortBy: sortBy || "hypes",
        isUpcoming: true,
      }),
  });

  queryClient.prefetchQuery({
    queryKey: ["games", "upcoming", page + 1, search || null, filters, limit || undefined, sortBy || null],
    queryFn: () =>
      getAllGames({
        filters,
        page: page + 1,
        limit,
        sortBy: sortBy || "hypes",
        isUpcoming: true,
      }),
  });

  return { data, isLoading };
}
