import { useGetAllGames } from "@/features/games/hooks/useGetAllGames";
import FadingBackground from "@/features/games/ui/FadingBackground";
import Filters from "@/features/games/ui/Filters";
import FullPagination from "../features/games/ui/FullPagination";
import GamesGallery from "../features/games/ui/GamesGallery";
import { Helmet } from "react-helmet-async";

function AllGames() {
  const { data, isLoading } = useGetAllGames();

  return (
    <>
      <Helmet>
        {/* Basic SEO Meta Tags */}
        <title>All Games | Game-Changer</title>
        <meta
          name="description"
          content="Browse all games on Game-Changer. Explore a comprehensive collection of titles across all genres, platforms, and release dates."
        />
        <meta
          property="og:description"
          content="Browse all games on Game-Changer. Explore a comprehensive collection of titles across all genres, platforms, and release dates."
        />
        <link
          rel="canonical"
          href="https://game-changer-gg.vercel.app/games/allGames"
        />
      </Helmet>
      <Filters />
      <GamesGallery data={data} isLoading={isLoading} />;
    </>
  );
}

export default AllGames;
