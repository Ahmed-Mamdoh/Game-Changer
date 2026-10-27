import { getAllGames, getPopularNowGames } from "@/api/igdbApi";
import { useQuery } from "@tanstack/react-query";

// Games popular right now; falls back to all-time most rated if IGDB's
// popularity data is unavailable, so the hero never renders empty.
export function useGetPopularNow(limit) {
  const { data, isLoading } = useQuery({
    queryKey: ["games", "popularNow", limit],
    queryFn: async () => {
      try {
        const games = await getPopularNowGames(limit);
        if (games.length) return games;
      } catch {
        // fall through to the all-time list
      }
      return getAllGames({ sortBy: "total_rating_count", limit });
    },
    staleTime: 60 * 60 * 1000,
  });
  return { data, isLoading };
}
