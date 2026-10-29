import { addUserGame, deleteUserGame, updateUserGame } from "@/api/supabase";
import { useGetUserGames } from "@/features/User/hooks/useGetUserGames";
import { UserToken } from "@/hooks/useUserToken";
import { gameToast } from "@/ui/gameToast";
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

// Statuses that mean the player has an opinion, so we ask for a rating
const RATE_AFTER = ["finished", "dropped"];

// Set a game's library status straight from a card, without opening the game.
// Finishing or dropping an unrated game sets ratePrompt to that status, so
// the caller can open the log and ask for the rating For You learns from.
export function useQuickStatus() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user_id = UserToken()?.user?.id;
  const { data } = useGetUserGames(user_id);
  const [pending, setPending] = useState({});
  const [ratePrompt, setRatePrompt] = useState(null);

  function statusOf(gameId) {
    if (gameId in pending) return pending[gameId];
    return data?.user_games?.find((g) => g.game_id === gameId)?.status || null;
  }

  // The library row and the user's review, for opening a log on a game
  function logOf(gameId) {
    const userGame = data?.user_games?.find((g) => g.game_id === gameId);
    const userGameReview = userGame?.game?.reviews?.find(
      (review) => review.user_id === user_id,
    );
    return { userGame, userGameReview };
  }

  async function refetch(gameId) {
    await queryClient.invalidateQueries({ queryKey: ["user_games", user_id] });
    queryClient.invalidateQueries({
      queryKey: ["user_game", user_id, String(gameId)],
    });
    queryClient.invalidateQueries({
      queryKey: ["game_reviews", String(gameId)],
    });
  }

  // Puts the status back, or takes a game that was just added out again
  async function undoStatus(game, previous) {
    setRatePrompt(null);
    const { error } = previous
      ? await updateUserGame({ game_id: game.id, user_id, status: previous })
      : await deleteUserGame({ game_id: game.id, user_id });
    if (error) {
      toast.error(`Couldn't undo that for ${game.name}. Try again.`);
      return;
    }
    refetch(game.id);
  }

  // Resolves true once the status is saved and the library is refetched
  async function setStatus(game, status) {
    if (!user_id) {
      navigate("/auth");
      return false;
    }
    const current = statusOf(game.id);
    if (current === status) return false;

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
      return false;
    }

    gameToast({
      game,
      message:
        status === "to play"
          ? "Added to your wishlist"
          : `Moved to ${STATUS_LABELS[status]}`,
      icon: STATUS_ICONS[status].icon,
      iconClass: STATUS_ICONS[status].color,
      action: { label: "Undo", onClick: () => undoStatus(game, current) },
    });
    await refetch(game.id);
    setPending((p) => {
      const next = { ...p };
      delete next[game.id];
      return next;
    });
    // logOf still reads the library from before the change; ratings survive it
    if (RATE_AFTER.includes(status) && !logOf(game.id).userGameReview?.rating) {
      setRatePrompt(status);
    }
    return true;
  }

  return {
    statusOf,
    logOf,
    setStatus,
    ratePrompt,
    closeRatePrompt: () => setRatePrompt(null),
    isSignedIn: Boolean(user_id),
  };
}
