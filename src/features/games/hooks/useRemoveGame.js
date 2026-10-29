import { deleteUserGame, restoreUserGame } from "@/api/supabase";
import { UserToken } from "@/hooks/useUserToken";
import { useQueryClient } from "@tanstack/react-query";
import { gameToast } from "@/ui/gameToast";
import { Trash2, Undo2 } from "lucide-react";
import toast from "react-hot-toast";

// Delete a game, its status, log and review from the signed-in user's library.
export function useRemoveGame(game) {
  const queryClient = useQueryClient();
  const user_id = UserToken()?.user?.id;

  // Resolves once the library is refetched, so posters don't flash back
  function refetch() {
    const gameId = String(game.id);
    const library = queryClient.invalidateQueries({
      queryKey: ["user_games", user_id],
    });
    queryClient.invalidateQueries({ queryKey: ["user_game", user_id, gameId] });
    queryClient.invalidateQueries({
      queryKey: ["user_game_review", user_id, gameId],
    });
    queryClient.invalidateQueries({ queryKey: ["game_reviews", gameId] });
    return library;
  }

  async function undoRemove(removed) {
    const { error } = await restoreUserGame(removed);
    if (error) {
      toast.error(`Couldn't bring back ${game.name}. Try again.`);
      return;
    }
    gameToast({
      game,
      message: "Back in your library",
      icon: Undo2,
      iconClass: "text-pulse-success",
    });
    refetch();
  }

  // `from` only names the list in the toast: "library" or "wishlist"
  async function removeGame(from = "library") {
    const { error, removed } = await deleteUserGame({
      game_id: game.id,
      user_id,
    });
    if (error) {
      toast.error(`Couldn't remove ${game.name}. Try again.`);
      return false;
    }

    gameToast({
      game,
      message: `Removed from your ${from}`,
      icon: Trash2,
      iconClass: "text-text-muted",
      action: removed?.userGame && {
        label: "Undo",
        onClick: () => undoRemove(removed),
      },
    });
    await refetch();
    return true;
  }

  return { removeGame };
}
