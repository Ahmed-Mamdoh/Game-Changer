import { deleteUserGame } from "@/api/supabase";
import { UserToken } from "@/hooks/useUserToken";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Delete a game, its status, log and review from the signed-in user's library.
export function useRemoveGame(game) {
  const queryClient = useQueryClient();
  const user_id = UserToken()?.user?.id;

  // `from` only names the list in the toast: "library" or "wishlist"
  async function removeGame(from = "library") {
    const { error } = await deleteUserGame({ game_id: game.id, user_id });
    if (error) {
      toast.error(`Couldn't remove ${game.name}. Try again.`);
      return;
    }

    toast.success(`Removed ${game.name} from your ${from}`);
    const gameId = String(game.id);
    queryClient.invalidateQueries({ queryKey: ["user_games", user_id] });
    queryClient.invalidateQueries({ queryKey: ["user_game", user_id, gameId] });
    queryClient.invalidateQueries({
      queryKey: ["user_game_review", user_id, gameId],
    });
    queryClient.invalidateQueries({ queryKey: ["game_reviews", gameId] });
  }

  return { removeGame };
}
