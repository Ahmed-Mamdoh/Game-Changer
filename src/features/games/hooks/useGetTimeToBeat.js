import { useQuery } from "@tanstack/react-query";
import { getTimeToBeat } from "../../../api/igdbApi";
import { useParams } from "react-router-dom";

// Defaults to the game in the URL; pass an id to use it off the game page
export function useGetTimeToBeat(id) {
  const params = useParams();
  const gameId = id ?? params.gameId;

  const { data, isLoading, error } = useQuery({
    queryKey: ["timeToBeat", gameId],
    queryFn: () => getTimeToBeat(gameId),
    enabled: Boolean(gameId),
  });
  return { data, isLoading, error };
}
