import { useGetAllGames } from "@/features/games/hooks/useGetAllGames";
import FadingBackground from "@/features/games/ui/FadingBackground";
import Filters from "@/features/games/ui/Filters";
import FullPagination from "../features/games/ui/FullPagination";
import GamesGallery from "../features/games/ui/GamesGallery";

function AllGames() {
  const { data, isLoading } = useGetAllGames();

  return (
    <div className="relative min-h-screen py-20">
      <FadingBackground first={true} />
      {/* Content section */}
      <div className="z-10 w-full">
        <div className="mx-auto">
          <Filters />
          <GamesGallery data={data} isLoading={isLoading} />
          <FullPagination />
        </div>
      </div>
    </div>
  );
}

export default AllGames;
