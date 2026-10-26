import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllGames } from "../../../api/igdbApi";
import { LIMIT } from "@/constants/constant";
import useGetFiltersParams from "./useGetFiltersParams";
import { useSearchGames } from "./useSearchGames";

export function useGetAllGames() {
  const { filters, sortBy, platform, page, search, player_perspectives } =
    useGetFiltersParams();
  const queryClient = useQueryClient();

  const searchQuery = useSearchGames();

  const browseKey = (pageNumber) => [
    "games",
    "all",
    pageNumber,
    null,
    filters,
    sortBy,
    platform,
    player_perspectives,
  ];
  const browseFn = (pageNumber) => () =>
    getAllGames({
      filters,
      platform,
      sortBy: sortBy || "total_rating_count",
      page: pageNumber,
      player_perspectives,
    });

  const browseQuery = useQuery({
    queryKey: browseKey(page),
    queryFn: browseFn(page),
    enabled: !search,
  });

  const keyString = JSON.stringify(browseKey(page));
  useEffect(() => {
    if (search) return;
    queryClient.prefetchQuery({
      queryKey: browseKey(page + 1),
      queryFn: browseFn(page + 1),
    });
    // keyString covers every input of browseKey/browseFn
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyString, search, queryClient]);

  if (search) {
    const { data, isLoading, error } = searchQuery;
    return {
      data: data?.slice((page - 1) * LIMIT, page * LIMIT),
      isLoading,
      error,
    };
  }

  const { data, isLoading, error } = browseQuery;
  return { data, isLoading, error };
}
