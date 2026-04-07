import { useGetAllGames } from "@/features/games/hooks/useGetAllGames";
import FadingBackground from "@/features/games/ui/FadingBackground";
import Filters from "@/features/games/ui/Filters";
import FullPagination from "../features/games/ui/FullPagination";
import GamesGallery from "../features/games/ui/GamesGallery";

function AllGames() {
  const { data, isLoading } = useGetAllGames();

  return (
    <div className="relative min-h-screen">
      <FadingBackground first={true} />
      {/* Content section */}
      <div className="absolute top-[10vh] z-10 w-full">
        <div className="container mx-auto">
          <Filters className="mt-4 w-3/4" />
          <GamesGallery data={data} isLoading={isLoading} />
          <FullPagination />
        </div>
      </div>
    </div>
  );
}

export default AllGames;
