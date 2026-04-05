import GamesGallary from "@/features/games/ui/GamesGallary";
import Filters from "@/features/games/ui/Filters";
import FullPagination from "@/features/games/ui/FullPagination";
import { useGetUpcomingGames } from "@/features/games/hooks/useGetUpcomingGames";
import FadingBackground from "@/features/games/ui/FadingBackground";

function UpcomingGames() {
  const { data, isLoading } = useGetUpcomingGames();

  return (
    <div className="relative mx-auto">
      <FadingBackground />
      {/* Content section */}
      <div className="absolute top-[10vh] z-10 pb-15">
        <Filters showSortBy={false} className="mt-4 w-3/4" />
        <GamesGallary data={data} isLoading={isLoading} />
        <FullPagination />
      </div>
    </div>
  );
}

export default UpcomingGames;
