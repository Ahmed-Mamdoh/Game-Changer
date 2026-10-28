import { addUserGame, deleteUserGame, updateUserGame } from "@/api/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { UserToken } from "@/hooks/useUserToken";
import { useGetUserGame } from "@/features/User/hooks/useGetUserGame";
import { useGetOneGame } from "./useGetOneGame";
import { formatIGDBImage } from "@/utils/igdbImage";

export function useUserGameActions(gameId) {
  const queryClient = useQueryClient();
  const user_id = UserToken()?.user?.id;
  const userGame = useGetUserGame(user_id);
  const userGameData = userGame?.data?.data?.[0] || {};
  const { data } = useGetOneGame();
  const { cover, name } = data[0] || {};
  const game_cover = formatIGDBImage(cover?.url, "t_720p_2x");

  async function handleFavoriteChange(isFavorite) {
    const { error } = await updateUserGame({
      game_id: gameId,
      user_id,
      is_favorite: isFavorite,
    });
    if (error) throw error;

    queryClient.invalidateQueries({
      queryKey: ["user_games", user_id],
    });
    queryClient.invalidateQueries({
      queryKey: ["user_game", user_id, String(gameId)],
    });
  }

  async function handleWishlistChange(e) {
    const isWishlist = e.target.checked;
    if ((!userGameData || userGameData.status !== "to play") && isWishlist) {
      const { error } = addUserGame({
        user_id,
        status: "to play",
        game_id: gameId,
        game_name: name,
        game_cover,
        review: "",
        rating: 0,
      });
      if (error) throw error;
    } else {
      const { error } = await deleteUserGame({
        game_id: gameId,
        user_id,
      });
      if (error) throw error;
    }
    queryClient.invalidateQueries({
      queryKey: ["user_games", user_id],
    });
    queryClient.invalidateQueries({
      queryKey: ["user_game", user_id, String(gameId)],
    });
  }
  return { handleFavoriteChange, handleWishlistChange };
}
