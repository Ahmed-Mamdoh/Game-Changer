import { getAllGames } from "../../api/igdbApi";
import { useQuery } from "@tanstack/react-query";

export function useGetGameSection(sortBy, limit) {
  const { data, isLoading } = useQuery({
    queryKey: [sortBy, limit],
    queryFn: () => getAllGames({ sortBy, limit }),
  });
  return { data, isLoading };
}
