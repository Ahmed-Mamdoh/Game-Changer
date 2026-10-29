import { updateUserGame } from "@/api/supabase";
import { StarRating } from "@/features/games/components/LogGameDialog";
import { coverUrlOf } from "@/utils/igdbImage";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const RATE_STATUSES = ["finished", "dropped"];

const ratingOf = (userGame) =>
  userGame?.game?.reviews?.find((r) => r.user_id === userGame.user_id)?.rating;

// Played and dropped games with no rating, rated in one click each. Ratings
// are what For You learns from, so games logged before it asked show up here.
function RateTheseStrip({ userGames, user_id }) {
  const queryClient = useQueryClient();
  // Ratings saved here, shown until the refetched library drops the game
  const [rated, setRated] = useState({});

  const unrated = userGames
    .filter((g) => RATE_STATUSES.includes(g.status) && !ratingOf(g))
    // Most played first: the strongest signal of what you liked
    .sort((a, b) => (b.hours_played || 0) - (a.hours_played || 0));

  if (!unrated.length) return null;

  async function rate(userGame, rating) {
    const { game_id } = userGame;
    const name = userGame.game?.name;
    setRated((r) => ({ ...r, [game_id]: rating }));
    const { error } = await updateUserGame({ game_id, user_id, rating });
    if (error) {
      setRated((r) => {
        const next = { ...r };
        delete next[game_id];
        return next;
      });
      toast.error(`Couldn't rate ${name}. Try again.`);
      return;
    }
    toast.success(`Rated ${name} ${rating} / 5`);
    queryClient.invalidateQueries({ queryKey: ["user_games", user_id] });
    queryClient.invalidateQueries({
      queryKey: ["user_game_review", user_id, String(game_id)],
    });
    queryClient.invalidateQueries({
      queryKey: ["game_reviews", String(game_id)],
    });
  }

  return (
    <section
      aria-labelledby="rate-these-title"
      className="border-stroke-subtle bg-bg-surface flex flex-col gap-4 rounded-lg border p-4"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2
          id="rate-these-title"
          className="text-text-main text-lg font-semibold"
        >
          Rate what you've played
        </h2>
        <p className="text-text-dim tabular text-sm">
          {unrated.length} unrated · ratings shape your For You picks
        </p>
      </div>

      <ul className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4">
        {unrated.map((userGame) => {
          const { game_id, game } = userGame;
          return (
            <li key={game_id} className="flex w-32 shrink-0 flex-col gap-2">
              <Link
                to={`/game/${game_id}`}
                className="group flex flex-col gap-1.5"
              >
                <img
                  src={coverUrlOf(game)}
                  alt=""
                  loading="lazy"
                  className="bg-bg-raised aspect-[3/4] w-full rounded-md object-cover outline-1 -outline-offset-1 outline-white/15 transition-[filter] duration-150 group-hover:brightness-110"
                />
                <span className="text-text-main line-clamp-1 text-sm font-semibold group-hover:underline group-hover:underline-offset-2">
                  {game?.name}
                </span>
              </Link>
              <StarRating
                size="sm"
                label={`Rate ${game?.name}`}
                value={rated[game_id] || 0}
                onChange={(rating) => rating && rate(userGame, rating)}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default RateTheseStrip;
