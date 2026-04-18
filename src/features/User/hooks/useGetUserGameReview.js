import { getUserGameReview } from "@/api/supabase";
import { useQuery } from "@tanstack/react-query";

export function useGetUserGameReview({ user_game_id }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user_game_review", user_game_id],
    queryFn: () => getUserGameReview({ user_game_id }),
  });
  return { data, isLoading, error };
}
