import { useQuery } from "@tanstack/react-query";
import { getTimeToBeat } from "../../../api/igdbApi";
import { useParams } from "react-router-dom";

// Defaults to the game in the URL; pass an id to use it off the game page.
// Cards and the game page share one cache entry per game.
export function useGetTimeToBeat(id, { enabled = true } = {}) {
  const params = useParams();
  const gameId = id != null ? String(id) : params.gameId;

  const { data, isLoading, error } = useQuery({
    queryKey: ["timeToBeat", gameId],
    queryFn: () => getTimeToBeat(gameId),
    enabled: Boolean(gameId) && enabled,
    staleTime: 24 * 60 * 60 * 1000,
  });
  return { data, isLoading, error };
}
