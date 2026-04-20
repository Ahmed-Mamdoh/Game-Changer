import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getGameReviews } from "@/api/supabase";
export function useGetGameReviews() {
  const { gameId } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["game_reviews", gameId],
    queryFn: () => getGameReviews({ game_id: gameId }),
  });

  return { data, isLoading, error };
}
