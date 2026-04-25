import GamesGallery from "@/features/games/ui/GamesGallery";
import Filters from "@/features/games/ui/Filters";
import FullPagination from "@/features/games/ui/FullPagination";
import { useGetUpcomingGames } from "@/features/games/hooks/useGetUpcomingGames";
import FadingBackground from "@/features/games/ui/FadingBackground";
import { Helmet } from "react-helmet-async";

function UpcomingGames() {
  const { data, isLoading } = useGetUpcomingGames();

  return (
    <>
      <Helmet>
        {/* Basic SEO Meta Tags */}
        <title>Upcoming Games | Game-Changer</title>
        <meta
          name="description"
          content="Discover the most anticipated upcoming games on Game-Changer. Stay ahead and get ready for the next big releases!"
        />
        <meta
          property="og:description"
          content="Discover the most anticipated upcoming games on Game-Changer. Stay ahead and get ready for the next big releases!"
        />
        <link
          rel="canonical"
          href="https://game-changer-gg.vercel.app/games/upcomingGames"
        />
      </Helmet>
      <Filters isUpcoming />
      <GamesGallery data={data} isLoading={isLoading} />;
    </>
  );
}

export default UpcomingGames;
