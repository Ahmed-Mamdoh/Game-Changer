import { useGetRecommendations } from "@/features/games/hooks/useGetRecommendations";
import Filters from "@/features/games/ui/Filters";
import RecommendationCard from "@/features/games/ui/RecommendationCard";
import { useGetUserGames } from "@/features/User/hooks/useGetUserGames";
import { UserToken } from "@/hooks/useUserToken";
import Spinner from "@/ui/Spinner";
import { Sparkles } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";

function ForYouPage() {
  const user_id = UserToken()?.user?.id;
  const navigate = useNavigate();
  const { data: user_games_response, isLoading: isLoadingUserGames } =
    useGetUserGames(user_id);
  const user_games = isLoadingUserGames
    ? []
    : user_games_response?.user_games || [];
  const { recommendations, isLoading, error } = useGetRecommendations();
  if (error)
    return (
      <div className="text-text-error p-4 text-center">
        Failed to load recommendations.
      </div>
    );
  if (!user_id) {
    navigate("/auth");
    return null;
  }

  if (isLoadingUserGames) return <Spinner />;

  if (user_games.length === 0) {
    return (
      <>
        <Helmet>
          {/* Basic SEO Meta Tags */}
          <title>For You | Game-Changer</title>
          <meta
            name="description"
            content="Discover personalized game recommendations on Game-Changer based on your ratings and gaming preferences."
          />
          <link
            rel="canonical"
            href="https://game-changer-gg.vercel.app/games/foryou"
          />
        </Helmet>
        <div className="relative flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
          <div className="bg-bg-card mb-6 rounded-full p-6">
            <Sparkles className="text-pulse-primary h-12 w-12" />
          </div>
          <h2 className="mb-2">Your Recommendation Engine is Ready!</h2>
          <p className="text-text-dim mb-8 max-w-md">
            To get personalized recommendations, start by adding and rating some
            games to your collection.
          </p>
          <Link
            to="/games/allGames"
            className="bg-pulse-primary hover:bg-pulse-primary/80 rounded-full px-8 py-3 font-bold text-white transition-all duration-300 hover:scale-105"
          >
            Explore Games
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        {/* Basic SEO Meta Tags */}
        <title>For You | Game-Changer</title>
        <meta
          name="description"
          content="Discover personalized game recommendations on Game-Changer based on your ratings and gaming preferences."
        />
        <meta
          property="og:description"
          content="Discover personalized game recommendations on Game-Changer based on your ratings and gaming preferences."
        />
        <link
          rel="canonical"
          href="https://game-changer-gg.vercel.app/games/foryou"
        />
      </Helmet>
      <div className="relative mx-auto flex w-9/10 items-center justify-between pt-3">
        <div>
          <h2>Recommended for You</h2>
          <p className="text-text-dim text-sm">Based on your ratings</p>
        </div>
      </div>

      <div className="mx-auto w-9/10 pt-8 pb-16">
        {isLoading ? (
          <Spinner />
        ) : recommendations?.length === 0 ? (
          <h2 className="text-center">🔍 No Games Found</h2>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {recommendations?.map((game) => (
              <RecommendationCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ForYouPage;
