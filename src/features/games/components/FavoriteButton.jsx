import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { coverUrlOf } from "@/utils/igdbImage";
import { Heart, Repeat } from "lucide-react";
import {
  MAX_FAVORITES,
  gameOfEntry,
  useFavorites,
} from "../hooks/useFavorites";

const VARIANTS = {
  // Game page action bar, over the art
  art: (on) =>
    `btn-on-art px-4 ${on ? "bg-pulse-error/20 hover:bg-pulse-error/30" : ""}`,
  // Log dialog header
  pill: (on) =>
    `inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3.5 text-sm font-semibold transition-colors duration-100 ${
      on
        ? "border-pulse-error/45 bg-pulse-error/15 text-text-main hover:bg-pulse-error/20"
        : "border-stroke-medium text-text-main bg-black/30 hover:bg-white/[0.06]"
    }`,
  // Poster hover bar, beside the status buttons
  poster: () =>
    "text-text-main flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm border border-white/15 bg-black/60 backdrop-blur-md transition-colors duration-100 hover:bg-black/80",
};

// One-tap heart for a played game. Hidden for games that aren't played yet.
function FavoriteButton({ game, variant = "art" }) {
  const {
    favorites,
    isFavorite,
    canFavorite,
    toggleFavorite,
    swapFor,
    swapFavorite,
    closeSwap,
  } = useFavorites();

  if (!canFavorite(game.id)) return null;
  const on = isFavorite(game.id);
  const labelled = variant !== "poster";

  return (
    <>
      <button
        type="button"
        aria-pressed={on}
        aria-label={labelled ? undefined : `Favorite ${game.name}`}
        title={
          on
            ? "Remove from favorites"
            : `Add to favorites (${favorites.length} of ${MAX_FAVORITES})`
        }
        onClick={() => toggleFavorite(game)}
        className={VARIANTS[variant](on)}
      >
        <Heart
          className={`text-pulse-error h-4 w-4 ${on ? "fill-current" : ""}`}
        />
        {labelled && (on ? "Favorited" : "Favorite")}
      </button>

      <FavoriteSwapDialog
        game={swapFor}
        favorites={favorites}
        onPick={(entry) => swapFavorite(gameOfEntry(entry), swapFor)}
        onClose={closeSwap}
      />
    </>
  );
}

// Favorites are full: pick which one the new game replaces
function FavoriteSwapDialog({ game, favorites, onPick, onClose }) {
  return (
    <Dialog open={Boolean(game)} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        overlayClassName="confirm-overlay bg-black/60 backdrop-blur-sm"
        className="confirm-panel bg-bg-surface border-stroke-medium gap-0 rounded-2xl border p-5 shadow-[var(--shadow-float)] sm:max-w-[30rem]"
      >
        <DialogTitle className="text-text-main pr-8 text-lg leading-snug font-semibold text-balance">
          Your {MAX_FAVORITES} favorites are full
        </DialogTitle>
        <DialogDescription className="text-text-dim mt-1 text-sm text-pretty">
          Pick one to swap out for {game?.name}.
        </DialogDescription>

        <ul className="mt-4 grid grid-cols-5 gap-2">
          {favorites.map((entry) => (
            <li key={entry.game_id}>
              <button
                type="button"
                onClick={() => onPick(entry)}
                title={`Replace ${entry.game?.name}`}
                aria-label={`Replace ${entry.game?.name}`}
                className="group/swap relative block w-full cursor-pointer rounded-md"
              >
                <img
                  src={coverUrlOf(entry.game)}
                  alt=""
                  className="bg-bg-raised aspect-[3/4] w-full rounded-md object-cover outline-1 -outline-offset-1 outline-white/15 transition-[filter] duration-150 group-hover/swap:brightness-50 group-focus-visible/swap:brightness-50"
                />
                <Repeat className="text-text-main absolute inset-0 m-auto h-5 w-5 opacity-0 transition-opacity duration-100 group-hover/swap:opacity-100 group-focus-visible/swap:opacity-100" />
              </button>
              <p className="text-text-dim mt-1 truncate text-xs">
                {entry.game?.name}
              </p>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

export default FavoriteButton;
