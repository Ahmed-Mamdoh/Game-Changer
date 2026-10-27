import { useGetRecommendations } from "@/features/games/hooks/useGetRecommendations";
import RecommendationCard from "@/features/games/ui/RecommendationCard";
import { useGetUserGames } from "@/features/User/hooks/useGetUserGames";
import { UserToken } from "@/hooks/useUserToken";
import Spinner from "@/ui/Spinner";
import { RefreshCw } from "lucide-react";
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
  const { recommendations, isLoading, isRefreshing, error, refresh } =
    useGetRecommendations();
  if (error && !isRefreshing)
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
        <h3>Your picks didn't load</h3>
        <p>The recommendation service didn't answer. Try again in a moment.</p>
        <button onClick={refresh} className="btn-primary mt-2">
          Try again
        </button>
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
        <div className="flex flex-col items-center px-4 py-16 text-center">
          <h3 className="mb-1">Log a few games first</h3>
          <p className="mb-6 max-w-[50ch]">
            Picks come from the games in your library. Add three or more you've
            played, with ratings, and your picks show up here.
          </p>
          <Link to="/games/allGames" className="btn-primary">
            Browse games
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
      <div className="mx-auto flex w-full max-w-[1440px] items-center px-4 md:px-8">
        <button
          onClick={refresh}
          disabled={isLoading || isRefreshing}
          className="btn-quiet h-9"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          New picks
        </button>
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-4 pt-6 pb-16 md:px-8">
        {isLoading || isRefreshing ? (
          <Spinner />
        ) : recommendations?.length === 0 ? (
          <p className="py-16 text-center">
            No picks this time. Press New picks to try again.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
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
