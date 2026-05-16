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
import {
  Bookmark,
  CheckCircle2,
  Gamepad2,
  Heart,
  LayoutGrid,
  XCircle,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";

function Account() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const genreParam = searchParams.get("genre");
  const themeParam = searchParams.get("theme");
  const statusParam = searchParams.get("status");
  const isFavoriteParam = searchParams.get("isFavorite");

  const user_id = UserToken()?.user?.id;
  const { data: genres, isLoading: isLoadingGenres } = useGetGenres();
  const { data: themes, isLoading: isLoadingThemes } = useGetThemes();

  const { data, isLoading } = useGetUserGames(user_id);
  const userGames = data?.user_games || [];

  if (!user_id) {
    navigate("/auth");
  }

  if (isLoading || isLoadingGenres || isLoadingThemes) return <Spinner />;

  // Calculate counts for each status
  const counts = {
    all: userGames.length,
    playing: userGames.filter((g) => g.status === "playing").length,
    finished: userGames.filter((g) => g.status === "finished").length,
    dropped: userGames.filter((g) => g.status === "dropped").length,
    wishlist: userGames.filter((g) => g.status === "to play").length,
    favorites: userGames.filter((g) => g.is_favorite === true).length,
  };

  const genreName =
    genres?.length > 0 &&
    genres?.filter((genre) => genre?.id === +genreParam)[0]?.name;
  const themeName =
    themes?.length > 0 &&
    themes?.filter((theme) => theme?.id === +themeParam)[0]?.name;

  const GalleryData = userGames
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
      return userGame?.is_favorite === true;
    })
    .sort((a, b) => {
      // 1. Primary Sort: Status Rank
      const getStatusRank = (status) => {
        if (status === "playing") return 1;
        if (status === "to play") return 2;
        if (status === "finished") return 3;
        if (status === "dropped") return 4;
        return 5; // For any other status
      };

      const rankA = getStatusRank(a.status);
      const rankB = getStatusRank(b.status);

      if (rankA !== rankB) return rankA - rankB;

      // 2. Secondary Sort: Hours Played (Descending)
      const hoursA = a.hours_played || 0;
      const hoursB = b.hours_played || 0;
      if (hoursA !== hoursB) return hoursB - hoursA;

      // 3. Tertiary Sort: Release Date (Descending - newest first)
      const dateA = a.game?.first_release_date || 0;
      const dateB = b.game?.first_release_date || 0;
      return dateA - dateB;
    })
    .map((userGame) => {
      return {
        id: userGame?.game?.id,
        name: userGame?.game?.name,
        cover: { url: userGame?.game?.cover },
        status: userGame?.status,
        hoursPlayed: userGame?.hours_played,
        dateFinished: userGame?.date_finished,
        isFavorite: userGame?.is_favorite,
        first_release_date: userGame?.game?.first_release_date,
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
            <UserStats userGames={userGames} isLoading={isLoading} />

            <div className="bg-bg-card border-stroke-medium grid w-full grid-cols-2 gap-3 rounded-2xl border p-2 backdrop-blur-xl transition-all sm:grid-cols-3 lg:grid-cols-6">
              <UserFilterButton
                paramsValue=""
                buttonText="All"
                icon={LayoutGrid}
                count={counts.all}
                activeColor="pulse-secondary"
              />
              <UserFilterButton
                paramsValue="playing"
                buttonText="Playing"
                icon={Gamepad2}
                count={counts.playing}
                activeColor="pulse-primary"
              />
              <UserFilterButton
                paramsValue="finished"
                buttonText="Finished"
                icon={CheckCircle2}
                count={counts.finished}
                activeColor="pulse-success"
              />
              <UserFilterButton
                paramsValue="dropped"
                buttonText="Dropped"
                icon={XCircle}
                count={counts.dropped}
                activeColor="pulse-error"
              />
              <UserFilterButton
                paramsValue="to play"
                buttonText="Wishlist"
                icon={Bookmark}
                count={counts.wishlist}
                activeColor="pulse-warning"
              />
              <UserFilterButton
                paramsValue="true"
                buttonText="Favorites"
                icon={Heart}
                count={counts.favorites}
                activeColor="pulse-error"
                paramKey="isFavorite"
              />
            </div>
          </div>
          <GamesGallery data={GalleryData} isLoading={isLoading} />
        </div>
      </div>
    </>
  );
}

export default Account;
