import { useGetAllGames } from "@/features/games/hooks/useGetAllGames";
import FadingBackground from "@/features/games/ui/FadingBackground";
import Filters from "@/features/games/ui/Filters";
import FullPagination from "../features/games/ui/FullPagination";
import GamesGallery from "../features/games/ui/GamesGallery";

function AllGames() {
  const { data, isLoading } = useGetAllGames();

  return <GamesGallery data={data} isLoading={isLoading} />;
}

export default AllGames;
