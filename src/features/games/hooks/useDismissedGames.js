import { getUserGamesData } from "@/api/igdbApi";
import { loadDismissed } from "@/features/games/dismissedGames";
import { useQuery } from "@tanstack/react-query";

// Games the player marked "Not for me", newest first, with why. Pass
// withDetails to also load names, covers and years from IGDB.
export function useDismissedGames(user_id, { withDetails = false } = {}) {
  const dismissed = useQuery({
    queryKey: ["dismissed_games", user_id],
    queryFn: () => loadDismissed(user_id),
    enabled: !!user_id,
  });
  const ids = dismissed.data?.ids || [];

  const details = useQuery({
    queryKey: ["dismissed_games", user_id, "details", ids.join(",")],
    queryFn: () => getUserGamesData(ids),
    enabled: withDetails && ids.length > 0,
    placeholderData: (previous) => previous,
  });
  const byId = new Map(
    (Array.isArray(details.data) ? details.data : []).map((game) => [
      game.id,
      game,
    ]),
  );

  return {
    count: ids.length,
    games: ids.map((id) => ({
      id,
      reason: dismissed.data.reasons.get(id) || "this",
      ...byId.get(id),
    })),
    isLoading: dismissed.isLoading || (withDetails && details.isLoading),
    error: dismissed.error || details.error,
  };
}
