import Filters from "@/features/games/ui/Filters";
import GamesGallary from "../features/games/GamesGallary";
import FullPagination from "../features/games/ui/FullPagination";
import { useGetAllGames } from "@/features/games/useGetAllGames";

function AllGames() {
  const { data, isLoading } = useGetAllGames();

  return (
    <div className="container mx-auto">
      <Filters />
      <GamesGallary data={data} isLoading={isLoading} />
      <FullPagination />
    </div>
  );
}

export default AllGames;
