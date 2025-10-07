import UserCharts from "@/features/User/components/UserCharts";
import UserHeader from "@/features/User/components/UserHeader";
import Filters from "./../features/games/ui/Filters";
import { useGetUserGames } from "@/features/User/hooks/useGetUserGames";
import GamesGallary from "@/features/games/ui/GamesGallary";
import { useGetGenres } from "@/features/games/hooks/useGetGenres";
import { useSearchParams } from "react-router-dom";
import Spinner from "@/ui/Spinner";
import { useGetThemes } from "@/features/games/hooks/useGetThemes";

function Account() {
  const [searchParams] = useSearchParams();
  const genreParam = searchParams.get("genre");
  const themeParam = searchParams.get("theme");
  const statusParam = searchParams.get("status");
  const sortByParam = searchParams.get("sortBy");

  const supabaseToken = localStorage.getItem(
    "sb-kapovyqqncfsoangqppi-auth-token",
  );
  const userData = JSON.parse(supabaseToken || "{}");
  const user_id = userData?.user?.id;
  const { data: genres, isLoading: isLoadingGenres } = useGetGenres();
  const { data: themes, isLoading: isLoadingThemes } = useGetThemes();

  const { data, isLoading } = useGetUserGames(user_id);
  const user_games = data?.user_games || [];

  if (isLoading || isLoadingGenres || isLoadingThemes) return <Spinner />;

  const genreName = genres.filter((genre) => genre?.id === +genreParam)[0]
    ?.name;
  const themeName = themes.filter((theme) => theme?.id === +themeParam)[0]
    ?.name;

  const GallaryData = user_games
    .filter((game) => {
      if (!genreParam) return true;
      return game?.genres?.includes(genreName);
    })
    .filter((game) => {
      if (!themeParam) return true;
      return game?.themes?.includes(themeName);
    })
    .filter((game) => {
      if (!statusParam) return true;
      return game?.status === statusParam;
    })
    .sort((a, b) => {
      if (sortByParam === "hours_played")
        return b.hours_played - a.hours_played;
      if (sortByParam === "date_finished")
        return (
          new Date(b.date_finished) - new Date(a.date_finished || Date.now())
        );
      const getStatusRank = (status) => {
        if (status === "playing") return 1;
        if (status === "finished") return 2;
        if (status === "dropped") return 3;
        return 4; // For any other status
      };

      const rankA = getStatusRank(a.status);
      const rankB = getStatusRank(b.status);

      return rankA - rankB;
    })
    .map((game) => {
      return {
        id: game.game_id,
        name: game.game_name,
        cover: { url: game.game_cover },
        status: game.status,
        hoursPlayed: game.hours_played,
        dateFinished: game.date_finished,
      };
    });

  return (
    <div className="container mx-auto">
      <UserHeader />
      <div className="mx-auto mt-6 flex w-11/12 items-start justify-between gap-x-6">
        <div>
          <Filters
            showGameModes={false}
            showStatus={true}
            isAccount={true}
            className="bg-base-300 mt-0 w-full"
          />
          <GamesGallary data={GallaryData} isLoading={isLoading} />
        </div>
        <UserCharts user_games={user_games} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default Account;
