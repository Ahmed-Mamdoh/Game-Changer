import { useGetGenres } from "@/features/games/hooks/useGetGenres";
import { useGetThemes } from "@/features/games/hooks/useGetThemes";
import FadingBackground from "@/features/games/ui/FadingBackground";
import GamesGallery from "@/features/games/ui/GamesGallery";
import UserFilterButton from "@/features/User/components/UserFilterButton";
import UserHeader from "@/features/User/components/UserHeader";
import UserStats from "@/features/User/components/UserStats";
import { useGetUserGames } from "@/features/User/hooks/useGetUserGames";
import { UserToken } from "@/hooks/useUserToken";
import Spinner from "@/ui/Spinner";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";

function Account() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const genreParam = searchParams.get("genre");
  const themeParam = searchParams.get("theme");
  const statusParam = searchParams.get("status");
  const sortByParam = searchParams.get("sortBy");
  const isFavoriteParam = searchParams.get("isFavorite");

  const user_id = UserToken()?.user?.id;
  const { data: genres, isLoading: isLoadingGenres } = useGetGenres();
  const { data: themes, isLoading: isLoadingThemes } = useGetThemes();

  const { data, isLoading } = useGetUserGames(user_id);
  const user_games = data?.user_games || [];

  if (!user_id) {
    navigate("/auth");
  }

  if (isLoading || isLoadingGenres || isLoadingThemes) return <Spinner />;

  const genreName =
    genres?.length > 0 &&
    genres?.filter((genre) => genre?.id === +genreParam)[0]?.name;
  const themeName =
    themes?.length > 0 &&
    themes?.filter((theme) => theme?.id === +themeParam)[0]?.name;

  const GalleryData = user_games
    .filter((userGame) => {
      if (!genreParam) return true;
      return userGame?.game?.genres?.includes(genreName);
    })
    .filter((userGame) => {
      if (!themeParam) return true;
      return userGame?.game?.themes?.includes(themeName);
    })
    .filter((userGame) => {
      if (!statusParam) return true;
      return userGame?.status === statusParam;
    })
    .filter((userGame) => {
      if (!isFavoriteParam) return true;
      return userGame?.game?.is_favorite === true;
    })
    .sort((a, b) => {
      if (sortByParam === "hours_played")
        return b.game?.hours_played - a.game?.hours_played;
      if (sortByParam === "date_finished")
        return (
          new Date(b.game?.date_finished) -
          new Date(a.game?.date_finished || Date.now())
        );
      const getStatusRank = (status) => {
        if (status === "playing") return 1;
        if (status === "finished") return 2;
        if (status === "dropped") return 3;
        return 4; // For any other status
      };

      const rankA = getStatusRank(a.game?.status);
      const rankB = getStatusRank(b.game?.status);

      return rankA - rankB;
    })
    .map((userGame) => {
      return {
        id: userGame?.game?.game_id,
        name: userGame?.game?.name,
        cover: { url: userGame?.game?.cover },
        status: userGame?.status,
        hoursPlayed: userGame?.hours_played,
        dateFinished: userGame?.date_finished,
        isFavorite: userGame?.is_favorite,
      };
    });

  return (
    <>
      <Helmet>
        {/* Basic SEO Meta Tags */}
        <title>My Account | Game-Changer</title>
        <meta
          name="description"
          content="Manage your personal game library, track your progress, and organize your favorites on Game-Changer."
        />
        <meta
          property="og:description"
          content="Manage your personal game library, track your progress, and organize your favorites on Game-Changer."
        />
        <link
          rel="canonical"
          href="https://game-changer-gg.vercel.app/account"
        />
      </Helmet>
      <div className="relative mx-auto min-h-[150dvh] py-20">
        <FadingBackground first />

        <div className="relative z-10 mx-auto w-full">
          <div className="mx-auto w-full px-4 md:w-9/10">
            <UserHeader />
            <UserStats user_games={user_games} isLoading={isLoading} />

            <div
              className="bg-bg-card border-stroke-medium hover:border-pulse-secondary
            grid w-full grid-cols-2 gap-x-3 gap-y-3 rounded-xl border p-4 backdrop-blur-xl
            transition-all sm:grid-cols-4"
            >
              <UserFilterButton paramsValue="" buttonText="All" />
              <UserFilterButton paramsValue="playing" buttonText="Playing" />
              <UserFilterButton paramsValue="finished" buttonText="Finished" />
              <UserFilterButton paramsValue="dropped" buttonText="Dropped" />
            </div>
          </div>

          <GamesGallery data={GalleryData} isLoading={isLoading} />
        </div>
      </div>
    </>
  );
}

export default Account;
