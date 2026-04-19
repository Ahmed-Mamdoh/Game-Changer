import { useGetOneGame } from "@/features/games/hooks/useGetOneGame";
import Spinner from "@/ui/Spinner";

import GameDetailsTabs from "@/features/games/components/GameDetailsTabs";
import GameDetailsOverview from "@/features/games/components/GameDetailsOverview";
import GameDetailsMedia from "@/features/games/components/GameDetailsMedia";
import GameDetailsRelatedGames from "@/features/games/components/GameDetailsRelatedGames";
import GameDetailsLangTable from "@/features/games/components/GameDetailsLangTable";
import { useGetGameReviews } from "@/features/games/hooks/useGetGameReviews";

function GameDetails() {
  const { data, isLoading } = useGetOneGame();
  const { data: reviews, isLoading: reviewsLoading } = useGetGameReviews();
  console.log(reviews);
  if (isLoading || reviewsLoading) return <Spinner />;

  return (
    <>
      {/* <GameDetailsTabs data={data} /> */}
      <div className="relative mt-0 pb-20">
        {/* Data */}
        <GameDetailsOverview data={data} />
        {/*Media*/}
        <GameDetailsMedia data={data} />

        {/* Related Games */}
        <GameDetailsRelatedGames data={data} />

        {/* Language Support */}
        <GameDetailsLangTable data={data} />

        {/* Game Reviews */}
        <span id="Game Reviews"></span>
        <div className="mx-auto flex w-9/10 items-start justify-start pt-9 pb-4">
          <h2 className="text-center">Game Reviews</h2>
        </div>
        <div className="bg-bg-card h-full w-full"></div>
      </div>
    </>
  );
}

export default GameDetails;
