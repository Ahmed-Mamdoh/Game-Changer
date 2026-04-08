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
        {/* Basic Open Graph Tags */}
        <meta
          property="og:title"
          content="Game-Changer | Discover Popular, Free & Upcoming Games"
        />
        <meta
          property="og:description"
          content="Discover the best games on Game-Changer. Browse popular games, find free-to-play titles, and stay updated with upcoming releases."
        />
        <meta property="og:url" content="https://game-changer-gg.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Game-Changer" />
        <meta property="og:locale" content="en_US" />

        <meta
          property="og:image"
          content="https://game-changer-gg.vercel.app/og-image.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta
          property="og:image:alt"
          content="Game-Changer - Discover Amazing Games"
        />

        <meta
          property="og:image"
          content="https://game-changer-gg.vercel.app/og-image-2.jpg"
        />
        <meta property="og:image:width" content="1080" />
        <meta property="og:image:height" content="1080" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Game-Changer | Discover Popular, Free & Upcoming Games"
        />
        <meta
          name="twitter:description"
          content="Discover the best games on Game-Changer. Browse popular games, find free-to-play titles, and stay updated with upcoming releases."
        />
        <meta
          name="twitter:image"
          content="https://game-changer-gg.vercel.app/twitter-image.jpg"
        />

        <meta property="og:determiner" content="the" />
        <meta
          property="og:see_also"
          content="https://game-changer-gg.vercel.app/allGames"
        />
      </Helmet>

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
    </>
  );
}

export default Home;
