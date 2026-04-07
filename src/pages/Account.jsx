import { useGetGenres } from "@/features/games/hooks/useGetGenres";
import { useGetThemes } from "@/features/games/hooks/useGetThemes";
import FadingBackground from "@/features/games/ui/FadingBackground";
import GamesGallery from "@/features/games/ui/GamesGallery";
import UserFilterButton from "@/features/User/components/UserFilterButton";
import UserHeader from "@/features/User/components/UserHeader";
import UserStats from "@/features/User/components/UserStats";
import { useGetUserGames } from "@/features/User/hooks/useGetUserGames";
import Spinner from "@/ui/Spinner";
import { useSearchParams } from "react-router-dom";

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

  const GalleryData = user_games
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
    <div className="relative mx-auto min-h-[150vh] ">
      <FadingBackground first />
      <div className="absolute top-[10vh] mx-auto mt-6 flex w-full items-start justify-between gap-x-6">
        <div className="container mx-auto">
          <div className="mx-auto w-9/10">
            <UserHeader />
            <UserStats user_games={user_games} isLoading={isLoading} />
            <div className="flex flex-col gap-2">
              <p>Filters</p>
              <div className="flex items-center gap-x-5">
                <UserFilterButton paramsValue="" buttonText="All" />
                <UserFilterButton paramsValue="playing" buttonText="Playing" />
                <UserFilterButton
                  paramsValue="finished"
                  buttonText="Finished"
                />
                <UserFilterButton paramsValue="dropped" buttonText="Dropped" />
              </div>
            </div>
          </div>

          <GamesGallery data={GalleryData} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

export default Account;
