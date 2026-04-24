import GamesGallery from "@/features/games/ui/GamesGallery";
import Filters from "@/features/games/ui/Filters";
import FullPagination from "@/features/games/ui/FullPagination";
import { useGetUpcomingGames } from "@/features/games/hooks/useGetUpcomingGames";
import FadingBackground from "@/features/games/ui/FadingBackground";

function UpcomingGames() {
  const { data, isLoading } = useGetUpcomingGames();

  return (
    <>
      <Filters isUpcoming />
      <GamesGallery data={data} isLoading={isLoading} />;
    </>
  );
}

export default UpcomingGames;
