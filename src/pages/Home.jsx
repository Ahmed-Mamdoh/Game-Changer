import { useGetFreeGamesToShow } from "@/features/games/useGetFreeGamesToShow";
import { useGetGameSection } from "@/features/games/useGetGameSection";
import { useGetUpcomingGames } from "@/features/games/useGetUpcomingGames";
import HeroSection from "@/ui/HeroSection";
import HomeSection from "@/ui/HomeSection";

function Home() {
  const { data: games, isLoading: isLoadingGames } = useGetGameSection(
    "total_rating_count",
    10,
  );

  const {
    dataToShow: freeGames,
    isLoadingFreeGamesIgdbData,
    isLoadingFreeGamesNames,
  } = useGetFreeGamesToShow();

  const { data: upcomingGames, isLoading: isLoadingUpcomingGames } =
    useGetUpcomingGames(10);
  return (
    <>
      <HeroSection sectionId="popular" />
      <HomeSection
        id="popular"
        sectionName="Popular Games"
        data={games}
        isLoading={isLoadingGames}
        route="allGames"
      />
      <HomeSection
        sectionName="Free Games"
        data={freeGames}
        isLoading={isLoadingFreeGamesIgdbData || isLoadingFreeGamesNames}
        route="freeGames"
      />
      <HomeSection
        sectionName="Upcoming Games"
        data={upcomingGames}
        isLoading={isLoadingUpcomingGames}
        route="upcomingGames"
      />
    </>
  );
}

export default Home;
