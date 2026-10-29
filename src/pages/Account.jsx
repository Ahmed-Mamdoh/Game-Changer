import { useGetGenres } from "@/features/games/hooks/useGetGenres";
import { useGetThemes } from "@/features/games/hooks/useGetThemes";
import GamesGallery from "@/features/games/ui/GamesGallery";
import UserFilterButton from "@/features/User/components/UserFilterButton";
import RateTheseStrip from "@/features/User/components/RateTheseStrip";
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
      <div className="min-h-[100dvh] pt-24">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-4 md:px-8">
          <UserHeader />
          <UserStats userGames={userGames} isLoading={isLoading} />
          <RateTheseStrip userGames={userGames} user_id={user_id} />

          <div
            role="tablist"
            aria-label="Library status"
            className="no-scrollbar border-stroke-subtle -mx-4 flex gap-1 overflow-x-auto border-b px-4 pb-3 md:mx-0 md:px-0"
          >
            <UserFilterButton
              paramsValue=""
              buttonText="All"
              icon={LayoutGrid}
              iconClassName="text-text-muted"
              count={counts.all}
            />
            <UserFilterButton
              paramsValue="playing"
              buttonText="Playing"
              icon={Gamepad2}
              iconClassName="text-pulse-primary"
              count={counts.playing}
            />
            <UserFilterButton
              paramsValue="finished"
              buttonText="Played"
              icon={CheckCircle2}
              iconClassName="text-pulse-success"
              count={counts.finished}
            />
            <UserFilterButton
              paramsValue="dropped"
              buttonText="Dropped"
              icon={XCircle}
              iconClassName="text-pulse-error"
              count={counts.dropped}
            />
            <UserFilterButton
              paramsValue="to play"
              buttonText="Wishlist"
              icon={Bookmark}
              iconClassName="text-pulse-warning"
              count={counts.wishlist}
            />
            <UserFilterButton
              paramsValue="true"
              buttonText="Favorites"
              icon={Heart}
              iconClassName="text-pulse-error"
              count={counts.favorites}
              paramKey="isFavorite"
            />
          </div>
        </div>
        <GamesGallery
          data={GalleryData}
          isLoading={isLoading}
          {...(userGames.length === 0
            ? {
                emptyTitle: "Your library is empty",
                emptyText:
                  "Find a game you've played and mark it Playing, Played or Wishlist. It shows up here with your hours.",
                emptyAction: { to: "/games/allGames", label: "Browse games" },
              }
            : {
                emptyTitle: "Nothing here yet",
                emptyText: "No games in your library match this tab.",
              })}
        />
      </div>
    </>
  );
}

export default Account;
