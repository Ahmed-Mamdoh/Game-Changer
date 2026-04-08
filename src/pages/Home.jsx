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

        {/* Open Graph Meta Tags for Social Media */}
        <meta
          property="og:title"
          content="Game-Changer | Discover Popular, Free & Upcoming Games"
        />
        <meta
          property="og:description"
          content="Discover the best games on Game-Changer. Browse popular games, find free-to-play titles, and stay updated with upcoming releases."
        />
        <meta
          property="og:image"
          content="https://game-changer-gg.vercel.app/og-image.jpg"
        />
        <meta property="og:url" content="https://game-changer-gg.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Game-Changer" />

        {/* Twitter Card Meta Tags */}
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

        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charset="UTF-8" />
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
