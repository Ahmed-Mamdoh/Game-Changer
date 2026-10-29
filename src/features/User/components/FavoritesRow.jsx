import {
  MAX_FAVORITES,
  gameOfEntry,
  useFavorites,
} from "@/features/games/hooks/useFavorites";
import { coverUrlOf } from "@/utils/igdbImage";
import { Heart, X } from "lucide-react";
import { Link } from "react-router-dom";

// The hearted games, most played first, in fixed slots. Libraries from before
// the cap can hold more than five; they all show so they can be trimmed.
function FavoritesRow() {
  const { favorites: hearted, toggleFavorite } = useFavorites();
  const favorites = [...hearted].sort(
    (a, b) => (b.hours_played || 0) - (a.hours_played || 0),
  );
  const slots = Math.max(MAX_FAVORITES, favorites.length);

  return (
    <section
      aria-labelledby="favorites-title"
      className="panel flex flex-col gap-3 p-4"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2
          id="favorites-title"
          className="text-text-main flex items-center gap-2 text-lg font-semibold"
        >
          <Heart className="text-pulse-error h-4 w-4" aria-hidden="true" />
          Favorites
        </h2>
        <span className="text-text-dim tabular text-sm">
          {favorites.length} of {MAX_FAVORITES}
        </span>
      </div>

      <ul className="grid grid-cols-5 gap-2 sm:gap-3">
        {Array.from({ length: slots }, (_, i) => {
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
            <li key={game_id} className="group relative">
              <Link
                to={`/game/${game_id}`}
                title={game?.name}
                className="block"
              >
                <img
                  src={coverUrlOf(game)}
                  alt={game?.name}
                  loading="lazy"
                  className="bg-bg-raised aspect-[3/4] w-full rounded-md object-cover outline-1 -outline-offset-1 outline-white/15 transition-[filter] duration-150 group-hover:brightness-110"
                />
              </Link>
              <button
                type="button"
                onClick={() => toggleFavorite(gameOfEntry(favorite))}
                title="Remove from favorites"
                aria-label={`Remove ${game?.name} from favorites`}
                className="text-text-main hover:bg-pulse-error absolute top-1 right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm border border-white/15 bg-black/65 backdrop-blur-md transition-[opacity,background-color] duration-100 focus-visible:opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          );
        })}
      </ul>

      {favorites.length === 0 && (
        <p className="text-text-dim text-sm">
          Heart a game you&apos;ve played to pin it here.
        </p>
      )}
      {favorites.length > MAX_FAVORITES && (
        <p className="text-text-dim text-sm">
          Favorites now hold {MAX_FAVORITES}. Remove{" "}
          {favorites.length - MAX_FAVORITES} to heart new ones.
        </p>
      )}
    </section>
  );
}

export default FavoritesRow;
