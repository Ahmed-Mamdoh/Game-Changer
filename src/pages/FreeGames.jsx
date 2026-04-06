import GamesGallary from "@/features/games/ui/GamesGallary";
import { useGetFreeGamesToShow } from "@/features/games/hooks/useGetFreeGamesToShow";
import FadingBackground from "@/features/games/ui/FadingBackground";

function FreeGames() {
  const { dataToShow, isLoadingFreeGamesIgdbData, isLoadingFreeGamesNames } =
    useGetFreeGamesToShow();
  return (
    <div className="relative mx-auto w-full">
      <FadingBackground first={true} />
      <div className="absolute top-[10vh] left-0 h-full w-full">
        <GamesGallary
          isLoading={isLoadingFreeGamesNames || isLoadingFreeGamesIgdbData}
          data={dataToShow}
        />
      </div>
    </div>
  );
}

export default FreeGames;
