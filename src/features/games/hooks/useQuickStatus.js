import { addUserGame, updateUserGame } from "@/api/supabase";
import { useGetUserGames } from "@/features/User/hooks/useGetUserGames";
import { UserToken } from "@/hooks/useUserToken";
import { formatIGDBImage } from "@/utils/igdbImage";
import { useQueryClient } from "@tanstack/react-query";
import { Bookmark, Check, Play, Square } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const STATUS_LABELS = {
  "to play": "Wishlist",
  playing: "Playing",
  finished: "Played",
  dropped: "Dropped",
};

export const STATUS_ICONS = {
  "to play": { icon: Bookmark, color: "text-pulse-warning" },
  playing: { icon: Play, color: "text-pulse-primary" },
  finished: { icon: Check, color: "text-pulse-success" },
  dropped: { icon: Square, color: "text-pulse-error" },
};

// Set a game's library status straight from a card, without opening the game.
export function useQuickStatus() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user_id = UserToken()?.user?.id;
  const { data } = useGetUserGames(user_id);
  const [pending, setPending] = useState({});

  function statusOf(gameId) {
    if (gameId in pending) return pending[gameId];
    return data?.user_games?.find((g) => g.game_id === gameId)?.status || null;
  }

  async function setStatus(game, status) {
    if (!user_id) {
      navigate("/auth");
      return;
    }
    const current = statusOf(game.id);
    if (current === status) return;

    setPending((p) => ({ ...p, [game.id]: status }));
    const coverUrl =
      typeof game.cover === "string" ? game.cover : game.cover?.url;
    const { error } = current
      ? await updateUserGame({ game_id: game.id, user_id, status })
      : await addUserGame({
          user_id,
          status,
          game_id: game.id,
          game_name: game.name,
          game_cover: formatIGDBImage(coverUrl, "t_720p_2x"),
          review: "",
          rating: 0,
        });

    if (error) {
      setPending((p) => {
        const next = { ...p };
        delete next[game.id];
        return next;
      });
      toast.error(`Couldn't update ${game.name}. Try again.`);
      return;
    }

    toast.success(
      status === "to play"
        ? `Added ${game.name} to your wishlist`
        : `${game.name} moved to ${STATUS_LABELS[status]}`,
    );
    await queryClient.invalidateQueries({ queryKey: ["user_games", user_id] });
    queryClient.invalidateQueries({
      queryKey: ["user_game", user_id, String(game.id)],
    });
    setPending((p) => {
      const next = { ...p };
      delete next[game.id];
      return next;
    });
  }

  return { statusOf, setStatus, isSignedIn: Boolean(user_id) };
}
