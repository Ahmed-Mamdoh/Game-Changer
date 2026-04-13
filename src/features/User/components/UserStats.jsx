import StatsCard from "@/ui/StatsCard";
import { GoClock } from "react-icons/go";
import { IoGameControllerOutline } from "react-icons/io5";
import { PiSwordLight } from "react-icons/pi";
import UserCharts from "./UserCharts";

function UserStats({ user_games, isLoading }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          data={user_games?.length || 0}
          title="Total Games"
          icon={
            <IoGameControllerOutline className="text-pulse-extra h-10 w-10 sm:h-12 sm:w-12" />
          }
        />
        <StatsCard
          data={user_games
            ?.map((game) => game.hours_played)
            .reduce((acc, cur) => acc + cur || 0)}
          title="Total Hours"
          icon={
            <GoClock className="text-pulse-extra h-10 w-10 sm:h-12 sm:w-12" />
          }
        />
        <StatsCard
          data={(() => {
            const data = user_games?.map((game) => game.genres).flat();
            const dataCount = data.reduce((acc, item) => {
              return { ...acc, [item]: (acc[item] || 0) + 1 };
            }, {});
            const mostPlayed = Object.entries(dataCount).sort(
              (a, b) => b[1] - a[1],
            )[0];
            return mostPlayed ? mostPlayed[0] : "N/A";
          })()}
          className="sm:col-span-2 lg:col-span-1"
          title="Most Played Genre"
          icon={
            <PiSwordLight className="text-pulse-extra h-10 w-10 sm:h-12 sm:w-12" />
          }
        />
      </div>
      <UserCharts user_games={user_games} isLoading={isLoading} />
    </>
  );
}

export default UserStats;
