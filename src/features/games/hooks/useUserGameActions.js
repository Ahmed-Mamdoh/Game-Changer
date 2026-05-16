import { addUserGame, deleteUserGame, updateUserGame } from "@/api/supabase";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UserToken } from "@/hooks/useUserToken";
import { MySwal } from "@/lib/swal";
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

  async function handleDeleteGame() {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // delete game logic
        toast
          .promise(
            async () => {
              const { error } = await deleteUserGame({
                game_id: gameId,
                user_id,
              });
              if (error) throw error;
            },
            {
              loading: "Deleting game...",
              success: "Game deleted successfully",
              error: (error) => error.message,
            },
          )
          .finally(() => {
            const idStr = String(gameId);
            queryClient.invalidateQueries({
              queryKey: ["user_game", user_id, idStr],
            });
            queryClient.invalidateQueries({
              queryKey: ["user_games", user_id],
            });
            localStorage.removeItem("recommendations");
          });
      }
    });
  }

  async function handleFavoriteChange(e) {
    const isFavorite = e.target.checked;

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
  return { handleDeleteGame, handleFavoriteChange, handleWishlistChange };
}
