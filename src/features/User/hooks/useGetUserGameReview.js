import { getUserGameReview } from "@/api/supabase";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export function useGetUserGameReview(user_id) {
  const { gameId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["user_game_review", user_id, gameId],
    queryFn: () => getUserGameReview(user_id, gameId),
  });
  return { data, isLoading, error };
}
