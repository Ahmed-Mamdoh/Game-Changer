import { useGetFreeGamesToShow } from "@/features/games/hooks/useGetFreeGamesToShow";
import { useGetGameSection } from "@/features/games/hooks/useGetGameSection";
import { useGetUpcomingGames } from "@/features/games/hooks/useGetUpcomingGames";
import HeroSection from "@/ui/HeroSection";
import HomeSection from "@/ui/HomeSection";

function Home() {
  const { data: games, isLoading: isLoadingGames } = useGetGameSection(
    "total_rating_count",
    6,
  );

  const {
    dataToShow: freeGames,
    isLoadingFreeGamesIgdbData,
    isLoadingFreeGamesNames,
  } = useGetFreeGamesToShow();

  const { data: upcomingGames, isLoading: isLoadingUpcomingGames } =
    useGetUpcomingGames(6);
  return (
    <div className="from-obsidian-surface to-obsidian-muted bg-gradient-to-b pb-12">
      <HeroSection />
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
    </div>
  );
}

export default Home;
