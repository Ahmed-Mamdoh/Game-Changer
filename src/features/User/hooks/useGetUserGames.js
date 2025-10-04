import { getUserGames } from "@/api/supabase";
import { useQuery } from "@tanstack/react-query";

export function useGetUserGames(user_id) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user_games", user_id],
    queryFn: () => getUserGames(user_id),
  });
  return { data, isLoading, error };
}
