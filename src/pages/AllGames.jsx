import Filters from "@/features/games/ui/Filters";
import GamesGallary from "../features/games/ui/GamesGallary";
import FullPagination from "../features/games/ui/FullPagination";
import { useGetAllGames } from "@/features/games/hooks/useGetAllGames";
import spaceBackground from "../assets/space.png";
import FadingBackground from "@/features/games/ui/FadingBackground";

function AllGames() {
  const { data, isLoading } = useGetAllGames();

  return (
    <div className="relative min-h-screen">
      <FadingBackground />
      {/* Content section */}
      <div className="absolute top-[10vh] z-10 w-full pb-15">
        <div className="container mx-auto">
          <Filters className="mt-4 w-3/4" />
          <GamesGallary data={data} isLoading={isLoading} />
          <FullPagination />
        </div>
      </div>
    </div>
  );
}

export default AllGames;
