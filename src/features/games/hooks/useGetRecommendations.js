import { useQuery } from "@tanstack/react-query";
import { useGetUserGames } from "@/features/User/hooks/useGetUserGames";
import {
  buildWeightedProfile,
  calculateGameScore,
} from "@/utils/recommendingGames";
import { getGamesForRecommending } from "@/api/igdbApi";
import useGetFiltersParams from "./useGetFiltersParams";

export function useGetRecommendations(user_id) {
  const { filters, sortBy, page, platform, player_perspectives } =
    useGetFiltersParams();
  const { data: user_games_response, isLoading: isLoadingUserGames } =
    useGetUserGames(user_id);
  const user_games = isLoadingUserGames
    ? []
    : user_games_response?.user_games || [];

  const playedIds = user_games?.map((ug) => ug?.game_id) || [];

  const userProfile = buildWeightedProfile(user_games || []);

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "recommendations",
      user_id,
      playedIds,
      filters,
      sortBy,
      page,
      platform,
      player_perspectives,
    ],
    queryFn: () =>
      getGamesForRecommending({
        playedGamesIds: playedIds,
        filters,
        sortBy,
        page,
        platform,
        player_perspectives,
      }),
    enabled: !!playedIds,
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
    .slice(0, 20); // Return top 10

  return {
    recommendations,
    isLoading,
    error,
  };
}
