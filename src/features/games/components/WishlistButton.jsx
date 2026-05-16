import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useUserGameActions } from "../hooks/useUserGameActions";

function WishlistButton({ status, game_id }) {
  console.log(game_id);
  const { handleWishlistChange } = useUserGameActions(game_id || 0);

  return (
    <label className="swap tooltip" data-tip="Add to Wishlist">
      <input
        type="checkbox"
        defaultChecked={status === "to play"}
        onChange={handleWishlistChange}
      />
      <div className="swap-on text-pulse-warning text-3xl">
        <FaBookmark />
      </div>
      <div className="swap-off text-3xl">
        <FaRegBookmark />
      </div>
    </label>
  );
}

export default WishlistButton;
