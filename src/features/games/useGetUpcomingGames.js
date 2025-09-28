import { getAllGames } from "@/api/igdbApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

export function useGetUpcomingGames(limit) {
  const queryClient = useQueryClient();

  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const page = Number(searchParams.get("page")) || 1;
  const genre = searchParams.get("genre");
  const themes = searchParams.get("theme");
  const gameMode = searchParams.get("gameMode");

  let filters = [];
  if (genre) {
    filters.push(`genres = (${genre})`);
  }
  if (themes) {
    filters.push(`themes = (${themes})`);
  }
  if (gameMode) {
    filters.push(`game_modes = (${gameMode})`);
  }

  const { data, isLoading } = useQuery({
    queryKey: ["games", "upcoming", page, search, filters, limit],
    queryFn: () =>
      getAllGames({
        filters,
        page,
        limit,
        isUpcoming: true,
      }),
  });

  queryClient.prefetchQuery({
    queryKey: ["games", "upcoming", page + 1, search, filters, limit],
    queryFn: () =>
      getAllGames({
        filters,
        page: page + 1,
        limit,
        isUpcoming: true,
      }),
  });

  return { data, isLoading };
}
