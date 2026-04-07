import UserCharts from "@/features/User/components/UserCharts";
import { useGetUserGames } from "@/features/User/hooks/useGetUserGames";
import { useGetGenres } from "@/features/games/hooks/useGetGenres";
import { useGetThemes } from "@/features/games/hooks/useGetThemes";
import GamesGallary from "@/features/games/ui/GamesGallary";
import Spinner from "@/ui/Spinner";
import StatsCard from "@/ui/StatsCard";
import { IoGameControllerOutline } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";
import { GoClock } from "react-icons/go";

function Account() {
  const [searchParams] = useSearchParams();
  const genreParam = searchParams.get("genre");
  const themeParam = searchParams.get("theme");
  const statusParam = searchParams.get("status");
  const sortByParam = searchParams.get("sortBy");
  const isFavoriteParam = searchParams.get("isFavorite");

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

  const genreName =
    genres?.length > 0 &&
    genres?.filter((genre) => genre?.id === +genreParam)[0]?.name;
  const themeName =
    themes?.length > 0 &&
    themes?.filter((theme) => theme?.id === +themeParam)[0]?.name;

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
    .filter((game) => {
      if (!isFavoriteParam) return true;
      return game.is_favorite === true;
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
        isFavorite: game.is_favorite,
      };
    });

  return (
    <div className="container mx-auto pt-16">
      {/* <UserHeader /> */}
      <div className="mx-auto mt-6 flex w-11/12 items-start justify-between gap-x-6">
        <div>
          {/* <Filters
            showGameModes={false}
            showStatus={true}
            isAccount={true}
            showFavorite={true}
            className="bg-base-300 mt-0 w-full"
          /> */}
          <div className="flex items-center gap-x-3">
            <StatsCard
              data={GallaryData.length}
              title="Total Games"
              icon={
                <IoGameControllerOutline className="text-pulse-extra h-12 w-12" />
              }
            />
            <StatsCard
              data={GallaryData.reduce((acc, cur) => acc + cur.hoursPlayed, 0)}
              title="Total Hours"
              icon={<GoClock className="text-pulse-extra h-12 w-12" />}
            />
            <StatsCard
              data={(() => {
                const data = user_games?.map((game) => game.genres).flat();
                const dataCount = data.reduce((acc, item) => {
                  return { ...acc, [item]: (acc[item] || 0) + 1 };
                }, {});
                console.log(dataCount);
                const mostPlayed = Object.entries(dataCount).sort(
                  (a, b) => b[1] - a[1],
                )[0];
                return mostPlayed ? mostPlayed[0] : "N/A";
              })()}
              title="Most Played Genre"
              icon={
                <IoGameControllerOutline className="text-pulse-extra h-12 w-12" />
              }
            />
          </div>
          <GamesGallary data={GallaryData} isLoading={isLoading} />
        </div>
        <UserCharts user_games={user_games} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default Account;
