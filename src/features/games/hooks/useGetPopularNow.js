import { getAllGames, getPopularNowGames } from "@/api/igdbApi";
import { useQuery } from "@tanstack/react-query";

// Twitch-trending recent games; falls back to all-time most rated if the
// Twitch or IGDB lookup fails, so the hero never renders empty.
export function useGetPopularNow(limit) {
  const { data, isLoading } = useQuery({
    queryKey: ["games", "popularNow", limit],
    queryFn: async () => {
      // Second try covers IGDB's 4 req/s limit, which the home page's burst
      // of requests can trip on first load
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const games = await getPopularNowGames(limit);
          if (games.length) return games;
        } catch {
          await new Promise((r) => setTimeout(r, 800));
        }
      }
      return getAllGames({ sortBy: "total_rating_count", limit });
    },
    staleTime: 60 * 60 * 1000,
  });
  return { data, isLoading };
}
