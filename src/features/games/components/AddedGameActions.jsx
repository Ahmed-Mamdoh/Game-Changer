import { Heart, Trash2 } from "lucide-react";
import { useState } from "react";
import AddGameModal from "./AddGameModal";
import { useUserGameActions } from "../hooks/useUserGameActions";

const iconButton =
  "flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-white/15 bg-black/45 backdrop-blur-md transition-colors duration-100 hover:bg-black/65";

function AddedGameActions({ game, userGame, userGameReview }) {
  const { handleDeleteGame, handleFavoriteChange } = useUserGameActions(
    game.id,
  );
  const [isFavorite, setIsFavorite] = useState(Boolean(userGame?.is_favorite));

  return (
    <div className="flex items-center gap-2">
      <AddGameModal
        isUpdate={true}
        game={game}
        userGame={userGame}
        userGameReview={userGameReview}
      />
      <label
        className={`${iconButton} has-focus-visible:outline-pulse-accent has-focus-visible:outline-2`}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <input
          type="checkbox"
          className="sr-only"
          checked={isFavorite}
          aria-label="Favorite"
          onChange={(e) => {
            setIsFavorite(e.target.checked);
            handleFavoriteChange(e).catch(() =>
              setIsFavorite(!e.target.checked),
            );
          }}
        />
        <Heart
          className={`h-4 w-4 ${isFavorite ? "fill-pulse-error text-pulse-error" : "text-text-main"}`}
        />
      </label>
      <button
        type="button"
        onClick={handleDeleteGame}
        className={`${iconButton} text-text-main`}
        title="Remove from library"
        aria-label={`Remove ${game.name} from library`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export default AddedGameActions;
