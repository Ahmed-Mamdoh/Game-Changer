import { getFreePcGames } from "@/api/gamerpowerApi";
import { useQuery } from "@tanstack/react-query";

export function useGetFreePcGames() {
  const { data, isLoading } = useQuery({
    queryKey: ["free-games"],
    queryFn: getFreePcGames,
  });
  return { data, isLoading };
}
