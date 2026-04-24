import { useQuery } from "@tanstack/react-query";
import {
  buildWeightedProfile,
  calculateGameScore,
} from "@/utils/recommendingGames";
import { getGamesForRecommending } from "@/api/igdbApi";
import useGetFiltersParams from "./useGetFiltersParams";

export function useGetRecommendations(user_id, user_games) {
  const { platform } = useGetFiltersParams();

  const playedIds = user_games?.map((ug) => ug?.game_id) || [];

  const userProfile = buildWeightedProfile(user_games || []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["recommendations", user_id, playedIds, platform],
    queryFn: () =>
      getGamesForRecommending({
        playedGamesIds: playedIds,
        platform,
      }),
    enabled: !!playedIds && playedIds.length > 0,
    staleTime: Infinity, // Recommendations never change
  });

  const recommendations = data
    ?.map((game) => ({
      ...game,
      matchScore: calculateGameScore(game, userProfile),
    }))
    // Filter out negative or zero matches if we have enough candidates
    .filter((game) => game.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 60); // Return top 60

  return {
    recommendations,
    isLoading,
    error,
  };
}
