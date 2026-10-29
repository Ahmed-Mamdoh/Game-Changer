import { coverUrlOf } from "@/utils/igdbImage";
import { Heart } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const SLOTS = 5;

// Up to five hearted games, most played first. Empty slots say how to fill them.
function FavoritesRow({ userGames = [] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const favorites = userGames
    .filter((g) => g.is_favorite)
    .sort((a, b) => (b.hours_played || 0) - (a.hours_played || 0));

  function showAll() {
    const next = new URLSearchParams(searchParams);
    next.delete("status");
    next.set("isFavorite", "true");
    setSearchParams(next);
  }

  return (
    <section
      aria-labelledby="favorites-title"
      className="border-stroke-subtle bg-bg-surface flex flex-col gap-3 rounded-lg border p-4"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2
          id="favorites-title"
          className="text-text-main flex items-center gap-2 text-lg font-semibold"
        >
          <Heart className="text-pulse-error h-4 w-4" aria-hidden="true" />
          Favorites
        </h2>
        {favorites.length > SLOTS && (
          <button
            type="button"
            onClick={showAll}
            className="text-text-dim hover:text-text-main cursor-pointer text-sm"
          >
            See all {favorites.length}
          </button>
        )}
      </div>

      <ul className="grid grid-cols-5 gap-2 sm:gap-3">
        {Array.from({ length: SLOTS }, (_, i) => {
          const favorite = favorites[i];
          if (!favorite)
            return (
              <li
                key={`empty-${i}`}
                className="border-stroke-medium text-text-muted flex aspect-[3/4] items-center justify-center rounded-md border border-dashed"
              >
                <Heart className="h-4 w-4" aria-hidden="true" />
              </li>
            );
          const { game_id, game } = favorite;
          return (
            <li key={game_id}>
              <Link
                to={`/game/${game_id}`}
                title={game?.name}
                className="group block"
              >
                <img
                  src={coverUrlOf(game)}
                  alt={game?.name}
                  loading="lazy"
                  className="bg-bg-raised aspect-[3/4] w-full rounded-md object-cover outline-1 -outline-offset-1 outline-white/15 transition-[filter] duration-150 group-hover:brightness-110"
                />
              </Link>
            </li>
          );
        })}
      </ul>

      {favorites.length === 0 && (
        <p className="text-text-dim text-sm">
          Heart a game from its page to pin it here.
        </p>
      )}
    </section>
  );
}

export default FavoritesRow;
