import { useGetFreeGamesToShow } from "@/features/games/hooks/useGetFreeGamesToShow";
import { useGetGameSection } from "@/features/games/hooks/useGetGameSection";
import { useGetUpcomingGames } from "@/features/games/hooks/useGetUpcomingGames";
import HeroSection from "@/ui/HeroSection";
import HomeSection from "@/ui/HomeSection";
import { Helmet } from "react-helmet-async";

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
          name="keywords"
          content="games, video games, free games, upcoming games, popular games, gaming, game discovery"
        />
        <meta name="author" content="Ahmed Mamdoh" />
        <link rel="canonical" href="https://game-changer-gg.vercel.app" />
      </Helmet>

      <div className="from-obsidian-surface to-obsidian-muted bg-gradient-to-b pb-32">
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
    </>
  );
}

export default Home;
