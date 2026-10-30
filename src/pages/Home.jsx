import { useGetFreeGamesToShow } from "@/features/games/hooks/useGetFreeGamesToShow";
import { useGetGameSection } from "@/features/games/hooks/useGetGameSection";
import { useGetPopularNow } from "@/features/games/hooks/useGetPopularNow";
import { useGetUpcomingGames } from "@/features/games/hooks/useGetUpcomingGames";
import HeroSection from "@/ui/HeroSection";
import HomeSection from "@/ui/HomeSection";
import { Helmet } from "react-helmet-async";

function Home() {
  const { data: games, isLoading: isLoadingGames } = useGetGameSection(
    "total_rating_count",
    16,
  );
  const { data: popularNow, isLoading: isLoadingPopularNow } =
    useGetPopularNow(8);

  const {
    dataToShow: freeGames,
    isLoadingFreeGamesIgdbData,
    isLoadingFreeGamesNames,
  } = useGetFreeGamesToShow();

  const { data: upcomingGames, isLoading: isLoadingUpcomingGames } =
    useGetUpcomingGames(12);

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        {/* Basic SEO Meta Tags */}
        <title>Game-Changer | Discover Popular, Free & Upcoming Games</title>
        <meta
          name="description"
          content="Discover the best games on Game-Changer. Browse popular games, find free-to-play titles, and stay updated with upcoming releases. Your ultimate gaming destination."
        />
        <meta
          property="og:description"
          content="Discover the best games on Game-Changer. Browse popular games, find free-to-play titles, and stay updated with upcoming releases. Your ultimate gaming destination."
        />
        <link rel="canonical" href="https://game-changer-gg.vercel.app/" />
      </Helmet>

      <HeroSection popularGames={popularNow} isLoading={isLoadingPopularNow} />
      <div className="mx-auto flex max-w-[1440px] flex-col gap-12 pt-4 pb-24">
        <HomeSection
          sectionName="Free to keep now"
          data={freeGames}
          isLoading={isLoadingFreeGamesIgdbData || isLoadingFreeGamesNames}
          route="games/freeGames"
        />
        <HomeSection
          sectionName="Coming soon"
          data={upcomingGames}
          isLoading={isLoadingUpcomingGames}
          route="games/upcomingGames"
        />
        <HomeSection
          id="popular"
          sectionName="Most played of all time"
          data={games}
          isLoading={isLoadingGames}
          route="games/allGames"
        />
      </div>
    </>
  );
}

export default Home;
