import Filters from "@/features/games/ui/Filters";
import GamesGallary from "../features/games/ui/GamesGallary";
import FullPagination from "../features/games/ui/FullPagination";
import { useGetAllGames } from "@/features/games/hooks/useGetAllGames";

function AllGames() {
  const { data, isLoading } = useGetAllGames();

  return (
    <div className="container mx-auto">
      <Filters className="mt-4 w-3/4" />
      <GamesGallary data={data} isLoading={isLoading} />
      <FullPagination />
    </div>
  );
}

export default AllGames;
