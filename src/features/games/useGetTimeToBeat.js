import { useQuery } from "@tanstack/react-query";
import { getTimeToBeat } from "../../api/igdbApi";
import { useParams } from "react-router-dom";

export function useGetTimeToBeat() {
  const { gameId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["timeToBeat", gameId],
    queryFn: () => getTimeToBeat(gameId),
  });
  return { data, isLoading, error };
}
