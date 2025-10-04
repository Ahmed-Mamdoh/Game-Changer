import { getUserGame } from "@/api/supabase";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export function useGetUserGame(user_id) {
  const { gameId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["user_game", user_id, gameId],
    queryFn: () => getUserGame(user_id, gameId),
  });
  return { data, isLoading, error };
}
