import { useGetRecommendations } from "@/features/games/hooks/useGetRecommendations";
import Filters from "@/features/games/ui/Filters";
import GameItem from "@/features/games/ui/GameItem";
import GamesGallery from "@/features/games/ui/GamesGallery";
import { UserToken } from "@/hooks/useUserToken";
import Spinner from "@/ui/Spinner";
import { useNavigate } from "react-router-dom";

function ForYouPage() {
  const user_id = UserToken()?.user?.id;
  const navigate = useNavigate();
  const { recommendations, isLoading, error } = useGetRecommendations(user_id);
  if (error)
    return (
      <div className="text-text-error p-4 text-center">
        Failed to load recommendations.
      </div>
    );
  if (!user_id) {
    navigate("/auth");
  }
  // todo : add ui for empty user games
  return (
    <>
      <Filters
        showSortBy={false}
        showGenres={false}
        showThemes={false}
        showGameModes={false}
        showPerspective={false}
      />
      <div className="relative mx-auto flex w-9/10 items-center justify-between pt-3">
        <div>
          <h2>Recommended for You</h2>
          <p className="text-text-dim text-sm">Based on your ratings</p>
        </div>
      </div>
      <GamesGallery data={recommendations} isLoading={isLoading} />
    </>
  );
}

export default ForYouPage;
