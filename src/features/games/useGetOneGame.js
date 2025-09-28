import { useQuery } from "@tanstack/react-query";
import { getOneGame } from "../../api/igdbApi";
import { useParams } from "react-router-dom";
export function useGetOneGame() {
  const { gameId } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["games", gameId],
    queryFn: () => getOneGame(gameId),
  });

  return { data, isLoading, error };
}
