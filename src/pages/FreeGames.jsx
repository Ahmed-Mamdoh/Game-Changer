import GamesGallary from "@/features/games/ui/GamesGallary";
import { useGetFreeGamesToShow } from "@/features/games/hooks/useGetFreeGamesToShow";

function FreeGames() {
  const { dataToShow, isLoadingFreeGamesIgdbData, isLoadingFreeGamesNames } =
    useGetFreeGamesToShow();
  return (
    <div className="container mx-auto">
      <GamesGallary
        isLoading={isLoadingFreeGamesNames || isLoadingFreeGamesIgdbData}
        data={dataToShow}
      />
    </div>
  );
}

export default FreeGames;
