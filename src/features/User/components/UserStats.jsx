import StatsCard from "@/ui/StatsCard";
import { GoClock } from "react-icons/go";
import { IoGameControllerOutline } from "react-icons/io5";
import { PiSwordLight } from "react-icons/pi";
import UserCharts from "./UserCharts";

function UserStats({ user_games, isLoading }) {
  return (
    <>
      <div className="flex items-center gap-x-3 pt-3">
        <StatsCard
          data={user_games?.length || 0}
          title="Total Games"
          icon={
            <IoGameControllerOutline className="text-pulse-extra h-12 w-12" />
          }
        />
        <StatsCard
          data={user_games
            ?.map((game) => game.hours_played)
            .reduce((acc, cur) => acc + cur || 0)}
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
          icon={<PiSwordLight className="text-pulse-extra h-12 w-12" />}
        />
      </div>
      <UserCharts user_games={user_games} isLoading={isLoading} />
    </>
  );
}

export default UserStats;
