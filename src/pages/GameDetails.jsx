import { useGetOneGame } from "@/features/games/hooks/useGetOneGame";
import Spinner from "@/ui/Spinner";
import GameDetailsLangTable from "@/features/games/components/GameDetailsLangTable";
import GameDetailsMedia from "@/features/games/components/GameDetailsMedia";
import GameDetailsOverview from "@/features/games/components/GameDetailsOverview";
import GameDetailsRelatedGames from "@/features/games/components/GameDetailsRelatedGames";
import GameDetailsReviews from "@/features/games/components/GameDetailsReviews";
import { useGetGameReviews } from "@/features/games/hooks/useGetGameReviews";

function GameDetails() {
  const { data, isLoading } = useGetOneGame();
  const { data: reviewsData, isLoading: reviewsLoading } = useGetGameReviews();

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
        <GameDetailsReviews reviewsData={reviewsData} />
      </div>
    </>
  );
}

export default GameDetails;
