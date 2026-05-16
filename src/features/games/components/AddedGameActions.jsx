import { FaHeart, FaRegHeart, FaTrash } from "react-icons/fa";
import AddGameModal from "./AddGameModal";
import { useUserGameActions } from "../hooks/useUserGameActions";

function AddedGameActions({ game, userGame, userGameReview }) {
  const { handleDeleteGame, handleFavoriteChange } = useUserGameActions(
    game.id,
  );

  return (
    <div className="flex flex-col items-end gap-3">
      <div className="flex items-center gap-x-4">
        <label className="swap tooltip" data-tip="Delete Game">
          <button
            onClick={handleDeleteGame}
            className="cursor-pointer bg-transparent text-2xl"
          >
            <FaTrash />
          </button>
        </label>
        <label className="swap tooltip" data-tip="Add to Favorites">
          <input
            type="checkbox"
            defaultChecked={userGame?.is_favorite}
            onChange={handleFavoriteChange}
          />
          <div className="swap-on text-error text-3xl">
            <FaHeart />
          </div>
          <div className="swap-off text-3xl">
            <FaRegHeart />
          </div>
        </label>
        <AddGameModal
          isUpdate={true}
          game={game}
          userGame={userGame}
          userGameReview={userGameReview}
        />
      </div>
    </div>
  );
}

export default AddedGameActions;
