import GamesGallery from "@/features/games/ui/GamesGallery";
import { useGetFreeGamesToShow } from "@/features/games/hooks/useGetFreeGamesToShow";
import FadingBackground from "@/features/games/ui/FadingBackground";

function FreeGames() {
  const { dataToShow, isLoadingFreeGamesIgdbData, isLoadingFreeGamesNames } =
    useGetFreeGamesToShow();
  return (
    <div className="relative mx-auto min-h-screen w-full py-20">
      <FadingBackground first={true} />
      <div className="h-full w-full">
        <GamesGallery
          isLoading={isLoadingFreeGamesNames || isLoadingFreeGamesIgdbData}
          data={dataToShow}
        />
      </div>
    </div>
  );
}

export default FreeGames;
