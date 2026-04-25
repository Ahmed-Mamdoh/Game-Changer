import GamesGallery from "@/features/games/ui/GamesGallery";
import { useGetFreeGamesToShow } from "@/features/games/hooks/useGetFreeGamesToShow";
import FadingBackground from "@/features/games/ui/FadingBackground";
import { Helmet } from "react-helmet-async";

function FreeGames() {
  const { dataToShow, isLoadingFreeGamesIgdbData, isLoadingFreeGamesNames } =
    useGetFreeGamesToShow();
  return (
    <>
      <Helmet>
        {/* Basic SEO Meta Tags */}
        <title>Free Games | Game-Changer</title>
        <meta
          name="description"
          content="Check out the latest free games available for a limited time on Game-Changer. Grab them before they expire!"
        />
        <meta
          property="og:description"
          content="Check out the latest free games available for a limited time on Game-Changer. Grab them before they expire!"
        />
        <link
          rel="canonical"
          href="https://game-changer-gg.vercel.app/games/freeGames"
        />
      </Helmet>
      <GamesGallery
        isLoading={isLoadingFreeGamesNames || isLoadingFreeGamesIgdbData}
        data={dataToShow}
      />
    </>
  );
}

export default FreeGames;
