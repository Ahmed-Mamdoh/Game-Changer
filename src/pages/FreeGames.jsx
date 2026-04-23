import GamesGallery from "@/features/games/ui/GamesGallery";
import { useGetFreeGamesToShow } from "@/features/games/hooks/useGetFreeGamesToShow";
import FadingBackground from "@/features/games/ui/FadingBackground";

function FreeGames() {
  const { dataToShow, isLoadingFreeGamesIgdbData, isLoadingFreeGamesNames } =
    useGetFreeGamesToShow();
  return (
    <GamesGallery
      isLoading={isLoadingFreeGamesNames || isLoadingFreeGamesIgdbData}
      data={dataToShow}
    />
  );
}

export default FreeGames;
