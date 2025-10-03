import { useGetOneGame } from "@/features/games/hooks/useGetOneGame";
import Spinner from "@/ui/Spinner";

import GameDetailsTabs from "@/features/games/components/GameDetailsTabs";
import GameDetailsOverview from "@/features/games/components/GameDetailsOverview";
import GameDetailsMedia from "@/features/games/components/GameDetailsMedia";
import GameDetailsRelatedGames from "@/features/games/components/GameDetailsRelatedGames";
import GameDetailsLangTable from "@/features/games/components/GameDetailsLangTable";

function GameDetails() {
  const { data, isLoading } = useGetOneGame();
  if (isLoading) return <Spinner />;

  //destruct data

  return (
    <>
      <GameDetailsTabs data={data} />
      <div className="relative mx-4 mt-0 pb-20 sm:mx-12">
        {/* Data */}
        <GameDetailsOverview data={data} />
        {/*Media*/}
        <GameDetailsMedia data={data} />

        {/* Related Games */}
        <GameDetailsRelatedGames data={data} />

        {/* Language Support */}
        <GameDetailsLangTable data={data} />
      </div>
    </>
  );
}

export default GameDetails;
