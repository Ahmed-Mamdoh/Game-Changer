import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllGames } from "../../api/igdbApi";
import { useSearchParams } from "react-router-dom";
export function useGetAllGames() {
  const queryClient = useQueryClient();

  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const page = Number(searchParams.get("page")) || 1;
  const genre = searchParams.get("genre");
  const themes = searchParams.get("theme");
  const gameMode = searchParams.get("gameMode");
  const sortBy = search
    ? null
    : searchParams.get("sortBy") || "total_rating_count";
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

  const { data, isLoading, error } = useQuery({
    queryKey: ["games", "all", page, search, filters, sortBy],
    queryFn: () =>
      getAllGames({
        filters,
        sortBy,
        page,
        search,
      }),
  });

  queryClient.prefetchQuery({
    queryKey: ["games", "all", page + 1, search, filters, sortBy],
    queryFn: () =>
      getAllGames({
        filters,
        sortBy,
        page: page + 1,
        search,
      }),
  });

  return { data, isLoading, error };
}
