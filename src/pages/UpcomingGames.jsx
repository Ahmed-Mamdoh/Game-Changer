import GamesGallary from "@/features/games/GamesGallary";
import Filters from "@/features/games/ui/Filters";
import FullPagination from "@/features/games/ui/FullPagination";
import { useGetUpcomingGames } from "@/features/games/useGetUpcomingGames";

function UpcomingGames() {
  const { data, isLoading } = useGetUpcomingGames();

  return (
    <div className="container mx-auto">
      <Filters showSortBy={false} />
      <GamesGallary data={data} isLoading={isLoading} />
      <FullPagination />
    </div>
  );
}

export default UpcomingGames;
