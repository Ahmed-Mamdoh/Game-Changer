import { updateUserGame } from "@/api/supabase";
import { useGetUserGames } from "@/features/User/hooks/useGetUserGames";
import { UserToken } from "@/hooks/useUserToken";
import { gameToast } from "@/ui/gameToast";
import { useQueryClient } from "@tanstack/react-query";
import { Heart, Repeat } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

// Favorites are a short showcase, not a second library
export const MAX_FAVORITES = 5;

// A library row as the game shape toasts and covers expect
export const gameOfEntry = (entry) => ({ ...entry.game, id: entry.game_id });

// Heart and unheart played games from anywhere. At the cap, toggleFavorite
// sets swapFor to the game instead, so the caller can ask which one it replaces.
export function useFavorites() {
  const queryClient = useQueryClient();
  const user_id = UserToken()?.user?.id;
  const { data } = useGetUserGames(user_id);
  const [pending, setPending] = useState({});
  const [swapFor, setSwapFor] = useState(null);

  const library = data?.user_games ?? [];
  const entryOf = (gameId) => library.find((g) => g.game_id === gameId);

  function isFavorite(gameId) {
    if (gameId in pending) return pending[gameId];
    return Boolean(entryOf(gameId)?.is_favorite);
  }

  // Only played games can be favorites; a wishlist game hasn't earned it yet
  function canFavorite(gameId) {
    const status = entryOf(gameId)?.status;
    return Boolean(status) && status !== "to play";
  }

  const favorites = library.filter((g) => isFavorite(g.game_id));

  async function save(gameId, value) {
    setPending((p) => ({ ...p, [gameId]: value }));
    const { error } = await updateUserGame({
      game_id: gameId,
      user_id,
      is_favorite: value,
    });
    if (!error) {
      await queryClient.invalidateQueries({
        queryKey: ["user_games", user_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["user_game", user_id, String(gameId)],
      });
    }
    setPending((p) => {
      const next = { ...p };
      delete next[gameId];
      return next;
    });
    return !error;
  }

  async function setFavorite(game, value, { undo = true } = {}) {
    if (!(await save(game.id, value))) {
      toast.error(`Couldn't update favorites for ${game.name}. Try again.`);
      return false;
    }
    const count = favorites.length + (value ? 1 : -1);
    gameToast({
      game,
      message: value
        ? `Added to favorites · ${count} of ${MAX_FAVORITES}`
        : "Removed from favorites",
      icon: Heart,
      iconClass: value ? "text-pulse-error" : "text-text-muted",
      action: undo && {
        label: "Undo",
        onClick: () => setFavorite(game, !value, { undo: false }),
      },
    });
    return true;
  }

  function toggleFavorite(game) {
    if (isFavorite(game.id)) return setFavorite(game, false);
    if (favorites.length >= MAX_FAVORITES) {
      setSwapFor(game);
      return false;
    }
    return setFavorite(game, true);
  }

  // Unhearts `out` first so the cap holds at every step
  async function swapFavorite(out, incoming, { undo = true } = {}) {
    setSwapFor(null);
    const saved =
      (await save(out.id, false)) && (await save(incoming.id, true));
    if (!saved) {
      toast.error("Couldn't swap your favorites. Try again.");
      return false;
    }
    gameToast({
      game: incoming,
      message: `Replaced ${out.name} in favorites`,
      icon: Repeat,
      iconClass: "text-pulse-error",
      action: undo && {
        label: "Undo",
        onClick: () => swapFavorite(incoming, out, { undo: false }),
      },
    });
    return true;
  }

  return {
    favorites,
    isFavorite,
    canFavorite,
    toggleFavorite,
    swapFor,
    swapFavorite,
    closeSwap: () => setSwapFor(null),
  };
}
