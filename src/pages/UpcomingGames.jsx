import GamesGallery from "@/features/games/ui/GamesGallery";
import NoResults from "@/features/games/ui/NoResults";
import { UPCOMING_FILTERS } from "@/features/games/hooks/useFilterMenus";
import { useGetUpcomingGames } from "@/features/games/hooks/useGetUpcomingGames";
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
      <GamesGallery
        data={data}
        isLoading={isLoading}
        emptyState={<NoResults isUpcoming menuOptions={UPCOMING_FILTERS} />}
      />
    </>
  );
}

export default UpcomingGames;
