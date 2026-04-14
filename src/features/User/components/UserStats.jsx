import StatsCard from "@/ui/StatsCard";
import { GoClock } from "react-icons/go";
import { IoGameControllerOutline } from "react-icons/io5";
import { PiSwordLight } from "react-icons/pi";
import { GiScrollQuill } from "react-icons/gi";
import UserCharts from "./UserCharts";

function UserStats({ user_games, isLoading }) {
  const totalHours = user_games
    ?.map((game) => game.hours_played)
    .reduce((acc, cur) => acc + cur || 0);
  const genresCount = user_games
    ?.map((game) => game.genres)
    .flat()
    .reduce((acc, item) => {
      return { ...acc, [item]: (acc[item] || 0) + 1 };
    }, {});
  const ThemesCount = user_games
    ?.map((game) => game.themes)
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
      <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Mobile View Stats */}
        <div
          className={`bg-obsidian-deep/60 border-obsidian-border hover:border-pulse-extra/50 grid
            w-full grid-cols-4 items-center justify-between rounded-2xl border-2
            py-4 backdrop-blur-xs transition-all md:hidden`}
        >
          <div className="flex flex-col items-center gap-1 ">
            <IoGameControllerOutline className="text-pulse-extra h-8 w-8 sm:h-10 sm:w-10" />
            <p className="text-pulse-extra text-base font-bold sm:text-2xl">
              {user_games?.length}
            </p>
            <span className="text-text-secondary text-xs sm:text-sm">
              Games Played
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 ">
            <GoClock className="text-pulse-extra h-8 w-8 sm:h-10 sm:w-10" />
            <p className="text-pulse-extra text-base font-bold sm:text-2xl">
              {totalHours}
            </p>
            <span className="text-text-secondary text-xs sm:text-sm">
              Hours Played
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 ">
            <PiSwordLight className="text-pulse-extra h-8 w-8 sm:h-10 sm:w-10" />
            <p className="text-pulse-extra text-base font-bold sm:text-2xl">
              {mostPlayedGenre}
            </p>
            <span className="text-text-secondary text-xs sm:text-sm">
              Fav Genre
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 ">
            <GiScrollQuill className="text-pulse-extra h-8 w-8 sm:h-10 sm:w-10" />
            <p className="text-pulse-extra text-base font-bold sm:text-2xl">
              {mostPlayedTheme}
            </p>
            <span className="text-text-secondary text-xs sm:text-sm">
              Fav Theme
            </span>
          </div>
        </div>

        {/* Desktop View Stats */}
        <StatsCard
          data={user_games?.length || 0}
          title="Total Games"
          className="hidden md:flex"
          icon={
            <IoGameControllerOutline className="text-pulse-extra h-10 w-10 sm:h-12 sm:w-12" />
          }
        />
        <StatsCard
          data={totalHours}
          title="Total Hours"
          className="hidden md:flex"
          icon={
            <GoClock className="text-pulse-extra h-10 w-10 sm:h-12 sm:w-12" />
          }
        />
        <StatsCard
          data={mostPlayedGenre}
          title="Most Played Genre"
          className="hidden sm:col-span-2 md:flex lg:col-span-1"
          icon={
            <PiSwordLight className="text-pulse-extra h-10 w-10 sm:h-12 sm:w-12" />
          }
        />
      </div>
      {/* User Charts */}
      <UserCharts user_games={user_games} isLoading={isLoading} />
    </>
  );
}

export default UserStats;
