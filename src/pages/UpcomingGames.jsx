import GamesGallary from "@/features/games/ui/GamesGallary";
import Filters from "@/features/games/ui/Filters";
import FullPagination from "@/features/games/ui/FullPagination";
import { useGetUpcomingGames } from "@/features/games/hooks/useGetUpcomingGames";

function UpcomingGames() {
  const { data, isLoading } = useGetUpcomingGames();

  return (
    <div className="container mx-auto">
      <Filters showSortBy={false} className="mt-4 w-3/4" />
      <GamesGallary data={data} isLoading={isLoading} />
      <FullPagination />
    </div>
  );
}

export default UpcomingGames;
