import StatsCard from "@/ui/StatsCard";
import { GoClock } from "react-icons/go";
import { IoGameControllerOutline } from "react-icons/io5";
import { PiSwordLight } from "react-icons/pi";
import { GiScrollQuill } from "react-icons/gi";
import UserCharts from "./UserCharts";

function UserStats({ userGames, isLoading }) {
  const user_games = userGames?.filter(
    (userGame) => userGame.status !== "to play",
  );
  const totalHours = user_games?.length
    ? user_games.reduce(
        (acc, userGame) => acc + (userGame.hours_played || 0),
        0,
      )
    : 0;
  const genresCount = user_games
    ?.map((userGame) => userGame?.game?.genres || [])
    .flat()
    .reduce((acc, item) => {
      return { ...acc, [item]: (acc[item] || 0) + 1 };
    }, {});
  const ThemesCount = user_games
    ?.map((userGame) => userGame?.game?.themes || [])
    .flat()
    .reduce((acc, item) => {
      return { ...acc, [item]: (acc[item] || 0) + 1 };
    }, {});
  const mostPlayedGenre =
    Object.entries(genresCount || {}).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "N/A";
  const mostPlayedTheme =
    Object.entries(ThemesCount || {}).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "N/A";
  return (
    <>
      <div className="grid grid-cols-1 gap-2 pt-2 pb-2 sm:grid-cols-1 md:hidden md:grid-cols-2 lg:grid-cols-3">
        {/* Mobile View Stats */}
        <div
          className={`bg-bg-card border-stroke-medium hover:border-pulse-secondary grid
            w-full grid-cols-4 items-center justify-between rounded-xl border
            py-4 backdrop-blur-xl transition-all `}
        >
          <div className="flex flex-col items-center gap-1 ">
            <IoGameControllerOutline className="text-text-brand h-8 w-8 sm:h-10 sm:w-10" />
            <p className="text-text-brand text-base font-bold sm:text-2xl">
              {user_games?.length}
            </p>
            <span className="text-text-dim text-xs sm:text-sm">
              Games Played
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 ">
            <GoClock className="text-text-brand h-8 w-8 sm:h-10 sm:w-10" />
            <p className="text-text-brand text-base font-bold sm:text-2xl">
              {totalHours}
            </p>
            <span className="text-text-dim text-xs sm:text-sm">
              Hours Played
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 ">
            <PiSwordLight className="text-text-brand h-8 w-8 sm:h-10 sm:w-10" />
            <p className="text-text-brand text-base font-bold sm:text-2xl">
              {mostPlayedGenre}
            </p>
            <span className="text-text-dim text-xs sm:text-sm">Fav Genre</span>
          </div>

          <div className="flex flex-col items-center gap-1 ">
            <GiScrollQuill className="text-text-brand h-8 w-8 sm:h-10 sm:w-10" />
            <p className="text-text-brand text-base font-bold sm:text-2xl">
              {mostPlayedTheme}
            </p>
            <span className="text-text-dim text-xs sm:text-sm">Fav Theme</span>
          </div>
        </div>

        {/* Desktop View Stats */}
      </div>
      {/* User Charts */}
      <UserCharts user_games={user_games} isLoading={isLoading} />
    </>
  );
}

export default UserStats;
